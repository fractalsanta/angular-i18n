module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class SalesItemHistoricalServiceMock extends DataMock implements Core.Tests.IMock<Api.ISalesItemHistoricalService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.ISalesItemHistoricalService = {
            GetForecastSalesItemHistory: (entityId: number, forecastId: number, salesItemId: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IHistoricalSalesItem[]> => {
                return this.GetDataHttpPromise("GetForecastSalesItemHistory");
            }
        };
    };
} 