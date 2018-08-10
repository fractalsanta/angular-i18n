var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Tests;
        (function (Tests) {
            "use strict";
            var DriverDistanceManagerServiceMock = (function () {
                function DriverDistanceManagerServiceMock($q) {
                    var _this = this;
                    this.$q = $q;
                    this.Object = {
                        GetRecordsForEntityByDate: function (entityId, date) {
                            return _this._promiseHelper.CreateHttpPromise(_this._records);
                        },
                        PutActionDriverDistanceRecord: function (entityId, record) {
                            return _this._promiseHelper.CreateHttpPromise({});
                        },
                        GetActiveUsersByAssignedEntity: function (entityId) {
                            return _this._promiseHelper.CreateHttpPromise(_this._recordUsers);
                        },
                        Post: function (entityId, request) {
                            return _this._promiseHelper.CreateHttpPromise(1);
                        }
                    };
                    this._promiseHelper = new PromiseHelper($q);
                    this._records = [];
                    this._recordUsers = [];
                }
                DriverDistanceManagerServiceMock.prototype.InjectRecordsToReturn = function (records) {
                    this._records = records;
                };
                return DriverDistanceManagerServiceMock;
            }());
            Tests.DriverDistanceManagerServiceMock = DriverDistanceManagerServiceMock;
        })(Tests = DriverDistance.Tests || (DriverDistance.Tests = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
