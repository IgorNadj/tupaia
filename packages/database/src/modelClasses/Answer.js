/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { DatabaseModel } from '../DatabaseModel';
import { DatabaseType } from '../DatabaseType';
import { TYPES } from '../types';

class AnswerType extends DatabaseType {
  static databaseType = TYPES.ANSWER;
}

export class AnswerModel extends DatabaseModel {
  get DatabaseTypeClass() {
    return AnswerType;
  }
}
