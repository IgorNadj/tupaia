/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { createMuiTheme } from '@material-ui/core/styles';
import * as COLORS from '../constants/colors';

const themeName = 'Tupaia';

const palette = {
  primary: {
    main: COLORS.RED,
    light: COLORS.LIGHT_RED,
  },
  secondary: {
    main: COLORS.YELLOW,
  },
  error: {
    main: COLORS.RED,
    light: COLORS.LIGHT_RED,
  },
  warning: {
    main: COLORS.RED,
    light: COLORS.LIGHT_RED,
  },
  success: {
    main: COLORS.GREEN,
  },
  text: {
    primary: COLORS.FONT_DARKGREY,
    secondary: COLORS.FONT_MIDGREY,
    tertiary: COLORS.FONT_LIGHTGREY,
  },
  grey: {
    400: COLORS.GREY_DE,
  },
  background: {
    default: COLORS.WHITE,
    paper: COLORS.WHITE,
  },
};

const typography = {
  h1: {
    fontSize: '3.125rem',
    fontWeight: 500,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  h4: {
    fontSize: '1.3125rem',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  h5: {
    fontSize: '1.3125rem',
    fontWeight: 500,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  subtitle1: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  subtitle2: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  body1: {
    fontSize: '0.9375rem',
    fontWeight: 400,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  button: {
    textTransform: 'none',
    letterSpacing: '0.035em',
  },
};

const shape = { borderRadius: 3 };

const overrides = {
  MuiCard: {
    root: {
      borderColor: COLORS.GREY_DE,
    },
  },
};

export const theme = createMuiTheme({ palette, themeName, typography, shape, overrides });