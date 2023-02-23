/**
 * Tupaia
 * Copyright (c) 2017 - 2022 Beyond Essential Systems Pty Ltd
 */

import { MeditrakAppServerModelRegistry } from '../../../types';

// Required for backwards compatibility for meditrak instances
// that use clinic_id against SurveyResponse
export async function getEntityIdFromClinicId(
  models: MeditrakAppServerModelRegistry,
  clinicId: string,
) {
  if (!clinicId) {
    return null;
  }
  const clinic = await models.facility.findById(clinicId);
  const entity = await models.entity.findOne({ code: clinic.code });
  if (!entity) {
    throw new Error(`Entity could not be found for clinic with code ${clinic.code}.`);
  }

  return entity.id;
}
