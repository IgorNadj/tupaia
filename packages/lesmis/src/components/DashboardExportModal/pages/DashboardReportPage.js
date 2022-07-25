import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Typography } from '@material-ui/core';

import { EntityDetails, DashboardTitleContainer } from '../components';
import { DashboardReport } from '../../DashboardReport';
import { yearToApiDates } from '../../../api/queries/utils';
import { useUrlSearchParam } from '../../../utils';
import { DEFAULT_DATA_YEAR } from '../../../constants';

export const DashboardReportPage = ({
  item,
  isEntityDetailsRequired,
  subDashboardName,
  exportOptions,
  useYearSelector,
  PageContainer,
  ...configs
}) => {
  const [selectedYear] = useUrlSearchParam('year', DEFAULT_DATA_YEAR);
  const { startDate, endDate } = useYearSelector ? yearToApiDates(selectedYear) : yearToApiDates();

  return (
    <PageContainer
      key={item.code}
      useYearSelector={useYearSelector}
      selectedYear={selectedYear}
      {...configs}
    >
      {isEntityDetailsRequired && <EntityDetails />}
      <DashboardTitleContainer>
        <Typography variant="h2">{subDashboardName}</Typography>
        <Divider />
        <Typography variant="h5">{item.name}</Typography>
      </DashboardTitleContainer>
      <DashboardReport
        reportCode={item.reportCode}
        name={item.name}
        startDate={startDate}
        endDate={endDate}
        exportOptions={exportOptions}
        isExporting // render exporting format
        isEnlarged // render exporting format
      />
    </PageContainer>
  );
};

DashboardReportPage.propTypes = {
  item: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    reportCode: PropTypes.string,
  }).isRequired,
  getNextPage: PropTypes.func,
  isEntityDetailsRequired: PropTypes.bool.isRequired,
  subDashboardName: PropTypes.string.isRequired,
  exportOptions: PropTypes.object.isRequired,
  PageContainer: PropTypes.func.isRequired,
  useYearSelector: PropTypes.bool,
};

DashboardReportPage.defaultProps = {
  useYearSelector: false,
  getNextPage: () => {},
};
