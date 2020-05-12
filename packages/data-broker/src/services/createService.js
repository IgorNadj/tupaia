/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { DhisService } from './dhis';
import { TupaiaDataService } from './tupaia';
import { TupaiaDataApi } from './tupaia';

export const createService = (models, type) => {
  switch (type) {
    case 'dhis':
      return new DhisService(models);
    case 'tupaia':
      return new TupaiaDataService(models, new TupaiaDataApi(models));
    default:
      throw new Error(`Invalid service type: ${type}`);
  }
};
