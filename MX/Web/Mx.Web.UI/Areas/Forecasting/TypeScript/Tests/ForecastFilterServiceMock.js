var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var ForecastFilterServiceMock = (function () {
            function ForecastFilterServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    GetForecastFilters: function () {
                        return _this._promiseHelper.CreateHttpPromise(_this._records);
                    },
                    DeleteFilterById: function (id) {
                        return _this._promiseHelper.CreateHttpPromise({});
                    }
                };
                this._promiseHelper = new PromiseHelper($q);
                this._records = [];
            }
            ForecastFilterServiceMock.prototype.InjectRecordsToReturn = function (records) {
                this._records = records;
            };
            return ForecastFilterServiceMock;
        }());
        Tests.ForecastFilterServiceMock = ForecastFilterServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
