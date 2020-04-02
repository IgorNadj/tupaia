/**
 * Tupaia Config Server
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */

import { DataBuilder } from '/apiV1/dataBuilders/DataBuilder';

class SumByOrgUnitBuilder extends DataBuilder {
  /**
   * @returns {SumAggregateSeriesOutput}
   */
  async build() {
    const { dataElementCodes, labels } = this.config;

    const { results, dataPeriod } = await this.fetchAnalytics(dataElementCodes);
    const dataByOrgUnit = {};
    results.forEach(({ organisationUnit, value }) => {
      dataByOrgUnit[organisationUnit] = (dataByOrgUnit[organisationUnit] || 0) + value;
    });
    const returnData = Object.keys(dataByOrgUnit)
      .sort()
      .map(organisationUnit => ({
        name: labels && labels[organisationUnit] ? labels[organisationUnit] : organisationUnit,
        value: dataByOrgUnit[organisationUnit],
      }));
      console.log(dataPeriod);
      
    return {
      data: returnData,
      dataPeriod: { earliestPeriod: '20170310', latestPeriod: '20200401' },
    };
  }
}

export const sumByOrgUnit = async ({ dataBuilderConfig, query, entity }, aggregator, dhisApi) => {
  const builder = new SumByOrgUnitBuilder(
    aggregator,
    dhisApi,
    dataBuilderConfig,
    query,
    entity,
    dataBuilderConfig.aggregationType,
  );
  return builder.build();
};
