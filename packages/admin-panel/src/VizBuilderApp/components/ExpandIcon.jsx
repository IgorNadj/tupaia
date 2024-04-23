/*
 * Tupaia
 * Copyright (c) 2017 - 2024 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import { SvgIcon } from '@material-ui/core';

export const ExpandIcon = props => {
  return (
    <SvgIcon
      {...props}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M31 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 31C0 31.2652 0.105357 31.5196 0.292893 31.7071C0.48043 31.8946 0.734784 32 1 32H31C31.2652 32 31.5196 31.8946 31.7071 31.7071C31.8946 31.5196 32 31.2652 32 31V1C32 0.734784 31.8946 0.48043 31.7071 0.292893C31.5196 0.105357 31.2652 0 31 0ZM30 30H2V2H30V30Z" />
      <path d="M19.71 13.71L25 8.41V13H27V6C27 5.73478 26.8946 5.48043 26.7071 5.29289C26.5196 5.10536 26.2652 5 26 5H19V7H23.59L18.3 12.29L19.71 13.71Z" />
      <path d="M6 27H13V25H8.41L13.7 19.71L12.29 18.3L7 23.59V19H5V26C5 26.2652 5.10536 26.5196 5.29289 26.7071C5.48043 26.8946 5.73478 27 6 27Z" />
    </SvgIcon>
  );
};
