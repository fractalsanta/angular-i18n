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
        var MetricServiceMock = (function (_super) {
            __extends(MetricServiceMock, _super);
            function MetricServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastMetrics: function (entityId, forecastId, filterId, includeActuals) {
                        return _this.GetDataHttpPromise("GetForecastMetrics");
                    },
                    GetForecastMetricsByServiceType: function (entityId, forecastId, serviceType, includeActuals) {
                        return _this.GetDataHttpPromise("GetForecastMetricsByServiceType");
                    },
                    GetForecastEvaluationById: function (entityId, forecastEvaluationId) {
                        return _this.GetDataHttpPromise("GetForecastEvaluationById");
                    },
                    GetForecastMetricId: function (entityId, forecastId, id) {
                        return _this.GetDataHttpPromise("GetForecastMetricId");
                    },
                    GetEvaluationMetricId: function (entityId, forecastEvaluationId, id) {
                        return _this.GetDataHttpPromise("GetEvaluationMetricId");
                    },
                    PatchForecastMetricDetails: function (entityId, forecastId, version, metricDetailRequests) {
                        return _this.GetDataHttpPromise("PatchForecastMetricDetails");
                    }
                };
            }
            return MetricServiceMock;
        }(Tests.DataMock));
        Tests.MetricServiceMock = MetricServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
