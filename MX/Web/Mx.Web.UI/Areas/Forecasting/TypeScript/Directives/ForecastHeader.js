var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastHeaderController = (function () {
        function ForecastHeaderController($scope, $location, $translation, $modal, eventService, constants) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.eventService = eventService;
            this.constants = constants;
            $scope.Translations = {};
            $translation.GetTranslations().then(function (result) {
                $scope.Translations = result.Forecasting;
            });
            $scope.ShowAllEvents = function () {
                _this.ShowAllEvents($scope.Translations.AllScheduledEventsFor + $scope.CurrentDate.format(constants.DateCompactFormat), $scope.AllEventsList);
            };
            var date = localStorage.getItem("DateMenu.DateString");
            if (date) {
                $scope.CurrentDate = moment(date);
            }
            else {
                $scope.CurrentDate = moment();
            }
            $scope.OnSelectedDayChange = function (selectedDate) {
                $scope.OnDatePickerChange(selectedDate);
                $scope.CurrentDate = moment(selectedDate);
                _this.GetTagsForToday($scope.CurrentDate);
            };
            this.GetTagsForToday($scope.CurrentDate);
            $scope.NavigateTo = function (view, part, filter) {
                var metric = $scope.ForecastingOptions.Metric.charAt(0).toUpperCase() + $scope.ForecastingOptions.Metric.slice(1), url = "/Forecasting/" + view + "/" + metric;
                if ($scope.ForecastingOptions.Metric === Forecasting.Services.MetricType.SalesItems) {
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
            $scope.NavigateToMetric = function (view, metric, filter) {
                var url = "/Forecasting/" + view + "/" + metric.charAt(0).toUpperCase() + metric.slice(1);
                if ($scope.ForecastingOptions.Metric === Forecasting.Services.MetricType.SalesItems) {
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
            $scope.NavigateToHistory = function (view, part) {
                var metric = $scope.ForecastingOptions.Metric, url = "/Forecasting/" + view + "/" + metric;
                url += "/" + $scope.ForecastObject.Forecast.Id;
                url += "/" + $scope.IsGridView;
                if ($scope.ForecastingOptions.Part !== null && !part) {
                    url += "/" + $scope.ForecastObject.Metrics.DaySegments[$scope.ForecastingOptions.Part].Id;
                }
                if (part) {
                    url += "/" + part;
                }
                if ($scope.ForecastingOptions.Metric === Forecasting.Services.MetricType.SalesItems) {
                    metric = "SalesItems";
                }
                if ($scope.IsSalesItemView) {
                    url += "/" + $scope.ForecastingOptions.ItemId;
                }
                $location.path(url);
            };
        }
        ForecastHeaderController.prototype.GetTagsForToday = function (date) {
            var _this = this;
            this.eventService.GetMonthTags(date).then(function (tagsResult) {
                _this.eventService.GetEventProfiles().then(function (profilesResult) {
                    var info = tagsResult.data;
                    var profiles = profilesResult.data;
                    var startDate = moment(info.FirstDayOnCalendar);
                    var dayIndex = date.diff(startDate, "days");
                    var dayInfo = info.DayInfo[dayIndex];
                    if (dayInfo.EventProfileTagIds.length > 1 && dayInfo.EventProfileIds.length > 1) {
                        _this.eventData = [];
                        for (var i = 0, j = dayInfo.EventProfileTagIds.length; i < j; i++) {
                            _this.eventData.push({
                                TagId: dayInfo.EventProfileTagIds[i],
                                ProfileId: dayInfo.EventProfileIds[i],
                                ProfileName: _.find(profiles, function (p) { return p.Id === dayInfo.EventProfileIds[i]; }).Name,
                                Notes: dayInfo.EventTagNotes[i]
                            });
                        }
                        _this.$scope.EventLabel = _this.$scope.Translations.MultiEventDay.replace(/\{0\}/g, dayInfo.EventProfileIds.length.toString());
                        _this.$scope.IsMultiEventDay = true;
                    }
                    else if (dayInfo.EventProfileTagIds.length > 0 && dayInfo.EventProfileIds.length > 0) {
                        var profileId = dayInfo.EventProfileIds[0];
                        var profileName = _.find(profiles, function (p) { return p.Id === profileId; }).Name;
                        _this.$scope.EventLabel = _this.$scope.Translations.SingleEventDay.replace(/\{0\}/g, profileName);
                        _this.$scope.AllEventsList = _this.$scope.EventLabel;
                        _this.$scope.IsMultiEventDay = false;
                    }
                    else {
                        _this.$scope.EventLabel = "";
                        _this.$scope.AllEventsList = "";
                        _this.$scope.IsMultiEventDay = false;
                    }
                });
            });
        };
        ForecastHeaderController.prototype.ShowAllEvents = function (title, messageText, confirmButtonText) {
            var _this = this;
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/AllEventsForDayDialog.html",
                controller: "Forecasting.AllEventsForDayController",
                resolve: {
                    date: function () {
                        return _this.$scope.CurrentDate;
                    },
                    eventData: function () {
                        return _this.eventData;
                    }
                }
            });
        };
        return ForecastHeaderController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("ForecastHeaderController", ForecastHeaderController, Core.NG.$typedScope(), Core.NG.$location, Core.$translation, Core.NG.$modal, Forecasting.Services.$eventService, Core.Constants);
    var ForecastHeader = (function () {
        function ForecastHeader() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/HeaderTemplate.html",
                controller: "Forecasting.ForecastHeaderController"
            };
        }
        return ForecastHeader;
    }());
    Core.NG.ForecastingModule.RegisterDirective("forecastHeader", ForecastHeader);
})(Forecasting || (Forecasting = {}));
