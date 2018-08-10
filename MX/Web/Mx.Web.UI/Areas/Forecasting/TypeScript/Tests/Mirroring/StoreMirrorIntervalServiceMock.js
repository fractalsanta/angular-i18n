var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var _myDefaults = {
            GetStoreMirrorIntervals: [
                { "Intervals": [{ "Id": 26, "SourceDateStart": "2015-07-20T00:00:00", "TargetDateStart": "2015-07-20T00:00:00", "TargetDateEnd": "2015-07-22T00:00:00", "Adjustment": 1.2, "GroupId": "f1349739-5c85-434d-986d-4bcc0d00bc45", "SourceEntity": { "EntityId": 740 }, "TargetEntity": { "EntityId": 269 }, "IsCorporateMirror": false }], "GroupId": "f1349739-5c85-434d-986d-4bcc0d00bc45", "CancelledDate": null, "EarliestSourceDate": "2015-07-20T00:00:00", "LatestSourceDate": "2015-07-22T00:00:00", "EarliestTargetDate": "2015-07-20T00:00:00", "LatestTargetDate": "2015-07-22T00:00:00", "OverallStatus": 2, "OverallStatusGroup": 1 },
                { "Intervals": [{ "Id": 6, "SourceDateStart": "2015-07-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "Adjustment": 1.0, "GroupId": "16148ce0-35e9-4603-9d5e-d086397ee792", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "16148ce0-35e9-4603-9d5e-d086397ee792", "CancelledDate": null, "SourceDateStart": "2015-07-07T00:00:00", "SourceDateEnd": "2015-07-12T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "OverallStatus": 1, "OverallStatusGroup": 3, "SourceEntity": null, "TargetEntity": null },
                { "Intervals": [{ "Id": 11, "SourceDateStart": "2015-07-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "Adjustment": 1.0, "GroupId": "28e3c859-2816-4be7-bf7d-7322be050365", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "28e3c859-2816-4be7-bf7d-7322be050365", "CancelledDate": null, "SourceDateStart": "2015-07-07T00:00:00", "SourceDateEnd": "2015-07-12T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "OverallStatus": 1, "OverallStatusGroup": 3, "SourceEntity": null, "TargetEntity": null },
                { "Intervals": [{ "Id": 12, "SourceDateStart": "2014-03-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-08T00:00:00", "Adjustment": 1.0, "GroupId": "4622a874-c3f3-4772-ae70-6e05730dc987", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "4622a874-c3f3-4772-ae70-6e05730dc987", "CancelledDate": null, "SourceDateStart": "2014-03-07T00:00:00", "SourceDateEnd": "2014-03-08T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-08T00:00:00", "OverallStatus": 1, "OverallStatusGroup": 3, "SourceEntity": null, "TargetEntity": null },
                { "Intervals": [{ "Id": 7, "SourceDateStart": "2015-07-07T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "Adjustment": 1.0, "GroupId": "64081c55-c2a0-4016-b268-ae8b42687db4", "SourceEntity": { "EntityId": 269 }, "TargetEntity": { "EntityId": 386 }, "IsCorporateMirror": false }], "GroupId": "64081c55-c2a0-4016-b268-ae8b42687db4", "CancelledDate": "2015-07-21T10:36:30", "SourceDateStart": "2015-07-07T00:00:00", "SourceDateEnd": "2015-07-12T00:00:00", "TargetDateStart": "2015-07-07T00:00:00", "TargetDateEnd": "2015-07-12T00:00:00", "OverallStatus": 4, "OverallStatusGroup": 2, "SourceEntity": null, "TargetEntity": null }
            ]
        };
        var StoreMirrorIntervalsServiceMock = (function (_super) {
            __extends(StoreMirrorIntervalsServiceMock, _super);
            function StoreMirrorIntervalsServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetStoreMirrorInterval: function (id) {
                        return _this.GetDataHttpPromise("GetStoreMirrorInterval");
                    },
                    GetStoreMirrorIntervals: function (entityId, group, types) {
                        return _this.GetDataHttpPromise("GetStoreMirrorIntervals");
                    },
                    PostStoreMirrorIntervals: function (storeMirrorIntervalGroup) {
                        return _this.GetDataHttpPromise("PostStoreMirrorIntervals");
                    },
                    DeleteStoreMirrorInterval: function (entityId, userName, groupId, resetManagerForecasts) {
                        return _this.GetDataHttpPromise("DeleteStoreMirrorInterval");
                    }
                };
            }
            return StoreMirrorIntervalsServiceMock;
        }(Tests.DataMock));
        Tests.StoreMirrorIntervalsServiceMock = StoreMirrorIntervalsServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
