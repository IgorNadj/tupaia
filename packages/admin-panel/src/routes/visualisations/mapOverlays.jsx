/*
 * Tupaia
 * Copyright (c) 2017 - 2024 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { CreateActionButton } from '../../editor';
import { prettyArray } from '../../utilities';
import { ArrayFilter } from '../../table/columnTypes/columnFilters';

export const MAP_OVERLAYS_ENDPOINT = 'mapOverlays';

const FIELDS = [
  {
    Header: 'Code',
    source: 'code',
    type: 'tooltip',
  },
  {
    Header: 'Name',
    source: 'name',
    width: 140,
    type: 'tooltip',
  },
  {
    Header: 'Permission Group',
    width: 160,
    source: 'permission_group',
    editConfig: {
      optionsEndpoint: 'permissionGroups',
      optionLabelKey: 'name',
      optionValueKey: 'name',
      sourceKey: 'permission_group',
    },
  },
  {
    Header: 'Linked Measures',
    source: 'linked_measures',
    width: 160,
    Cell: ({ value }) => prettyArray(value),
    Filter: ArrayFilter,
    editConfig: {
      optionsEndpoint: MAP_OVERLAYS_ENDPOINT,
      optionLabelKey: 'id',
      sourceKey: 'linked_measures',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Config',
    source: 'config',
    type: 'jsonTooltip',
    width: 200,
    editConfig: { type: 'jsonEditor' },
  },
  {
    Header: 'Entity attributes filters',
    source: 'entity_attributes_filter',
    type: 'jsonTooltip',
    width: 200,
    editConfig: {
      type: 'jsonEditor',
      secondaryLabel:
        'This field will be used to filter the entities that this map overlay will have data for. This field is case sensitive. It is an extension of `config.measureLevel`. E.g. {"facility_type": "Hospital"}',
    },
  },
  {
    Header: 'Country Codes',
    source: 'country_codes',
    width: 140,
    Cell: ({ value }) => prettyArray(value),
    Filter: ArrayFilter,
    editConfig: {
      optionsEndpoint: 'entities',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceKey: 'country_codes',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Project Codes',
    source: 'project_codes',
    width: 140,
    Cell: ({ value }) => prettyArray(value),
    Filter: ArrayFilter,
    editConfig: {
      optionsEndpoint: 'projects',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceKey: 'project_codes',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Report Code',
    source: 'report_code',
    width: 140,
    type: 'tooltip',
  },
  {
    Header: 'Legacy',
    source: 'legacy',
    width: 140,
    type: 'boolean',
    editConfig: { type: 'boolean' },
  },
];

const extraEditFields = [
  // ID field for constructing viz-builder path only, not for showing or editing
  {
    Header: 'ID',
    source: 'id',
    show: false,
  },
  {
    Header: 'Edit using Visualisation Builder',
    type: 'link',
    editConfig: {
      type: 'link',
      linkOptions: {
        path: '/viz-builder/map-overlay/:id',
        parameters: { id: 'id' },
      },
      visibilityCriteria: {
        legacy: false,
      },
    },
  },
];

const COLUMNS = [
  ...FIELDS,
  {
    Header: 'Export',
    type: 'export',
    actionConfig: {
      exportEndpoint: 'mapOverlayVisualisation',
      fileName: '{code}',
    },
  },
  {
    Header: 'Edit',
    type: 'edit',
    source: 'id',
    actionConfig: {
      title: 'Edit Map Overlay',
      editEndpoint: MAP_OVERLAYS_ENDPOINT,
      fields: [...FIELDS, ...extraEditFields],
    },
  },
  {
    Header: 'Delete',
    type: 'delete',
    actionConfig: {
      endpoint: MAP_OVERLAYS_ENDPOINT,
    },
  },
];

const IMPORT_CONFIG = {
  title: 'Import Map Overlay Visualisation',
  subtitle: 'Please upload one or more .json files with visualisations to be imported:',
  actionConfig: {
    importEndpoint: 'mapOverlayVisualisations',
    multiple: true,
  },
  getFinishedMessage: response => (
    <>
      <span>{response.message}</span>
      {response.importedVizes.map(({ code, id }) => (
        <p>
          <span>{`${code}: `}</span>
          <Link to={`/viz-builder/map-overlay/${id}`}>View in Visualisation Builder</Link>
        </p>
      ))}
    </>
  ),
};

const LinksComponent = () => (
  <CreateActionButton to="/viz-builder/map-overlay/new" component={Link}>
    New
  </CreateActionButton>
);

export const mapOverlays = {
  title: 'Map overlays',
  path: '/map-overlays',
  endpoint: 'mapOverlays',
  columns: COLUMNS,
  importConfig: IMPORT_CONFIG,
  LinksComponent,
  needsBESAdminAccess: ['delete'],
};
