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
        var MetricAllServiceMock = (function (_super) {
            __extends(MetricAllServiceMock, _super);
            function MetricAllServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastMetricAlls: function (entityId, forecastId, filterId, includeActuals) {
                        return _this.GetDataHttpPromise("GetForecastMetricAlls");
                    },
                    GetForecastMetricAlls1: function (entityId) {
                        return _this.GetDataHttpPromise("GetForecastMetricAlls1");
                    }
                };
            }
            return MetricAllServiceMock;
        }(Tests.DataMock));
        Tests.MetricAllServiceMock = MetricAllServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
