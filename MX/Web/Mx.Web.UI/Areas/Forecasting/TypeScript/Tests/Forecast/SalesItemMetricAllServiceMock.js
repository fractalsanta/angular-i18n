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
        var SalesItemMetricAllServiceMock = (function (_super) {
            __extends(SalesItemMetricAllServiceMock, _super);
            function SalesItemMetricAllServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastingSalesItemMetricAlls: function (entityId, forecastId, filterId, includeActuals, aggregate) {
                        return _this.GetDataHttpPromise("GetForecastingSalesItemMetricAlls");
                    },
                    GetSalesItemMetrics: function (entityId, forecastId, id, filterId, includeActuals, aggregate) {
                        return _this.GetDataHttpPromise("GetSalesItemMetrics");
                    },
                    GetSalesItemMetricDetailsById: function (entityId, forecastId, ids, filterId, aggregate) {
                        return _this.GetDataHttpPromise("GetSalesItemMetricDetailsById");
                    }
                };
            }
            return SalesItemMetricAllServiceMock;
        }(Tests.DataMock));
        Tests.SalesItemMetricAllServiceMock = SalesItemMetricAllServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
