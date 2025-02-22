/**
 * Tupaia MediTrak
 * Copyright (c) 2018 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { DeleteButton } from './DeleteButton';
import { ExportButton } from '../../importExport';
import { BooleanSelectFilter } from './columnFilters';
import { Tooltip, JSONTooltip } from './Tooltip';
import { LogsButton } from '../../logsTable';
import { SyncStatus } from '../../sync';
import { EditButton } from './EditButton';
import { BulkEditButton } from './BulkEditButton';
import { TestDatabaseConnectionButton } from './TestDatabaseConnectionButton';
import { QrCodeButton } from './QrCodeButton';
import { ResubmitSurveyResponseButton } from './ResubmitSurveyResponseButton';

const generateCustomCell = (CustomCell, actionConfig, reduxId) => props =>
  <CustomCell actionConfig={actionConfig} reduxId={reduxId} {...props} />;

const BUTTON_COLUMN_OPTIONS = {
  filterable: false,
  disableSortBy: true,
  isButtonColumn: true,
};

const CUSTOM_CELL_COMPONENTS = {
  bulkEdit: BulkEditButton,
  edit: EditButton,
  export: ExportButton,
  delete: DeleteButton,
  boolean: ({ value }) => (value ? 'Yes' : 'No'),
  tooltip: Tooltip,
  jsonTooltip: JSONTooltip,
  logs: LogsButton,
  sync: SyncStatus,
  testDatabaseConnection: TestDatabaseConnectionButton,
  qrCode: QrCodeButton,
  resubmitSurveyResponse: ResubmitSurveyResponseButton,
};

const BUTTON_COLUMN_TYPES = [
  'edit',
  'export',
  'delete',
  'logs',
  'resubmitSurveyResponse',
  'qrCode',
  'testDatabaseConnection',
  'bulkEdit',
];

export const generateConfigForColumnType = (type, actionConfig, reduxId) => {
  const CustomCellComponent = CUSTOM_CELL_COMPONENTS[type];
  if (!CustomCellComponent) {
    return {};
  }
  let config = {
    Cell: generateCustomCell(CustomCellComponent, actionConfig, reduxId),
  };
  if (BUTTON_COLUMN_TYPES.includes(type)) {
    config = {
      ...config,
      ...BUTTON_COLUMN_OPTIONS,
    };
  }
  if (type === 'boolean') {
    config = {
      ...config,
      Filter: BooleanSelectFilter,
    };
  }
  return config;
};
