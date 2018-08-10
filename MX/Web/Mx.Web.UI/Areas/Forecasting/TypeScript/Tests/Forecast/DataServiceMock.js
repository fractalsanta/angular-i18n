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
        var DataServiceMock = (function (_super) {
            __extends(DataServiceMock, _super);
            function DataServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    CanViewHistory: function () {
                        return _this.GetData("CanViewHistory") ||
                            _this.dataService.CanViewHistory();
                    },
                    CanRevertForecast: function () {
                        return _this.GetData("CanRevertForecast") ||
                            _this.dataService.CanRevertForecast();
                    },
                    GetEntityId: function () {
                        return _this.GetData("GetEntityId") ||
                            _this.dataService.GetEntityId();
                    },
                    GetAllForecastingDataForDate: function (targetDate) {
                        return _this.GetDataPromise("GetAllForecastingDataForDate") ||
                            _this.dataService.GetAllForecastingDataForDate(targetDate);
                    },
                    GetAllForecastingDataForDateByFilter: function (targetDate, filterIds, noMetrics) {
                        return _this.GetDataPromise("GetAllForecastingDataForDateByFilter") ||
                            _this.dataService.GetAllForecastingDataForDateByFilter(targetDate, filterIds, noMetrics);
                    },
                    GetBlankForecastingData: function () {
                        return _this.GetDataHttpPromise("GetBlankForecastingData") ||
                            _this.dataService.GetBlankForecastingData();
                    },
                    GetSalesItemsForForecastData: function (forecastId) {
                        return _this.GetDataHttpPromise("GetSalesItemsForForecastData") ||
                            _this.dataService.GetSalesItemsForForecastData(forecastId);
                    },
                    GetSalesItemMetrics: function (forecastId, salesItemId) {
                        return _this.GetDataHttpPromise("GetSalesItemMetrics") ||
                            _this.dataService.GetSalesItemMetrics(forecastId, salesItemId);
                    },
                    GetSalesItemMetricsByFilter: function (forecastId, salesItemId, filterId) {
                        return _this.GetDataHttpPromise("GetSalesItemMetricsByFilter") ||
                            _this.dataService.GetSalesItemMetricsByFilter(forecastId, salesItemId, filterId);
                    },
                    GetSalesItemMetricsByFilters: function (forecastId, salesItemId, filterIds) {
                        return _this.GetDataPromise("GetSalesItemMetricsByFilters") ||
                            _this.dataService.GetSalesItemMetricsByFilters(forecastId, salesItemId, filterIds);
                    },
                    UpdateMetrics: function (forecastId, version, metricDetails, filterId) {
                        return _this.GetDataHttpPromise("UpdateMetrics") ||
                            _this.dataService.UpdateMetrics(forecastId, version, metricDetails, filterId);
                    },
                    UpdateMetricsByFilter: function (forecastId, version, forecastMetricAllsFiltered) {
                        return _this.GetDataHttpPromise("UpdateMetricsByFilter") ||
                            _this.dataService.UpdateMetricsByFilter(forecastId, version, forecastMetricAllsFiltered);
                    },
                    UpdateSalesItemMetrics: function (forecastId, salesItemId, version, salesItemMetricDetails, filterId) {
                        return _this.GetDataHttpPromise("UpdateSalesItemMetrics") ||
                            _this.dataService.UpdateSalesItemMetrics(forecastId, salesItemId, version, salesItemMetricDetails, filterId);
                    },
                    UpdateSalesItemMetricsByFilter: function (forecastId, salesItemId, version, forecastMetricAllsFiltered) {
                        return _this.GetDataHttpPromise("UpdateSalesItemMetricsByFilter") ||
                            _this.dataService.UpdateSalesItemMetricsByFilter(forecastId, salesItemId, version, forecastMetricAllsFiltered);
                    },
                    GetAllHistoricalData: function (forecastId, filterId) {
                        return _this.GetDataHttpPromise("GetAllHistoricalData") ||
                            _this.dataService.GetAllHistoricalData(forecastId, filterId);
                    },
                    GetDaySegments: function (forecastId) {
                        return _this.GetDataHttpPromise("GetDaySegments") ||
                            _this.dataService.GetDaySegments(forecastId);
                    },
                    GetHistoricalSalesItem: function (forecastId, salesItem, filterId) {
                        return _this.GetDataHttpPromise("GetHistoricalSalesItem") ||
                            _this.dataService.GetHistoricalSalesItem(forecastId, salesItem, filterId);
                    },
                    RevertForecast: function (forecastId, version) {
                        return _this.GetDataPromise("RevertForecast") ||
                            _this.dataService.RevertForecast(forecastId, version);
                    },
                    GetForecastEvaluationDataForDate: function (targetDate, filterId) {
                        return _this.GetDataPromise("GetForecastEvaluationDataForDate") ||
                            _this.dataService.GetForecastEvaluationDataForDate(targetDate, filterId);
                    }
                };
                this.$authServiceMock = new Core.Tests.AuthServiceMock();
                this.historicalServiceMock = new Tests.HistoricalServiceMock($q);
                this.salesItemHistoricalServiceMock = new Tests.SalesItemHistoricalServiceMock($q);
                this.salesItemMetricAllServiceMock = new Tests.SalesItemMetricAllServiceMock($q);
                this.forecastServiceMock = new Tests.ForecastServiceMock($q);
                this.salesItemMetricServiceMock = new Tests.SalesItemMetricServiceMock($q);
                this.metricServiceMock = new Tests.MetricServiceMock($q);
                this.daySegmentServiceMock = new Tests.DaySegmentServiceMock($q);
                this.salesItemServiceMock = new Tests.SalesItemServiceMock($q);
                this.metricAllServiceMock = new Tests.MetricAllServiceMock($q);
                this.forecastSalesEvaluationServiceMock = new Tests.ForecastSalesEvaluationServiceMock($q);
                this.forecastSalesItemEvaluationServiceMock = new Tests.ForecastSalesItemEvaluationServiceMock($q);
                this.forecastTransactionEvaluationServiceMock = new Tests.ForecastTransactionEvaluationServiceMock($q);
                this.multiFilterMetricAllServiceMock = new Tests.MultiFilterMetricAllServiceMock($q);
                this.multiFilterSalesItemMetricAllServiceMock = new Tests.MultiFilterSalesItemMetricAllServiceMock($q);
                this.dataService = new Forecasting.Services.DataService($q, this.$authServiceMock.Object, this.historicalServiceMock.Object, this.salesItemHistoricalServiceMock.Object, this.salesItemMetricAllServiceMock.Object, this.forecastServiceMock.Object, this.salesItemMetricServiceMock.Object, this.metricServiceMock.Object, this.daySegmentServiceMock.Object, this.salesItemServiceMock.Object, this.metricAllServiceMock.Object, this.forecastSalesEvaluationServiceMock.Object, this.forecastSalesItemEvaluationServiceMock.Object, this.forecastTransactionEvaluationServiceMock.Object, this.multiFilterMetricAllServiceMock.Object, this.multiFilterSalesItemMetricAllServiceMock.Object);
            }
            return DataServiceMock;
        }(Tests.DataMock));
        Tests.DataServiceMock = DataServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
