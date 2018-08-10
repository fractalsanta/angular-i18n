var Forecasting;
(function (Forecasting) {
    var Services;
    (function (Services) {
        "use strict";
        var IntervalTypes = (function () {
            function IntervalTypes() {
            }
            IntervalTypes.All = 1;
            IntervalTypes.Year = 2;
            IntervalTypes.Month = 3;
            IntervalTypes.Week = 4;
            IntervalTypes.Day = 5;
            IntervalTypes.Forecast = 6;
            IntervalTypes.DaySegment = 7;
            IntervalTypes.Hour = 8;
            IntervalTypes.Interval = 9;
            IntervalTypes.Types = ["", "All", "Year", "Month", "Week", "Day", "Forecast", "DaySegment", "Hour", "Interval"];
            return IntervalTypes;
        }());
        Services.IntervalTypes = IntervalTypes;
        var DataService = (function () {
            function DataService($q, $authService, historicalService, salesItemHistoricalService, salesItemMetricAllService, forecastService, salesItemMetricService, metricService, daySegmentService, salesItemService, metricAllService, forecastSalesEvaluationService, forecastSalesItemEvaluationService, forecastTransactionEvaluationService, filterMetricAllService, filterSalesItemsMetricAllService) {
                this.$q = $q;
                this.$authService = $authService;
                this.historicalService = historicalService;
                this.salesItemHistoricalService = salesItemHistoricalService;
                this.salesItemMetricAllService = salesItemMetricAllService;
                this.forecastService = forecastService;
                this.salesItemMetricService = salesItemMetricService;
                this.metricService = metricService;
                this.daySegmentService = daySegmentService;
                this.salesItemService = salesItemService;
                this.metricAllService = metricAllService;
                this.forecastSalesEvaluationService = forecastSalesEvaluationService;
                this.forecastSalesItemEvaluationService = forecastSalesItemEvaluationService;
                this.forecastTransactionEvaluationService = forecastTransactionEvaluationService;
                this.filterMetricAllService = filterMetricAllService;
                this.filterSalesItemsMetricAllService = filterSalesItemsMetricAllService;
            }
            DataService.prototype.GetForecastEvaluationDataForDate = function (targetDate, filterId) {
                var d = this.$q.defer(), combined = [], forecastSalesEvaluationData, forecastTransactionEvaluationData;
                forecastSalesEvaluationData = this.GetForecastSalesEvaluationData(targetDate, filterId)
                    .then(function (forecastSalesEvalData) {
                    combined[0] = forecastSalesEvalData;
                });
                forecastTransactionEvaluationData = this.GetForecastTransactionEvaluationData(targetDate, filterId)
                    .then(function (forecastTransEvalData) {
                    combined[1] = forecastTransEvalData;
                });
                this.$q.all([forecastSalesEvaluationData, forecastTransactionEvaluationData]).then(function () {
                    d.resolve(combined);
                });
                return d.promise;
            };
            DataService.prototype.CanViewHistory = function () {
                return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_History);
            };
            DataService.prototype.CanRevertForecast = function () {
                return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_Reset);
            };
            DataService.prototype.GetEntityId = function () {
                var user = this.$authService.GetUser();
                return user.BusinessUser.MobileSettings.EntityId;
            };
            DataService.prototype.GetAllForecastingDataForDate = function (targetDate) {
                return this.GetAllForecastingDataForDateByFilter(targetDate);
            };
            DataService.prototype.GetAllForecastingDataForDateByFilter = function (targetDate, filterIds, noMetrics) {
                var _this = this;
                var d = this.$q.defer();
                this.GetForecastForDate(targetDate).success(function (forecastForDate) {
                    var forecastId = null, forecast = forecastForDate;
                    if (forecast && (forecast.ForecastStatus === 0 || forecast.ForecastStatus === 3)) {
                        forecastId = forecast.Id;
                    }
                    else {
                        d.reject();
                        return;
                    }
                    var afd = {
                        TargetDate: targetDate,
                        FilterIds: filterIds,
                        ForecastId: forecastId,
                        Forecast: forecast,
                        ForecastMetricAlls: null,
                        ForecastMetricAllsFiltered: null
                    };
                    if (!noMetrics) {
                        var metricAll;
                        if (filterIds === undefined) {
                            metricAll = _this.GetForecastMetricAllsData(forecastId).success(function (metricsData) {
                                afd.ForecastMetricAlls = metricsData;
                                afd.Forecast = metricsData.Forecast;
                            });
                        }
                        else {
                            metricAll = _this.GetForecastMetricAllsByFilters(forecast.EntityId, forecastId, filterIds, false).success(function (metricsData) {
                                afd.ForecastMetricAlls = metricsData[0].Data;
                                afd.Forecast = afd.ForecastMetricAlls.Forecast;
                                afd.ForecastMetricAllsFiltered = metricsData;
                                _.each(metricsData, function (metrics) {
                                    metrics.Data.DaySegmentIndexes = metricsData[0].Data.DaySegmentIndexes;
                                    metrics.Data.DaySegments = metricsData[0].Data.DaySegments;
                                    metrics.Data.Forecast = metricsData[0].Data.Forecast;
                                    metrics.Data.IntervalStarts = metricsData[0].Data.IntervalStarts;
                                    metrics.Data.IntervalTypes = metricsData[0].Data.IntervalTypes;
                                    metrics.Data.TypeIndexes = metricsData[0].Data.TypeIndexes;
                                });
                            });
                        }
                        _this.$q.all([metricAll, null]).then(function () {
                            d.resolve(afd);
                        });
                    }
                    else {
                        d.resolve(afd);
                    }
                });
                return d.promise;
            };
            DataService.prototype.GetBlankForecastingData = function () {
                return this.metricAllService.GetForecastMetricAlls1(this.GetEntityId());
            };
            DataService.prototype.GetDaySegments = function (forecastId) {
                return this.daySegmentService.GetDaysegments(this.GetEntityId());
            };
            DataService.prototype.GetAllHistoricalData = function (forecastid, filterId) {
                return this.historicalService.GetForecastSalesHistory(this.GetEntityId(), forecastid, filterId);
            };
            DataService.prototype.GetHistoricalSalesItem = function (forecastId, salesItem, filterId) {
                return this.salesItemHistoricalService.GetForecastSalesItemHistory(this.GetEntityId(), forecastId, salesItem, filterId);
            };
            DataService.prototype.GetSalesItemMetrics = function (forecastId, salesItemId) {
                return this.salesItemMetricAllService.GetSalesItemMetrics(this.GetEntityId(), forecastId, salesItemId, null, false, false);
            };
            DataService.prototype.GetSalesItemMetricsByFilter = function (forecastId, salesItemId, filterId) {
                return this.salesItemMetricAllService.GetSalesItemMetrics(this.GetEntityId(), forecastId, salesItemId, filterId, false, false);
            };
            DataService.prototype.GetSalesItemMetricsByFilters = function (forecastId, salesItemId, filterIds) {
                var d = this.$q.defer(), afd, metricAll;
                afd = {
                    ForecastId: forecastId,
                    FilterIds: filterIds,
                    SalesItemId: salesItemId,
                    ForecastMetricAlls: null,
                    ForecastMetricAllsFiltered: null
                };
                if (filterIds === undefined) {
                    metricAll = this.GetSalesItemMetrics(forecastId, salesItemId).success(function (metricsData) {
                        afd.ForecastMetricAlls = metricsData;
                    });
                }
                else {
                    metricAll = this.filterSalesItemsMetricAllService.GetSalesItemMetrics(this.GetEntityId(), forecastId, salesItemId, filterIds, false, false)
                        .success(function (metricsData) {
                        afd.ForecastMetricAlls = metricsData[0].Data;
                        afd.ForecastMetricAllsFiltered = metricsData;
                        _.each(metricsData, function (metrics) {
                            metrics.Data.DaySegmentIndexes = metricsData[0].Data.DaySegmentIndexes;
                            metrics.Data.DaySegments = metricsData[0].Data.DaySegments;
                            metrics.Data.IntervalStarts = metricsData[0].Data.IntervalStarts;
                            metrics.Data.IntervalTypes = metricsData[0].Data.IntervalTypes;
                            metrics.Data.TypeIndexes = metricsData[0].Data.TypeIndexes;
                        });
                    });
                }
                this.$q.all([metricAll, null]).then(function () {
                    d.resolve(afd);
                });
                return d.promise;
            };
            DataService.prototype.GetUpatedMetricDetails = function (alls) {
                var indexes = alls.TypeIndexes[Services.IntervalTypes.Interval], metricDetails = [], i, currentSalesValueString, currentSalesValueNumber;
                for (i = 0; i < indexes.length; i += 1) {
                    if (alls.NewManagerSales[indexes[i]] != undefined || alls.NewManagerTransactions[indexes[i]] != undefined) {
                        metricDetails.push({
                            IntervalStart: alls.IntervalStarts[indexes[i]],
                            ManagerSales: alls.NewManagerSales[indexes[i]],
                            ManagerTransactionCount: alls.NewManagerTransactions[indexes[i]]
                        });
                    }
                }
                for (i = 0; i < metricDetails.length; i += 1) {
                    currentSalesValueString = String(metricDetails[i].ManagerSales);
                    currentSalesValueNumber = Number(currentSalesValueString.replace(/[^0-9,.]/g, ""));
                    metricDetails[i].ManagerSales = currentSalesValueNumber;
                }
                return metricDetails;
            };
            DataService.prototype.UpdateMetrics = function (forecastId, version, alls, filterId) {
                var metrics, forecastMetricDetails;
                forecastMetricDetails = {
                    MetricDetails: this.GetUpatedMetricDetails(alls),
                    FilterId: filterId
                };
                metrics = this.metricService.PatchForecastMetricDetails(this.GetEntityId(), forecastId, version, [forecastMetricDetails])
                    .success(function () {
                    alls.ManagerSales = $.extend(alls.ManagerSales, alls.NewManagerSales);
                    alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                    alls.NewManagerSales.splice(0, alls.NewManagerSales.length);
                    alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                });
                return metrics;
            };
            DataService.prototype.UpdateMetricsByFilter = function (forecastId, version, forecastMetricAllsFiltered) {
                var _this = this;
                var metrics, forecastMetricDetails = [], updated = [];
                _.each(forecastMetricAllsFiltered, function (filtered) {
                    if (filtered.IsDirty) {
                        var alls = filtered.Data;
                        updated.push(filtered);
                        forecastMetricDetails.push({
                            MetricDetails: _this.GetUpatedMetricDetails(alls),
                            FilterId: filtered.FilterId
                        });
                    }
                });
                metrics = this.metricService.PatchForecastMetricDetails(this.GetEntityId(), forecastId, version, forecastMetricDetails)
                    .success(function () {
                    _.each(updated, function (filtered) {
                        var alls = filtered.Data;
                        alls.ManagerSales = $.extend(alls.ManagerSales, alls.NewManagerSales);
                        alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                        alls.NewManagerSales.splice(0, alls.NewManagerSales.length);
                        alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                        filtered.IsDirty = false;
                    });
                });
                return metrics;
            };
            DataService.prototype.GetUpatedSalesItemMetricDetails = function (alls, salesItemId) {
                var indexes = alls.TypeIndexes[Services.IntervalTypes.Interval], metricDetails = [], i;
                for (i = 0; i < indexes.length; i += 1) {
                    if (alls.NewManagerTransactions[indexes[i]] != undefined) {
                        metricDetails.push({
                            IntervalStart: alls.IntervalStarts[indexes[i]],
                            SalesItemId: salesItemId,
                            ManagerTransactionCount: alls.NewManagerTransactions[indexes[i]]
                        });
                    }
                }
                return metricDetails;
            };
            DataService.prototype.UpdateSalesItemMetrics = function (forecastId, salesItemId, version, alls, filterId) {
                var metrics, forecastSalesItemMetricDetails;
                forecastSalesItemMetricDetails = {
                    SalesItemMetricDetails: this.GetUpatedSalesItemMetricDetails(alls, salesItemId),
                    FilterId: filterId
                };
                metrics = this.salesItemMetricService.PatchSalesItemMetricDetails(this.GetEntityId(), forecastId, version, [forecastSalesItemMetricDetails])
                    .success(function () {
                    alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                    alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                });
                return metrics;
            };
            DataService.prototype.UpdateSalesItemMetricsByFilter = function (forecastId, salesItemId, version, forecastMetricAllsFiltered) {
                var _this = this;
                var metrics, forecastSalesItemMetricDetails = [], updated = [];
                _.each(forecastMetricAllsFiltered, function (filtered) {
                    if (filtered.IsDirty) {
                        var alls = filtered.Data;
                        updated.push(filtered);
                        forecastSalesItemMetricDetails.push({
                            SalesItemMetricDetails: _this.GetUpatedSalesItemMetricDetails(alls, salesItemId),
                            FilterId: filtered.FilterId
                        });
                    }
                });
                metrics = this.salesItemMetricService.PatchSalesItemMetricDetails(this.GetEntityId(), forecastId, version, forecastSalesItemMetricDetails)
                    .success(function () {
                    _.each(updated, function (filtered) {
                        var alls = filtered.Data;
                        alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                        alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                        filtered.IsDirty = false;
                    });
                });
                return metrics;
            };
            DataService.prototype.RevertForecast = function (forecastId, version) {
                var code = "revert", operations;
                operations = {
                    Operations: [{ OpCode: code }],
                    Version: version
                };
                return this.forecastService.PatchRevertForecast(this.GetEntityId(), forecastId, operations);
            };
            DataService.prototype.GetForecastSalesEvaluationData = function (targetDate, filterId) {
                return this.forecastSalesEvaluationService.GetEvaluateSales(this.GetEntityId(), targetDate, filterId);
            };
            DataService.prototype.GetForecastTransactionEvaluationData = function (targetDate, filterId) {
                return this.forecastTransactionEvaluationService.GetEvaluateTransactions(this.GetEntityId(), targetDate, filterId);
            };
            DataService.prototype.GetSalesItemsForForecastData = function (forecastId) {
                return this.salesItemService.GetSalesItemsForForecast(this.GetEntityId(), forecastId);
            };
            DataService.prototype.GetForecastMetricAllsData = function (forecastId) {
                return this.metricAllService.GetForecastMetricAlls(this.GetEntityId(), forecastId, null, false);
            };
            DataService.prototype.GetForecastForDate = function (targetDate) {
                return this.forecastService.GetForecastForBusinessDay(this.GetEntityId(), targetDate);
            };
            DataService.prototype.GetForecastMetricAllsByFilters = function (entityId, forecastId, filterIds, includeActuals) {
                return this.filterMetricAllService.GetForecastMetricAlls(entityId, forecastId, filterIds, includeActuals);
            };
            return DataService;
        }());
        Services.DataService = DataService;
        Services.$dataService = Core.NG.ForecastingModule.RegisterService("DataService", DataService, Core.NG.$q, Core.Auth.$authService, Forecasting.Api.$historicalService, Forecasting.Api.$salesItemHistoricalService, Forecasting.Api.$salesItemMetricAllService, Forecasting.Api.$forecastService, Forecasting.Api.$salesItemMetricService, Forecasting.Api.$metricService, Forecasting.Api.$daySegmentService, Forecasting.Api.$salesItemService, Forecasting.Api.$metricAllService, Forecasting.Api.$forecastSalesEvaluationService, Forecasting.Api.$forecastSalesItemEvaluationService, Forecasting.Api.$forecastTransactionEvaluationService, Forecasting.Api.$multiFilterMetricAllService, Forecasting.Api.$multiFilterSalesItemMetricAllService);
    })(Services = Forecasting.Services || (Forecasting.Services = {}));
})(Forecasting || (Forecasting = {}));
