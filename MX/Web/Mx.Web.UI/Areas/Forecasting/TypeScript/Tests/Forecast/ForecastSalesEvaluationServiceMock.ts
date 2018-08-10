module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class ForecastSalesEvaluationServiceMock extends DataMock implements Core.Tests.IMock<Api.IForecastSalesEvaluationService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.IForecastSalesEvaluationService = {
            GetEvaluateSales: (entityId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedSalesEvaluationResponse[]> => {
                return this.GetDataHttpPromise("GetEvaluateSales");
            }
        };
    };
} 