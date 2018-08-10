module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class ForecastSalesItemEvaluationServiceMock extends DataMock implements Core.Tests.IMock<Api.IForecastSalesItemEvaluationService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.IForecastSalesItemEvaluationService = {
            Get: (entityId: number, salesItemId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedSalesItemEvaluationResponse[]> => {
                return this.GetDataHttpPromise("Get");
            }
        };
    };
} 