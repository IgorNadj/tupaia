/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import styled from 'styled-components';
import { darken } from '@material-ui/core';
import { useSearchParams } from 'react-router-dom';
import { ViewConfig, ViewReport } from '@tupaia/types';
import { DownloadFilesVisual } from '@tupaia/ui-components';
import { useDownloadFiles } from '../../../api/mutations';
import { URL_SEARCH_PARAMS } from '../../../constants';

const StyledDownloadFilesVisual = styled(DownloadFilesVisual)`
  .filename {
    color: ${({ theme }) => darken(theme.palette.common.white, 0.1)};
  }
  .checkbox-icon {
    color: ${({ theme }) => darken(theme.palette.common.white, 0.1)};
  }
  button {
    text-transform: none;
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
  // override button styles from @tupaia/ui-components to match the theme of the app
  .MuiButton-text {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.main};
  }
  .MuiButton-containedPrimary {
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    &:hover {
      border-color: ${({ theme }) => darken(theme.palette.primary.main, 0.3)};
    }
  }
`;

interface DownloadFilesVisualProps {
  report: ViewReport;
  config: ViewConfig;
  isEnlarged?: boolean;
}

export const DownloadFiles = ({ report, config, isEnlarged }: DownloadFilesVisualProps) => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  const { mutateAsync: download, error, reset, isLoading } = useDownloadFiles();

  const onClose = () => {
    reset();
    urlSearchParams.delete(URL_SEARCH_PARAMS.REPORT);
    setUrlSearchParams(urlSearchParams);
  };

  const errorObj = error as Error;

  return (
    <StyledDownloadFilesVisual
      config={config}
      report={report}
      downloadFiles={download as (uniqueFileNames: string[]) => Promise<void>}
      error={errorObj?.message}
      isEnlarged={isEnlarged}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};
