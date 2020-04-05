/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

/**
 * SearchBar
 *
 * Container providing all the controls for user: login, logout, info, account
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import FacilityIcon from 'material-ui/svg-icons/maps/local-hospital';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { ControlBar } from '../../components/ControlBar';
import { HierarchyItem } from '../../components/HierarchyItem';

import { selectOrgUnitsAsHierarchy } from '../../reducers/orgUnitReducers';

import {
  changeSearch,
  toggleSearchExpand,
  changeOrgUnit,
  highlightOrgUnit,
  openMapPopup,
  requestOrgUnit,
} from '../../actions';

const styles = {
  menuOption: {
    width: 320,
    padding: 7,
  },
  contentWrapper: {
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  searchResultList: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    overflowY: 'auto',
  },
  searchResultItem: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minHeight: 30,
    padding: '5px',
    lineHeight: '150%',
    alignItems: 'center',
  },
  searchResponseText: {
    paddingTop: 14,
  },
  heirarchyItem: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  controlBar: {
    marginBottom: '10px',
  },
};

const ICON_BY_ORG_UNIT_TYPE = {
  Facility: FacilityIcon,
};
const LEAF_ORG_UNIT_TYPE = 'Village';

export class SearchBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSafeToCloseResults: true,
    };
  }

  componentWillMount() {
    const { hierarchyData, getNestedOrgUnits } = this.props;
    if (!hierarchyData || !Array.isArray(hierarchyData) || hierarchyData.length < 1) {
      getNestedOrgUnits('World');
    }
  }

  renderSearchResults() {
    const { searchResponse, onOrgUnitClick, searchString } = this.props;
    if (searchString === '') {
      return null;
    }
    if (!searchResponse || !Array.isArray(searchResponse) || searchResponse.length < 1) {
      const responseText = isNull(searchResponse)
        ? 'Loading search results...'
        : `No results found for search '${searchString}'.`;
      return <div style={styles.searchResponseText}>{responseText}</div>;
    }
    return (
      <List style={styles.searchResultList}>
        {searchResponse.map(orgUnit => (
          <ListItem
            style={{ display: 'flex' }}
            innerDivStyle={styles.searchResultItem}
            primaryText={orgUnit.displayName}
            onClick={() => onOrgUnitClick(orgUnit)}
            key={orgUnit.displayName}
          />
        ))}
      </List>
    );
  }

  renderHierarchy() {
    const {
      hierarchyData,
      onOrgUnitClick,
      onOrgHighlight,
      getNestedOrgUnits,
      orgUnitFetchError,
    } = this.props;

    if (isNull(hierarchyData))
      return <div style={styles.searchResponseText}>Loading countries...</div>;
    if (orgUnitFetchError) return <h2>Server error, try refresh</h2>;
    if (hierarchyData.length < 1) return null;

    const recurseOrgUnits = (orgUnits, nestedMargin) => {
      if (!orgUnits || orgUnits.length < 1) return []; // OrgUnits with no children are our recursive base case
      return orgUnits.map(orgUnit => {
        // Recursively generate the children for this OrgUnit, will not recurse whole tree as
        // HierarchyItems only fetch their children data on componentWillMount
        const nestedItems = recurseOrgUnits(orgUnit.organisationUnitChildren);
        let willMountFunc;
        if (!nestedItems || nestedItems.length < 1) {
          willMountFunc = () => getNestedOrgUnits(orgUnit.organisationUnitCode);
        }

        return (
          <HierarchyItem
            key={orgUnit.organisationUnitCode}
            label={orgUnit.name}
            nestedMargin={nestedMargin}
            nestedItems={nestedItems}
            hasNestedItems={orgUnit.type !== LEAF_ORG_UNIT_TYPE}
            isLoading={orgUnit.isLoading}
            Icon={ICON_BY_ORG_UNIT_TYPE[orgUnit.type]}
            onClick={() => onOrgUnitClick(orgUnit)}
            onMouseEnter={() => onOrgHighlight(orgUnit)}
            onMouseLeave={() => onOrgHighlight()}
            willMountFunc={willMountFunc}
          />
        );
      });
    };

    const hierarchy = recurseOrgUnits(hierarchyData, '0px');
    return <List style={styles.heirarchyItem}>{hierarchy}</List>;
  }

  render() {
    const { isExpanded, onSearchChange, onSearchFocus, onSearchBlur, onExpandClick } = this.props;
    const { isSafeToCloseResults } = this.state;
    const SearchResultsComponent = isExpanded && this.renderSearchResults();
    return (
      <div style={styles.menuOption}>
        <ControlBar
          onSearchChange={onSearchChange}
          onSearchFocus={onSearchFocus}
          onControlBlur={() => onSearchBlur(isExpanded, isSafeToCloseResults)}
          isExpanded={isExpanded}
          onExpandClick={() => onExpandClick()}
          hintText="Search Location"
          style={styles.controlBar}
          icon={<SearchIcon />}
          inTopBar={true}
        >
          <div
            onMouseLeave={() => this.setState({ isSafeToCloseResults: true })}
            onMouseEnter={() => this.setState({ isSafeToCloseResults: false })}
            style={styles.contentWrapper}
          >
            {SearchResultsComponent || this.renderHierarchy()}
          </div>
        </ControlBar>
      </div>
    );
  }
}

SearchBar.propTypes = {
  onExpandClick: PropTypes.func.isRequired,
  onOrgUnitClick: PropTypes.func.isRequired,
  onOrgHighlight: PropTypes.func.isRequired,
  getNestedOrgUnits: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  searchResponse: PropTypes.arrayOf(PropTypes.object),
  hierarchyData: PropTypes.arrayOf(PropTypes.object),
  searchString: PropTypes.string,
  orgUnitFetchError: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearchFocus: PropTypes.func,
  onSearchBlur: PropTypes.func,
};

SearchBar.defaultProps = {
  isExpanded: false,
  searchResponse: null,
  hierarchyData: null,
  searchString: '',
  orgUnitFetchError: '',
  onSearchChange: undefined,
  onSearchFocus: undefined,
  onSearchBlur: undefined,
};

const mapStateToProps = state => {
  const { isExpanded, searchResponse, searchString } = state.searchBar;
  const { orgUnitFetchError } = state.orgUnits;
  const hierarchyData = selectOrgUnitsAsHierarchy(state).organisationUnitChildren || [];
  return { isExpanded, searchResponse, searchString, hierarchyData, orgUnitFetchError };
};

const mapDispatchToProps = dispatch => {
  return {
    onSearchChange: event => dispatch(changeSearch(event.target.value)),
    onSearchFocus: () => dispatch(toggleSearchExpand(true)),
    onExpandClick: () => dispatch(toggleSearchExpand()),
    onSearchBlur: (isExpanded, isSafeToCloseResults) =>
      isExpanded && isSafeToCloseResults && dispatch(toggleSearchExpand()),
    onOrgUnitClick: orgUnit => {
      dispatch(changeOrgUnit(orgUnit));
      dispatch(openMapPopup(orgUnit.organisationUnitCode));
    },
    onOrgHighlight: orgUnit => dispatch(highlightOrgUnit(orgUnit)),
    getNestedOrgUnits: organisationUnitCode => dispatch(requestOrgUnit({ organisationUnitCode })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
