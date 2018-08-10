module Workforce.DriverDistance.Tests {
    "use strict";

    export class DriverDistanceEmployeeServiceMock implements Core.Tests.IMock<Api.IDriverDistanceEmployeeService> {
        private _promiseHelper: PromiseHelper;
        private _records: Api.Models.IDriverDistanceRecord[];

        constructor(private $q: ng.IQService) {
            this._promiseHelper = new PromiseHelper($q);
            this._records = [];
        }

        public InjectRecordsToReturn(records: Api.Models.IDriverDistanceRecord[]) {
            this._records = records;
        }

        public Object: Api.IDriverDistanceEmployeeService = {
            GetRecordsForEmployeeByEntityAndDate: (employeeId: number, entityId: number, date: string): ng.IHttpPromise<Api.Models.IDriverDistanceRecord[]> => {
                return this._promiseHelper.CreateHttpPromise(this._records);
            },

            Post: (entityid: number, request: Workforce.DriverDistance.Api.Models.ICreateDriverDistanceRequest): ng.IHttpPromise<number> => {
                return this._promiseHelper.CreateHttpPromise(1);
            }
        }
    }
}