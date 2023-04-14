'use strict';

import { createDropAnalyticsLogTablesFunction } from './migrationData/buildAnalyticsTableFunction/createDropAnalyticsLogTablesFunction.v1';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  await db.runSql(createDropAnalyticsLogTablesFunction);
  return null;
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
