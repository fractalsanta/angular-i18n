var Workforce;
(function (Workforce) {
    var MyTimeOff;
    (function (MyTimeOff) {
        "use strict";
        var MyTimeOffController = (function () {
            function MyTimeOffController($scope, translationService, popupMessageService, myTimeOffService, timeOffReasonService, confirmation, notification, $location, constants, $modal) {
                var _this = this;
                this.$scope = $scope;
                this.popupMessageService = popupMessageService;
                this.myTimeOffService = myTimeOffService;
                this.timeOffReasonService = timeOffReasonService;
                this.confirmation = confirmation;
                this.notification = notification;
                this.$modal = $modal;
                this._inDiscard = false;
                $scope.InDetailMode = false;
                $scope.InAddMode = false;
                $scope.AddNewRequest = function () {
                    var tomorrow = _this.GetDateAtMidnight(moment().toDate()).add("d", 1).toDate(), defaultReasonId = "";
                    for (var reasonId in $scope.TimeOffReasons) {
                        defaultReasonId = reasonId;
                        break;
                    }
                    $scope.NewRequest = {
                        AllDay: true,
                        StartDateTime: tomorrow,
                        EndDateTime: tomorrow,
                        ReasonId: defaultReasonId,
                        Comments: "",
                        StartDateLimit: tomorrow,
                        DateLimit: tomorrow,
                        ShowStartDateDisplay: false,
                        ShowEndDateDisplay: false
                    };
                    $scope.InAddMode = true;
                    $scope.InDetailMode = true;
                };
                $scope.DiscardNewRequest = function () {
                    var promise = confirmation.Confirm({
                        Title: $scope.Translations.DiscardRequestConfirmation,
                        Message: $scope.Translations.DiscardTimeOffRequest,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        ConfirmText: $scope.Translations.Confirm
                    });
                    promise.then(function () {
                        $scope.InAddMode = false;
                        $scope.ResetDetailMode();
                    }, function () {
                        _this._inDiscard = false;
                    });
                    _this._inDiscard = true;
                    return promise;
                };
                $scope.SubmitRequest = function (request) {
                    var startTime = request.StartDateTime, endTime = request.EndDateTime;
                    if (!request.AllDay && startTime === endTime) {
                        popupMessageService.ShowWarning($scope.Translations.StartAndEndTimeCannotBeTheSame);
                        return;
                    }
                    if (request.AllDay) {
                        startTime = _this.GetDateAtMidnight(startTime).toDate();
                        endTime = _this.GetDateAtMidnight(endTime).toDate();
                    }
                    var start = moment(startTime);
                    var end = moment(endTime);
                    var hours;
                    if (request.AllDay) {
                        hours = 0;
                    }
                    else {
                        hours = end.diff(start) / 60 / 60 / 1000;
                    }
                    var newRequest = {
                        StartDateTime: start.format(constants.InternalDateTimeFormat),
                        EndDateTime: end.format(constants.InternalDateTimeFormat),
                        ReasonId: Number(request.ReasonId),
                        Comments: request.Comments,
                        Hours: hours
                    };
                    myTimeOffService.PostNewRequest(newRequest).success(function (result) {
                        if (result.Successful) {
                            _this.GetFutureTimeOffRequests();
                            $scope.NewRequest = null;
                            $scope.InAddMode = false;
                            $scope.ResetDetailMode();
                        }
                        else {
                            popupMessageService.ShowError($scope.Translations[result.Message]);
                        }
                    });
                };
                $scope.ViewRequest = function (request) {
                    if ($scope.InAddMode) {
                        $scope.DiscardNewRequest().then(function () {
                            $scope.ViewRequest(request);
                        });
                        return;
                    }
                    $scope.SelectedRequest = request;
                    $scope.InDetailMode = true;
                };
                $scope.ResetDetailMode = function () {
                    $scope.InDetailMode = false;
                };
                $scope.RemoveRequest = function (request) {
                    confirmation.Confirm({
                        Title: $scope.Translations.RemoveRequestConfirmation,
                        Message: $scope.Translations.RemoveTimeOffRequest,
                        ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                        ConfirmText: $scope.Translations.Remove
                    }).then(function () {
                        myTimeOffService.PostCancelRequest(request.RequestId).success(function () {
                            popupMessageService.ShowSuccess($scope.Translations.RequestRemoved);
                            $scope.ResetDetailMode();
                            _this.GetFutureTimeOffRequests();
                        });
                    });
                };
                $scope.SetAllDayFlag = function (flag) {
                    if ($scope.NewRequest) {
                        $scope.NewRequest.AllDay = flag;
                    }
                };
                $scope.ToggleStartDateDisplay = function (e) {
                    $scope.Model.Date = $scope.NewRequest.StartDateTime;
                    _this.OpenDatePicker();
                    $scope.SettingStart = true;
                    $scope.NewRequest.DateLimit = $scope.NewRequest.StartDateLimit;
                    if ($scope.NewRequest) {
                        $scope.NewRequest.ShowStartDateDisplay = !$scope.NewRequest.ShowStartDateDisplay;
                        $scope.NewRequest.ShowEndDateDisplay = false;
                    }
                };
                $scope.SetDate = function (date) {
                    if ($scope.SettingStart) {
                        if (date < $scope.NewRequest.StartDateLimit)
                            date = $scope.NewRequest.StartDateLimit;
                        $scope.NewRequest.StartDateTime = date;
                        if ($scope.NewRequest.EndDateTime < date)
                            $scope.NewRequest.EndDateTime = date;
                    }
                    else {
                        if (date < $scope.NewRequest.StartDateTime)
                            date = $scope.NewRequest.StartDateTime;
                        $scope.NewRequest.EndDateTime = date;
                    }
                    $scope.ModalInstance.close();
                };
                $scope.ToggleEndDateDisplay = function () {
                    $scope.Model.Date = $scope.NewRequest.EndDateTime;
                    $scope.SettingStart = false;
                    _this.OpenDatePicker();
                    $scope.NewRequest.DateLimit = $scope.NewRequest.StartDateTime;
                    if ($scope.NewRequest) {
                        $scope.NewRequest.ShowEndDateDisplay = !$scope.NewRequest.ShowEndDateDisplay;
                        $scope.NewRequest.ShowStartDateDisplay = false;
                    }
                };
                $scope.IsRequestPending = function (request) {
                    return (request.Status === Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Requested);
                };
                $scope.IsRequestForAllDay = function (request) {
                    var startDate = moment(request.StartDateTime), endDate = moment(request.EndDateTime);
                    return (startDate.hours() === 0 && endDate.hours() === 0);
                };
                $scope.IsRequestForMultipleDays = function (request) {
                    var startDate = _this.GetDateAtMidnight(moment(request.StartDateTime).toDate()), endDate = _this.GetDateAtMidnight(moment(request.EndDateTime).toDate());
                    return (startDate.diff(endDate) !== 0);
                };
                $scope.GetStatusTranslation = function (requestStatus) {
                    switch (requestStatus) {
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Approved:
                            return $scope.Translations.Approved;
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Declined:
                            return $scope.Translations.Denied;
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Requested:
                            return $scope.Translations.Pending;
                        default:
                            return "";
                    }
                };
                $scope.GetStatusIconClass = function (requestStatus) {
                    switch (requestStatus) {
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Approved:
                            return "fa-check";
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Declined:
                            return "fa-ban";
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Requested:
                            return "fa-clock-o";
                        default:
                            return "";
                    }
                };
                $scope.GetStatusIconColor = function (requestStatus) {
                    switch (requestStatus) {
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Approved:
                            return "green";
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Declined:
                            return "red";
                        case Workforce.MySchedule.Api.Models.TimeOffRequestStatus.Requested:
                            return "orange";
                        default:
                            return "";
                    }
                };
                $scope.GetAllDayRequestEndDate = function (request) {
                    return moment(request.EndDateTime).toDate();
                };
                $scope.OnStartDateTimeChange = function (newDate) {
                    if ($scope.NewRequest && newDate !== null) {
                        if ($scope.NewRequest.StartDateLimit > newDate) {
                            newDate = $scope.NewRequest.StartDateLimit;
                            $scope.NewRequest.StartDateTime = newDate;
                        }
                        if ($scope.NewRequest.EndDateTime < newDate) {
                            $scope.NewRequest.EndDateTime = newDate;
                        }
                    }
                };
                $scope.OnEndDateTimeChange = function (newDate) {
                    if ($scope.NewRequest && newDate !== null) {
                        if ($scope.NewRequest.StartDateTime > newDate) {
                            $scope.NewRequest.EndDateTime = $scope.NewRequest.StartDateTime;
                        }
                    }
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.WorkforceMyTimeOff;
                    popupMessageService.SetPageTitle($scope.Translations.MyTimeOff);
                    if (!$scope.ModalInstance) {
                        _this.GetFutureTimeOffRequests();
                    }
                });
                $scope.$on("$locationChangeStart", function (e, newUrl) {
                    var targetPath = newUrl.split("#");
                    if ($scope.InAddMode && targetPath.length > 1) {
                        if (!_this._inDiscard) {
                            $scope.DiscardNewRequest().then(function () {
                                $location.path(targetPath[1]);
                            });
                        }
                        e.preventDefault();
                    }
                });
            }
            MyTimeOffController.prototype.OpenDatePicker = function () {
                this.$scope.NewRequest.DateLimit = new Date();
                this.$scope.ModalInstance = this.$modal.open({
                    templateUrl: 'timeOffDatePicker.html',
                    controller: MyTimeOffController,
                    windowClass: "datepicker",
                    scope: this.$scope
                });
            };
            MyTimeOffController.prototype.GetFutureTimeOffRequests = function () {
                var _this = this;
                this.myTimeOffService.GetFutureTimeOffRequests().success(function (result) {
                    _this.$scope.SelectedRequest = null;
                    _this.$scope.TimeOffRequests = result;
                });
                this.timeOffReasonService.GetReasons().success(function (results) {
                    _this.$scope.TimeOffReasons = results;
                });
            };
            MyTimeOffController.prototype.GetDateAtMidnight = function (currentDate) {
                return moment(currentDate).hours(0).minutes(0).seconds(0).milliseconds(0);
            };
            return MyTimeOffController;
        }());
        Core.NG.WorkforceMyTimeOffModule.RegisterRouteController("", "Templates/MyTimeOff.html", MyTimeOffController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Workforce.MySchedule.Api.$myTimeOffService, MyTimeOff.Api.$timeOffReasonService, Core.$confirmationService, Core.$popupMessageService, Core.NG.$location, Core.Constants, Core.NG.$modal);
    })(MyTimeOff = Workforce.MyTimeOff || (Workforce.MyTimeOff = {}));
})(Workforce || (Workforce = {}));
