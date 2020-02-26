/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Index file that exports all utility functions that we use throughout tupaia_web
 */
export { default as request } from './request';
export { default as checkBoundsDifference } from './checkBoundsDifference';
export { organisationUnitIsArea } from './organisation';
export { getSiblingItems, storeSiblingItems } from './orgUnitSiblingCache';
export { isMobile, delayMobileTapCallback } from './mobile';
export { getCenterAndZoomForBounds } from './getCenterAndZoomForBounds';
export { mapBoxToken } from './mapbox';
export { getFacilityThumbnailUrl } from './getFacilityThumbnailUrl';
export { getMapUrl } from './getMapUrl';
export { initHistoryDispatcher, historyMiddleware } from './historyNavigation';
export { OverlayContainer, OverlayView } from './overlayContainer';
export { getMeasureFromHierarchy } from './getMeasureFromHierarchy';
export {
  processMeasureInfo,
  getMeasureDisplayInfo,
  getMeasureAsShade,
  flattenNumericalMeasureData,
} from './measures';
export { default as ga, gaEvent, gaPageView, gaMiddleware } from './ga';
export { formatDateForApi } from './formatDateForApi';
export { formatDataValue } from './formatters';
export { findByKey } from './collection';
export { areStringsEqual } from './string';
export { hexToRgba, getPresentationOption } from './color';
