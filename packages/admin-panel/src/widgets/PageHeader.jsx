/*
 * Tupaia
 * Copyright (c) 2017 - 2024 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ImportModal } from '../importExport';
import { CreateButton as SingleCreateButton, BulkCreateButton } from '../editor';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Wrapper = styled.div`
  padding-block: 0.7rem;
  padding-inline: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey['400']};
`;

export const PageHeader = ({
  importConfig,
  createConfig,
  exportConfig,
  ExportModalComponent,
  LinksComponent,
}) => {
  const CreateButton =
    createConfig && createConfig.bulkCreate ? BulkCreateButton : SingleCreateButton;

  if (!importConfig && !createConfig && !ExportModalComponent && !LinksComponent) {
    return null;
  }

  return (
    <Wrapper>
      <Container>
        {importConfig && <ImportModal {...importConfig} />}
        {createConfig && <CreateButton {...createConfig} />}
        {ExportModalComponent && <ExportModalComponent {...exportConfig} />}
        {LinksComponent && <LinksComponent />}
      </Container>
    </Wrapper>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  importConfig: PropTypes.object,
  createConfig: PropTypes.object,
  exportConfig: PropTypes.object,
  ExportModalComponent: PropTypes.elementType,
  LinksComponent: PropTypes.elementType,
};

PageHeader.defaultProps = {
  importConfig: null,
  createConfig: null,
  exportConfig: {},
  ExportModalComponent: null,
  LinksComponent: null,
};
