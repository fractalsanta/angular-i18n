module Forecasting.Tests {
    "use strict";

    export class ForecastFilterServiceMock implements Core.Tests.IMock<Api.IForecastFilterService> {
        private _promiseHelper: PromiseHelper;
        private _records: Api.Models.IForecastFilterRecord[];

        constructor(private $q: ng.IQService) {
            this._promiseHelper = new PromiseHelper($q);
            this._records = [];
        }

        public InjectRecordsToReturn(records: Api.Models.IForecastFilterRecord[]): void {
            this._records = records;
        }

        public Object: Api.IForecastFilterService = {
            GetForecastFilters: (): ng.IHttpPromise<Api.Models.IForecastFilterRecord[]> => {
                return this._promiseHelper.CreateHttpPromise(this._records);
            },
            DeleteFilterById: (id: number): ng.IHttpPromise<{}> => {
                return this._promiseHelper.CreateHttpPromise({});
            }
        };
    };
}