/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import { Project, Facility } from '/models';
import { DataBuilder } from '/apiV1/dataBuilders/DataBuilder';
import { getFacilityStatuses, getBasicFacilityTypeNamePlural } from '/apiV1/utils';

class CountOperationalFacilitiesByTypeBuilder extends DataBuilder {
  async fetchEntityHierarchyId() {
    const { projectCode } = this.query;
    const project = await Project.findOne({ code: projectCode });
    return project.entity_hierarchy_id;
  }

  async build() {
    const facilityTypeAndLevelByCode = await this.fetchFacilityTypeData();
    const operationalFacilityCodes = await this.fetchOperationalFacilityCodes();

    const countsByType = {};
    operationalFacilityCodes.forEach(facilityCode => {
      if (!facilityTypeAndLevelByCode[facilityCode]) {
        // super edge case where we've collected operational status for a facility that we don't
        // have an entity in the db for (does exist!)
        return;
      }
      const { type, level } = facilityTypeAndLevelByCode[facilityCode];
      if (!countsByType[type]) {
        countsByType[type] = {
          name: type,
          value: 0,
          level,
        };
      }
      countsByType[type].value++;
    });

    // Convert data to array and if using the aggregation server for codes, sort by level
    return { data: Object.values(countsByType).sort((a, b) => a.level - b.level) };
  }

  async fetchFacilityTypeData() {
    // Get facility entities under this entity, for the given project
    const entityHierarchyId = await this.fetchEntityHierarchyId();
    const facilityEntities = await this.entity.getFacilities(entityHierarchyId);
    if (facilityEntities.length === 0) return {};

    // Find matching facility records
    const facilities = await Facility.find({ code: facilityEntities.map(e => e.code) });

    // Work out which "type" to use
    // To have a cohesive aggregation of facility types across multiple countries, we use standard
    // facility category levels 1, 2, 3, & 4. Countries may use specific facility types, but each
    // must have a level that comes within one of the four standard levels, e.g. 1.4 or 3.1
    const firstCountryCode = facilityEntities[0].country_code;
    const isMultipleCountries = facilityEntities.some(e => e.country_code !== firstCountryCode);
    const getTypeAndLevel = facility => {
      if (isMultipleCountries) {
        return {
          type: getBasicFacilityTypeNamePlural(facility.category_code),
          level: parseInt(facility.category_code, 10),
        };
      }
      return {
        type: facility.type_name,
        level: parseFloat(facility.type),
      };
    };
    const facilityTypeAndLevelByCode = {};
    facilities.forEach(f => {
      facilityTypeAndLevelByCode[f.code] = getTypeAndLevel(f);
    });
    return facilityTypeAndLevelByCode;
  }

  async fetchOperationalFacilityCodes() {
    const facilityStatuses = await getFacilityStatuses(
      this.aggregator,
      this.entity.code,
      this.period,
      true,
    );
    return Object.entries(facilityStatuses)
      .filter(([, isOperational]) => isOperational)
      .map(([code]) => code);
  }
}

// Number of Operational Facilities by Facility Type
export const countOperationalFacilitiesByType = async (queryConfig, aggregator, dhisApi) => {
  const { dataBuilderConfig, query, entity } = queryConfig;
  const builder = new CountOperationalFacilitiesByTypeBuilder(
    aggregator,
    dhisApi,
    dataBuilderConfig,
    query,
    entity,
  );
  return builder.build();
};
