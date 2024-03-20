/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */
import { useQuery } from 'react-query';
import { DatatrakWebEntityDescendantsRequest } from '@tupaia/types';
import { get } from '../api';

export const useProjectEntities = (
  projectCode?: string,
  params?: DatatrakWebEntityDescendantsRequest.ReqBody,
) => {
  return useQuery(
    ['entityDescendants', projectCode, params],
    (): Promise<DatatrakWebEntityDescendantsRequest.ResBody> =>
      get('entityDescendants', { params: { filter: { ...params, projectCode } } }),
    { enabled: !!projectCode },
  );
};
