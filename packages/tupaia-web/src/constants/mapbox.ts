/*
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

const openStreets = {
  key: 'osm',
  label: 'Open Streets',
  thumbnail: 'https://tupaia.s3-ap-southeast-2.amazonaws.com/uploads/osm-tile-thumbnail.png',
  url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
};
const satellite = {
  key: 'satellite',
  label: 'Satellite',
  thumbnail: 'https://tupaia.s3-ap-southeast-2.amazonaws.com/uploads/satellite-tile-thumbnail.png',
  url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=${
    import.meta.env.REACT_APP_MAPBOX_TOKEN
  }`,
};

export const TILE_SETS = [openStreets, satellite];

export const DEFAULT_BOUNDS = [
  // Note: There's a little bit of a hack going on here, the bounds[0] for explore are actually [6.5, 110]
  // However in order to trigger the map to re-render we set them slightly adjusted as [6.5001, 110]
  // See: https://github.com/beyondessential/tupaia-backlog/issues/540#issuecomment-631314721
  [6.5001, 110],
  [-40, 204.5],
];