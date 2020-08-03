import React from 'react';
import { ResourcePage } from './ResourcePage';
import { prettyJSON, prettyArray } from '../../utilities/pretty';

const FIELDS = [
  {
    Header: 'ID',
    source: 'id',
  },
  {
    Header: 'Name',
    source: 'name',
  },
  {
    Header: 'Group Name',
    source: 'groupName',
  },
  {
    Header: 'Permission Group',
    source: 'userGroup',
    editConfig: {
      optionsEndpoint: 'permissionGroups',
      optionLabelKey: 'name',
      optionValueKey: 'name',
      sourceIdKey: 'userGroup',
    },
  },
  {
    Header: 'Data Element Code',
    source: 'dataElementCode',
  },
  {
    Header: 'Measure Builder',
    source: 'measureBuilder',
    editConfig: {
      optionsEndpoint: 'mapOverlays',
      optionLabelKey: 'measureBuilder',
      optionValueKey: 'measureBuilder',
      sourceIdKey: 'measureBuilder',
    },
  },
  {
    Header: 'Measure Builder Config',
    source: 'measureBuilderConfig',
    Cell: ({ value }) => prettyJSON(value),
    editConfig: { type: 'jsonEditor' },
  },
  {
    Header: 'Display Type',
    source: 'displayType',
    editConfig: {
      optionsEndpoint: 'mapOverlays',
      optionLabelKey: 'displayType',
      optionValueKey: 'displayType',
      sourceIdKey: 'displayType',
    },
  },
  {
    Header: 'Custom Colors',
    source: 'customColors',
  },
  {
    Header: 'isDataRegional',
    source: 'isDataRegional',
    type: 'boolean',
  },
  {
    Header: 'Values',
    source: 'values',
    Cell: ({ value }) => prettyJSON(value),
    editConfig: { type: 'jsonEditor' },
  },
  {
    Header: 'Hide From Menu',
    source: 'hideFromMenu',
    type: 'boolean',
  },
  {
    Header: 'Hide From Popup',
    source: 'hideFromPopup',
    type: 'boolean',
  },
  {
    Header: 'Hide From Legend',
    source: 'hideFromLegend',
    type: 'boolean',
  },
  {
    Header: 'Linked Measures',
    source: 'linkedMeasures',
    Cell: ({ value }) => prettyArray(value),
    editConfig: {
      optionsEndpoint: 'mapOverlays',
      optionLabelKey: 'id',
      sourceIdKey: 'linkedMeasures',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Sort Order',
    source: 'sortOrder',
  },
  {
    Header: 'Presentation Options',
    source: 'presentationOptions',
    Cell: ({ value }) => prettyJSON(value),
    editConfig: { type: 'jsonEditor' },
  },
  {
    Header: 'Country Codes',
    source: 'countryCodes',
    Cell: ({ value }) => prettyArray(value),
    editConfig: {
      optionsEndpoint: 'entities',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceIdKey: 'countryCodes',
      allowMultipleValues: true,
    },
  },
  {
    Header: 'Project Codes',
    source: 'projectCodes',
    Cell: ({ value }) => prettyArray(value),
    editConfig: {
      optionsEndpoint: 'projects',
      optionLabelKey: 'code',
      optionValueKey: 'code',
      sourceIdKey: 'projectCodes',
      allowMultipleValues: true,
    },
  },
];

const COLUMNS = [
  ...FIELDS,
  {
    Header: 'Edit',
    type: 'edit',
    source: 'id',
    actionConfig: {
      editEndpoint: 'mapOverlays',
      fields: [...FIELDS],
    },
  },
];

export const MapOverlaysPage = () => (
  <ResourcePage
    title="Map Overlays"
    endpoint="mapOverlays"
    columns={COLUMNS}
    editConfig={{
      title: 'Edit Map Overlay',
    }}
  />
);
