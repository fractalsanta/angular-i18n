var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var ForecastFilterDialogServiceMock = (function () {
            function ForecastFilterDialogServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    PostInsertOrUpdateForecastFilter: function (forecastFilterRecord) {
                        return _this._promiseHelper.CreateHttpPromise({});
                    }
                };
                this._promiseHelper = new PromiseHelper($q);
            }
            return ForecastFilterDialogServiceMock;
        }());
        Tests.ForecastFilterDialogServiceMock = ForecastFilterDialogServiceMock;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
