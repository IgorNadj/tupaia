/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { ResourcePage } from './ResourcePage';

const FIELDS = [
  {
    Header: 'Code',
    source: 'code',
    width: 300,
  },
  {
    Header: 'Builder',
    source: 'builder',
    width: 170,
    editConfig: {
      optionsEndpoint: 'indicators',
      optionLabelKey: 'builder',
      optionValueKey: 'builder',
      sourceKey: 'builder',
      distinct: true,
    },
  },
  {
    Header: 'Config',
    source: 'config',
    type: 'jsonTooltip',
    editConfig: {
      type: 'jsonEditor',
      default: '{ "formula": "", "aggregation": { "" : "" } }',
    },
  },
];

const COLUMNS = [
  ...FIELDS,
  {
    Header: 'Edit',
    type: 'edit',
    source: 'id',
    width: 70,
    actionConfig: {
      title: 'Edit Indicator',
      editEndpoint: 'indicators',
      fields: [...FIELDS],
    },
  },
];

const CREATE_CONFIG = {
  title: 'Add Indicator',
  actionConfig: {
    editEndpoint: 'indicators',
    fields: FIELDS,
  },
};

export const IndicatorsPage = () => (
  <ResourcePage
    title="Indicators"
    endpoint="indicators"
    columns={COLUMNS}
    createConfig={CREATE_CONFIG}
  />
);
