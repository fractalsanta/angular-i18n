module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class HistoricalServiceMock extends DataMock implements Core.Tests.IMock<Api.IHistoricalService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.IHistoricalService = {
            GetForecastSalesHistory: (entityId: number, forecastId: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IHistoricalBasis[]> => {
                return this.GetDataHttpPromise("GetForecastSalesHistory");
            }
        };
    };
} 