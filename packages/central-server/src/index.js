/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */

import '@babel/polyfill';
import http from 'http';
import {
  AnalyticsRefresher,
  EntityHierarchyCacher,
  ModelRegistry,
  SurveyResponseOutdater,
  TupaiaDatabase,
  getDbMigrator,
} from '@tupaia/database';
import { isFeatureEnabled } from '@tupaia/utils';

import { MeditrakSyncQueue } from './database';
import * as modelClasses from './database/models';
import { startSyncWithDhis } from './dhis';
import { startSyncWithMs1 } from './ms1';
import { startSyncWithKoBo } from './kobo';
import { startFeedScraper } from './social';
import { createApp } from './createApp';

import winston from './log';
import { configureEnv } from './configureEnv';

configureEnv();

(async () => {
  /**
   * Set up database
   */
  const database = new TupaiaDatabase();
  const models = new ModelRegistry(database, modelClasses, true);

  /**
   * Set up change handlers e.g. for syncing
   */
  if (isFeatureEnabled('MEDITRAK_SYNC_QUEUE')) {
    const meditrakSyncQueue = new MeditrakSyncQueue(models);
    meditrakSyncQueue.listenForChanges();
  }

  // Pre-cache entity hierarchy details
  const entityHierarchyCacher = new EntityHierarchyCacher(models);
  entityHierarchyCacher.listenForChanges();

  // Add listener to refresh analytics table
  const analyticsRefresher = new AnalyticsRefresher(models);
  analyticsRefresher.listenForChanges();

  // Add listener to handle survey response changes
  const surveyResponseOutdater = new SurveyResponseOutdater(models);
  surveyResponseOutdater.listenForChanges();

  /**
   * Set up actual app with routes etc.
   */
  const app = createApp(database, models);

  /**
   * Start the server
   */
  const port = process.env.PORT || 8090;
  http.createServer(app).listen(port);
  winston.info(`Running on port ${port}`);
  const aggregationDescription = process.env.AGGREGATION_URL_PREFIX || 'production';
  winston.info(`Connected to ${aggregationDescription} aggregation`);

  /**
   * Regularly sync data to the aggregation servers
   */
  startSyncWithDhis(models);

  /**
   * Regularly sync data to MS1
   */
  startSyncWithMs1(models);

  /**
   * Regularly sync data from KoBoToolbox
   */
  startSyncWithKoBo(models);

  /**
   * Regularly sync actions that have happened on server with the app social feed.
   */
  startFeedScraper(models);

  /**
   * If running via PM2, run migrations then notify that we are ready
   */
  if (process.send) {
    try {
      await database.waitForChangeChannel();
      winston.info('Successfully connected to pubsub service');
      const dbMigrator = getDbMigrator();
      await dbMigrator.up();
      winston.info('Database migrations complete');
    } catch (error) {
      winston.error(error.message);
    }
  }
})();
