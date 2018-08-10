var Forecasting;
(function (Forecasting) {
    "use strict";
    var EvaluatorController = (function () {
        function EvaluatorController($scope, $routeParams, $location, $modal, translation, messageService, dataService, forecastingObjectService, $filter, eventService, forecastFilterService) {
            var _this = this;
            this.$scope = $scope;
            this.messageService = messageService;
            this.eventService = eventService;
            this.forecastFilterService = forecastFilterService;
            $routeParams.metric = $routeParams.metric.toLowerCase();
            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales" },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions" },
                salesitems: { Template: "n", TranslationKey: "SalesItems" }
            }, currentMetric = metricMap[$routeParams.metric];
            $scope.IsEvaluatorView = true;
            $scope.HasData = false;
            $scope.Translations = {};
            $scope.ForecastingOptions = {
                Metric: $routeParams.metric,
                Template: currentMetric.Template,
                Part: ($routeParams.part) ? Number($routeParams.part) : null,
                ItemId: null,
                IntervalTypes: Forecasting.Services.IntervalTypes,
                ForecastIndex: 0,
                FilterId: ($routeParams.filter) ? Number($routeParams.filter) : null
            };
            var calandarDateFormat = "M/d/yyyy";
            var date = localStorage.getItem("DateMenu.DateString");
            if (date) {
                date = moment(date).toDate();
            }
            else {
                date = moment().toDate();
            }
            $scope.ForecastPickerOptions = {
                Date: date,
                DayOffset: $scope.IsEvaluatorView ? 7 : 1
            };
            $scope.DayString = $filter('date')(date, calandarDateFormat);
            translation.GetTranslations().then(function (result) {
                $scope.Translations = result.Forecasting;
                var title = $scope.IsEvaluatorView ? $scope.Translations.TitleEvaluator : $scope.Translations.TitleForecasting;
                messageService.SetPageTitle(title);
                $scope.DisplayMetric = result.Forecasting[currentMetric.TranslationKey];
                $scope.LoadData();
                $scope.GetForecastFilters();
            });
            $scope.LoadData = function (reload) {
                var ev = forecastingObjectService.Cache["EV"];
                if (!reload) {
                    if (!(ev &&
                        ev.DayString === $scope.DayString)) {
                        reload = true;
                    }
                }
                if (!reload) {
                    $scope.HasData = true;
                    $scope.SetData(ev);
                }
                else {
                    $scope.HasData = true;
                    $scope.Clear();
                    $scope.GetEvaluation();
                }
            };
            $scope.GetForecastFilters = function () {
                forecastFilterService.GetForecastFilters().success(function (results) {
                    results.unshift({
                        Id: null,
                        Name: _this.$scope.Translations.Total
                    });
                    $scope.DropDownForecastFilters = results;
                    $scope.ShowForecastFilters = _.any($scope.DropDownForecastFilters, function (el) { return el.Id != null; });
                });
            };
            $scope.GetEvaluation = function () {
                dataService.GetForecastEvaluationDataForDate($scope.DayString, $scope.ForecastingOptions.FilterId).then(function (evaluation) {
                    if (evaluation === null || evaluation[0].data.length <= 0) {
                        _this.AlertNoData();
                        return;
                    }
                    evaluation.DayString = $scope.DayString;
                    forecastingObjectService.Cache["EV"] = evaluation;
                    $scope.SetData(evaluation);
                });
            };
            $scope.Clear = function () {
                $scope.Evaluation = forecastingObjectService.Cache["EV"] = null;
            };
            $scope.$on("$locationChangeStart", function (e, newUrl, oldUrl) {
                var evaluatorRegex = /\/Evaluator\//i;
                if (!evaluatorRegex.test(newUrl)) {
                    $scope.Clear();
                    localStorage.removeItem("DateMenu.DateString");
                }
            });
            $scope.SetData = function (evaluation) {
                var index, firstDayOfWeek, selectedDate, dateString;
                $scope.ForecastingOptions.SeriesEvaluationTimes = $scope.GetSeriesTimeArray(evaluation);
                $scope.ForecastingOptions.DaySegmentNames = $scope.GetDaySegmentNames(evaluation);
                firstDayOfWeek = moment(evaluation[0].data[0].BusinessDate[0]);
                selectedDate = moment(firstDayOfWeek).toDate();
                dateString = $filter('date')(selectedDate, calandarDateFormat);
                if ($scope.DayString !== dateString) {
                    _this.SetDayString(dateString);
                    localStorage.setItem("DateMenu.DateString", $scope.DayString);
                }
                $scope.ForecastPickerOptions.Date = selectedDate;
                var evaluationIndex = 0;
                if ($routeParams.part && $scope.ForecastingOptions.DaySegmentNames.length > 1) {
                    evaluationIndex = Number($routeParams.part);
                }
                $scope.GetSeriesEvaluationData(evaluation, evaluationIndex).then(function (series) {
                    $scope.ForecastingOptions.SeriesEvaluationData = series;
                });
                $scope.DaySegments = [];
                for (index = 0; index < $scope.ForecastingOptions.DaySegmentNames.length; index += 1) {
                    $scope.DaySegments.push({ name: $scope.ForecastingOptions.DaySegmentNames[index], value: index });
                }
                if ($scope.ForecastingOptions.DaySegmentNames.length > 1) {
                    $scope.DropDownDaySegments = { type: $scope.ForecastingOptions.Part ? $scope.ForecastingOptions.Part : 0 };
                }
                else {
                    $scope.DropDownDaySegments = { type: 0 };
                }
                $scope.Metrics = [
                    { name: $scope.Translations.Sales, value: "sales" },
                    { name: $scope.Translations.Transactions, value: "transactions" }
                ];
                $scope.DropDownMetrics = { type: $scope.ForecastingOptions.Metric };
                messageService.Dismiss();
            };
            $scope.GetSeriesEvaluationData = function (ed, index) {
                return _this.GetTagsForWeek(moment($scope.DayString)).then(function (tags) {
                    var evaluationData = Forecasting.Services.MetricType.Sales === $scope.ForecastingOptions.Metric ? ed[0].data : ed[1].data, suffix = ($scope.ForecastingOptions.Metric[0].toUpperCase() + $scope.ForecastingOptions.Metric.slice(1)), evaluationType = ["Actual" + suffix, "Manager" + suffix, "System" + suffix], legendName = [$scope.Translations.Actual, $scope.Translations.ManagerEdited, $scope.Translations.SystemGenerated], colors = ["#6DDA5F", "#FCAE30", "#07A4D8"], arr = [], currentMetric, i, data;
                    for (i = 0; i < evaluationType.length; i += 1) {
                        currentMetric = evaluationType[i];
                        data = evaluationData[index][currentMetric].map(function (v, j) {
                            return {
                                value: v,
                                actual: Math.round(evaluationData[index][evaluationType[0]][j]),
                                manager: Math.round(evaluationData[index][evaluationType[1]][j]),
                                system: Math.round(evaluationData[index][evaluationType[2]][j]),
                                hasBeenEdited: evaluationData[index]["HasBeenEdited"][j],
                                managerAccuracy: Math.round(evaluationData[index]["ManagerAccuracy"][j] * 100),
                                systemAccuracy: Math.round(evaluationData[index]["SystemAccuracy"][j] * 100),
                                events: tags[j].map(function (tag) { return tag ? "Event: " + tag : ""; })
                            };
                        });
                        arr.push({
                            data: data,
                            color: colors[i],
                            name: legendName[i],
                            field: "value"
                        });
                    }
                    return arr;
                });
            };
            $scope.GetDaySegmentNames = function (ed) {
                var graphData = ed[0].data, arr = [], i;
                for (i = 0; i < graphData.length; i += 1) {
                    if (graphData[i].DaySegmentDescription) {
                        arr.push(graphData[i].DaySegmentDescription);
                    }
                    else {
                        arr.push($scope.Translations.AllDay);
                    }
                }
                return arr;
            };
            $scope.GetSeriesTimeArray = function (ed) {
                var times = ed[0].data[0].BusinessDate, arr = [], m, i;
                for (i = 0; i < times.length; i += 1) {
                    m = moment(times[i]);
                    arr.push(m.format("MMM-DD"));
                }
                return arr;
            };
            $scope.OnDatePickerChange = function (selectedDate) {
                var dateString = $filter('date')(selectedDate, calandarDateFormat);
                if ($scope.DayString !== dateString) {
                    _this.SetDayString(dateString);
                }
                localStorage.setItem("DateMenu.DateString", $scope.DayString);
                $scope.LoadData(true);
            };
        }
        EvaluatorController.prototype.AlertNoData = function (skipMessage) {
            this.$scope.HasData = false;
            if (!skipMessage) {
                this.messageService.ShowError(this.$scope.Translations.NoForecastForDay + " " + this.$scope.DayString);
            }
        };
        EvaluatorController.prototype.SetDayString = function (dayString) {
            this.$scope.DayStringInvalid = false;
            this.$scope.DayString = dayString;
        };
        EvaluatorController.prototype.GetTagsForWeek = function (startDate) {
            var _this = this;
            return this.eventService.GetMonthTags(startDate).then(function (tagsResult) {
                return _this.eventService.GetEventProfiles().then(function (profilesResult) {
                    var info = tagsResult.data;
                    var profiles = profilesResult.data;
                    var firstDate = moment(info.FirstDayOnCalendar);
                    var day1Index = startDate.diff(firstDate, "days");
                    var returnValue = [];
                    for (var i = day1Index, j = day1Index + 7; i < j; i++) {
                        var dayInfo = info.DayInfo[i];
                        if (dayInfo.EventProfileTagIds.length > 0 && dayInfo.EventProfileIds.length > 0) {
                            var setProfiles = _.filter(profiles, function (p) { return dayInfo.EventProfileIds.indexOf(p.Id) != -1; });
                            var profileNames = _.pluck(setProfiles, "Name");
                            returnValue.push(profileNames);
                        }
                        else {
                            returnValue.push([""]);
                        }
                    }
                    return returnValue;
                });
            });
        };
        return EvaluatorController;
    }());
    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric", "Templates/EvaluatorView.html", EvaluatorController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$filter, Forecasting.Services.$eventService, Forecasting.Api.$forecastFilterService);
    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric/filter/:filter", "Templates/EvaluatorView.html", EvaluatorController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$filter, Forecasting.Services.$eventService, Forecasting.Api.$forecastFilterService);
    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric/:part", "Templates/EvaluatorView.html", EvaluatorController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$filter, Forecasting.Services.$eventService, Forecasting.Api.$forecastFilterService);
    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric/:part/filter/:filter", "Templates/EvaluatorView.html", EvaluatorController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$filter, Forecasting.Services.$eventService, Forecasting.Api.$forecastFilterService);
})(Forecasting || (Forecasting = {}));
