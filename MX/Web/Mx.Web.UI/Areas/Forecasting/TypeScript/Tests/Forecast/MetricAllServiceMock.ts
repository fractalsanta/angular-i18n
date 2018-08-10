module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
    };

    export class MetricAllServiceMock extends DataMock implements Core.Tests.IMock<Api.IMetricAllService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.IMetricAllService = {
            GetForecastMetricAlls: (entityId: number, forecastId: number, filterId: number, includeActuals: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingMetricAlls> => {
                return this.GetDataHttpPromise("GetForecastMetricAlls");
            },

            GetForecastMetricAlls1: (entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecastingMetricAlls> => {
                return this.GetDataHttpPromise("GetForecastMetricAlls1");
            }
        };
    };
} 