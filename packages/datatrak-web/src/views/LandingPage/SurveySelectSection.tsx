/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { DESKTOP_MEDIA_QUERY, ROUTES } from '../../constants';
import { Button, ButtonLink as BaseButtonLink } from '../../components';

const TUPAIA_REDIRECT_URL = process.env.REACT_APP_TUPAIA_REDIRECT_URL || 'https://tupaia.org';

const SurveyAlert = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 0.625rem;
  padding: 1rem;
  display: flex;
  position: relative;
  align-items: flex-start;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: 1rem 2.3rem;
  }
`;

const ButtonLink = styled(BaseButtonLink)`
  font-size: 1rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  & ~ .MuiButtonBase-root {
    margin-left: 0; // override default margin from ui-components
  }
  &:last-child {
    margin-top: 1rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  max-width: 20rem;
  ${({ theme }) => theme.breakpoints.up('md')} {
    width: 11rem;
  }
  .MuiButton-root {
    line-height: 1.1;
    padding: 0.75rem;
    &:last-child {
      margin-top: 0.625rem;
    }
  }
`;

const TextWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.up('md')} {
    padding-right: 4rem;
    max-width: 75%;
    padding-left: 2rem;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding-right: 1rem;
    max-width: 80%;
  }
`;

const Text = styled(Typography)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const DesktopText = styled.span`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`;

const SurveysImage = styled.img`
  width: auto;
  height: calc(100% + 3rem);
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  top: -1.5rem;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    top: -20%;
    right: 2rem;
    height: 150%;
  }

  ${DESKTOP_MEDIA_QUERY} {
    top: -2rem;
    height: calc(100% + 6rem);
  }
`;

const SurveyAlertContent = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 70%;
  padding-right: 2rem;
  ${({ theme }) => theme.breakpoints.up('md')} {
    flex-direction: row;
    width: 100%;
    align-items: center;
  }
`;

export const SurveySelectSection = () => {
  return (
    <SurveyAlert>
      <SurveyAlertContent>
        <ButtonWrapper>
          <ButtonLink to={ROUTES.SURVEY_SELECT}>Select survey</ButtonLink>
          <Button variant="outlined" onClick={() => window.open(TUPAIA_REDIRECT_URL)}>
            Explore data
          </Button>
        </ButtonWrapper>
        <TextWrapper>
          <Text>
            Tupaia DataTrak makes data collection easy!
            <DesktopText>
              {' '}
              You can use Tupaia DataTrak to complete surveys (and collect coconuts!), share news,
              stories and information with the Tupaia community. To collect data offline, please
              download our mobile app, Tupaia MediTrak, from Google Play or the Apple App Store.
            </DesktopText>
          </Text>
        </TextWrapper>
      </SurveyAlertContent>
      <SurveysImage src="/surveys.svg" alt="Illustration of woman holding a tablet" />
    </SurveyAlert>
  );
};
