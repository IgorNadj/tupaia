/*
 * Tupaia
 * Copyright (c) 2017 - 2024 Beyond Essential Systems Pty Ltd
 */

import React, { ReactElement, ReactNode } from 'react';
import { Link as RouterLink, To } from 'react-router-dom';
import { Button as UIButton, Tooltip } from '@tupaia/ui-components';
import styled from 'styled-components';

const StyledButton = styled(UIButton)`
  &.Mui-disabled {
    pointer-events: auto; // this is to allow the hover effect of a tooltip to work
  }
`;

export const TooltipButtonWrapper = styled.span`
  display: flex;
  flex-direction: column;
  vertical-align: baseline;
`;

interface ButtonProps extends Record<string, any> {
  tooltip?: ReactNode;
  children?: ReactNode;
  to?: To;
}

const ButtonWrapper = ({
  children,
  tooltip,
}: {
  children: ReactElement<any, any>;
  tooltip?: ButtonProps['tooltip'];
}) => {
  if (!tooltip) return children;
  return (
    // Wrap the button in a <span> to suppress console error about tooltips on disabled buttons
    <Tooltip title={tooltip} arrow enterDelay={1000}>
      <TooltipButtonWrapper>{children}</TooltipButtonWrapper>
    </Tooltip>
  );
};
export const Button = ({ tooltip, children, to, ...restOfProps }: ButtonProps) => {
  return (
    <ButtonWrapper tooltip={tooltip}>
      <StyledButton {...restOfProps} component={to ? RouterLink : undefined} to={to}>
        {children}
      </StyledButton>
    </ButtonWrapper>
  );
};
