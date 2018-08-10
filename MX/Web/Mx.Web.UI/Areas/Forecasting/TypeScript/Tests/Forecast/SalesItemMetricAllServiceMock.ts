module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
    };

    export class SalesItemMetricAllServiceMock extends DataMock implements Core.Tests.IMock<Api.ISalesItemMetricAllService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.ISalesItemMetricAllService = {
            GetForecastingSalesItemMetricAlls: (entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls> => {
                return this.GetDataHttpPromise("GetForecastingSalesItemMetricAlls");
            },

            GetSalesItemMetrics: (entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls> => {
                return this.GetDataHttpPromise("GetSalesItemMetrics");
            },

            GetSalesItemMetricDetailsById: (entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls> => {
                return this.GetDataHttpPromise("GetSalesItemMetricDetailsById");
            }
        };
    };
}  