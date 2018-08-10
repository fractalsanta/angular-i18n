module Workforce.DriverDistance.Tests {
    "use strict";

    export class DriverDistanceManagerServiceMock implements Core.Tests.IMock<Api.IDriverDistanceManagerService> {
        private _promiseHelper: PromiseHelper;
        private _records: Api.Models.IDriverDistanceRecord[];
        private _recordUsers: Administration.User.Api.Models.IUser[];

        constructor(private $q: ng.IQService) {
            this._promiseHelper = new PromiseHelper($q);
            this._records = [];
            this._recordUsers = [];
        }

        public InjectRecordsToReturn(records: Api.Models.IDriverDistanceRecord[]) {
            this._records = records;
        }

        public Object: Api.IDriverDistanceManagerService = {
            GetRecordsForEntityByDate: (entityId: number, date: string): ng.IHttpPromise<Api.Models.IDriverDistanceRecord[]> => {
                return this._promiseHelper.CreateHttpPromise(this._records);
            },

            PutActionDriverDistanceRecord: (entityId: number, record: Api.Models.IActionDriverDistanceRequest): ng.IHttpPromise<{}> => {
                return this._promiseHelper.CreateHttpPromise({});
            },

            GetActiveUsersByAssignedEntity: (entityId: number): ng.IHttpPromise<Administration.User.Api.Models.IUser[]> => {
                return this._promiseHelper.CreateHttpPromise(this._recordUsers);
            },

            Post: (entityId: number, request: Workforce.DriverDistance.Api.Models.ICreateAuthorizedDriverDistanceRequest): ng.IHttpPromise<number> => {
                return this._promiseHelper.CreateHttpPromise(1);
            }
        }
    }
}