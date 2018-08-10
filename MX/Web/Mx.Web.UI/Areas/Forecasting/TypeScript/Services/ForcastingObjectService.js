var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Forecasting;
(function (Forecasting) {
    var Services;
    (function (Services) {
        "use strict";
        var MetricType = (function () {
            function MetricType() {
            }
            MetricType.Sales = "sales";
            MetricType.Transactions = "transactions";
            MetricType.SalesItems = "salesitems";
            MetricType.Events = "events";
            return MetricType;
        }());
        Services.MetricType = MetricType;
        var CacheName = (function () {
            function CacheName() {
            }
            CacheName.EV = "EV";
            CacheName.EventProfile = "EventProfile";
            CacheName.FC = "FC";
            CacheName.FCS = "FCS";
            CacheName.FCSI = "FCSI";
            CacheName._CACHE = "_FOS_CACHE_";
            return CacheName;
        }());
        Services.CacheName = CacheName;
        var ForecastingObjectService = (function () {
            function ForecastingObjectService($q, $location, $timeout) {
                this.$q = $q;
                this.$location = $location;
                this.$timeout = $timeout;
                this.Cache = {};
                this.EventProfileDeferred = null;
            }
            ForecastingObjectService.prototype.ClearEdits = function (fo) {
                var _this = this;
                if (!fo) {
                    return;
                }
                this.ClearEditsAlls(fo.Metrics);
                _.each(fo.MetricsFiltered, function (filtered) {
                    _this.ClearEditsAlls(filtered.Data);
                });
                fo.HourlyEdit = false;
                fo.IsDirty = this.IsDirty(fo);
            };
            ForecastingObjectService.prototype.ClearEditsAlls = function (alls) {
                if (alls.NewManagerSales && alls.NewManagerSales.length) {
                    alls.NewManagerSales.splice(0, alls.NewManagerSales.length);
                }
                if (alls.NewManagerTransactions && alls.NewManagerTransactions.length) {
                    alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                }
                if (alls.NewManagerAdjustments && alls.NewManagerAdjustments.length) {
                    alls.NewManagerAdjustments.splice(0, alls.NewManagerAdjustments.length);
                }
            };
            ForecastingObjectService.prototype.IsDirty = function (fo, index) {
                var _this = this;
                if (!fo) {
                    return false;
                }
                var alls = fo.Metrics, isDirty = false;
                if (this.IsDirtyAlls(alls, index)) {
                    return true;
                }
                _.each(fo.MetricsFiltered, function (filtered) {
                    if (!isDirty && _this.IsDirtyAlls(filtered.Data, index)) {
                        isDirty = true;
                    }
                });
                return isDirty;
            };
            ForecastingObjectService.prototype.IsDirtyAlls = function (alls, index) {
                if (index !== undefined) {
                    if (alls.NewManagerSales && index < alls.NewManagerSales.length && alls.NewManagerSales[index] != undefined) {
                        return true;
                    }
                    else if (alls.NewManagerTransactions && index < alls.NewManagerTransactions.length && alls.NewManagerTransactions[index] != undefined) {
                        return true;
                    }
                    else if (alls.NewManagerAdjustments && index < alls.NewManagerAdjustments.length && alls.NewManagerAdjustments[index] != undefined) {
                        return true;
                    }
                }
                else {
                    if (alls.NewManagerSales && alls.NewManagerSales.length) {
                        return true;
                    }
                    else if (alls.NewManagerTransactions && alls.NewManagerTransactions.length) {
                        return true;
                    }
                    else if (alls.NewManagerAdjustments && alls.NewManagerAdjustments.length) {
                        return true;
                    }
                }
                return false;
            };
            ForecastingObjectService.prototype.SortArrayKeepOriginalIndexes = function (alls, indexes, metric) {
                var arrayWithOrigIndexes = [];
                for (var indx in indexes) {
                    if (indx) {
                        arrayWithOrigIndexes.push({ index: indx, value: indx });
                    }
                }
                arrayWithOrigIndexes.sort(function (a, b) {
                    var ret;
                    if (metric === MetricType.Sales) {
                        ret = alls.ManagerSales[indexes[b.value]] - alls.ManagerSales[indexes[a.value]];
                    }
                    else {
                        ret = alls.ManagerTransactions[indexes[b.value]] - alls.ManagerTransactions[indexes[a.value]];
                    }
                    if (ret === 0) {
                        ret = a.index - b.index;
                    }
                    return ret;
                });
                return arrayWithOrigIndexes;
            };
            ForecastingObjectService.prototype.DisburseChangeDaily = function (alls, index, metric, percent, salesDaily, transactionDaily) {
                var length = alls.IntervalStarts.length, indexes = [], origIndexes, runningSalesTotal = 0, runningTransactionTotal = 0, cachedSalesTotal = 0, cachedTransactionTotal = 0, salesRemainder, transactionRemainder, salesDailyFormatted, i, j;
                if (alls.IntervalTypes[index] >= Services.IntervalTypes.DaySegment) {
                    i = index + 1;
                    while (alls.IntervalTypes[i] !== alls.IntervalTypes[index] && i < length) {
                        if (alls.IntervalTypes[i] === Services.IntervalTypes.Interval) {
                            indexes.push(i);
                        }
                        i++;
                    }
                }
                else {
                    indexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                }
                origIndexes = this.SortArrayKeepOriginalIndexes(alls, indexes, metric);
                salesDailyFormatted = salesDaily;
                length = indexes.length;
                if (length > 0) {
                    for (j = 0; j < length; j += 1) {
                        i = indexes[j];
                        if (alls.ManagerSales) {
                            cachedSalesTotal += alls.ManagerSales[i];
                        }
                        cachedTransactionTotal += alls.ManagerTransactions[i];
                    }
                    if (metric !== MetricType.Sales) {
                        if (cachedTransactionTotal > 0) {
                            percent = transactionDaily / cachedTransactionTotal;
                        }
                        salesDailyFormatted = Math.round(cachedSalesTotal * percent);
                    }
                    else {
                        if (cachedSalesTotal > 0) {
                            percent = salesDailyFormatted / cachedSalesTotal;
                        }
                        transactionDaily = Math.round(cachedTransactionTotal * percent);
                    }
                }
                for (j = 0; j < length; j += 1) {
                    i = indexes[j];
                    if (alls.NewManagerSales) {
                        alls.NewManagerSales[i] = Math.round(alls.ManagerSales[i] * percent);
                        runningSalesTotal += alls.NewManagerSales[i];
                    }
                    alls.NewManagerTransactions[i] = Math.round(alls.ManagerTransactions[i] * percent);
                    runningTransactionTotal += alls.NewManagerTransactions[i];
                }
                if (metric === MetricType.SalesItems) {
                    salesRemainder = 0;
                }
                else {
                    salesRemainder = salesDailyFormatted - runningSalesTotal;
                }
                transactionRemainder = transactionDaily - runningTransactionTotal;
                for (j = 0; salesRemainder !== 0 || transactionRemainder !== 0; j += 1) {
                    if (salesRemainder === 0 && transactionRemainder === 0) {
                        break;
                    }
                    if (j === length) {
                        j = 0;
                    }
                    i = indexes[origIndexes[j].index];
                    if (alls.NewManagerSales && (alls.NewManagerSales[i] > 0 || runningSalesTotal === 0)) {
                        if (salesRemainder > 0) {
                            alls.NewManagerSales[i] += 1;
                            salesRemainder -= 1;
                        }
                        else if (salesRemainder < 0) {
                            alls.NewManagerSales[i] -= 1;
                            salesRemainder += 1;
                        }
                    }
                    if (alls.NewManagerTransactions[i] > 0 || runningTransactionTotal === 0) {
                        if (transactionRemainder > 0) {
                            alls.NewManagerTransactions[i] += 1;
                            transactionRemainder -= 1;
                        }
                        else if (transactionRemainder < 0) {
                            alls.NewManagerTransactions[i] -= 1;
                            transactionRemainder += 1;
                        }
                    }
                }
            };
            ForecastingObjectService.prototype.EditDailyValue = function (fo, index, metric, oldValue, updatedValue) {
                if (!fo) {
                    return;
                }
                return this.EditDailyValueAlls(fo.Metrics, index, metric, oldValue, updatedValue);
            };
            ForecastingObjectService.prototype.EditDailyValueAlls = function (alls, index, metric, oldValue, updatedValue) {
                var percentChange = (oldValue) ? (updatedValue / oldValue) : 1;
                if (metric !== MetricType.Events) {
                    if (metric === MetricType.Sales) {
                        alls.NewManagerSales[index] = updatedValue;
                        alls.NewManagerTransactions[index] = Math.floor(alls.ManagerTransactions[index] * percentChange);
                    }
                    else {
                        alls.NewManagerTransactions[index] = updatedValue;
                        if (metric === MetricType.Transactions && alls.NewManagerSales) {
                            alls.NewManagerSales[index] = Math.floor(alls.ManagerSales[index] * percentChange);
                        }
                    }
                    if (alls.IntervalTypes[index] !== Services.IntervalTypes.Interval) {
                        this.DisburseChangeDaily(alls, index, metric, percentChange, alls.NewManagerSales ? alls.NewManagerSales[index] : 0, alls.NewManagerTransactions[index]);
                    }
                    if (alls.NewManagerSales) {
                        this.UpdateTotals(alls, alls.NewManagerSales, alls.ManagerSales);
                    }
                    this.UpdateTotals(alls, alls.NewManagerTransactions, alls.ManagerTransactions);
                }
                else {
                    alls.NewManagerAdjustments[index] = updatedValue;
                    if (alls.IntervalTypes[index] !== Services.IntervalTypes.Interval) {
                        var length = alls.IntervalStarts.length, i = index + 1;
                        while (alls.IntervalTypes[i] !== alls.IntervalTypes[index] && i < length) {
                            if (alls.IntervalTypes[i] === Services.IntervalTypes.Interval) {
                                alls.NewManagerAdjustments[i] = updatedValue;
                            }
                            else if (alls.IntervalTypes[i] === Services.IntervalTypes.Hour) {
                                alls.NewManagerAdjustments[i] = updatedValue;
                            }
                            i++;
                        }
                    }
                    this.UpdateRanges(alls, alls.NewManagerAdjustments, alls.ManagerAdjustments);
                }
            };
            ForecastingObjectService.prototype.UpdateTotals = function (alls, values, defaults) {
                var types = alls.IntervalTypes, i, j, length = types.length, total, dirty;
                for (i = 0; i < length; i += 1) {
                    if (types[i] !== Services.IntervalTypes.Interval) {
                        total = 0;
                        dirty = false;
                        for (j = i + 1; j < length; j += 1) {
                            if (types[i] === types[j]) {
                                break;
                            }
                            if (types[j] === Services.IntervalTypes.Interval) {
                                dirty = dirty || (values[j] != undefined);
                                total += ((values[j] != undefined) ? values[j] : defaults[j]);
                            }
                        }
                        if (dirty) {
                            values[i] = total;
                        }
                    }
                }
            };
            ForecastingObjectService.prototype.UpdateRanges = function (alls, values, defaults) {
                var types = alls.IntervalTypes, i, j, length = types.length, min, max, dirty, value;
                for (i = 0; i < length; i += 1) {
                    if (types[i] !== Services.IntervalTypes.Interval) {
                        min = 1000;
                        max = -100;
                        dirty = false;
                        for (j = i + 1; j < length; j += 1) {
                            if (types[i] === types[j]) {
                                break;
                            }
                            if (types[j] === Services.IntervalTypes.Interval) {
                                value = ((values[j] != undefined) ? values[j] : defaults[j]);
                                dirty = dirty || (values[j] != undefined);
                                min = Math.min(min, value);
                                max = Math.max(max, value);
                            }
                        }
                        if (dirty) {
                            values[i] = { min: min, max: max };
                        }
                        else {
                            defaults[i] = { min: min, max: max };
                        }
                    }
                }
            };
            ForecastingObjectService.prototype.EditEventAdjustments = function (profile) {
                var _this = this;
                var returnedDeferred = this.$q.defer();
                if (profile.Adjustments === undefined) {
                    profile.Adjustments = [];
                }
                this.ClearCache([Services.CacheName.FC], true);
                this.SetCache(Services.CacheName.EventProfile, profile, false);
                this.EventProfileDeferred = this.$q.defer();
                this.EventProfileDeferred.promise.then(function (manualAdjustments) {
                    if (manualAdjustments) {
                        profile.Adjustments = manualAdjustments;
                        returnedDeferred.resolve(profile);
                    }
                    else {
                        returnedDeferred.resolve(null);
                    }
                });
                this.$timeout(function () {
                    _this.$location.path("/Forecasting/Editor/Grid/Events");
                });
                return returnedDeferred.promise;
            };
            ForecastingObjectService.prototype.EditEventAdjustmentsCompleted = function (cancelled, newUrl) {
                var _this = this;
                if (this.EventProfileDeferred) {
                    var fo = this.GetCache(Services.CacheName.FC), manualAdjustments = null;
                    if (!cancelled) {
                        manualAdjustments = this.GetAdjustments(fo);
                    }
                    this.EventProfileDeferred.resolve(manualAdjustments);
                    this.ClearCache([Services.CacheName.FC, Services.CacheName.EventProfile], true);
                    this.EventProfileDeferred = undefined;
                }
                this.$timeout(function () {
                    _this.$location.path(newUrl || "/Forecasting/Events");
                });
            };
            ForecastingObjectService.prototype.GetAdjustments = function (fo) {
                var alls, manualAdjustments = [], intervalIndexes, i;
                alls = fo.Metrics;
                intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                for (i = 0; i < intervalIndexes.length; i++) {
                    var index = intervalIndexes[i];
                    manualAdjustments.push(alls.NewManagerAdjustments[index] != undefined ?
                        alls.NewManagerAdjustments[index] : alls.ManagerAdjustments[index]);
                }
                return manualAdjustments;
            };
            ForecastingObjectService.prototype.SetAdjustments = function (fo) {
                var alls, intervalIndexes, profile = this.GetCache(Services.CacheName.EventProfile), i;
                if (profile && profile.Adjustments && fo.Metrics) {
                    alls = fo.Metrics;
                    intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                    for (i = 0; i < profile.Adjustments.length; i++) {
                        var index = intervalIndexes[i];
                        alls.ManagerAdjustments[index] = profile.Adjustments[i];
                    }
                    this.UpdateRanges(alls, alls.ManagerAdjustments, alls.ManagerAdjustments);
                }
            };
            ForecastingObjectService.prototype.CellNotEditableByPercentage = function (alls, index, metric, isByPercentage) {
                if (isByPercentage) {
                    if (metric === Services.MetricType.Sales) {
                        var nmsales = alls.NewManagerSales[index], msales = alls.ManagerSales[index], ssales = alls.SystemSales[index];
                        return nmsales != undefined ? !nmsales : msales !== ssales ? !msales : !ssales;
                    }
                    else if (metric === Services.MetricType.Transactions) {
                        var nmtrans = alls.NewManagerTransactions[index], mtrans = alls.ManagerTransactions[index], strans = alls.SystemTransactions[index];
                        return nmtrans != undefined ? !nmtrans : mtrans !== strans ? !mtrans : !strans;
                    }
                    else if (metric === Services.MetricType.Events) {
                        return false;
                    }
                }
                return false;
            };
            ForecastingObjectService.prototype.CellValue = function (alls, index, metric) {
                if (metric === Services.MetricType.Sales) {
                    var nmsales = alls.NewManagerSales[index], msales = alls.ManagerSales[index], ssales = alls.SystemSales[index];
                    return nmsales != undefined ? nmsales : msales !== ssales ? msales : undefined;
                }
                else if (metric === Services.MetricType.Transactions) {
                    var nmtrans = alls.NewManagerTransactions[index], mtrans = alls.ManagerTransactions[index], strans = alls.SystemTransactions[index];
                    return nmtrans != undefined ? nmtrans : mtrans !== strans ? mtrans : undefined;
                }
                else if (metric === Services.MetricType.Events) {
                    var nmadj = alls.NewManagerAdjustments[index], madj = alls.ManagerAdjustments[index];
                    if (nmadj != undefined && nmadj.min !== undefined) {
                        return (nmadj.min !== 0 || nmadj.max !== 0) ? nmadj : undefined;
                    }
                    else if (madj !== undefined && madj.min !== undefined) {
                        return (madj.min !== 0 || madj.max !== 0) ? madj : undefined;
                    }
                    else {
                        return nmadj != undefined ? nmadj : madj !== 0 ? madj : undefined;
                    }
                }
                return undefined;
            };
            ForecastingObjectService.prototype.GetEditValue = function (alls, index, metric) {
                var oldValue;
                if (metric === Services.MetricType.Sales) {
                    oldValue = (alls.NewManagerSales[index] != undefined ?
                        alls.NewManagerSales[index] : alls.ManagerSales[index]);
                }
                else if (metric === Services.MetricType.Transactions) {
                    oldValue = (alls.NewManagerTransactions[index] != undefined ?
                        alls.NewManagerTransactions[index] : alls.ManagerTransactions[index]);
                }
                else if (metric === Services.MetricType.Events) {
                    oldValue = (alls.NewManagerAdjustments[index] != undefined ?
                        alls.NewManagerAdjustments[index] : alls.ManagerAdjustments[index]);
                }
                return oldValue;
            };
            ForecastingObjectService.prototype.CellNotEditable = function (alls, index, metric, isByPercentage) {
                if (isByPercentage) {
                    if (metric === Services.MetricType.Sales) {
                        var nmsales = alls.NewManagerSales[index], msales = alls.ManagerSales[index], ssales = alls.SystemSales[index];
                        return nmsales != undefined ? !nmsales : msales !== ssales ? !msales : !ssales;
                    }
                    else if (metric === Services.MetricType.Transactions) {
                        var nmtrans = alls.NewManagerTransactions[index], mtrans = alls.ManagerTransactions[index], strans = alls.SystemTransactions[index];
                        return nmtrans != undefined ? !nmtrans : mtrans !== strans ? !mtrans : !strans;
                    }
                    else if (metric === Services.MetricType.Events) {
                        return false;
                    }
                }
                return false;
            };
            ForecastingObjectService.prototype.ReCalculateFilteredTotal = function (saved, current, Filters, FiltersMap) {
                if (!Filters || !saved || !current || saved.MetricsFiltered.length === 1) {
                    return;
                }
                var savedTotal = saved.MetricsFiltered[0].Data, allsTotal = current.MetricsFiltered[0].Data, isSalesItem = !allsTotal.hasOwnProperty("NewManagerSales");
                if (!isSalesItem) {
                    allsTotal.NewManagerSales.splice(0, allsTotal.NewManagerSales.length);
                }
                allsTotal.NewManagerTransactions.splice(0, allsTotal.NewManagerTransactions.length);
                _.each(current.MetricsFiltered, function (filtered, metricsFilteredIndex) {
                    if (filtered.FilterId && FiltersMap[filtered.FilterId].Filter.IsForecastEditableViaGroup) {
                        var savedAlls = saved.MetricsFiltered[metricsFilteredIndex].Data, alls = current.MetricsFiltered[metricsFilteredIndex].Data;
                        _.each(allsTotal.TypeIndexes[Services.IntervalTypes.Interval], function (index) {
                            if (!isSalesItem && alls.NewManagerSales[index] !== undefined) {
                                allsTotal.NewManagerSales[index] =
                                    (allsTotal.NewManagerSales[index] !== undefined ? allsTotal.NewManagerSales[index] : savedTotal.ManagerSales[index])
                                        - savedAlls.ManagerSales[index]
                                        + alls.NewManagerSales[index];
                            }
                            if (alls.NewManagerTransactions[index] !== undefined) {
                                allsTotal.NewManagerTransactions[index] =
                                    (allsTotal.NewManagerTransactions[index] !== undefined ? allsTotal.NewManagerTransactions[index] : savedTotal.ManagerTransactions[index])
                                        - savedAlls.ManagerTransactions[index]
                                        + alls.NewManagerTransactions[index];
                            }
                        });
                    }
                });
                if (!isSalesItem) {
                    this.UpdateTotals(allsTotal, allsTotal.NewManagerSales, allsTotal.ManagerSales);
                }
                this.UpdateTotals(allsTotal, allsTotal.NewManagerTransactions, allsTotal.ManagerTransactions);
            };
            ForecastingObjectService.prototype.GetCache = function (name) {
                var object;
                object = this.Cache[name];
                if (object == undefined) {
                    var cache = JSON.parse(localStorage.getItem(CacheName._CACHE)) || {};
                    object = cache[name];
                }
                return object;
            };
            ForecastingObjectService.prototype.SetCache = function (name, object, persist) {
                this.Cache[name] = object;
                if (persist) {
                    var cache = JSON.parse(localStorage.getItem(CacheName._CACHE)) || {};
                    cache[name] = object;
                    localStorage.setItem(CacheName._CACHE, JSON.stringify(cache));
                }
                return object;
            };
            ForecastingObjectService.prototype.ClearCache = function (names, persisted) {
                var _this = this;
                angular.forEach(names, function (name) {
                    _this.SetCache(name, null);
                    if (persisted) {
                        var cache = JSON.parse(localStorage.getItem(CacheName._CACHE));
                        if (cache && cache[name]) {
                            cache[name] = undefined;
                            localStorage.setItem(CacheName._CACHE, JSON.stringify(cache));
                        }
                    }
                });
            };
            ForecastingObjectService.prototype.GetSeriesGraphData = function (alls, options) {
                if (!alls || !options || !alls.IntervalStarts) {
                    return [];
                }
                var dayPartColors = ["#f1c40f", "#3498db", "#2ecc71", "#9b59b6", "#1abc9c", "#e74c3c"], seriesGraphData = [];
                seriesGraphData.push({
                    Categories: this.BuildIntervalStartLabelsForWholeDay(alls),
                    Series: this.BuildSeriesDataForWholeDay(alls, dayPartColors),
                    SeriesName: "Day"
                });
                var intervalStartLabels, series;
                for (var part = 0; part < alls.DaySegments.length; part++) {
                    intervalStartLabels = this.BuildIntervalStartLabelsForDayPart(alls, part);
                    series = this.BuildSeriesDataForDayPart(alls, dayPartColors, part);
                    seriesGraphData.push({
                        Categories: intervalStartLabels,
                        Series: series,
                        SeriesName: alls.DaySegments[part].DaySegmentType.Description
                    });
                }
                return seriesGraphData;
            };
            ForecastingObjectService.prototype.BuildIntervalStartLabelsForWholeDay = function (alls) {
                var result = [];
                var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                for (var i = 0; i < intervalIndexes.length; i++) {
                    var currentIntervalIndex = intervalIndexes[i];
                    var mf = this.BuildIntervalStartLabel(alls.IntervalStarts[currentIntervalIndex], false);
                    result.push(mf);
                }
                return result;
            };
            ForecastingObjectService.prototype.BuildIntervalStartLabelsForDayPart = function (alls, dayPartIndex) {
                var result = [];
                var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                for (var i = 0; i < intervalIndexes.length; i++) {
                    var currentIntervalIndex = intervalIndexes[i];
                    if (this.ShouldDayPartIncludeInterval(alls, i, dayPartIndex)) {
                        var mf = this.BuildIntervalStartLabel(alls.IntervalStarts[currentIntervalIndex], true);
                        result.push(mf);
                    }
                }
                return result;
            };
            ForecastingObjectService.prototype.ShouldDayPartIncludeInterval = function (alls, interval, dayPartIndex) {
                var currentIntervalIndex = alls.TypeIndexes[Services.IntervalTypes.Interval][interval];
                var prevIntervalIndex = alls.TypeIndexes[Services.IntervalTypes.Interval][interval - 1];
                return dayPartIndex === alls.DaySegmentIndexes[currentIntervalIndex] ||
                    dayPartIndex === alls.DaySegmentIndexes[prevIntervalIndex];
            };
            ForecastingObjectService.prototype.BuildIntervalStartLabel = function (intervalStart, forDayPart) {
                var m = moment(intervalStart), mf = (forDayPart || m.minutes() === 0) ? m.format("h:mm A") : "";
                return mf;
            };
            ForecastingObjectService.prototype.BuildSeriesDataForWholeDay = function (alls, colors) {
                var result = [];
                var values = { sales: alls.NewManagerSales || [], transactions: alls.NewManagerTransactions }, defaults = { sales: alls.ManagerSales || [], transactions: alls.ManagerTransactions }, unknownSerieData = [], seriesData = [], i, j;
                for (j = 0; j < alls.DaySegments.length; j++) {
                    seriesData.push([]);
                }
                seriesData.push(unknownSerieData);
                var unknownDaySegmentIndex = seriesData.indexOf(unknownSerieData);
                var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                for (i = 0; i < intervalIndexes.length; i++) {
                    for (j = 0; j < seriesData.length; j++) {
                        seriesData[j].push(null);
                    }
                }
                var hasUnknownSegment = false;
                for (i = 0; i < intervalIndexes.length; i++) {
                    var currentIntervalIndex = intervalIndexes[i];
                    var prevIntervalIndex = intervalIndexes[i - 1];
                    if (alls.DaySegmentIndexes[currentIntervalIndex] === -1) {
                        hasUnknownSegment = true;
                    }
                    var value = this.BuildValueForInterval(values, defaults, currentIntervalIndex);
                    var currentDaySegmentIndex = alls.DaySegmentIndexes[currentIntervalIndex];
                    this.AssignValueToSeriesData(seriesData, value, i, currentDaySegmentIndex, unknownDaySegmentIndex, true);
                    var prevDaySegmentIndex = alls.DaySegmentIndexes[prevIntervalIndex];
                    this.AssignValueToSeriesData(seriesData, value, i, prevDaySegmentIndex, unknownDaySegmentIndex, false);
                }
                for (j = 0; j < alls.DaySegments.length; j++) {
                    result.push({
                        data: seriesData[j],
                        color: colors[j]
                    });
                }
                if (hasUnknownSegment) {
                    var colorForUnknownPart = "#b7b7b7";
                    result.push({
                        data: seriesData[unknownDaySegmentIndex],
                        color: colorForUnknownPart
                    });
                }
                return result;
            };
            ForecastingObjectService.prototype.AssignValueToSeriesData = function (seriesData, value, currentInterval, daySegmentIndex, unknownDaySegmentIndex, inSegment) {
                if (daySegmentIndex == undefined)
                    return;
                var indextoUse;
                if (daySegmentIndex === -1) {
                    indextoUse = unknownDaySegmentIndex;
                }
                else {
                    indextoUse = daySegmentIndex;
                }
                seriesData[indextoUse][currentInterval] = {
                    "value": value,
                    "inSegment": inSegment
                };
            };
            ForecastingObjectService.prototype.BuildSeriesDataForDayPart = function (alls, colors, dayPartIndex) {
                var result = [];
                var values = { sales: alls.NewManagerSales || [], transactions: alls.NewManagerTransactions }, defaults = { sales: alls.ManagerSales || [], transactions: alls.ManagerTransactions }, seriesDataOfDayPart = [];
                var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
                for (var i = 0; i < intervalIndexes.length; i++) {
                    var currentIntervalIndex = intervalIndexes[i];
                    if (!this.ShouldDayPartIncludeInterval(alls, i, dayPartIndex)) {
                        continue;
                    }
                    var value = this.BuildValueForInterval(values, defaults, currentIntervalIndex);
                    var currentDaySegmentIndex = alls.DaySegmentIndexes[currentIntervalIndex];
                    seriesDataOfDayPart.push({
                        "value": value,
                        "inSegment": dayPartIndex === currentDaySegmentIndex
                    });
                }
                result.push({
                    data: seriesDataOfDayPart,
                    color: colors[dayPartIndex]
                });
                return result;
            };
            ForecastingObjectService.prototype.BuildValueForInterval = function (values, defaults, intervalIndex) {
                var value = {
                    sales: values.sales[intervalIndex] != undefined
                        ? values.sales[intervalIndex]
                        : defaults.sales[intervalIndex],
                    transactions: values.transactions[intervalIndex] != undefined
                        ? values.transactions[intervalIndex]
                        : defaults.transactions[intervalIndex]
                };
                return value;
            };
            ForecastingObjectService.prototype.GetSeriesGraphDataLine = function (dataFilterd, options) {
                if (!dataFilterd || !options) {
                    return [];
                }
                var alls = dataFilterd.Data, intervalStartLabels, series, seriesData, i, part, typeIndexes = alls.TypeIndexes, intervalIndexes = [], values = { sales: alls.NewManagerSales || [], transactions: alls.NewManagerTransactions }, defaults = { sales: alls.ManagerSales || [], transactions: alls.ManagerTransactions }, seriesGraphData = [];
                if (values !== undefined) {
                    intervalIndexes = typeIndexes[Services.IntervalTypes.Interval];
                    for (part = -1; part < alls.DaySegments.length; part++) {
                        intervalStartLabels = [];
                        series = [];
                        seriesData = [];
                        for (i = 0; i < intervalIndexes.length; i++) {
                            if (alls.IntervalStarts) {
                                var m = moment(alls.IntervalStarts[intervalIndexes[i]]), mf = (m.minutes() === 0) ? m.format("h:mm A") : "";
                                intervalStartLabels.push(mf);
                            }
                            if (part === -1 || part === alls.DaySegmentIndexes[intervalIndexes[i]]
                                || part === alls.DaySegmentIndexes[intervalIndexes[i - 1]]) {
                                var value = {
                                    sales: values.sales[intervalIndexes[i]] != undefined ? values.sales[intervalIndexes[i]] : defaults.sales[intervalIndexes[i]],
                                    transactions: values.transactions[intervalIndexes[i]] != undefined ? values.transactions[intervalIndexes[i]] : defaults.transactions[intervalIndexes[i]]
                                };
                                seriesData.push({
                                    "value": value,
                                    "filter": options.FiltersMap[dataFilterd.FilterId || 0].Filter.Name
                                });
                            }
                        }
                        for (i = 0; i < seriesData.length; i++) {
                            if (part === -1 || part === i) {
                                series.push({
                                    data: seriesData,
                                    tooltip: { visible: false },
                                    filter: options.FiltersMap[dataFilterd.FilterId || 0],
                                    name: options.FiltersMap[dataFilterd.FilterId || 0].Filter.Name
                                });
                            }
                        }
                        seriesGraphData.push({
                            Categories: intervalStartLabels,
                            Series: series,
                            SeriesName: options.FiltersMap[dataFilterd.FilterId || 0].Filter.Name
                        });
                    }
                }
                return seriesGraphData;
            };
            return ForecastingObjectService;
        }());
        Services.ForecastingObjectService = ForecastingObjectService;
        Services.$forecastingObjectService = Core.NG.ForecastingModule.RegisterService("ForecastingObjectService", ForecastingObjectService, Core.NG.$q, Core.NG.$location, Core.NG.$timeout);
        ;
        Services.metricMap = {
            sales: {
                IsCurrency: true, Metric: "ManagerSales", TranslationKey: "Sales",
                MetricKey: MetricType.Sales
            },
            transactions: {
                Metric: "ManagerTransactionCount", TranslationKey: "Transactions",
                MetricKey: MetricType.Transactions
            },
            salesitems: {
                TranslationKey: "SalesItems",
                MetricKey: MetricType.Transactions
            },
            events: {
                Metric: "ManagerAdjustments", TranslationKey: "ManagerAdjustments",
                MetricKey: MetricType.Events
            }
        };
        ;
        var ForecastObjectData = (function () {
            function ForecastObjectData($q, dataService, forecastingObjectService) {
                this.$q = $q;
                this.dataService = dataService;
                this.forecastingObjectService = forecastingObjectService;
                this.ForecastObject = null;
            }
            ForecastObjectData.prototype.GetParent = function () {
                return this.Parent;
            };
            ForecastObjectData.prototype.GetForecastingObject = function () {
                return this.ForecastObject;
            };
            ForecastObjectData.prototype.SetForecastingObject = function (fo, noFilter) {
                this.ForecastObject = fo;
                if (fo && this.Filter && !noFilter) {
                    this.SetFilter(this.Filter);
                }
                return this.GetForecastingObject();
            };
            ForecastObjectData.prototype.GetCache = function () {
                return this.forecastingObjectService.GetCache(Services.CacheName.FC);
            };
            ForecastObjectData.prototype.LoadData = function (dayString, reload, noMetrics) {
                var _this = this;
                var d = this.$q.defer(), fo = this.GetCache();
                if (!reload) {
                    if (!fo ||
                        fo.DayString !== dayString ||
                        fo.Forecast.EntityId !== this.dataService.GetEntityId() ||
                        (!noMetrics && fo.Metrics === null)) {
                        reload = true;
                    }
                }
                if (!reload) {
                    fo = this.SetForecastingObject(fo);
                    d.resolve(fo);
                }
                else {
                    this.Clear(true);
                    this.GetForecast(dayString, noMetrics).then(function (data) {
                        data = _this.SetForecastingObject(data);
                        d.resolve(data);
                    }).catch(function (reason) {
                        d.reject(reason);
                    });
                }
                return d.promise;
            };
            ForecastObjectData.prototype.SetFilter = function (filter) {
                var fo = this.GetForecastingObject(), filterId = filter ? filter.Id : null, data;
                if (!fo) {
                    return;
                }
                if (fo && fo.IsDirty) {
                    return;
                }
                _.each(fo.MetricsFiltered, function (filtered) {
                    if (filtered.FilterId === filterId) {
                        data = filtered.Data;
                    }
                });
                if (data) {
                    this.Filter = filter;
                    fo = {
                        DayString: fo.DayString,
                        Forecast: fo.Forecast,
                        Metrics: data,
                        MetricsFiltered: fo.MetricsFiltered,
                        IsDirty: fo.IsDirty,
                        IsLocked: fo.Forecast.IsDayLocked || (filter ? !filter.IsForecastEditableViaGroup : false),
                        ViewHistory: fo.ViewHistory,
                        HourlyEdit: fo.HourlyEdit,
                        CanRevertForecast: fo.CanRevertForecast,
                        Filter: filter
                    };
                    fo = this.SetForecastingObject(fo, true);
                }
            };
            ForecastObjectData.prototype.Clear = function (clearCache) {
                this.SetForecastingObject(null);
                if (clearCache) {
                    this.forecastingObjectService.ClearCache([Services.CacheName.FC]);
                }
            };
            ForecastObjectData.prototype.ClearChanges = function () {
                this.forecastingObjectService.ClearEdits(this.GetForecastingObject());
            };
            ForecastObjectData.prototype.GetForecast = function (dayString, noMetrics) {
                var _this = this;
                var d = this.$q.defer();
                var fo = null;
                this.dataService.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then(function (data) {
                    if (data.Forecast) {
                        if (data.Forecast.BusinessDay.substring(0, 10) !== dayString) {
                            d.reject();
                            return;
                        }
                        fo = {
                            DayString: dayString,
                            Forecast: data.Forecast,
                            Metrics: data.ForecastMetricAlls,
                            MetricsFiltered: data.ForecastMetricAllsFiltered,
                            IsDirty: false,
                            IsLocked: data.Forecast.IsDayLocked,
                            ViewHistory: _this.dataService.CanViewHistory(),
                            HourlyEdit: false,
                            CanRevertForecast: _this.dataService.CanRevertForecast()
                        };
                        _this.forecastingObjectService.SetCache(Services.CacheName.FC, fo);
                    }
                    d.resolve(fo);
                }).catch(function (reason) {
                    d.reject(reason);
                });
                return d.promise;
            };
            ForecastObjectData.prototype.SaveChanges = function (filtered) {
                var _this = this;
                var d = this.$q.defer(), fo = this.GetForecastingObject();
                if (filtered) {
                    this.dataService.UpdateMetricsByFilter(fo.Forecast.Id, fo.Forecast.Version, fo.MetricsFiltered)
                        .success(function () {
                        fo.IsDirty = _this.forecastingObjectService.IsDirty(fo);
                        _this.LoadData(fo.DayString, true);
                        d.resolve();
                    })
                        .error(function (message, status) {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
                }
                else {
                    this.dataService.UpdateMetrics(fo.Forecast.Id, fo.Forecast.Version, fo.Metrics, fo.Filter ? fo.Filter.Id : undefined)
                        .success(function () {
                        fo.IsDirty = _this.forecastingObjectService.IsDirty(fo);
                        _this.LoadData(fo.DayString, true);
                        d.resolve();
                    })
                        .error(function (message, status) {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
                }
                return d.promise;
            };
            ForecastObjectData.prototype.ResetForecasts = function () {
                var d = this.$q.defer(), fo = this.GetForecastingObject();
                this.dataService.RevertForecast(fo.Forecast.Id, fo.Forecast.Version).then(function (ver) {
                    d.resolve(ver);
                }).catch(function (reason) {
                    d.reject(reason);
                });
                return d.promise;
            };
            return ForecastObjectData;
        }());
        Services.ForecastObjectData = ForecastObjectData;
        var ForecastObjectDataSalesItem = (function (_super) {
            __extends(ForecastObjectDataSalesItem, _super);
            function ForecastObjectDataSalesItem($q, dataService, forecastingObjectService, $filter) {
                _super.call(this, $q, dataService, forecastingObjectService);
                this.$q = $q;
                this.dataService = dataService;
                this.forecastingObjectService = forecastingObjectService;
                this.$filter = $filter;
                this.Parent = new ForecastObjectData($q, dataService, forecastingObjectService);
                this.ForecastObject = {};
                this.Items = {
                    EntityId: 0,
                    SalesItems: [],
                    SearchParam: ""
                };
            }
            ForecastObjectDataSalesItem.prototype.GetItemId = function () {
                return this.ItemId;
            };
            ForecastObjectDataSalesItem.prototype.SetItemId = function (itemId) {
                this.ItemId = itemId;
                if (itemId === null) {
                    this.SetForecastingObject(null);
                    if (this.Items) {
                        this.Items.SelectedSalesItem = null;
                    }
                }
            };
            ForecastObjectDataSalesItem.prototype.GetCache = function () {
                return this.forecastingObjectService.GetCache(Services.CacheName.FCS);
            };
            ForecastObjectDataSalesItem.prototype.LoadData = function (dayString, reload, noMetrics) {
                var _this = this;
                var d = this.$q.defer();
                var fo = this.GetCache();
                if (!reload) {
                    if (!(fo &&
                        fo.DayString === dayString &&
                        fo.ItemId === this.ItemId &&
                        fo.Forecast.EntityId === this.dataService.GetEntityId())) {
                        reload = true;
                    }
                }
                if (!reload) {
                    this.SetForecastingObject(fo);
                    this.LoadSalesItems(fo.Forecast.EntityId, fo.Forecast.Id);
                    d.resolve(fo);
                }
                else {
                    var ItemId = this.ItemId;
                    this.Clear(true);
                    this.GetParent().LoadData(dayString, reload, true).then(function (parentData) {
                        if (parentData) {
                            _this.LoadSalesItems(parentData.Forecast.EntityId, parentData.Forecast.Id);
                            if (ItemId) {
                                _this.GetForecastByItemId(dayString, ItemId).then(function (data) {
                                    data.Forecast = parentData.Forecast;
                                    data.IsLocked = parentData.Forecast.IsDayLocked;
                                    data = _this.SetForecastingObject(data);
                                    d.resolve(data);
                                }).catch(function (reason) {
                                    d.reject(reason);
                                });
                            }
                            else {
                                d.reject();
                            }
                        }
                        else {
                            _this.Items = {
                                EntityId: 0,
                                SalesItems: [],
                                SearchParam: "",
                                SelectedSalesItem: _this.Items ? _this.Items.SelectedSalesItem : undefined
                            };
                            d.reject();
                        }
                    }).catch(function (reason) {
                        d.reject(reason);
                    });
                }
                return d.promise;
            };
            ForecastObjectDataSalesItem.prototype.GetForecast = function (dayString) {
                var ItemId = this.ItemId;
                return this.GetForecastByItemId(dayString, ItemId);
            };
            ForecastObjectDataSalesItem.prototype.GetForecastByItemId = function (dayString, ItemId) {
                var _this = this;
                var d = this.$q.defer();
                var fo = null;
                this.dataService.GetSalesItemMetricsByFilters(this.GetParent().GetForecastingObject().Forecast.Id, ItemId, null)
                    .then(function (data) {
                    if (_this.ItemId === data.SalesItemId) {
                        var pfo = _this.GetParent().GetForecastingObject();
                        fo = {
                            DayString: dayString,
                            Forecast: pfo ? pfo.Forecast : null,
                            ItemId: ItemId,
                            Metrics: data.ForecastMetricAlls,
                            MetricsFiltered: data.ForecastMetricAllsFiltered,
                            IsDirty: false,
                            IsLocked: pfo && pfo.Forecast ? pfo.Forecast.IsDayLocked : true,
                            ViewHistory: _this.dataService.CanViewHistory(),
                            HourlyEdit: false,
                            CanRevertForecast: _this.dataService.CanRevertForecast()
                        };
                        _this.forecastingObjectService.SetCache(Services.CacheName.FCS, fo);
                        fo = _this.SetForecastingObject(fo);
                        d.resolve(fo);
                    }
                    else {
                        d.reject();
                    }
                })
                    .catch(function () {
                    d.reject();
                });
                return d.promise;
            };
            ForecastObjectDataSalesItem.prototype.Clear = function (clearCache) {
                this.SetForecastingObject(null);
                if (clearCache) {
                    this.forecastingObjectService.ClearCache([Services.CacheName.FCS]);
                }
            };
            ForecastObjectDataSalesItem.prototype.ClearChanges = function () {
                this.forecastingObjectService.ClearEdits(this.GetForecastingObject());
            };
            ForecastObjectDataSalesItem.prototype.SaveChanges = function (filtered) {
                var _this = this;
                var d = this.$q.defer(), fo = this.GetForecastingObject(), forecast = this.GetParent().GetForecastingObject().Forecast;
                if (filtered) {
                    this.dataService.UpdateSalesItemMetricsByFilter(forecast.Id, this.ItemId, forecast.Version, fo.MetricsFiltered)
                        .success(function () {
                        fo.IsDirty = _this.forecastingObjectService.IsDirty(fo);
                        _this.LoadData(fo.DayString, true);
                        d.resolve();
                    })
                        .error(function (message, status) {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
                }
                else {
                    this.dataService.UpdateSalesItemMetrics(forecast.Id, this.ItemId, forecast.Version, fo.Metrics, fo.Filter ? fo.Filter.Id : undefined)
                        .success(function () {
                        fo.IsDirty = _this.forecastingObjectService.IsDirty(fo);
                        _this.LoadData(fo.DayString, true);
                        d.resolve();
                    })
                        .error(function (message, status) {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
                }
                return d.promise;
            };
            ForecastObjectDataSalesItem.prototype.ResetForecasts = function () {
                var d = this.$q.defer(), fo = this.GetForecastingObject();
                this.dataService.RevertForecast(fo.Forecast.Id, fo.Forecast.Version).then(function (ver) {
                    d.resolve(ver);
                }).catch(function (reason) {
                    d.reject(reason);
                });
                return d.promise;
            };
            ForecastObjectDataSalesItem.prototype.LoadSalesItems = function (entityId, forecastId) {
                var _this = this;
                var reload = false;
                if (!this.Items || this.Items.EntityId !== entityId) {
                    reload = true;
                }
                if (reload) {
                    this.dataService.GetSalesItemsForForecastData(forecastId).then(function (salesItemData) {
                        _this.Items = {
                            EntityId: entityId,
                            SalesItems: _this.$filter("orderBy")(salesItemData.data, "Description"),
                            SearchParam: "",
                            SelectedSalesItem: _this.Items ? _this.Items.SelectedSalesItem : undefined
                        };
                        _this.forecastingObjectService.SetCache(Services.CacheName.FCSI, _this.Items);
                        _this.FindSalesItem();
                    });
                }
                else {
                    this.FindSalesItem();
                }
            };
            ForecastObjectDataSalesItem.prototype.FindSalesItem = function (itemId) {
                var foundItem = null;
                if (!itemId) {
                    itemId = this.ItemId;
                }
                if (itemId) {
                    foundItem = _.find(this.Items.SalesItems, { Id: itemId });
                    if (!foundItem && this.Items.SalesItems && this.Items.SalesItems.length) {
                        this.SetItemId(null);
                    }
                }
                this.Items.SelectedSalesItem = foundItem;
            };
            return ForecastObjectDataSalesItem;
        }(ForecastObjectData));
        Services.ForecastObjectDataSalesItem = ForecastObjectDataSalesItem;
    })(Services = Forecasting.Services || (Forecasting.Services = {}));
})(Forecasting || (Forecasting = {}));
