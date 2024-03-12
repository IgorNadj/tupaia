/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import type { MeditrakSurveyResponseRequest, CountryAccessResponse } from '@tupaia/types';
import { QueryParameters } from '../types';
import { RequestBody } from './ApiConnection';
import { BaseApi } from './BaseApi';
import { PublicInterface } from './types';

const stringifyParams = (queryParameters: Record<string, unknown> = {}) => {
  const { filter, columns, sort, ...restOfParameters } = queryParameters;

  const translatedParams = restOfParameters;
  if (filter) {
    translatedParams.filter = JSON.stringify(filter);
  }
  if (columns) {
    translatedParams.columns = JSON.stringify(columns);
  }
  if (sort) {
    translatedParams.sort = JSON.stringify(sort);
  }

  return translatedParams as QueryParameters;
};

export class CentralApi extends BaseApi {
  public async getUser() {
    return this.connection.get('me');
  }

  public async getCountryAccessList(): Promise<CountryAccessResponse[]> {
    return this.connection.get('me/countries');
  }

  public async registerUserAccount(
    userFields: Record<string, unknown>,
  ): Promise<{ userId: string; message: string }> {
    return this.connection.post('user', null, userFields);
  }

  public async changeUserPassword(
    passwordChangeFields: Record<string, unknown>,
  ): Promise<{ message: string }> {
    return this.connection.post('me/changePassword', null, passwordChangeFields);
  }

  public async createSurveyResponses(
    responses: MeditrakSurveyResponseRequest[],
    queryParameters?: QueryParameters,
  ): Promise<void> {
    const BATCH_SIZE = 500;
    for (let i = 0; i < responses.length; i += BATCH_SIZE) {
      const chunk = responses.slice(i, i + BATCH_SIZE);
      await this.connection.post('surveyResponse', queryParameters, chunk);
    }
  }

  public async fetchResources(endpoint: string, params?: Record<string, unknown>) {
    return this.connection.get(endpoint, stringifyParams(params));
  }

  public async createResource(
    endpoint: string,
    params: Record<string, unknown>,
    body: RequestBody,
  ) {
    return this.connection.post(endpoint, stringifyParams(params), body);
  }

  public async updateResource(
    endpoint: string,
    params: Record<string, unknown>,
    body: RequestBody,
  ) {
    return this.connection.put(endpoint, stringifyParams(params), body);
  }

  public async deleteResource(endpoint: string) {
    return this.connection.delete(endpoint);
  }

  public async upsertResource(
    endpoint: string,
    params: Record<string, unknown>,
    body: RequestBody,
  ) {
    const results = await this.fetchResources(endpoint, params);

    if (results.length > 1) {
      throw new Error(
        `Cannot upsert ${endpoint} since multiple resources were found: please use unique fields in you query`,
      );
    }

    if (results.length === 1) {
      await this.updateResource(`${endpoint}/${results[0].id}`, params, body);
    } else {
      await this.createResource(endpoint, params, body);
    }

    const [resource] = await this.fetchResources(endpoint, params);
    return resource;
  }
}

export interface CentralApiInterface extends PublicInterface<CentralApi> {}
