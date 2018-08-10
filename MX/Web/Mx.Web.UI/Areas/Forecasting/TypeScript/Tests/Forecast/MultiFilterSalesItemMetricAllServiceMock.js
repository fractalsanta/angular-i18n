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
        var MultiFilterSalesItemMetricAllServiceMock = (function (_super) {
            __extends(MultiFilterSalesItemMetricAllServiceMock, _super);
            function MultiFilterSalesItemMetricAllServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastingSalesItemMetricAlls: function (entityId, forecastId, filterIds, includeActuals, aggregate) {
                        return _this.GetDataHttpPromise("GetForecastingSalesItemMetricAlls");
                    },
                    GetSalesItemMetrics: function (entityId, forecastId, id, filterIds, includeActuals, aggregate) {
                        return _this.GetDataHttpPromise("GetSalesItemMetrics");
                    },
                    GetSalesItemMetricDetailsById: function (entityId, forecastId, ids, filterIds, aggregate) {
                        return _this.GetDataHttpPromise("GetSalesItemMetricDetailsById");
                    }
                };
            }
            return MultiFilterSalesItemMetricAllServiceMock;
        }(Tests.DataMock));
        Tests.MultiFilterSalesItemMetricAllServiceMock = MultiFilterSalesItemMetricAllServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
