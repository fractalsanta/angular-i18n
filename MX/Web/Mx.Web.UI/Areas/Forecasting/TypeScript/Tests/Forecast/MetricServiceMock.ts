module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
    };

    export class MetricServiceMock extends DataMock implements Core.Tests.IMock<Api.IMetricService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.IMetricService = {
            GetForecastMetrics: (entityId: number, forecastId: number, filterId: number, includeActuals: boolean): ng.IHttpPromise<any> => {
                return this.GetDataHttpPromise("GetForecastMetrics");
            },

            GetForecastMetricsByServiceType: (entityId: number, forecastId: number, serviceType: number, includeActuals: boolean): ng.IHttpPromise<any> => {
                return this.GetDataHttpPromise("GetForecastMetricsByServiceType");
            },

            GetForecastEvaluationById: (entityId: number, forecastEvaluationId: string): ng.IHttpPromise<string[]> => {
                return this.GetDataHttpPromise("GetForecastEvaluationById");
            },

            GetForecastMetricId: (entityId: number, forecastId: number, id: number): ng.IHttpPromise<string> => {
                return this.GetDataHttpPromise("GetForecastMetricId");
            },

            GetEvaluationMetricId: (entityId: number, forecastEvaluationId: string, id: number): ng.IHttpPromise<string> => {
                return this.GetDataHttpPromise("GetEvaluationMetricId");
            },

            PatchForecastMetricDetails: (entityId: number, forecastId: number, version: number, /*[FromBody]*/ metricDetailRequests: Forecasting.Api.Models.IForecastMetricDetailsHeader[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader> => {
                return this.GetDataHttpPromise("PatchForecastMetricDetails");
            }
        };
    };
} 