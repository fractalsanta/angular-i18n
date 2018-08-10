module Forecasting {
    "use strict";
    
    interface IForecastHeaderScope extends ng.IScope {
        IsGridView: boolean;
        IsSalesItemView: boolean;

        ForecastingOptions: Services.IForecastingOptions;
        ForecastObject?: Services.IForecastObject;
        ForecastSalesItems?: Services.IForecastSalesItems;
        FOSalesItem: Services.IForecastObject;
                
        NavigateTo(view: string, part?: number, filter?: number): void;
        NavigateToMetric(view: string, metric: string, filter?: number): void;
        NavigateToHistory(view: string, part?: number): void;

        Translations: Api.Models.ITranslations;

        CurrentDate: Moment;
        IsMultiEventDay: boolean;
        EventLabel: string;
        AllEventsList: string;
        ShowAllEvents(): void;

        OnSelectedDayChange(selectedDate: Date): void;
        OnDatePickerChange(selectedDate: Date): void;
    }

    export interface IDayEventData {
        TagId: number;
        ProfileId: number;
        ProfileName: string;
        Notes: string;
    }

    class ForecastHeaderController {
        
        private eventData: IDayEventData[];

        constructor(
            private $scope: IForecastHeaderScope,
            $location: ng.ILocationService,
            $translation: Core.ITranslationService,
            private $modal: ng.ui.bootstrap.IModalService,
            private eventService: Services.IEventService,
            private constants: Core.IConstants
            ) {

            $scope.Translations = <Api.Models.ITranslations>{};

            $translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Forecasting;
            });

            $scope.ShowAllEvents = (): void => {
                this.ShowAllEvents($scope.Translations.AllScheduledEventsFor + $scope.CurrentDate.format(constants.DateCompactFormat), $scope.AllEventsList);
            };

            var date = localStorage.getItem("DateMenu.DateString");
            if (date) {
                $scope.CurrentDate = moment(date);
            } else {
                $scope.CurrentDate = moment();
            }

            $scope.OnSelectedDayChange = (selectedDate: Date): void => {
                $scope.OnDatePickerChange(selectedDate); // this is defined in the ForecastController.ts
                $scope.CurrentDate = moment(selectedDate);
                this.GetTagsForToday($scope.CurrentDate);
            };

            this.GetTagsForToday($scope.CurrentDate);

            $scope.NavigateTo = (view: string, part?: number, filter?: number): void => {
                /* capitialize the first letter of metric to match expected url casing */
                var metric = $scope.ForecastingOptions.Metric.charAt(0).toUpperCase() + $scope.ForecastingOptions.Metric.slice(1),
                    url = "/Forecasting/" + view + "/" + metric;

                /* sales items needs camel casing */
                if ($scope.ForecastingOptions.Metric === Services.MetricType.SalesItems) {
                    metric = "SalesItems";

                    if ($scope.ForecastingOptions.ItemId) {
                        url += "/" + $scope.ForecastingOptions.ItemId;
                    }
                }

                if ($scope.ForecastingOptions.Part !== null && part === undefined) {
                    url += "/" + $scope.ForecastingOptions.Part;
                }

                if (part) {
                    url += "/" + part;
                }

                if (filter) {
                    url += "/filter/" + filter;
                }

                $location.path(url);
            };

            $scope.NavigateToMetric = (view: string, metric: string, filter?: number): void => {
                var url = "/Forecasting/" + view + "/" + metric.charAt(0).toUpperCase() + metric.slice(1);

                /* sales items needs camel casing */
                if ($scope.ForecastingOptions.Metric === Services.MetricType.SalesItems) {
                    metric = "SalesItems";
                }

                if ($scope.ForecastingOptions.ItemId) {
                    url += "/" + $scope.ForecastingOptions.ItemId;
                }

                if ($scope.ForecastingOptions.Part !== null) {
                    url += "/" + $scope.ForecastingOptions.Part;
                }

                if (filter) {
                    url += "/filter/" + filter;
                }
                $location.path(url);
            };

            $scope.NavigateToHistory = (view: string, part?: number): void => {
                var metric = $scope.ForecastingOptions.Metric,
                    url = "/Forecasting/" + view + "/" + metric;

                url += "/" + $scope.ForecastObject.Forecast.Id;

                url += "/" + $scope.IsGridView;

                if ($scope.ForecastingOptions.Part !== null && !part) {
                    url += "/" + $scope.ForecastObject.Metrics.DaySegments[$scope.ForecastingOptions.Part].Id;
                }

                if (part) {
                    url += "/" + part;
                }

                /* sales items needs camel casing */
                if ($scope.ForecastingOptions.Metric === Forecasting.Services.MetricType.SalesItems) {
                    metric = "SalesItems";
                }

                if ($scope.IsSalesItemView) {
                    url += "/" + $scope.ForecastingOptions.ItemId;
                }

                $location.path(url);
            };
        }

        GetTagsForToday(date: Moment): void {
            this.eventService.GetMonthTags(date).then(tagsResult => {
                this.eventService.GetEventProfiles().then(profilesResult => {
                    var info = tagsResult.data;
                    var profiles = profilesResult.data;
                    var startDate = moment(info.FirstDayOnCalendar);
                    var dayIndex = date.diff(startDate, "days");
                    var dayInfo = info.DayInfo[dayIndex];
                    if (dayInfo.EventProfileTagIds.length > 1 && dayInfo.EventProfileIds.length > 1) {
                        this.eventData = [];
                        for (var i = 0, j = dayInfo.EventProfileTagIds.length; i < j; i++) {
                            this.eventData.push({
                                TagId: dayInfo.EventProfileTagIds[i],
                                ProfileId: dayInfo.EventProfileIds[i],
                                ProfileName: _.find(profiles, p => p.Id === dayInfo.EventProfileIds[i]).Name,
                                Notes: dayInfo.EventTagNotes[i]
                            });
                        }
                        this.$scope.EventLabel = this.$scope.Translations.MultiEventDay.replace(/\{0\}/g, dayInfo.EventProfileIds.length.toString());
                        this.$scope.IsMultiEventDay = true;
                    } else if (dayInfo.EventProfileTagIds.length > 0 && dayInfo.EventProfileIds.length > 0) {
                        var profileId = dayInfo.EventProfileIds[0];
                        var profileName = _.find(profiles, p => p.Id === profileId).Name;
                        this.$scope.EventLabel = this.$scope.Translations.SingleEventDay.replace(/\{0\}/g, profileName);
                        this.$scope.AllEventsList = this.$scope.EventLabel;
                        this.$scope.IsMultiEventDay = false;
                    } else {
                        this.$scope.EventLabel = "";
                        this.$scope.AllEventsList = "";
                        this.$scope.IsMultiEventDay = false;
                    }
                });
            });
        }

        private ShowAllEvents(title: string, messageText: string, confirmButtonText?: string): void {
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/AllEventsForDayDialog.html",
                controller: "Forecasting.AllEventsForDayController",
                resolve: {
                    date: (): Moment => {
                        return this.$scope.CurrentDate;
                    },
                    eventData: (): IDayEventData[] => {
                        return this.eventData;
                    }
                }
            });
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("ForecastHeaderController", ForecastHeaderController,
        Core.NG.$typedScope<IForecastHeaderScope>(),
        Core.NG.$location,
        Core.$translation,
        Core.NG.$modal,
        Forecasting.Services.$eventService,
        Core.Constants);

    class ForecastHeader implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/HeaderTemplate.html",
                controller: "Forecasting.ForecastHeaderController"
            };
        }
    }

    Core.NG.ForecastingModule.RegisterDirective("forecastHeader", ForecastHeader);
}