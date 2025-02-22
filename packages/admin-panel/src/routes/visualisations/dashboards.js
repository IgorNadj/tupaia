/*
 * Tupaia
 * Copyright (c) 2017 - 2024 Beyond Essential Systems Pty Ltd
 */

const DASHBOARDS_ENDPOINT = 'dashboards';

const FIELDS = [
  {
    Header: 'Code',
    source: 'code',
    type: 'tooltip',
  },
  {
    Header: 'Name',
    source: 'name',
  },
  {
    Header: 'Organisation Unit Code',
    source: 'root_entity_code',
    editConfig: {
      optionsEndpoint: 'entities',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceKey: 'root_entity_code',
    },
  },
  {
    Header: 'Sort Order',
    source: 'sort_order',
  },
];

const COLUMNS = [
  ...FIELDS,
  {
    Header: 'Edit',
    type: 'edit',
    source: 'id',
    actionConfig: {
      title: 'Edit Dashboard',
      editEndpoint: 'dashboards',
      fields: [...FIELDS],
    },
  },
  {
    Header: 'Delete',
    type: 'delete',
    actionConfig: {
      endpoint: DASHBOARDS_ENDPOINT,
    },
  },
];

const RELATION_FIELDS = [
  {
    Header: 'Dashboard Item Code',
    source: 'dashboard_item.code',
    editable: false,
  },
  {
    Header: 'Permission Groups',
    source: 'permission_groups',
    editConfig: {
      optionsEndpoint: 'permissionGroups',
      optionLabelKey: 'name',
      optionValueKey: 'name',
      sourceKey: 'permission_groups',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Entity Types',
    source: 'entity_types',
    editConfig: {
      type: 'autocomplete',
      allowMultipleValues: true,
      canCreateNewOptions: true,
      optionLabelKey: 'entityTypes',
      optionValueKey: 'entityTypes',
      secondaryLabel: "Input the entity types you want. Eg: 'country', 'sub_district'",
    },
  },
  {
    Header: 'Project Codes',
    source: 'project_codes',
    editConfig: {
      optionsEndpoint: 'projects',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceKey: 'project_codes',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Sort Order',
    source: 'sort_order',
  },
];

const RELATION_COLUMNS = [
  ...RELATION_FIELDS,
  {
    Header: 'Edit',
    type: 'edit',
    source: 'id',
    actionConfig: {
      editEndpoint: 'dashboardRelations',
      fields: RELATION_FIELDS,
    },
  },
];

const CREATE_CONFIG = {
  title: 'Create a new Dashboard',
  actionConfig: {
    editEndpoint: DASHBOARDS_ENDPOINT,
    fields: FIELDS,
  },
};

export const dashboards = {
  title: 'Dashboards',
  path: '/dashboards',
  endpoint: DASHBOARDS_ENDPOINT,
  columns: COLUMNS,
  createConfig: CREATE_CONFIG,
  nestedView: {
    title: 'Dashboard Relations',
    columns: RELATION_COLUMNS,
    endpoint: 'dashboards/{id}/dashboardRelations',
    path: '/:id/dashboard-relations',
    displayProperty: 'name',
  },
  needsBESAdminAccess: ['delete'],
};
