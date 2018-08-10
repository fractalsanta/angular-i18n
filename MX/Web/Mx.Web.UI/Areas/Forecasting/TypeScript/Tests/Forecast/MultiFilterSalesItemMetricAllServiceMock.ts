module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class MultiFilterSalesItemMetricAllServiceMock extends DataMock implements Core.Tests.IMock<Api.IMultiFilterSalesItemMetricAllService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.IMultiFilterSalesItemMetricAllService = {
            GetForecastingSalesItemMetricAlls: (entityId: number, forecastId: number, filterIds: number[], includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any[]> => {
                return this.GetDataHttpPromise("GetForecastingSalesItemMetricAlls");
            },

            GetSalesItemMetrics: (entityId: number, forecastId: number, id: number, filterIds: number[], includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any[]> => {
                return this.GetDataHttpPromise("GetSalesItemMetrics");
            },

            GetSalesItemMetricDetailsById: (entityId: number, forecastId: number, ids: string, filterIds: number[], aggregate: boolean): ng.IHttpPromise<any[]> => {
                return this.GetDataHttpPromise("GetSalesItemMetricDetailsById");
            }
        };
    };
} 