/**
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import { createContext } from 'react';
import { UseQueryResult } from 'react-query';
import { DashboardItemConfig, DashboardItemReport } from '@tupaia/types';
import { DashboardItem } from '../../types';

type DashboardItemState = {
  config?: DashboardItemConfig | null;
  report?: DashboardItemReport | null;
  isLoading: boolean;
  error?: UseQueryResult['error'] | null;
  refetch?: UseQueryResult['refetch'];
  isEnlarged?: boolean;
  isExport?: boolean;
  reportCode?: DashboardItem['reportCode'];
};
const defaultContext = {
  config: null,
  report: null,
  isLoading: false,
  error: null,
  refetch: () => {},
} as DashboardItemState;

export const DashboardItemContext = createContext(defaultContext);
