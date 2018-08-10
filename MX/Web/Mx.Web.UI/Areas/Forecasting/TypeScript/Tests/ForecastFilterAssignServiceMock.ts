module Forecasting.Tests {
    "use strict";

    export class ForecastFilterAssignServiceMock implements Core.Tests.IMock<Api.IForecastFilterAssignService> {
        private _helper: PromiseHelper;
        private _records: Api.Models.IForecastFilterAssignRecord[];

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
            this._records = [];
        }

        public InjectRecordsToReturn(records: Api.Models.IForecastFilterAssignRecord[]) {
            this._records = records;
        }

        public Object: Api.IForecastFilterAssignService = {
            GetForecastFilterAssigns: (): ng.IHttpPromise<Api.Models.IForecastFilterAssignRecord[]> => {
                return this._helper.CreateHttpPromise(this._records);
            },

            PostForecastFilterAssign: (forecastFilterAssignRecords: Api.Models.IForecastFilterAssignRecord[]): ng.IHttpPromise<{}> => {
                this._records = forecastFilterAssignRecords;
                return this._helper.CreateHttpPromise(null);
            }
        }
    }
}