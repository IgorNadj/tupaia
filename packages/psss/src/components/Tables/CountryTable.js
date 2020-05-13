/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

/*
 * CountryWeekTable
 */
import React from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Alarm, CheckCircleOutline } from '@material-ui/icons';
import { SiteSummaryTable } from './SiteSummaryTable';
import { ConnectedTable } from './ConnectedTable';
import * as COLORS from '../../theme/colors';
import { AFRCell, SitesReportedCell } from './TableCellComponents';

const CountryWeekTitle = styled.div`
  color: ${COLORS.BLUE};
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 3px;
`;

const CountryWeekSubTitle = styled.div`
  color: ${COLORS.TEXT_DARKGREY};
  font-size: 14px;
  line-height: 16px;
`;

const NameCell = ({ week, startDate, endDate }) => {
  const start = `${format(startDate, 'LLL d')}`;
  const end = `${format(endDate, 'LLL d')}`;
  const year = `${format(endDate, 'yyyy')}`;
  return (
    <React.Fragment>
      <CountryWeekTitle>{`Week ${week}`}</CountryWeekTitle>
      <CountryWeekSubTitle>{`${start} - ${end}, ${year}`}</CountryWeekSubTitle>
    </React.Fragment>
  );
};

NameCell.propTypes = {
  week: PropTypes.number.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};

const Status = styled.div`
  display: inline-flex;
  color: ${props => props.color};
  align-items: center;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 11px;
  line-height: 1;
  padding-left: 1rem;
  text-align: left;
  width: 100%;

  .MuiSvgIcon-root {
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }
`;

const StatusCell = ({ status }) => {
  if (status === 'Overdue') {
    return (
      <Status color={COLORS.ORANGE}>
        <Alarm />
        {status}
      </Status>
    );
  }

  return (
    <Status color={COLORS.TEXT_LIGHTGREY}>
      <CheckCircleOutline />
      {status}
    </Status>
  );
};

StatusCell.propTypes = {
  status: PropTypes.string.isRequired,
};

const countryColumns = [
  {
    title: 'Date ',
    key: 'week',
    width: '30%',
    align: 'left',
    CellComponent: NameCell,
  },
  {
    title: 'Site Reported',
    key: 'sitesReported',
    CellComponent: SitesReportedCell,
    width: '100px',
  },
  {
    title: 'AFR',
    key: 'AFR',
    CellComponent: AFRCell,
  },
  {
    title: 'DIA',
    key: 'DIA',
  },
  {
    title: 'ILI',
    key: 'ILI',
  },
  {
    title: 'PF',
    key: 'PF',
  },
  {
    title: 'DLI',
    key: 'DLI',
  },
  {
    title: 'STATUS',
    key: 'status',
    width: '110px',
    CellComponent: StatusCell,
  },
];

/*
 * CountryWeekTable Component
 */
export const CountryTable = () => (
  <ConnectedTable
    endpoint="country-weeks"
    columns={countryColumns}
    SubComponent={SiteSummaryTable}
  />
);
