var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var ForecastFilterAssignServiceMock = (function () {
            function ForecastFilterAssignServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    GetForecastFilterAssigns: function () {
                        return _this._helper.CreateHttpPromise(_this._records);
                    },
                    PostForecastFilterAssign: function (forecastFilterAssignRecords) {
                        _this._records = forecastFilterAssignRecords;
                        return _this._helper.CreateHttpPromise(null);
                    }
                };
                this._helper = new PromiseHelper($q);
                this._records = [];
            }
            ForecastFilterAssignServiceMock.prototype.InjectRecordsToReturn = function (records) {
                this._records = records;
            };
            return ForecastFilterAssignServiceMock;
        }());
        Tests.ForecastFilterAssignServiceMock = ForecastFilterAssignServiceMock;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
