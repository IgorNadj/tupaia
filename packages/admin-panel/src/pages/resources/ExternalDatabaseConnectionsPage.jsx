/*
 * Tupaia
 * Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { ResourcePage } from './ResourcePage';
import { ArrayFilter } from '../../table/columnTypes/columnFilters';
import { prettyArray } from '../../utilities';

const EXTERNAL_DATABASE_CONNECTIONS_ENDPOINT = 'externalDatabaseConnections';

const FIELDS = [
  {
    Header: 'Code',
    source: 'code',
    type: 'tooltip',
  },
  {
    Header: 'Name',
    source: 'name',
  },
  {
    Header: 'Description',
    source: 'description',
  },
  {
    Header: 'Permission groups',
    source: 'permission_groups',
    Filter: ArrayFilter,
    Cell: ({ value }) => prettyArray(value),
    editConfig: {
      optionsEndpoint: 'permissionGroups',
      optionLabelKey: 'name',
      optionValueKey: 'name',
      sourceKey: 'permission_groups',
      allowMultipleValues: true,
    },
  },
];

const COLUMNS = [
  ...FIELDS,
  {
    Header: 'Edit',
    source: 'id',
    type: 'edit',
    actionConfig: {
      editEndpoint: EXTERNAL_DATABASE_CONNECTIONS_ENDPOINT,
      title: 'Edit External Database Connection',
      fields: [...FIELDS],
    },
  },
  {
    Header: 'Test',
    source: 'id',
    filterable: false,
    sortable: false,
    type: 'testDatabaseConnection',
    width: 70,
  },
  {
    Header: 'Delete',
    source: 'id',
    type: 'delete',
    actionConfig: {
      endpoint: EXTERNAL_DATABASE_CONNECTIONS_ENDPOINT,
    },
  },
];

const CREATE_CONFIG = {
  title: 'Create a new External Database Connection',
  actionConfig: {
    editEndpoint: EXTERNAL_DATABASE_CONNECTIONS_ENDPOINT,
    fields: [...FIELDS],
  },
};

export const ExternalDatabaseConnectionsPage = () => (
  <ResourcePage
    title="External Database Connections"
    endpoint={EXTERNAL_DATABASE_CONNECTIONS_ENDPOINT}
    columns={COLUMNS}
    createConfig={CREATE_CONFIG}
  />
);
