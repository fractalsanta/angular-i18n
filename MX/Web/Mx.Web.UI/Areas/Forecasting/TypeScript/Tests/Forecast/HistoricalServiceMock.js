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
        var _myDefaults = {};
        var HistoricalServiceMock = (function (_super) {
            __extends(HistoricalServiceMock, _super);
            function HistoricalServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastSalesHistory: function (entityId, forecastId, filterId) {
                        return _this.GetDataHttpPromise("GetForecastSalesHistory");
                    }
                };
            }
            return HistoricalServiceMock;
        }(Tests.DataMock));
        Tests.HistoricalServiceMock = HistoricalServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
