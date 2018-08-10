module Forecasting {
    "use strict";

    
    interface IEvaluatorControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;

        DayStringInvalid: boolean;
        IsEvaluatorView: boolean;
        HasData: boolean;
        DayString: string;
        DisplayMetric: string;

        ForecastingOptions: IEvaluatorOptions;
        Evaluation: Services.IEvaluatorObject;
        Metrics: any;
        DropDownMetrics: any;
        DaySegments: any;
        DropDownDaySegments: any;
        DropDownForecastFilters: Api.Models.IForecastFilterRecord[];
        ShowForecastFilters: boolean;

        LoadData(reload?: boolean): void;
        GetEvaluation(): void;
        SetData(fo: Services.IForecastObject): void;
        Clear(): void;
        GetSeriesEvaluationData(ed: any, index: number): ng.IPromise<any[]>;
        GetDaySegmentNames(ed: any): string[];
        GetForecastFilters(): void;
        GetSeriesTimeArray(ed: any): any[];
        GetEvaluationPart(index: number): void;
        OnDatePickerChange(selectedDate: Date): void;
        ForecastPickerOptions: Core.NG.IMxDayPickerOptions;
    }

    interface IEvaluatorControllerRouteParams {
        view: string;
        metric: string;
        id?: string;
        part?: string;
        filter?: string;
    }

    export interface IEvaluatorOptions {
        Metric: string;
        Template: string;
        Part?: number;
        ItemId?: number;
        SeriesEvaluationData?: any[];
        SeriesEvaluationTimes?: any[];
        Title?: string;
        DaySegmentNames?: any[];
        FilterId?: number;
    }

    class EvaluatorController {
        constructor(
            private $scope: IEvaluatorControllerScope,
            $routeParams: IEvaluatorControllerRouteParams,
            $location: ng.ILocationService,
            $modal: ng.ui.bootstrap.IModalService,
            translation: Core.ITranslationService,
            private messageService: Core.IPopupMessageService,
            dataService: Services.IDataService,
            forecastingObjectService: Services.IForecastingObjectService,
            $filter: ng.IFilterService,
            private eventService: Services.IEventService,
            private forecastFilterService : Forecasting.Api.IForecastFilterService) {

            // Lowercase metric to ensure simple case-insensitive comparison.
            $routeParams.metric = $routeParams.metric.toLowerCase();

            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales" },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions" },
                salesitems: { Template: "n", TranslationKey: "SalesItems" }
            },
            currentMetric = metricMap[$routeParams.metric];

            $scope.IsEvaluatorView = true;
            $scope.HasData = false;

            $scope.Translations = <Api.Models.ITranslations>{};

            $scope.ForecastingOptions = <IEvaluatorOptions>{
                Metric: $routeParams.metric,
                Template: currentMetric.Template,
                Part: ($routeParams.part) ? Number($routeParams.part) : null,
                ItemId: null,
                IntervalTypes: Services.IntervalTypes,
                ForecastIndex: 0,
                FilterId: ($routeParams.filter) ? Number($routeParams.filter) : null
            };

            var calandarDateFormat = "M/d/yyyy";
            var date: any = localStorage.getItem("DateMenu.DateString");

            if (date) {
                date = moment(date).toDate();
            } else {
                date = moment().toDate();
            }

            $scope.ForecastPickerOptions = <Core.NG.IMxDayPickerOptions>{
                Date: date,
                DayOffset: $scope.IsEvaluatorView ? 7 : 1
            };

            $scope.DayString = $filter('date')(date, calandarDateFormat);

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Forecasting;
                var title = $scope.IsEvaluatorView ? $scope.Translations.TitleEvaluator : $scope.Translations.TitleForecasting;
                messageService.SetPageTitle(title);
                $scope.DisplayMetric = result.Forecasting[currentMetric.TranslationKey];

                $scope.LoadData();
                $scope.GetForecastFilters();
            });

            $scope.LoadData = (reload?: boolean): void => {
                var ev: any = forecastingObjectService.Cache["EV"];

                if (!reload) {
                    if (!(ev &&
                        ev.DayString === $scope.DayString)) {
                        reload = true;
                    }
                }

                if (!reload) {
                    $scope.HasData = true;
                    $scope.SetData(ev);
                } else {
                    $scope.HasData = true;
                    $scope.Clear();
                    $scope.GetEvaluation();
                }
            };

            $scope.GetForecastFilters = (): void => {
                forecastFilterService.GetForecastFilters().success((results: Forecasting.Api.Models.IForecastFilterRecord[]): void => {
                    results.unshift(<Api.Models.IForecastFilterRecord><any>{
                        Id: null,
                        Name: this.$scope.Translations.Total
                    });
                    $scope.DropDownForecastFilters = results;
                    $scope.ShowForecastFilters = _.any($scope.DropDownForecastFilters, (el) => el.Id != null);
                });
            }

            $scope.GetEvaluation = (): void => {
                dataService.GetForecastEvaluationDataForDate($scope.DayString, $scope.ForecastingOptions.FilterId).then((evaluation: any): void => {
                    if (evaluation === null || evaluation[0].data.length <= 0) {
                        this.AlertNoData();
                        return;
                    }

                    evaluation.DayString = $scope.DayString;
                    forecastingObjectService.Cache["EV"] = evaluation;
                    $scope.SetData(evaluation);
                });
            };

            $scope.Clear = (): void => {
                $scope.Evaluation = forecastingObjectService.Cache["EV"] = null;
            };

            $scope.$on("$locationChangeStart", (e: ng.IAngularEvent, newUrl: string, oldUrl: string): void => {
                var evaluatorRegex = /\/Evaluator\//i;

                if (!evaluatorRegex.test(newUrl)) {
                    $scope.Clear();
                    localStorage.removeItem("DateMenu.DateString");
                }
            });

            $scope.SetData = (evaluation: any): void => {

                var index, firstDayOfWeek, selectedDate, dateString;
                $scope.ForecastingOptions.SeriesEvaluationTimes = $scope.GetSeriesTimeArray(evaluation);
                $scope.ForecastingOptions.DaySegmentNames = $scope.GetDaySegmentNames(evaluation);
		// get the first buisness day of the week
                firstDayOfWeek = moment(evaluation[0].data[0].BusinessDate[0]);
                selectedDate = moment(firstDayOfWeek).toDate();
                dateString = $filter('date')(selectedDate, calandarDateFormat);
                if ($scope.DayString !== dateString) {
                    this.SetDayString(dateString);
                    localStorage.setItem("DateMenu.DateString", $scope.DayString);
                }

                $scope.ForecastPickerOptions.Date = selectedDate;

                var evaluationIndex: number = 0;
                if ($routeParams.part && $scope.ForecastingOptions.DaySegmentNames.length > 1) {
                    evaluationIndex = Number($routeParams.part);
                }

                $scope.GetSeriesEvaluationData(evaluation, evaluationIndex).then((series: any[]) => {
                    $scope.ForecastingOptions.SeriesEvaluationData = series;
                });

                $scope.DaySegments = [];
                for (index = 0; index < $scope.ForecastingOptions.DaySegmentNames.length; index += 1) {
                    $scope.DaySegments.push({ name: $scope.ForecastingOptions.DaySegmentNames[index], value: index });
                }
                if ($scope.ForecastingOptions.DaySegmentNames.length > 1) {
                    $scope.DropDownDaySegments = { type: $scope.ForecastingOptions.Part ? $scope.ForecastingOptions.Part : 0 };
                } else {
                    $scope.DropDownDaySegments = { type:0};
                }
                $scope.Metrics = [
                    { name: $scope.Translations.Sales, value: "sales" },
                    { name: $scope.Translations.Transactions, value: "transactions" }
                ];

                $scope.DropDownMetrics = { type: $scope.ForecastingOptions.Metric };

                messageService.Dismiss();
            };

            $scope.GetSeriesEvaluationData = (ed: Services.IEvaluatorObject, index: number): ng.IPromise<any[]> => {

                return this.GetTagsForWeek(moment($scope.DayString)).then((tags: string[][]) => {

                    var evaluationData = Services.MetricType.Sales === $scope.ForecastingOptions.Metric ? ed[0].data : ed[1].data,
                        suffix = ($scope.ForecastingOptions.Metric[0].toUpperCase() + $scope.ForecastingOptions.Metric.slice(1)),
                        evaluationType = ["Actual" + suffix, "Manager" + suffix, "System" + suffix],
                        legendName = [$scope.Translations.Actual, $scope.Translations.ManagerEdited, $scope.Translations.SystemGenerated],
                        colors = ["#6DDA5F", "#FCAE30", "#07A4D8"],
                        arr = [],
                        currentMetric,
                        i,
                        data;

                    for (i = 0; i < evaluationType.length; i += 1) {
                        currentMetric = evaluationType[i];
                        data = evaluationData[index][currentMetric].map((v, j) => {
                            return {
                                value: v,
                                actual: Math.round(evaluationData[index][evaluationType[0]][j]),
                                manager: Math.round(evaluationData[index][evaluationType[1]][j]),
                                system: Math.round(evaluationData[index][evaluationType[2]][j]),
                                hasBeenEdited: evaluationData[index]["HasBeenEdited"][j],
                                managerAccuracy: Math.round(evaluationData[index]["ManagerAccuracy"][j] * 100),
                                systemAccuracy: Math.round(evaluationData[index]["SystemAccuracy"][j] * 100),
                                events: tags[j].map((tag) => { return tag ? "Event: " + tag : ""; })
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

            $scope.GetDaySegmentNames = (ed: Services.IEvaluatorObject): string[]=> {
                var graphData = ed[0].data,
                    arr = [],
                    i;

                for (i = 0; i < graphData.length; i += 1) {
                    if (graphData[i].DaySegmentDescription) {
                        arr.push(graphData[i].DaySegmentDescription);
                    } else {
                        arr.push($scope.Translations.AllDay);
                    }
                }

                return arr;
            };

            $scope.GetSeriesTimeArray = (ed: Services.IEvaluatorObject): any[]=> {
                var times = ed[0].data[0].BusinessDate,
                    arr = [],
                    m,
                    i;

                for (i = 0; i < times.length; i += 1) {
                    m = moment(times[i]);
                    arr.push(m.format("MMM-DD"));
                }

                return arr;
            };
            // #endregion

            // #region  Calendar               
            $scope.OnDatePickerChange = (selectedDate: Date): void => {
                var dateString = $filter('date')(selectedDate, calandarDateFormat);
                if ($scope.DayString !== dateString) {
                    this.SetDayString(dateString);
                }
                localStorage.setItem("DateMenu.DateString", $scope.DayString);
                $scope.LoadData(true);
            };
            // #endregion
        }

        private AlertNoData(skipMessage?: boolean): void {
            this.$scope.HasData = false;

            if (!skipMessage) {
                this.messageService.ShowError(this.$scope.Translations.NoForecastForDay + " " + this.$scope.DayString);
            }
        }

        private SetDayString(dayString: string): void {
            this.$scope.DayStringInvalid = false;
            this.$scope.DayString = dayString;
        }
        
        GetTagsForWeek(startDate: Moment): ng.IPromise<string[][]> {
            return this.eventService.GetMonthTags(startDate).then(tagsResult => {
                return this.eventService.GetEventProfiles().then(profilesResult => {
                    var info = tagsResult.data;
                    var profiles = profilesResult.data;
                    var firstDate = moment(info.FirstDayOnCalendar);
                    var day1Index = startDate.diff(firstDate, "days");
                    var returnValue: string[][] = [];
                    for (var i = day1Index, j = day1Index + 7; i < j; i++) {
                        var dayInfo = info.DayInfo[i];
                        if (dayInfo.EventProfileTagIds.length > 0 && dayInfo.EventProfileIds.length > 0) {
                            var setProfiles = _.filter(profiles, p => dayInfo.EventProfileIds.indexOf(p.Id) != -1);
                            var profileNames = _.pluck(setProfiles, "Name");
                            returnValue.push(profileNames);
                        } else {
                            returnValue.push([""]);
                        }
                    }
                    return returnValue;
                });
            });
        }
    }

    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric", "Templates/EvaluatorView.html", EvaluatorController,
        Core.NG.$typedScope<IEvaluatorControllerScope>(),
        Core.NG.$typedStateParams<IEvaluatorControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$filter,
        Forecasting.Services.$eventService,
        Forecasting.Api.$forecastFilterService);

    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric/filter/:filter", "Templates/EvaluatorView.html", EvaluatorController,
        Core.NG.$typedScope<IEvaluatorControllerScope>(),
        Core.NG.$typedStateParams<IEvaluatorControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$filter,
        Forecasting.Services.$eventService,
        Forecasting.Api.$forecastFilterService);

    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric/:part", "Templates/EvaluatorView.html", EvaluatorController,
        Core.NG.$typedScope<IEvaluatorControllerScope>(),
        Core.NG.$typedStateParams<IEvaluatorControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$filter,
        Forecasting.Services.$eventService,
        Forecasting.Api.$forecastFilterService);

    Core.NG.ForecastingModule.RegisterRouteController("Evaluator/Graph/:metric/:part/filter/:filter", "Templates/EvaluatorView.html", EvaluatorController,
        Core.NG.$typedScope<IEvaluatorControllerScope>(),
        Core.NG.$typedStateParams<IEvaluatorControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$filter,
        Forecasting.Services.$eventService,
        Forecasting.Api.$forecastFilterService);

} 