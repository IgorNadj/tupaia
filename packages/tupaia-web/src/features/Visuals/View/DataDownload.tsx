/**
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, SpinningLoader } from '@tupaia/ui-components';
import { List, Typography } from '@material-ui/core';
import { ViewReport } from '@tupaia/types';
import { CheckboxList, Form as BaseForm } from '../../../components';
import { URL_SEARCH_PARAMS } from '../../../constants';
import { useMutation } from 'react-query';
import { download } from '../../../api';

const ListItem = styled.li`
  text-align: center;
  font-size: 1.25rem;
  &:not(:last-child) {
    margin-bottom: 0.625rem;
  }
`;

const Form = styled(BaseForm)`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  align-items: center;
  > fieldset {
    flex-grow: 1;
  }
  .MuiBox-root {
    flex: 1;
  }
  legend {
    margin-bottom: 1.5rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1.5rem;
  width: 100%;
`;

const FormButton = styled(Button)`
  text-transform: none;
`;

const CheckboxListWrapper = styled.div`
  width: 30rem;
  max-width: 100%;
`;

const ErrorMessage = styled(Typography).attrs({
  variant: 'body1',
  color: 'error',
})`
  margin-bottom: 1rem;
`;

interface DataDownloadProps {
  report: ViewReport;
  isEnlarged?: boolean;
}

const downloadFile = (blob: Blob, fileName?: string) => {
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = data;
  link.setAttribute('download', fileName!);

  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
};

const useFetchDownloadData = (report, selectedCodes) => {
  return useMutation<any, Error, any, unknown>(() => {
    return download(report.downloadUrl, {
      params: {
        surveyCodes: selectedCodes,
      },
    });
  });
};

export const DataDownload = ({ report, isEnlarged }: DataDownloadProps) => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const reportCode = urlSearchParams.get(URL_SEARCH_PARAMS.REPORT);
  const formContext = useForm({
    mode: 'onChange',
  });
  const selectedCodes = formContext.watch(reportCode!);
  const {
    mutateAsync: fetchDownloadData,
    isLoading,
    error,
    data: downloadResponse,
  } = useFetchDownloadData(report, selectedCodes);

  const { data } = report;
  if (!isEnlarged)
    return (
      <List>
        {data?.map(({ name }) => (
          <ListItem key={name}>{name}</ListItem>
        ))}
      </List>
    );

  const closeModal = () => {
    urlSearchParams.delete(URL_SEARCH_PARAMS.REPORT);
    urlSearchParams.delete(URL_SEARCH_PARAMS.REPORT_PERIOD);
    setUrlSearchParams(urlSearchParams);
  };

  console.log(downloadResponse);

  return isLoading ? (
    <SpinningLoader />
  ) : (
    <Form formContext={formContext}>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <CheckboxListWrapper>
        <CheckboxList
          options={
            data
              ? data.map(({ name, value }) => ({
                  label: name,
                  value: value as string,
                }))
              : []
          }
          name={reportCode!}
          legend="Select the data you wish to download"
          required
        />
      </CheckboxListWrapper>

      <ButtonWrapper>
        <FormButton variant="outlined" color="default" onClick={closeModal}>
          Cancel
        </FormButton>
        <FormButton
          // disabled={!selectedCodes || selectedCodes.length === 0 || isLoading}
          onClick={fetchDownloadData}
        >
          Download
        </FormButton>
      </ButtonWrapper>
    </Form>
  );
};
