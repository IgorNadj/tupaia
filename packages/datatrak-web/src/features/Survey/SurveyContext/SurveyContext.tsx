/*
 * Tupaia
 * Copyright (c) 2017 - 2024 Beyond Essential Systems Pty Ltd
 */

import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import { SurveyParams } from '../../../types';
import { useSurvey } from '../../../api';
import { getAllSurveyComponents } from '../utils';
import {
  generateCodeForCodeGeneratorQuestions,
  getDisplayQuestions,
  getIsQuestionVisible,
  getUpdatedFormData,
} from './utils';
import { SurveyFormContextType, surveyReducer } from './reducer';
import { ACTION_TYPES, SurveyFormAction } from './actions';

const defaultContext = {
  startTime: new Date().toISOString(),
  formData: {},
  activeScreen: [],
  isLast: false,
  numberOfScreens: 0,
  screenNumber: 1,
  screenHeader: '',
  screenDetail: '',
  surveyProjectCode: '',
  displayQuestions: [],
  sideMenuOpen: false,
  cancelModalOpen: false,
} as SurveyFormContextType;

const SurveyFormContext = createContext(defaultContext);

export const SurveyFormDispatchContext = createContext<Dispatch<SurveyFormAction> | null>(null);

export const SurveyContext = ({ children }) => {
  const [state, dispatch] = useReducer(surveyReducer, defaultContext);
  const { surveyCode, ...params } = useParams<SurveyParams>();
  const screenNumber = params.screenNumber ? parseInt(params.screenNumber!, 10) : null;
  const { data: survey } = useSurvey(surveyCode);
  const isResponseScreen = !!useMatch(ROUTES.SURVEY_RESPONSE);

  const { formData } = state;

  const surveyScreens = survey?.screens || [];
  const flattenedScreenComponents = getAllSurveyComponents(surveyScreens);

  // filter out screens that have no visible questions, and the components that are not visible. This is so that the titles of the screens are not using questions that are not visible
  const visibleScreens = surveyScreens
    .map(screen => {
      return {
        ...screen,
        surveyScreenComponents: screen.surveyScreenComponents.filter(question =>
          getIsQuestionVisible(question, formData),
        ),
      };
    })
    .filter(screen => screen.surveyScreenComponents.length > 0);

  const activeScreen = visibleScreens?.[screenNumber! - 1]?.surveyScreenComponents || [];

  useEffect(() => {
    const initialiseFormData = () => {
      if (!surveyCode || isResponseScreen) return;
      // if we are on the response screen, we don't want to initialise the form data, because we want to show the user's saved answers
      const initialFormData = generateCodeForCodeGeneratorQuestions(
        flattenedScreenComponents,
        formData,
      );
      dispatch({ type: ACTION_TYPES.SET_FORM_DATA, payload: initialFormData });
      // update the start time when a survey is started, so that it can be passed on when submitting the survey

      const currentDate = new Date();
      dispatch({
        type: ACTION_TYPES.SET_SURVEY_START_TIME,
        payload: currentDate.toISOString(),
      });
    };

    initialiseFormData();
  }, [surveyCode]);

  const displayQuestions = getDisplayQuestions(
    activeScreen,
    flattenedScreenComponents,
    screenNumber,
  );
  const screenHeader = activeScreen?.[0]?.text;
  const screenDetail = activeScreen?.[0]?.detail;

  return (
    <SurveyFormContext.Provider
      value={{
        ...state,
        surveyProjectCode: survey?.project?.code,
        activeScreen,
        screenNumber,
        displayQuestions,
        surveyScreens,
        screenHeader,
        screenDetail,
        visibleScreens,
      }}
    >
      <SurveyFormDispatchContext.Provider value={dispatch}>
        {children}
      </SurveyFormDispatchContext.Provider>
    </SurveyFormContext.Provider>
  );
};

export const useSurveyForm = () => {
  const surveyFormContext = useContext(SurveyFormContext);
  const { surveyScreens, formData, screenNumber, visibleScreens } = surveyFormContext;
  const flattenedScreenComponents = getAllSurveyComponents(surveyScreens);
  const dispatch = useContext(SurveyFormDispatchContext)!;

  const numberOfScreens = visibleScreens?.length || 0;
  const isLast = screenNumber === numberOfScreens;
  const isSuccessScreen = !!useMatch(ROUTES.SURVEY_SUCCESS);
  const isReviewScreen = !!useMatch(ROUTES.SURVEY_REVIEW);
  const isResponseScreen = !!useMatch(ROUTES.SURVEY_RESPONSE);

  const toggleSideMenu = () => {
    dispatch({ type: ACTION_TYPES.TOGGLE_SIDE_MENU });
  };

  const setFormData = (newFormData: Record<string, any>) => {
    dispatch({ type: ACTION_TYPES.SET_FORM_DATA, payload: newFormData });
  };

  const updateFormData = (newFormData: Record<string, any>) => {
    const updatedFormData = getUpdatedFormData(newFormData, formData, flattenedScreenComponents);

    setFormData(updatedFormData);
  };

  const resetForm = () => {
    dispatch({ type: ACTION_TYPES.RESET_FORM_DATA });
  };

  const getAnswerByQuestionId = (questionId: string) => {
    return surveyFormContext.formData[questionId];
  };

  const openCancelConfirmation = () => {
    dispatch({ type: ACTION_TYPES.OPEN_CANCEL_CONFIRMATION });
  };

  const closeCancelConfirmation = () => {
    dispatch({ type: ACTION_TYPES.CLOSE_CANCEL_CONFIRMATION });
  };

  return {
    ...surveyFormContext,
    isLast,
    isSuccessScreen,
    isReviewScreen,
    isResponseScreen,
    numberOfScreens,
    toggleSideMenu,
    updateFormData,
    setFormData,
    resetForm,
    getAnswerByQuestionId,
    openCancelConfirmation,
    closeCancelConfirmation,
  };
};
