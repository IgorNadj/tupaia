/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 *
 */
import { Chart } from '../../src/components/Chart';
import { DarkThemeTemplate, LightThemeChartTemplate } from './helpers';
import viewContent from './data/stackedBarChart.json';

export default {
  title: 'Chart/StackedBarChart',
  component: Chart,
};

/**
 * To test the charts,
 * - Copy a response from the web-frontend view endpoint (full json response)
 * - Go to the controls tab of the storybook addons and paste in the response
 */
export const LightTheme = LightThemeChartTemplate.bind({});
LightTheme.args = {
  viewContent,
  isEnlarged: true,
};

export const DarkTheme = DarkThemeTemplate.bind({});
DarkTheme.args = {
  viewContent,
  isEnlarged: true,
};
DarkTheme.parameters = { theme: 'dark' };