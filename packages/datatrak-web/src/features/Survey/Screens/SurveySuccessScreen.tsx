/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Button as BaseButton } from '../../../components';
import { useSurveyForm } from '../SurveyContext';
import { ROUTES } from '../../../constants';
import { useSurvey } from '../../../api/queries';
import { SurveyQRCode } from '../SurveyQRCode';
import { useCurrentUserContext } from '../../../api';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.breakpoints.up('md')} {
    flex: 1;
  }
`;

const StyledImg = styled.img`
  aspect-ratio: 1;
  width: 23rem;
  max-width: 80%;
  max-height: 50%;
  margin-block-end: 2.75rem;
`;

const Title = styled(Typography).attrs({
  variant: 'h2',
})`
  font-size: 1.375rem;
  font-weight: 600;
  text-align: center;
  margin-block-end: 1rem;
  ${({ theme }) => theme.breakpoints.up('md')} {
    font-size: 1.9rem;
    margin-block-end: 1.19rem;
  }
`;

const Text = styled(Typography)`
  max-width: 34.6rem;
  width: 100%;
  text-align: center;
  margin-block-end: 1.875rem;
`;

const ButtonGroup = styled.div`
  max-width: 28rem;
  width: 100%;
`;

const Button = styled(BaseButton)`
  & + & {
    margin: 1.25rem 0 0 0;
  }
`;

export const SurveySuccessScreen = () => {
  const { isLoggedIn } = useCurrentUserContext();
  const params = useParams();
  const navigate = useNavigate();
  const { resetForm } = useSurveyForm();
  const { data: survey } = useSurvey(params.surveyCode);

  const repeatSurvey = () => {
    resetForm();
    const path = generatePath(ROUTES.SURVEY_SCREEN, {
      ...params,
      screenNumber: '1',
    });
    navigate(path);
  };

  const getText = () => {
    if (survey?.canRepeat) {
      return "To repeat the same survey again click the button below, otherwise 'Close' to return to your dashboard";
    }

    return 'To return to your dashboard, click the button below';
  };

  const text = getText();

  return (
    <Wrapper>
      <Container>
        <StyledImg src="/tupaia-high-five.svg" alt="Survey submit success" />
        <Title>Survey submitted!</Title>
        {isLoggedIn && (
          <>
            <Text>{text}</Text>
            <ButtonGroup>
              {survey?.canRepeat && (
                <Button onClick={repeatSurvey} fullWidth variant="outlined">
                  Repeat Survey
                </Button>
              )}
              <Button to="/" fullWidth>
                Return to dashboard
              </Button>
            </ButtonGroup>
          </>
        )}
      </Container>
      <SurveyQRCode />
    </Wrapper>
  );
};
