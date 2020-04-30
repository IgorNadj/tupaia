'use strict';

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

const DATA_BUILDER_CONFIG = {
  "dataClasses": {
    "STI Detected": {
      "numerator": {
        "operation": "=",
        "operand": 'Detected',
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      },
      "denominator": {
        "operation": "in",
        "operand": ['Detected', 'Not Detected', 'Not Tested', 'Out of Reagent'],
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      }
    },
    "STI Not Detected": {
      "numerator": {
        "operation": "=",
        "operand": 'Not Detected',
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      },
      "denominator": {
        "operation": "in",
        "operand": ['Detected', 'Not Detected', 'Not Tested', 'Out of Reagent'],
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      }
    },
    "Not Tested": {
      "numerator": {
        "operation": "=",
        "operand": 'Not Tested',
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      },
      "denominator": {
        "operation": "in",
        "operand": ['Detected', 'Not Detected', 'Not Tested', 'Out of Reagent'],
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      }
    },
    "Not Tested (Out of Reagent)": {
      "numerator": {
        "operation": "=",
        "operand": 'Out of Reagent',
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      },
      "denominator": {
        "operation": "in",
        "operand": ['Detected', 'Not Detected', 'Not Tested', 'Out of Reagent'],
        "dataValues": [
          "CD2_11_A74_9",
          "CD2_16_A54_9",
          "CD2_27_A53_9",
          "CD2_NEW007_B16_9",
        ],
      }
    }
  },
  "programCode": "CD2"
};

const VIEW_JSON_CONFIG = {
  "name": "STI Test Status: Number of patients tested",
  "type": "chart",
  "chartType": "pie",
  "periodGranularity": "one_year_at_a_time",
  "valueType": "percentage",
  "defaultTimePeriod": {
    "value": "-1",
    "format": "years"
  }
};

exports.up = async function (db) {
  await db.runSql(`
    INSERT INTO "dashboardReport" ("id", "dataBuilder", "dataBuilderConfig", "viewJson", "dataServices")
    VALUES (
      'TO_CD_Validation_STI_Num_Of_Patients_Tested',
      'percentagesOfValueCounts',
      '${JSON.stringify(DATA_BUILDER_CONFIG)}',
      '${JSON.stringify(VIEW_JSON_CONFIG)}',
      '[{"isDataRegional": false}]'
    );

    UPDATE "dashboardGroup"
    SET "dashboardReports" = "dashboardReports" || '{TO_CD_Validation_STI_Num_Of_Patients_Tested}'
    WHERE code = 'TO_Communicable_Diseases_Country_Validation'
    AND "organisationLevel" = 'Country';
  `);
};

exports.down = async function (db) {
  await db.runSql(`
    DELETE FROM "dashboardReport" WHERE id = 'TO_CD_Validation_STI_Num_Of_Patients_Tested';

    UPDATE "dashboardGroup"
    SET "dashboardReports" = array_remove("dashboardReports", 'TO_CD_Validation_STI_Num_Of_Patients_Tested')
    WHERE code = 'TO_Communicable_Diseases_Country_Validation'
    AND "organisationLevel" = 'Country';
  `);
};

exports._meta = {
  "version": 1
};
