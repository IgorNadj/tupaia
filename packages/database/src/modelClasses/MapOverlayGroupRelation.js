/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { DatabaseModel } from '../DatabaseModel';
import { DatabaseRecord } from '../DatabaseRecord';
import { RECORDS } from '../records';

const MAP_OVERLAY = 'mapOverlay';
const MAP_OVERLAY_GROUP = 'mapOverlayGroup';
const RELATION_CHILD_TYPES = {
  MAP_OVERLAY,
  MAP_OVERLAY_GROUP,
};

export class MapOverlayGroupRelationRecord extends DatabaseRecord {
  static databaseRecord = RECORDS.MAP_OVERLAY_GROUP_RELATION;

  async findChildRelations() {
    return this.model.find({ map_overlay_group_id: this.child_id });
  }
}

export class MapOverlayGroupRelationModel extends DatabaseModel {
  get DatabaseRecordClass() {
    return MapOverlayGroupRelationRecord;
  }

  get RelationChildTypes() {
    return RELATION_CHILD_TYPES;
  }

  async findTopLevelMapOverlayGroupRelations() {
    const rootMapOverlayGroup = await this.otherModels.mapOverlayGroup.findRootMapOverlayGroup();

    return this.find({
      map_overlay_group_id: rootMapOverlayGroup.id,
      child_type: 'mapOverlayGroup',
    });
  }

  async findGroupRelations(mapOverlayGroupIds) {
    return this.find({
      map_overlay_group_id: {
        comparator: 'IN',
        comparisonValue: mapOverlayGroupIds,
      },
    });
  }

  async findParentRelationTree(childIds) {
    return this.database.findWithParents(
      this.databaseRecord,
      childIds,
      'child_id',
      'map_overlay_group_id',
    );
  }
}
