/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import { connect } from 'react-redux';

import { EntityList } from '../../entityMenu';
import { loadEntitiesFromDatabase } from '../../entityMenu/actions';
import { getEntityQuestionState } from '../selectors';
import { CodeGeneratorQuestion } from './CodeGeneratorQuestion';

const DumbEntityQuestion = props => {
  const { config } = props;
  const shouldGenerateCode = config && config.entity && config.entity.createNew;

  return shouldGenerateCode ? <CodeGeneratorQuestion {...props} /> : <EntityList {...props} />;
};

// This is presented as a question, but instead of tracking its answer it just
// speaks directly to redux and is sent as part of the metadata of the request.
export const PrimaryEntityQuestion = connect(
  (state, { id: questionId, answer: selectedEntityId }) => {
    const { filteredEntities = [] } = getEntityQuestionState(state, questionId);

    return {
      filteredEntities,
      selectedEntityId,
    };
  },
  (dispatch, { id: questionId, onChangeAnswer }) => ({
    onMount: () => dispatch(loadEntitiesFromDatabase(true, questionId)),
    onRowPress: entity => onChangeAnswer(entity.id),
  }),
)(DumbEntityQuestion);

export const EntityQuestion = connect(
  (state, { id: questionId, answer: selectedEntityId }) => {
    const { filteredEntities = [] } = getEntityQuestionState(state, questionId);

    return {
      filteredEntities,
      selectedEntityId,
    };
  },
  (dispatch, { id: questionId, onChangeAnswer }) => ({
    onMount: () => dispatch(loadEntitiesFromDatabase(false, questionId)),
    onRowPress: entity => onChangeAnswer(entity.id),
  }),
)(DumbEntityQuestion);
