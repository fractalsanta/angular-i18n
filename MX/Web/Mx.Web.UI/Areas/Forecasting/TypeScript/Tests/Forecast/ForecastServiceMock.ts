module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
        GetForecastForBusinessDay:
            { "Id": 485544, "EntityId": 386, "ForecastStatus": 0, "BusinessDay": "2015-07-01T00:00:00", "GenerationDate": "2015-07-01T22:03:06", "LastYearSales": 14785.0, "ManagerSales": 12930.0, "LastYearTransactionCount": 1896.0, "ManagerTransactionCount": 1793.0, "Version": 0, "IsDayLocked": false, "HasBeenEdited": false }
    };

    export class ForecastServiceMock extends DataMock implements Core.Tests.IMock<Api.IForecastService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.IForecastService = {
            GetForecastById: (entityId: number, id: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecast> => {
                return this.GetDataHttpPromise("GetForecastById");
            },

            GetForecastForBusinessDay: (entityId: number, businessDay: string): ng.IHttpPromise<Forecasting.Api.Models.IForecast> => {
                return this.GetDataHttpPromise("GetForecastForBusinessDay");
            },

            GetForecastsForBusinessDateRange: (entityId: number, startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.IForecast[]> => {
                return this.GetDataHttpPromise("GetForecastsForBusinessDateRange");
            },

            GetForecasts: (entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecast[]> => {
                return this.GetDataHttpPromise("GetForecasts");
            },

            PatchRevertForecast: (entityId: number, forecastId: number, /*[FromBody]*/ opcollection: Forecasting.Api.Models.IForecastOperationCollection): ng.IHttpPromise<number> => {
                return this.GetDataHttpPromise("PatchRevertForecast");
            }
        };
    };
} 