/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { createMuiTheme } from '@material-ui/core/styles';
import * as COLORS from './colors';

const themeName = 'Tupaia';

const palette = {
  primary: {
    main: COLORS.BLUE,
    light: COLORS.LIGHT_BLUE,
    dark: COLORS.DARK_BLUE,
  },
  secondary: {
    main: COLORS.LIGHT_BLACK,
    light: COLORS.LIGHT_BLUE,
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
    dark: COLORS.DARK_GREEN,
  },
  text: {
    primary: COLORS.LIGHT_BLACK,
    secondary: COLORS.TEXT_MIDGREY,
    tertiary: COLORS.TEXT_LIGHTGREY,
  },
  blue: {
    100: COLORS.BLUE_F6,
    200: COLORS.BLUE_E8,
    300: COLORS.BLUE_BF,
  },
  grey: {
    100: COLORS.GREY_FB,
    200: COLORS.GREY_F1,
    300: COLORS.GREY_E2,
    400: COLORS.GREY_DE,
    500: COLORS.GREY_9F,
    600: COLORS.GREY_72,
  },
  background: {
    default: COLORS.LIGHTGREY,
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
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.2,
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
  MuiDivider: {
    root: {
      backgroundColor: COLORS.GREY_DE,
    },
  },
  MuiFormLabel: {
    root: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: palette.text.primary,
    },
  },
  MuiInputBase: {
    input: {
      fontSize: '0.875rem',
      '&::placeholder': {
        color: COLORS.GREY_B8,
      },
    },
  },
  MuiFormControl: {
    root: {
      '& legend': {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: palette.text.primary,
      },
    },
  },
  MuiOutlinedInput: {
    input: {
      paddingInline: '1.1rem',
      paddingBlock: '0.875rem',
    },
  },
  MuiMenuItem: {
    root: {
      fontSize: '0.875rem',
    },
  },
  MuiButton: {
    root: {
      '&.MuiButtonBase-root': {
        fontSize: '0.875rem',
      },
    },
  },
};

export const theme = createMuiTheme({ palette, themeName, typography, shape, overrides });
