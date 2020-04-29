/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { WarningCloud, Clipboard, TabsToolbar } from '@tupaia/ui-components';
import Typography from '@material-ui/core/Typography';
import { Alarm } from '@material-ui/icons';
import MuiContainer from '@material-ui/core/Container';
import { Header } from '../components/Header';
import { AlertsRoutes } from '../routes/AlertsRoutes';

const Main = styled.main`
  background: lightgray;
`;

const Container = styled(MuiContainer)`
  min-height: 800px;
  padding-top: 1rem;
`;

const links = [
  {
    label: 'Alerts',
    to: '',
    icon: <Alarm />,
  },
  {
    label: 'Outbreak',
    to: '/outbreaks',
    icon: <WarningCloud />,
  },
  {
    label: 'Archive',
    to: '/archive',
    icon: <Clipboard />,
  },
];

export const AlertsView = ({ match }) => {
  return (
    <Main>
      <Header title="Alerts" />
      <TabsToolbar links={links} />
      <Container>
        <Typography variant="h2" gutterBottom>
          Alerts Layout
        </Typography>
        <AlertsRoutes match={match} />
      </Container>
    </Main>
  );
};

AlertsView.propTypes = {
  match: PropTypes.any.isRequired,
};
