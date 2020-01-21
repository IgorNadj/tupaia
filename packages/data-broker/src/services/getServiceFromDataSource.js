/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { DhisService } from './dhis';

const TYPE_TO_SERVICE = {
  dhis: DhisService,
};

export const getServiceFromDataSource = (dataSource, models) => {
  const ServiceClass = TYPE_TO_SERVICE[dataSource.service_type] || DhisService; // default to dhis
  return new ServiceClass(dataSource, models);
};
