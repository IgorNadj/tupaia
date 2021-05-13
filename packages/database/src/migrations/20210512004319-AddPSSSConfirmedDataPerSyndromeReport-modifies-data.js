'use strict';

import { generateId, insertObject, arrayToDbString } from '../utilities';

var dbm;
var type;
var seed;

const permissionGroupNameToId = async (db, name) => {
  const record = await db.runSql(`SELECT id FROM permission_group WHERE name = '${name}'`);
  return record.rows[0] && record.rows[0].id;
};

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const SYNDROMES = ['AFR', 'DIA', 'ILI', 'PF', 'DLI'];

const getReportCode = syndrome => `PSSS_${syndrome}_Confirmed_Report`;

const getTotalConfirmedCasesIndicator = syndrome => `PSSS_Accumulated_${syndrome}_Confirmed_Cases`;

const getReport = (syndrome, permissionGroupId) => {
  const reportCode = getReportCode(syndrome);
  const totalConfirmedCasesIndicator = getTotalConfirmedCasesIndicator(syndrome);

  return {
    id: generateId(),
    code: reportCode,
    config: {
      fetch: {
        dataElements: [totalConfirmedCasesIndicator],
      },
      transform: [
        'keyValueByDataElementName',
        'mostRecentValuePerOrgUnit',
        {
          // change key names
          transform: 'select',
          "'totalCases'": `$row.${totalConfirmedCasesIndicator}`,
        },
      ],
    },
    permission_group_id: permissionGroupId,
  };
};

exports.up = async function (db) {
  const permissionGroupId = await permissionGroupNameToId(db, 'PSSS');
  for (const syndrome of SYNDROMES) {
    const report = getReport(syndrome, permissionGroupId);
    await insertObject(db, 'report', report);
  }
};

exports.down = async function (db) {
  const reportCodes = SYNDROMES.map(getReportCode);

  await db.runSql(`
    DELETE FROM report
    WHERE code IN (${arrayToDbString(reportCodes)});
  `);
};

exports._meta = {
  version: 1,
};
