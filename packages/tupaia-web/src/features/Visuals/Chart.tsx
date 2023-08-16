/**
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { BarChart, GridOn } from '@material-ui/icons';
import { Tabs, darken, lighten, Tab } from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import { Chart as ChartComponent, ChartTable, ViewContent } from '@tupaia/ui-chart-components';
import { DashboardItemReport, DashboardItemConfig } from '../../types';
import { A4Page } from '@tupaia/ui-components';

const GREY_DE = '#DEDEE0';
const GREY_FB = '#FBF9F9';
const TEXT_DARKGREY = '#414D55';

const ExportingStyledTable = styled(ChartTable)`
  padding: 1.8rem 0;
  border-bottom: none;
  overflow: unset; // so that any horizontal scroll bar is applied to the parent container, not to the table

  .MuiTableContainer-root {
    overflow: unset; // so that any horizontal scroll bar is applied to the parent container, not to the table
  }
  table {
    border: 1px solid ${GREY_DE};
    width: auto;
  }
  ${A4Page} & {
    table {
      width: 100%;
    }
  }

  [role='button'] {
    display: none; // hide the sort buttons
  }

  // table head
  thead {
    border: 1px solid ${GREY_DE};
    background: none;
  }

  // table body
  tbody {
    tr {
      &:nth-of-type(odd) {
        background: ${GREY_FB};
      }
    }
  }

  th,
  td {
    color: ${TEXT_DARKGREY};
    border-color: ${GREY_DE};
  }
`;
const Wrapper = styled.div`
  display: flex;
  position: relative;
  align-content: stretch;
  align-items: stretch;
  flex-direction: column;
  .recharts-responsive-container {
    min-width: 0px;
  }
  .recharts-wrapper {
    font-size: 1rem !important; // this is to make sure the labels on the charts are relative to the base font size
  }
  li.recharts-legend-item {
    white-space: nowrap; // ensure there are no line breaks on the export legends
  }
`;

const TabsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .MuiTabs-indicator {
    display: none;
  }
`;

const TabsGroup = styled(Tabs)`
  border: 1px solid
    ${({ theme }) => {
      const {
        text: { primary },
        type,
      } = theme.palette;
      // This is to give the illusion of a thinner border, by blending it into the background more
      return type === 'light' ? lighten(primary, 0.5) : darken(primary, 0.6);
    }};
  border-radius: 5px;
  min-height: 0;
`;

const TabButton = styled(Tab)`
  min-width: 0;
  padding: 0.3rem;
  min-height: 0;
  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  &[aria-selected='true'] {
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const ContentWrapper = styled.div<{
  $isEnlarged: boolean;
  $isExporting: boolean;
}>`
  pointer-events: ${({ $isExporting }) => ($isExporting ? 'none' : 'initial')};
  padding: ${({ $isEnlarged }) => ($isEnlarged ? '1rem 0' : 'initial')};
  min-height: ${({ $isEnlarged }) =>
    $isEnlarged
      ? '24rem'
      : '0'}; // so that the chart table doesn't shrink the modal size when opened, of doesn't have much data
  ${A4Page} & {
    padding: 0;
  }
`;

interface ChartProps {
  report: DashboardItemReport;
  config: DashboardItemConfig;
  isEnlarged?: boolean;
  isExporting?: boolean;
}

const DISPLAY_TYPE_VIEWS = [
  {
    value: 'chart',
    Icon: BarChart,
    label: 'View chart',
    display: ChartComponent,
  },
  {
    value: 'table',
    Icon: GridOn,
    label: 'View table',
    display: ChartTable,
  },
];

const EXPORT_DISPLAY_TYPE_VIEWS = [
  {
    value: 'chart',
    Icon: BarChart,
    label: 'View chart',
    display: ChartComponent,
  },
  {
    value: 'table',
    Icon: GridOn,
    label: 'View table',
    display: ExportingStyledTable,
  },
];

export const Chart = ({ config, report, isEnlarged = false, isExporting = false }: ChartProps) => {
  const [displayType, setDisplayType] = useState(DISPLAY_TYPE_VIEWS[0].value);
  const handleChangeDisplayType = (_event: ChangeEvent<{}>, value: 'chart' | 'table') => {
    setDisplayType(value);
  };

  const showTable = isEnlarged
    ? !isExporting || config?.presentationOptions?.exportWithTable
    : false;

  const views = isExporting ? EXPORT_DISPLAY_TYPE_VIEWS : DISPLAY_TYPE_VIEWS;
  let availableDisplayTypes = showTable ? views : [views[0]];

  const viewContent = ({
    ...report,
    ...config,
  } as unknown) as ViewContent;

  return (
    <Wrapper>
      <TabContext value={displayType}>
        {isEnlarged && !isExporting && (
          <TabsWrapper>
            <TabsGroup
              value={displayType}
              onChange={handleChangeDisplayType}
              variant="standard"
              aria-label="Toggle display type"
            >
              {DISPLAY_TYPE_VIEWS.map(({ value, Icon, label }) => (
                <TabButton key={value} value={value} icon={<Icon />} aria-label={label} />
              ))}
            </TabsGroup>
          </TabsWrapper>
        )}
        {availableDisplayTypes.map(({ value, display: Content }) => (
          <ContentWrapper
            key={value}
            value={value}
            as={isEnlarged && !isExporting ? TabPanel : 'div'}
            $isEnlarged={isEnlarged}
            $isExporting={isExporting}
          >
            <Content viewContent={viewContent} isEnlarged={isEnlarged} isExporting={isExporting} />
          </ContentWrapper>
        ))}
      </TabContext>
    </Wrapper>
  );
};