/// <reference path="../DataMock.ts" />

module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
        GetStoreMirrorIntervals: [
            { "Intervals": [{ "Id": 26, "SourceDateStart": "2015-07-20T00:00:00", "TargetDateStart": "2015-07-20T00:00:00", "TargetDateEnd": "2015-07-22T00:00:00", "Adjustment": 1.2, "GroupId": "f1349739-5c85-434d-986d-4bcc0d00bc45", "SourceEntity": { "EntityId": 740 }, "TargetEntity": { "EntityId": 269 }, "IsCorporateMirror": false }], "GroupId": "f1349739-5c85-434d-986d-4bcc0d00bc45", "CancelledDate": null, "EarliestSourceDate": "2015-07-20T00:00:00", "LatestSourceDate": "2015-07-22T00:00:00", "EarliestTargetDate": "2015-07-20T00:00:00", "LatestTargetDate": "2015-07-22T00:00:00", "OverallStatus": 2, "OverallStatusGroup": 1 },
            { "Intervals": [{ "Id": 6, "SourceDateStart": "2015-07-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "Adjustment": 1.0, "GroupId": "16148ce0-35e9-4603-9d5e-d086397ee792", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "16148ce0-35e9-4603-9d5e-d086397ee792", "CancelledDate": null, "SourceDateStart": "2015-07-07T00:00:00", "SourceDateEnd": "2015-07-12T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "OverallStatus": 1, "OverallStatusGroup": 3, "SourceEntity": null, "TargetEntity": null },
            { "Intervals": [{ "Id": 11, "SourceDateStart": "2015-07-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "Adjustment": 1.0, "GroupId": "28e3c859-2816-4be7-bf7d-7322be050365", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "28e3c859-2816-4be7-bf7d-7322be050365", "CancelledDate": null, "SourceDateStart": "2015-07-07T00:00:00", "SourceDateEnd": "2015-07-12T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "OverallStatus": 1, "OverallStatusGroup": 3, "SourceEntity": null, "TargetEntity": null },
            { "Intervals": [{ "Id": 12, "SourceDateStart": "2014-03-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-08T00:00:00", "Adjustment": 1.0, "GroupId": "4622a874-c3f3-4772-ae70-6e05730dc987", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "4622a874-c3f3-4772-ae70-6e05730dc987", "CancelledDate": null, "SourceDateStart": "2014-03-07T00:00:00", "SourceDateEnd": "2014-03-08T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-08T00:00:00", "OverallStatus": 1, "OverallStatusGroup": 3, "SourceEntity": null, "TargetEntity": null },
            { "Intervals": [{ "Id": 7, "SourceDateStart": "2015-07-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "Adjustment": 1.0, "GroupId": "64081c55-c2a0-4016-b268-ae8b42687db4", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "64081c55-c2a0-4016-b268-ae8b42687db4", "CancelledDate": "2015-07-21T10:36:30", "SourceDateStart": "2015-07-07T00:00:00", "SourceDateEnd": "2015-07-12T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "OverallStatus": 4, "OverallStatusGroup": 2, "SourceEntity": null, "TargetEntity": null }
        ]
    };

    export class StoreMirrorIntervalsServiceMock extends DataMock implements Core.Tests.IMock<Api.IStoreMirrorIntervalsService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.IStoreMirrorIntervalsService = {

            GetStoreMirrorInterval: (id: number): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorInterval> => {
                return this.GetDataHttpPromise("GetStoreMirrorInterval");
            },

            GetStoreMirrorIntervals: (entityId: number, group: any, types: any): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorIntervalGroup[]> => {
                return this.GetDataHttpPromise("GetStoreMirrorIntervals");
            },

            PostStoreMirrorIntervals: (/*[FromBody]*/ storeMirrorIntervalGroup: Forecasting.Api.Models.IStoreMirrorIntervalGroup): ng.IHttpPromise<any> => {
                return this.GetDataHttpPromise("PostStoreMirrorIntervals");
            },

            DeleteStoreMirrorInterval: (entityId: number, userName: string, groupId: any, resetManagerForecasts: boolean): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("DeleteStoreMirrorInterval");
            }
        };
    };
} 