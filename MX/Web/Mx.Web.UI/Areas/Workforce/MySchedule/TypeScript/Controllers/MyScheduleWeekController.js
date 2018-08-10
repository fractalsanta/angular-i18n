var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var datePartCompareFormat = "YYMMDD";
        var usedColorCodes = {};
        var visibleDayHeaders = {};
        var calculatedDailyHours = {};
        var calculatedTotalHours;
        var ColorCode;
        (function (ColorCode) {
            ColorCode[ColorCode["Blue"] = 0] = "Blue";
            ColorCode[ColorCode["Purple"] = 1] = "Purple";
            ColorCode[ColorCode["Red"] = 2] = "Red";
            ColorCode[ColorCode["Green"] = 3] = "Green";
            ColorCode[ColorCode["Yellow"] = 4] = "Yellow";
            ColorCode[ColorCode["Brown"] = 5] = "Brown";
            ColorCode[ColorCode["Pink"] = 6] = "Pink";
            ColorCode[ColorCode["Gray"] = 7] = "Gray";
            ColorCode[ColorCode["DarkRed"] = 8] = "DarkRed";
            ColorCode[ColorCode["Silver"] = 9] = "Silver";
            ColorCode[ColorCode["PowederBlue"] = 10] = "PowederBlue";
            ColorCode[ColorCode["Coral"] = 11] = "Coral";
        })(ColorCode || (ColorCode = {}));
        var MyScheduleWeekController = (function () {
            function MyScheduleWeekController($scope, authService, myScheduleService, translationService, popupMessageService, $modal, dateService, constants, layoutService) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.myScheduleService = myScheduleService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.$modal = $modal;
                this.dateService = dateService;
                this.constants = constants;
                this.layoutService = layoutService;
                $scope.vm.Loaded = false;
                $scope.ChangeDates = function (startDate, endDate) {
                    $scope.vm.Loaded = false;
                    $scope.vm.DatesString = moment(startDate).format("LL") + " - " + moment(endDate).format("LL");
                    myScheduleService.GetShiftsByDateRange(moment(startDate), moment(endDate)).then(function (response) {
                        _this.ResetCalculatedfields();
                        $scope.vm.Schedule = response;
                        $scope.vm.Loaded = true;
                    });
                };
                dateService.StartOfWeek(moment()).then(function (day) {
                    $scope.ChangeDates(day.toDate(), moment(day).add({ days: 6 }).toDate());
                });
                $scope.$on("$stateChangeSuccess", function () { return _this.layoutService.SetMobileReady(true); });
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceMySchedule;
                    popupMessageService.SetPageTitle($scope.L10N.MySchedule);
                });
                $scope.SetSelectedShift = function (index) {
                    myScheduleService.SetSelectedShift($scope.vm.Schedule[index]);
                };
                $scope.ShowDayHeader = function (index) {
                    if (!visibleDayHeaders.hasOwnProperty(index.toString())) {
                        if (index) {
                            var currShift = $scope.vm.Schedule[index];
                            var prevShift = $scope.vm.Schedule[index - 1];
                            if (moment(currShift.StartDateTime).format(datePartCompareFormat) === moment(prevShift.StartDateTime).format(datePartCompareFormat)) {
                                visibleDayHeaders[index] = false;
                            }
                            else {
                                visibleDayHeaders[index] = true;
                            }
                        }
                        else {
                            visibleDayHeaders[index] = true;
                        }
                    }
                    return visibleDayHeaders[index];
                };
                $scope.IsTimeOff = function (index) {
                    return $scope.vm.Schedule[index].IsTimeOffRequest;
                };
                $scope.GetTimeOffStatus = function (index) { return myScheduleService.GetTimeOffStatus($scope.vm.Schedule[index], $scope.L10N); };
                $scope.GetTimeOffHours = function (index) {
                    if (moment($scope.vm.Schedule[index].StartDateTime).diff(moment($scope.vm.Schedule[index].EndDateTime), "hours") == -24) {
                        return $scope.L10N.ScheduleAllDay;
                    }
                    else {
                        return moment($scope.vm.Schedule[index].StartDateTime).format("LT") + " - " + moment($scope.vm.Schedule[index].EndDateTime).format("LT");
                    }
                };
                $scope.GetColorCode = function (calEntry) {
                    if (!calEntry.IsTimeOffRequest) {
                        if (!usedColorCodes.hasOwnProperty(calEntry.EntityId.toString())) {
                            var lastUsedColor = -1;
                            $.each(usedColorCodes, function (prop, value) {
                                if (value >= lastUsedColor) {
                                    lastUsedColor = value;
                                }
                            });
                            usedColorCodes[calEntry.EntityId] = ++lastUsedColor;
                        }
                        return ColorCode[usedColorCodes[calEntry.EntityId]] || "black";
                    }
                    else {
                        return "transparent";
                    }
                };
                $scope.GetDailyHours = function (startDate) {
                    var currDate = moment(startDate).format(datePartCompareFormat);
                    if (!calculatedDailyHours.hasOwnProperty(currDate)) {
                        var filtered = _.where($scope.vm.Schedule, function (shift) { return !shift.IsTimeOffRequest && moment(shift.StartDateTime).format(datePartCompareFormat) === currDate; });
                        var dailyTime = _.reduce(filtered, function (acc, shift) { return acc + moment(shift.EndDateTime).diff(moment(shift.StartDateTime), "minutes"); }, 0);
                        if (dailyTime > 0) {
                            calculatedDailyHours[currDate] = dailyTime > 60 ? Math.floor(dailyTime / 60) + $scope.L10N.Hours + " " + (dailyTime % 60) + $scope.L10N.Minutes : dailyTime + $scope.L10N.Minutes;
                        }
                        else {
                            calculatedDailyHours[currDate] = "";
                        }
                    }
                    return calculatedDailyHours[currDate];
                };
                $scope.GetTotalHours = function () {
                    if (!calculatedTotalHours) {
                        if ($scope.vm.Schedule && $scope.vm.Schedule.length) {
                            var total = 0;
                            for (var i = 0; i < $scope.vm.Schedule.length; i++) {
                                if (!$scope.vm.Schedule[i].IsTimeOffRequest) {
                                    total += moment($scope.vm.Schedule[i].EndDateTime).diff(moment($scope.vm.Schedule[i].StartDateTime), "minutes");
                                }
                            }
                            calculatedTotalHours = total > 60 ? Math.floor(total / 60) + $scope.L10N.Hours + " " + (total % 60) + $scope.L10N.Minutes : total + $scope.L10N.Minutes;
                        }
                    }
                    return calculatedTotalHours;
                };
                $scope.AnyShifts = function () {
                    return _.some($scope.vm.Schedule, function (s) { return !s.IsTimeOffRequest; });
                };
                $scope.ShareScheduleRange = function () {
                    $modal.open({
                        templateUrl: "Areas/Workforce/MySchedule/Templates/ShareSchedule.html",
                        controller: "Workforce.MySchedule.ShareScheduleController",
                        resolve: {
                            isSingleShift: function () {
                                return false;
                            }
                        }
                    });
                };
            }
            MyScheduleWeekController.prototype.ResetCalculatedfields = function () {
                usedColorCodes = {};
                visibleDayHeaders = {};
                calculatedDailyHours = {};
                calculatedTotalHours = null;
            };
            return MyScheduleWeekController;
        }());
        MySchedule.myScheduleWeekController = Core.NG.WorkforceMyScheduleModule.RegisterNamedController("MyScheduleWeekController", MyScheduleWeekController, Core.NG.$typedScope(), Core.Auth.$authService, MySchedule.myScheduleService, Core.$translation, Core.$popupMessageService, Core.NG.$modal, Core.Date.$dateService, Core.Constants, Core.layoutService);
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
