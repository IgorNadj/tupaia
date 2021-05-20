/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import PropTypes from 'prop-types';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MoveToInbox, LocationOn, SpeakerNotes, List } from '@material-ui/icons';
import {
  CardTabList,
  CardTab,
  CardTabPanels,
  WarningCloud,
  Virus,
  LinkButton,
} from '@tupaia/ui-components';
import { getAffectedSites, getAlertsMessages, getActivityFeed } from '../../api';
import {
  Drawer,
  DropdownMenu,
  AlertsDrawerHeader,
  AffectedSitesTab,
  ActivityTab,
  DrawerTray,
} from '../../components';
import { CreateOutbreakModal } from '../Modals';
import { NotesTab } from '../NotesTab';
import { getCountryName } from '../../store';
import { countryFlagImage, getDisplayDatesByPeriod, getWeekNumberByPeriod } from '../../utils';
import { useFetch } from '../../hooks';

const Option = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }
`;

const menuOptions = [
  {
    value: 'Alert',
    label: (
      <Option>
        <WarningCloud /> Alert
      </Option>
    ),
  },
  {
    value: 'Archive',
    label: (
      <Option>
        <MoveToInbox /> Archive Alert
      </Option>
    ),
  },
  {
    value: 'Outbreak',
    label: (
      <Option>
        <Virus /> Create Outbreak
      </Option>
    ),
  },
];

const TabsContext = createContext(null);

export const AlertsPanelContext = createContext(null);

export const AlertsPanelProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});

  return (
    <AlertsPanelContext.Provider value={{ data, setData, isOpen, setIsOpen }}>
      {children}
    </AlertsPanelContext.Provider>
  );
};

AlertsPanelProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertsPanel = React.memo(() => {
  const { data: panelData, isOpen, setIsOpen } = useContext(AlertsPanelContext);
  const { organisationUnit: countryCode, period, syndromeName } = panelData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sitesState = useFetch(getAffectedSites);
  const notesState = useFetch(getAlertsMessages);
  const activityState = useFetch(getActivityFeed);
  const countryName = useSelector(state => getCountryName(state, countryCode));

  const handleChange = option => {
    // TODO handle changes other than creating an outbreak
    setIsModalOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerTray heading="Alert Details" onClose={handleClose} Icon={WarningCloud} />
      {period && countryCode && (
        <AlertsDrawerHeader
          dateText={`Triggered on: W${getWeekNumberByPeriod(period)}`}
          date={getDisplayDatesByPeriod(period)}
          avatarUrl={countryFlagImage(countryCode)}
          subheading={countryName}
          heading={syndromeName}
          DropdownMenu={<DropdownMenu options={menuOptions} onChange={handleChange} />}
        />
      )}
      <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
        <CardTabList Context={TabsContext}>
          <CardTab>
            <LocationOn /> Affected Sites
          </CardTab>
          <CardTab>
            <SpeakerNotes />
            Notes ({notesState.count})
          </CardTab>
          <CardTab>
            <List />
            Activity
          </CardTab>
        </CardTabList>
        <CardTabPanels Context={TabsContext}>
          <AffectedSitesTab state={sitesState} />
          <NotesTab state={notesState} />
          <ActivityTab
            state={activityState}
            NotesTabLink={<LinkButton onClick={() => setActiveIndex(1)}>note</LinkButton>}
          />
        </CardTabPanels>
      </TabsContext.Provider>
      <CreateOutbreakModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </Drawer>
  );
});
