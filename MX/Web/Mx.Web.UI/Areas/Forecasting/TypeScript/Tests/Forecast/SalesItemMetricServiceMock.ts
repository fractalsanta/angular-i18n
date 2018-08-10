module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
    };

    export class SalesItemMetricServiceMock extends DataMock implements Core.Tests.IMock<Api.ISalesItemMetricService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.ISalesItemMetricService = {
            GetForecastSalesItemMetric: (entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any> => {
                return this.GetDataHttpPromise("GetForecastSalesItemMetric");
            },

            GetForecastSalesItemMetric1: (entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any> => {
                return this.GetDataHttpPromise("GetForecastSalesItemMetric1");
            },

            GetForecastSalesItemMetric2: (entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<any> => {
                return this.GetDataHttpPromise("GetForecastSalesItemMetric2");
            },

            Get: (entityId: number, forecastEvaluationId: string): ng.IHttpPromise<string[]> => {
                return this.GetDataHttpPromise("Get");
            },

            GetEvaluationSalesItemMetricId: (entityId: number, forecastEvaluationId: string, id: number): ng.IHttpPromise<string> => {
                return this.GetDataHttpPromise("GetEvaluationSalesItemMetricId");
            },

            PatchSalesItemMetricDetails: (entityId: number, forecastId: number, version: number, /*[FromBody]*/ salesItemMetricDetailRequests: Forecasting.Api.Models.IForecastSalesItemMetricDetailsHeader[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader> => {
                return this.GetDataHttpPromise("PatchSalesItemMetricDetails");
            }
        };
    };
} 