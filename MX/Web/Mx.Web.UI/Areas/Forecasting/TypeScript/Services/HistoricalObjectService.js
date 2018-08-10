var Forecasting;
(function (Forecasting) {
    var Services;
    (function (Services) {
        "use strict";
        var HistoricalObjectService = (function () {
            function HistoricalObjectService(authService, $filter) {
                this.authService = authService;
                this.$filter = $filter;
            }
            HistoricalObjectService.prototype.LoadSalesData = function (historicalData) {
                var found = false;
                var historicalObject = [];
                var i, j, len, history, currentObj;
                for (i = 0; i < historicalData.length; i += 1) {
                    len = historicalObject.length;
                    for (j = 0; j < len; j += 1) {
                        currentObj = historicalData[i];
                        if (currentObj.BusinessDate === historicalObject[j].BusinessDate) {
                            found = true;
                            historicalObject[j].Details.push({
                                IntervalStart: currentObj.IntervalStart,
                                Sales: currentObj.Sales,
                                Transactions: currentObj.Transactions
                            });
                            break;
                        }
                    }
                    if (!found) {
                        currentObj = historicalData[i];
                        history = {
                            BusinessDate: currentObj.BusinessDate,
                            Details: [
                                {
                                    IntervalStart: currentObj.IntervalStart,
                                    Sales: currentObj.Sales,
                                    Transactions: currentObj.Transactions
                                }
                            ]
                        };
                        historicalObject.push(history);
                    }
                    found = false;
                }
                return this.OrderObjectData(historicalObject);
            };
            HistoricalObjectService.prototype.LoadSalesItemData = function (data) {
                var found = false;
                var historicalObject = [];
                var i, j, len, history, currentObj;
                for (i = 0; i < data.length; i += 1) {
                    len = historicalObject.length;
                    for (j = 0; j < len; j += 1) {
                        currentObj = data[i];
                        if (currentObj.BusinessDate === historicalObject[j].BusinessDate) {
                            found = true;
                            historicalObject[j].Details.push({
                                IntervalStart: currentObj.IntervalStart,
                                Sales: 0,
                                Transactions: currentObj.Transactions
                            });
                            break;
                        }
                    }
                    if (!found) {
                        currentObj = data[i];
                        history = {
                            BusinessDate: currentObj.BusinessDate,
                            Details: [
                                {
                                    IntervalStart: currentObj.IntervalStart,
                                    Sales: 0,
                                    Transactions: currentObj.Transactions
                                }
                            ]
                        };
                        historicalObject.push(history);
                    }
                    found = false;
                }
                return this.OrderObjectData(historicalObject);
            };
            HistoricalObjectService.prototype.OrderObjectData = function (data) {
                return data.sort(function (a, b) {
                    return Date.parse(a.BusinessDate) - Date.parse(b.BusinessDate);
                });
            };
            HistoricalObjectService.prototype.CreateGridView = function (data, segment, metric, includeHours, fo) {
                var historicalDaysCount = data.length;
                var formatAsDollar = !(Services.MetricType.Transactions === metric || Services.MetricType.SalesItems === metric);
                var initialValue = formatAsDollar ? this.$filter("currency")(0) : "0";
                var view = includeHours ? this.CreateArray(1, historicalDaysCount + 3)
                    : this.CreateArray(1, historicalDaysCount + 2);
                if (segment === undefined) {
                    view = this.GenerateAllData(data, view, metric, fo, includeHours);
                }
                else {
                    view = this.GenerateSegmentData(data, view, segment, metric, fo, includeHours);
                }
                for (var i = 0; i < view.length; i++) {
                    for (var j = 0; j < view[i].length; j++) {
                        if (!view[i][j]) {
                            view[i][j] = initialValue;
                        }
                    }
                }
                return view;
            };
            HistoricalObjectService.prototype.GenerateSegmentData = function (data, view, segment, metric, fo, includeHours) {
                var isSales = Services.MetricType.Sales === metric;
                view = this.GenerateForecastSegmentData(view, segment, isSales, fo, includeHours);
                view = this.GenerateActualHistoricalData(data, view, segment, isSales, fo, includeHours, Math.floor(segment.StartHour));
                return view;
            };
            HistoricalObjectService.prototype.GenerateAllData = function (data, view, metric, fo, includeHours) {
                var isSales = Services.MetricType.Sales === metric;
                var forecastDayStart = moment(fo.Metrics.IntervalStarts[0]);
                var forecastBusinessDay = moment(fo.Forecast.BusinessDay);
                var minHour = (forecastDayStart >= forecastBusinessDay)
                    ? forecastDayStart.hours()
                    : forecastDayStart.hours() - 24;
                view = this.GenerateForecastData(view, metric, fo, forecastDayStart, includeHours);
                view = this.GenerateActualHistoricalData(data, view, null, isSales, fo, includeHours, minHour);
                return view;
            };
            HistoricalObjectService.prototype.GenerateForecastSegmentData = function (view, segment, isSales, fo, includeHours) {
                var lastYearIntervals = ((isSales) ? fo.Metrics.LastYearSales : fo.Metrics.LastYearTransactions), forecastIntervals = ((isSales) ? fo.Metrics.ManagerSales : fo.Metrics.ManagerTransactions), intervalStarts = fo.Metrics.IntervalStarts, intervalTypes = fo.Metrics.IntervalTypes, segments = fo.Metrics.DaySegmentIndexes, forecastColumnIndex = view[0].length - 1, timeColumnIndex = 0, lastYearColumnIndex;
                var i, hour;
                var selectedSegmentIndex = _.findIndex(fo.Metrics.DaySegments, function (x) { return x.DaySegmentType.Id === segment.DaySegmentType.Id; });
                if (!includeHours) {
                    lastYearColumnIndex = 0;
                    for (i = 0; i < forecastIntervals.length; i += 1) {
                        if (segments[i] === selectedSegmentIndex && intervalTypes[i] === Services.IntervalTypes.DaySegment) {
                            view[0][lastYearColumnIndex] = ((isSales) ? this.$filter('currency')(lastYearIntervals[i]) : lastYearIntervals[i]);
                            view[0][forecastColumnIndex] = ((isSales) ? this.$filter('currency')(forecastIntervals[i]) : forecastIntervals[i]);
                            return view;
                        }
                    }
                }
                else {
                    lastYearColumnIndex = 1;
                    hour = 0;
                    for (i = 0; i < forecastIntervals.length; i += 1) {
                        if (segments[i] === selectedSegmentIndex) {
                            if (intervalTypes[i] === Services.IntervalTypes.Hour) {
                                view[hour] = (view[hour]) ? view[hour] : [];
                                view[hour][timeColumnIndex] = moment(intervalStarts[i]).format("h:mm A");
                                this.AddValueToView(view, hour, lastYearColumnIndex, lastYearIntervals[i], isSales);
                                this.AddValueToView(view, hour, forecastColumnIndex, forecastIntervals[i], isSales);
                                hour += 1;
                            }
                        }
                    }
                }
                return view;
            };
            HistoricalObjectService.prototype.GenerateActualHistoricalData = function (data, view, segment, isSales, fo, includeHours, viewStartHour) {
                var historicalDaysCount = data.length;
                var currentDay, currentDayColumnIndex, j, numberOfIntervals, currentDetail, hour, hourWithMinutePortion, hourIndex, value;
                for (currentDay = 0; currentDay < historicalDaysCount; currentDay += 1) {
                    numberOfIntervals = data[currentDay].Details.length;
                    if (numberOfIntervals === 0) {
                        continue;
                    }
                    currentDayColumnIndex = (includeHours) ? currentDay + 2 : currentDay + 1;
                    var currentbusiDay = moment(data[currentDay].BusinessDate);
                    var actualIntervalStart = moment(data[currentDay].Details[0].IntervalStart);
                    var minActualHour = (actualIntervalStart >= currentbusiDay)
                        ? actualIntervalStart.hours()
                        : actualIntervalStart.hours() - 24;
                    for (j = 0; j < numberOfIntervals; j += 1) {
                        currentDetail = data[currentDay].Details[j];
                        if (segment) {
                            hourWithMinutePortion = minActualHour + j / 4;
                            if (hourWithMinutePortion < segment.StartHour || hourWithMinutePortion >= segment.EndHour) {
                                continue;
                            }
                        }
                        var indexToUse;
                        if (includeHours) {
                            hour = minActualHour + Math.floor(j / 4);
                            hourIndex = hour - viewStartHour;
                            if (hourIndex < 0 || hourIndex >= view.length) {
                                continue;
                            }
                            indexToUse = hourIndex;
                        }
                        else {
                            indexToUse = 0;
                        }
                        value = (isSales) ? currentDetail.Sales : currentDetail.Transactions;
                        this.AddValueToView(view, indexToUse, currentDayColumnIndex, value, isSales);
                    }
                }
                return view;
            };
            HistoricalObjectService.prototype.GenerateForecastData = function (view, metric, fo, forecastDayStart, includeHours) {
                var isSales = Services.MetricType.Sales === metric, isSalesItem = Services.MetricType.SalesItems === metric, timeColumnIndex = 0, lastYearColumnIndex, forecastColumnIndex = view[0].length - 1;
                var i, lastYearIntervals, forecastIntervals, intervalTypes, hour, intervalCount = 0;
                if (!includeHours) {
                    lastYearColumnIndex = 0;
                    view[0][lastYearColumnIndex] = ((isSales)
                        ? this.$filter("currency")(fo.Forecast.LastYearSales)
                        : ((isSalesItem) ? fo.Metrics.LastYearTransactions[0] : fo.Forecast.LastYearTransactionCount));
                    view[0][forecastColumnIndex] = ((isSales)
                        ? this.$filter("currency")(fo.Forecast.ManagerSales)
                        : ((isSalesItem) ? fo.Metrics.ManagerTransactions[0] : fo.Forecast.ManagerTransactionCount));
                }
                else {
                    lastYearColumnIndex = 1;
                    lastYearIntervals = ((isSales) ? fo.Metrics.LastYearSales : fo.Metrics.LastYearTransactions);
                    forecastIntervals = ((isSales) ? fo.Metrics.ManagerSales : fo.Metrics.ManagerTransactions);
                    intervalTypes = fo.Metrics.IntervalTypes;
                    hour = 0;
                    var minHour = forecastDayStart.hours();
                    for (i = 0; i < forecastIntervals.length; i += 1) {
                        if (intervalTypes[i] === Services.IntervalTypes.Hour) {
                            view[hour] = (view[hour]) ? view[hour] : [];
                            view[hour][timeColumnIndex] = this.GetFormatedHour(minHour + hour);
                            this.AddValueToView(view, hour, lastYearColumnIndex, lastYearIntervals[i], isSales);
                            this.AddValueToView(view, hour, forecastColumnIndex, forecastIntervals[i], isSales);
                        }
                        else {
                            if (intervalTypes[i] === Services.IntervalTypes.Interval) {
                                intervalCount += 1;
                                if (intervalCount === 4) {
                                    hour += 1;
                                    intervalCount = 0;
                                }
                            }
                        }
                    }
                }
                return view;
            };
            HistoricalObjectService.prototype.CreateArray = function (rows, cols) {
                var viewBoard = [];
                var i, j;
                for (i = 0; i < rows; i += 1) {
                    viewBoard[i] = [];
                    for (j = 0; j < cols; j += 1) {
                        viewBoard[i][j] = null;
                    }
                }
                return viewBoard;
            };
            HistoricalObjectService.prototype.GetFormatedHour = function (hour) {
                hour = hour % 24;
                var modifiedHour = hour > 12 ? hour - 12 : hour;
                return (modifiedHour || 12) + ":00 " + (hour < 12 ? "AM" : "PM");
            };
            HistoricalObjectService.prototype.AddValueToView = function (view, rowIndex, columnIndex, valueToAdd, isSales) {
                var currentValue = view[rowIndex][columnIndex];
                if (!currentValue) {
                    currentValue = "0";
                }
                var numberValue = (isSales)
                    ? parseFloat(currentValue.replace(/[^0-9-.]/g, ""))
                    : parseInt(currentValue, 10);
                if (!numberValue) {
                    numberValue = 0;
                }
                var numberResult = numberValue + valueToAdd;
                view[rowIndex][columnIndex] = (isSales) ? this.$filter("currency")(numberResult) : numberResult.toString();
            };
            return HistoricalObjectService;
        }());
        Services.$historicalObjectService = Core.NG.ForecastingModule.RegisterService("HistoricalObjectService", HistoricalObjectService, Core.Auth.$authService, Core.NG.$filter);
    })(Services = Forecasting.Services || (Forecasting.Services = {}));
})(Forecasting || (Forecasting = {}));
