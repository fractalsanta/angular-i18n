module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class ForecastTransactionEvaluationServiceMock extends DataMock implements Core.Tests.IMock<Api.IForecastTransactionEvaluationService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.IForecastTransactionEvaluationService = {
            GetEvaluateTransactions: (entityId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedTransactionEvaluationResponse[]> => {
                return this.GetDataHttpPromise("GetEvaluateTransactions");
            }
        };
    };
} 