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
        var SalesItemHistoricalServiceMock = (function (_super) {
            __extends(SalesItemHistoricalServiceMock, _super);
            function SalesItemHistoricalServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastSalesItemHistory: function (entityId, forecastId, salesItemId, filterId) {
                        return _this.GetDataHttpPromise("GetForecastSalesItemHistory");
                    }
                };
            }
            return SalesItemHistoricalServiceMock;
        }(Tests.DataMock));
        Tests.SalesItemHistoricalServiceMock = SalesItemHistoricalServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
