/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { PageHeader, PageBody } from '../widgets';

const importConfig = {
  title: 'Import Lab Results or Vector Data',
  actionConfig: {
    importEndpoint: 'striveLabResults',
  },
};

const StyledBody = styled(PageBody)`
  padding-top: 2rem;
`;

export const StrivePage = () => {
  return (
    <StyledBody>
      <PageHeader title="Strive" importConfig={importConfig} />
      <Typography variant="h4" gutterBottom>
        Import lab results or vector data
      </Typography>
      <Typography>Use the above Import button to import lab results or vector data.</Typography>
    </StyledBody>
  );
};
