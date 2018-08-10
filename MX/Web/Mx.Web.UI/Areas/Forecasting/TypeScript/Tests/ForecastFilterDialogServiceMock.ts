module Forecasting.Tests {
    "use strict";

    export class ForecastFilterDialogServiceMock implements Core.Tests.IMock<Api.IForecastFilterDialogService> {
        private _promiseHelper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._promiseHelper = new PromiseHelper($q);
        }
        
        public Object: Api.IForecastFilterDialogService = {
            PostInsertOrUpdateForecastFilter: (forecastFilterRecord: Forecasting.Api.Models.IForecastFilterRecord):
                ng.IHttpPromise<{}> => {
                return this._promiseHelper.CreateHttpPromise({});
            }
        }
    }
}