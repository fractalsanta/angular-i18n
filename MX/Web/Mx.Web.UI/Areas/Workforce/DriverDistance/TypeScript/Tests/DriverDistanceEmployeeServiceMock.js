var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Tests;
        (function (Tests) {
            "use strict";
            var DriverDistanceEmployeeServiceMock = (function () {
                function DriverDistanceEmployeeServiceMock($q) {
                    var _this = this;
                    this.$q = $q;
                    this.Object = {
                        GetRecordsForEmployeeByEntityAndDate: function (employeeId, entityId, date) {
                            return _this._promiseHelper.CreateHttpPromise(_this._records);
                        },
                        Post: function (entityid, request) {
                            return _this._promiseHelper.CreateHttpPromise(1);
                        }
                    };
                    this._promiseHelper = new PromiseHelper($q);
                    this._records = [];
                }
                DriverDistanceEmployeeServiceMock.prototype.InjectRecordsToReturn = function (records) {
                    this._records = records;
                };
                return DriverDistanceEmployeeServiceMock;
            }());
            Tests.DriverDistanceEmployeeServiceMock = DriverDistanceEmployeeServiceMock;
        })(Tests = DriverDistance.Tests || (DriverDistance.Tests = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
