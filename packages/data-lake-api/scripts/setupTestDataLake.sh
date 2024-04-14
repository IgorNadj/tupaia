#!/bin/bash -e

DIR=$(pwd "$0")
source "$DIR/../../scripts/bash/mergeEnvForDB.sh" 

# Set default port in case it wasn't in .env
: "${DATA_LAKE_DB_PORT:=5432}"

TUPAIA_USER_EXISTS=`PGPASSWORD=$DB_PG_PASSWORD psql -p $DATA_LAKE_DB_PORT -X -A -h $DATA_LAKE_DB_URL -U $DB_PG_USER -t -c "SELECT rolname FROM pg_catalog.pg_roles WHERE rolname = '$DATA_LAKE_DB_USER'"`

if [ -z "$TUPAIA_USER_EXISTS" ]; then
    PGPASSWORD=$DB_PG_PASSWORD psql -h $DATA_LAKE_DB_URL -p $DATA_LAKE_DB_PORT -U $DB_PG_USER -c "CREATE ROLE $DATA_LAKE_DB_USER LOGIN PASSWORD '$DATA_LAKE_DB_PASSWORD'"
fi

PGPASSWORD=$DB_PG_PASSWORD psql -h $DATA_LAKE_DB_URL -p $DATA_LAKE_DB_PORT -U $DB_PG_USER -c "DROP DATABASE IF EXISTS $DATA_LAKE_DB_NAME"
PGPASSWORD=$DB_PG_PASSWORD psql -h $DATA_LAKE_DB_URL -p $DATA_LAKE_DB_PORT -U $DB_PG_USER -c "CREATE DATABASE $DATA_LAKE_DB_NAME WITH OWNER $DB_PG_USER"
PGPASSWORD=$DB_PG_PASSWORD psql -h $DATA_LAKE_DB_URL -p $DATA_LAKE_DB_PORT -U $DB_PG_USER -d $DATA_LAKE_DB_NAME -f ./src/__tests__/testData/testDataDump.sql

