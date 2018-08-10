var Forecasting;
(function (Forecasting) {
    "use strict";
    var EventProfileController = (function () {
        function EventProfileController($scope, modalInstance, translationService, eventService, profile, editMode, noteMaxLength, confirmationService, popupMessageService, $authService, forecastingObjectService) {
            var _this = this;
            this.$scope = $scope;
            this.modalInstance = modalInstance;
            this.translationService = translationService;
            this.eventService = eventService;
            this.profile = profile;
            this.editMode = editMode;
            this.noteMaxLength = noteMaxLength;
            this.confirmationService = confirmationService;
            this.popupMessageService = popupMessageService;
            this.$authService = $authService;
            this.forecastingObjectService = forecastingObjectService;
            this._isDirty = false;
            this._calendarDateFormat = "ddd MMM DD YYYY";
            this.Initialize();
            translationService.GetTranslations().then(function (result) {
                $scope.Translation = result.Forecasting;
                if ($scope.EditMode) {
                    eventService.GetEventProfiles().then(function (result) {
                        $scope.Profiles = result.data;
                    });
                }
            });
            $scope.MarkPageAsDirty = function () {
                _this._isDirty = true;
            };
            $scope.MarkPageAsClean = function () {
                _this._isDirty = false;
            };
            $scope.SelectEventProfile = function () {
                $scope.Profile = _.find($scope.Profiles, { Id: $scope.ProfileIdWrapper.Id });
                $scope.EventProfileSourceSelected.Source = $scope.Profile.Source;
                for (var index = 0; index < $scope.Profile.History.length; index++) {
                    var date = moment($scope.Profile.History[index].Date).toDate();
                    var dateString = moment(date).format(_this._calendarDateFormat);
                    $scope.Profile.History[index].Date = dateString;
                }
                _this.SortOccurrencesByDate($scope.Profile.History);
            };
            $scope.Cancel = function () {
                if (_this._isDirty) {
                    confirmationService.Confirm({
                        Title: _this.$scope.Translation.ProfileCancelConfirmationTitle,
                        Message: _this.$scope.Translation.ProfileCancelConfirmationMessage,
                        ConfirmText: _this.$scope.Translation.ProfileCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(function (result) {
                        if (result) {
                            modalInstance.dismiss();
                        }
                    });
                }
                else {
                    modalInstance.dismiss();
                }
            };
            $scope.EnterAdjustments = function () {
                if ($scope.EditMode) {
                    $scope.NavigateToManualAdjustmentsGrid();
                }
                else {
                    eventService.DoesEventProfileNameExist($scope.Profile.Name).then(function (result) {
                        var profileNameIsTaken = (result.data);
                        if (profileNameIsTaken) {
                            $scope.MarkInvalidProfileName();
                        }
                        else {
                            $scope.NavigateToManualAdjustmentsGrid();
                        }
                    });
                }
            };
            $scope.NavigateToManualAdjustmentsGrid = function () {
                modalInstance.dismiss();
                forecastingObjectService.EditEventAdjustments($scope.Profile)
                    .then(function (profile) {
                    if (profile) {
                        $scope.SaveProfileFromGrid();
                    }
                });
            };
            $scope.SaveProfileModalClick = function () {
                var saveResult = _this.GetSaveProfilePromise();
                saveResult.success(function () {
                    modalInstance.close();
                }).error(function (data, status) {
                    if (status === Core.HttpStatus.Conflict) {
                        $scope.MarkInvalidProfileName();
                    }
                    else {
                        modalInstance.close();
                        popupMessageService.ShowError($scope.Translation.GenericErrorMessage);
                    }
                });
            };
            $scope.SaveProfileFromGrid = function () {
                var saveResult = _this.GetSaveProfilePromise();
                saveResult.success(function () {
                }).error(function (data, status) {
                    if (status === Core.HttpStatus.Conflict) {
                        $scope.AlertInvalidProfileNameFromGrid();
                    }
                    else {
                        popupMessageService.ShowError($scope.Translation.GenericErrorMessage);
                    }
                });
            };
            $scope.MarkInvalidProfileName = function () {
                $scope.InvalidProfileName = true;
                $scope.ErrorMessage = $scope.Translation.ProfileNameExists;
            };
            $scope.AlertInvalidProfileNameFromGrid = function () {
                popupMessageService.ShowError($scope.Translation.ProfileNameHasBeenCanceled);
            };
            $scope.DatePickerOptions = {
                Date: $scope.Yesterday,
                DayOffset: 1,
                MonthOffset: 0,
                Max: $scope.Yesterday
            };
            $scope.UpdateMethod = function () {
                $scope.MarkPageAsDirty();
            };
            $scope.UpdateName = function () {
                $scope.InvalidProfileName = false;
                $scope.MarkPageAsDirty();
            };
            $scope.OnDatePickerChange = function (selectedDate) {
                $scope.SelectedDate = selectedDate;
            };
            $scope.AddPastOccurrence = function (date) {
                var newPastOccurrence = {
                    Date: date.toDateString(),
                    Note: ""
                };
                for (var index = 0; index < $scope.Profile.History.length; index++) {
                    if ($scope.Profile.History[index].Date === newPastOccurrence.Date) {
                        return;
                    }
                }
                $scope.Profile.History.push(newPastOccurrence);
                _this.SortOccurrencesByDate($scope.Profile.History);
                _this.RemoveAllButFiveMostRecentOccurrences($scope.Profile.History);
                $scope.MarkPageAsDirty();
            };
            $scope.RemovePastOccurrence = function (date) {
                for (var index = 0; index < $scope.Profile.History.length; index++) {
                    var dateString = moment(date).format(_this._calendarDateFormat);
                    if ($scope.Profile.History[index].Date === dateString) {
                        $scope.Profile.History.splice(index, 1);
                        break;
                    }
                }
                $scope.MarkPageAsDirty();
            };
        }
        EventProfileController.prototype.Initialize = function () {
            this._user = this.$authService.GetUser();
            this.$scope.NoteMaxLength = this.noteMaxLength;
            this.$scope.Yesterday = new Date();
            this.$scope.Yesterday.setDate(this.$scope.Yesterday.getDate() - 1);
            this.$scope.SelectedDate = this.$scope.Yesterday;
            this.$scope.EditMode = this.editMode;
            this.$scope.InvalidProfileName = false;
            this.$scope.ProfileIdWrapper = {
                Id: 0
            };
            this.$scope.EventProfileSourceSelected = {
                Source: 0
            };
            this.$scope.Profile = {
                Id: 0,
                EntityId: 0,
                Name: "",
                Source: 1,
                History: [],
                Adjustments: null
            };
        };
        EventProfileController.prototype.GetSaveProfilePromise = function () {
            var saveResult;
            this.$scope.Profile.EntityId = this._user.BusinessUser.MobileSettings.EntityId;
            this.$scope.Profile.Source = this.$scope.EventProfileSourceSelected.Source;
            saveResult = this.eventService.SaveProfile(this.$scope.Profile).success(function () { return; });
            return saveResult;
        };
        EventProfileController.prototype.SortProfilesAlphabetically = function (profiles) {
            profiles.sort(function (profile1, profile2) {
                var name1 = profile1.Name.toString().toUpperCase(), name2 = profile2.Name.toString().toUpperCase(), returnValue;
                if (name1 < name2) {
                    returnValue = -1;
                }
                else if (name1 > name2) {
                    returnValue = 1;
                }
                else {
                    returnValue = 0;
                }
                return returnValue;
            });
        };
        EventProfileController.prototype.SortOccurrencesByDate = function (occurrences) {
            occurrences.sort(function (occurrence1, occurrence2) {
                return moment(occurrence2.Date).valueOf() - moment(occurrence1.Date).valueOf();
            });
        };
        EventProfileController.prototype.RemoveAllButFiveMostRecentOccurrences = function (occurrences) {
            if (occurrences.length > 5) {
                occurrences.splice(5, occurrences.length - 5);
            }
        };
        return EventProfileController;
    }());
    Forecasting.EventProfileController = EventProfileController;
    Core.NG.ForecastingModule.RegisterNamedController("EventProfileController", EventProfileController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Forecasting.Services.$eventService, Core.NG.$typedCustomResolve("Profile"), Core.NG.$typedCustomResolve("Edit"), Core.NG.$typedCustomResolve("NoteMaxLength"), Core.$confirmationService, Core.$popupMessageService, Core.Auth.$authService, Forecasting.Services.$forecastingObjectService);
})(Forecasting || (Forecasting = {}));
