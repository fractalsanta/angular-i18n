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
        var SalesItemMetricServiceMock = (function (_super) {
            __extends(SalesItemMetricServiceMock, _super);
            function SalesItemMetricServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastSalesItemMetric: function (entityId, forecastId, filterId, includeActuals, aggregate) {
                        return _this.GetDataHttpPromise("GetForecastSalesItemMetric");
                    },
                    GetForecastSalesItemMetric1: function (entityId, forecastId, id, filterId, includeActuals, aggregate) {
                        return _this.GetDataHttpPromise("GetForecastSalesItemMetric1");
                    },
                    GetForecastSalesItemMetric2: function (entityId, forecastId, ids, filterId, aggregate) {
                        return _this.GetDataHttpPromise("GetForecastSalesItemMetric2");
                    },
                    Get: function (entityId, forecastEvaluationId) {
                        return _this.GetDataHttpPromise("Get");
                    },
                    GetEvaluationSalesItemMetricId: function (entityId, forecastEvaluationId, id) {
                        return _this.GetDataHttpPromise("GetEvaluationSalesItemMetricId");
                    },
                    PatchSalesItemMetricDetails: function (entityId, forecastId, version, salesItemMetricDetailRequests) {
                        return _this.GetDataHttpPromise("PatchSalesItemMetricDetails");
                    }
                };
            }
            return SalesItemMetricServiceMock;
        }(Tests.DataMock));
        Tests.SalesItemMetricServiceMock = SalesItemMetricServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
