import { expect } from 'chai';
import sinon from 'sinon';
import { WeatherService } from '../../../services/weather';
import {
  createMockEntity,
  createMockModelsStub,
  createMockModelsStubWithMockEntity,
  createWeatherApiStub,
  createWeatherApiStubWithMockResponse,
  getMockDataSourcesArg,
  getMockOptionsArg,
  getMockTypeArg,
} from './WeatherService.stubs';
import { mockNow, resetMocks } from './testutil';

describe('WeatherService', () => {
  afterEach(() => {
    resetMocks();
  });

  describe('basic operation', () => {
    it('returns analytics data when requesting data for dataElements', async () => {
      const mockModels = await createMockModelsStubWithMockEntity();

      const mockHistoricDailyApiResponse = {
        data: [
          {
            precip: 23.6,
            max_temp: 29.8,
            min_temp: 24,
            datetime: '2019-01-20',
          },
          {
            precip: 5,
            max_temp: 6,
            min_temp: 7,
            datetime: '2019-01-21',
          },
        ],
        sources: [],
      };

      const mockApi = createWeatherApiStub(mockHistoricDailyApiResponse);

      const service = new WeatherService(mockModels, mockApi);

      mockNow(1549342800 * 1000); // 2019-02-05 05:00 UTC

      const actual = await service.pull(
        [
          {
            model: {},
            id: '12345_PRECIP',
            code: 'WTHR_PRECIP',
            type: 'dataElement',
            service_type: 'weather',
            config: {},
          },
        ],
        'dataElement',
        getMockOptionsArg({
          startDate: '2019-01-01', // historic data request requires these, but api is mocked so these are ignored
          endDate: '2019-01-02',
        }),
      );

      expect(actual.results).to.deep.equal([
        { dataElement: 'WTHR_PRECIP', value: 23.6, organisationUnit: 'MELB', period: '20190120' },
        { dataElement: 'WTHR_PRECIP', value: 5, organisationUnit: 'MELB', period: '20190121' },
      ]);
    });

    it('returns events data when requesting data for a dataGroup', async () => {
      const mockModels = await createMockModelsStubWithMockEntity();

      const mockHistoricDailyApiResponse = {
        data: [
          {
            precip: 23.6,
            max_temp: 29.8,
            min_temp: 24,
            datetime: '2019-01-20',
          },
          {
            precip: 5,
            max_temp: 6,
            min_temp: 7,
            datetime: '2019-01-21',
          },
        ],
        sources: [],
      };

      const mockApi = createWeatherApiStub(mockHistoricDailyApiResponse);

      const service = new WeatherService(mockModels, mockApi);

      mockNow(1549342800 * 1000); // 2019-02-05 05:00 UTC

      const actual = await service.pull(
        [
          {
            model: {},
            id: 'SOME_DATA_GROUP_ID', // mock data has the data group lookup return element codes [WTHR_PRECIP], data group id/code/name doesnt matter
            code: 'SOME_DATA_GROUP_CODE',
            type: 'dataGroup',
            service_type: 'weather',
            config: {},
          },
        ],
        'dataGroup',
        getMockOptionsArg({
          startDate: '2019-01-01', // historic data request requires these, but api is mocked so these are ignored
          endDate: '2019-01-02',
        }),
      );

      expect(actual).to.deep.equal([
        {
          event: 'weather_MELB_2019-01-20',
          orgUnit: 'MELB',
          orgUnitName: 'Melbourne',
          eventDate: '2019-01-20T23:59:59',
          dataValues: {
            WTHR_PRECIP: 23.6,
          },
        },
        {
          event: 'weather_MELB_2019-01-21',
          orgUnit: 'MELB',
          orgUnitName: 'Melbourne',
          eventDate: '2019-01-21T23:59:59',
          dataValues: {
            WTHR_PRECIP: 5,
          },
        },
      ]);
    });
  });

  describe('gets todays weather', () => {
    it('calls the forecast api with 1 day requested when no dates are provided', async () => {
      const mockEntity = await createMockEntity({
        point: JSON.stringify({ type: 'Point', coordinates: [55, -111] }),
      });

      const mockModels = createMockModelsStub({
        entity: {
          find: [mockEntity],
        },
        dataSource: {
          find: [
            {
              code: 'WTHR_FORECAST_PRECIP',
              type: 'dataElement',
              config: { weatherForecastData: true },
            },
          ],
        },
      });

      const mockApi = createWeatherApiStubWithMockResponse();

      const service = new WeatherService(mockModels, mockApi);

      await service.pull(
        getMockDataSourcesArg({
          code: 'WTHR_FORECAST_PRECIP',
        }),
        getMockTypeArg(),
        getMockOptionsArg({
          startDate: undefined,
          endDate: undefined,
        }),
      );

      expect(mockApi.forecastDaily).to.have.callCount(1);
      expect(mockApi.forecastDaily.firstCall).to.have.been.calledWith(
        -111,
        55,
        1, // 1 day requested
      );
    });

    it('throws when dates are provided for forecast data', async () => {
      const mockEntity = await createMockEntity({
        point: JSON.stringify({ type: 'Point', coordinates: [55, -111] }),
      });

      const mockModels = createMockModelsStub({
        entity: {
          find: [mockEntity],
        },
        dataSource: {
          find: [
            {
              code: 'WTHR_FORECAST_PRECIP',
              type: 'dataElement',
              config: { weatherForecastData: true },
            },
          ],
        },
      });

      const mockApi = createWeatherApiStubWithMockResponse();

      const service = new WeatherService(mockModels, mockApi);

      const functionCall = async () =>
        service.pull(
          getMockDataSourcesArg({
            code: 'WTHR_FORECAST_PRECIP',
          }),
          getMockTypeArg(),
          getMockOptionsArg({
            startDate: '2055-03-01',
            endDate: '2055-03-02',
          }),
        );

      await expect(functionCall()).to.be.rejectedWith(
        'Date range not supported with forecast weather',
      );

      expect(mockApi.forecastDaily).to.have.callCount(0);
    });
  });

  describe('gets historic weather', () => {
    it('calls the historic api with specific dates when provided', async () => {
      const mockModels = await createMockModelsStubWithMockEntity();

      const mockApi = createWeatherApiStubWithMockResponse();

      const service = new WeatherService(mockModels, mockApi);

      mockNow(1549342800 * 1000); // 2019-02-05 05:00 UTC

      await service.pull(
        getMockDataSourcesArg(),
        getMockTypeArg(),
        getMockOptionsArg({
          startDate: '2019-01-07',
          endDate: '2019-01-10',
        }),
      );

      expect(mockApi.historicDaily).to.have.callCount(1);

      expect(mockApi.historicDaily.firstCall).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        '2019-01-07',
        '2019-01-11', // (same as input, changed to be exclusive end date)
      );
    });

    it('throws when no dates are provided', async () => {
      const mockModels = await createMockModelsStubWithMockEntity();

      const mockApi = createWeatherApiStubWithMockResponse();

      const service = new WeatherService(mockModels, mockApi);

      const functionCall = async () =>
        await service.pull(
          getMockDataSourcesArg(),
          getMockTypeArg(),
          getMockOptionsArg({
            startDate: undefined,
            endDate: undefined,
          }),
        );

      await expect(functionCall()).to.be.rejectedWith(
        'Empty date range not supported with historic weather',
      );

      expect(mockApi.historicDaily).to.have.callCount(0);
    });
  });
});
