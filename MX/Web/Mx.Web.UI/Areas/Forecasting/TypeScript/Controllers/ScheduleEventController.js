var Forecasting;
(function (Forecasting) {
    "use strict";
    var ScheduleEventController = (function () {
        function ScheduleEventController($scope, modalInstance, translationService, eventService, popupMessageService, constants, date, noteMaxLength, eventTag) {
            var _this = this;
            this.$scope = $scope;
            this.modalInstance = modalInstance;
            this.translationService = translationService;
            this.eventService = eventService;
            this.popupMessageService = popupMessageService;
            this.constants = constants;
            this.date = date;
            this.noteMaxLength = noteMaxLength;
            this.eventTag = eventTag;
            $scope.SelectedEventTag = eventTag;
            $scope.NoteMaxLength = noteMaxLength;
            $scope.ScheduleConflict = false;
            $scope.ScheduleConflictErrorMessage = "";
            if (moment(date) < eventService.Today) {
                date = eventService.Today.toDate();
            }
            translationService.GetTranslations().then(function (result) {
                $scope.Translation = result.Forecasting;
            });
            $scope.Cancel = function () { return modalInstance.dismiss(); };
            $scope.Save = function () {
                if ($scope.SelectedEventTag != null) {
                    eventService.ScheduleEventUpdate($scope.NewTag).then(function () {
                        modalInstance.close();
                        popupMessageService.ShowSuccess($scope.Translation.EventHasBeenUpdated);
                    }, function (result) { return _this.HandleEventCreateUpdateFailure(result); });
                }
                else {
                    eventService.ScheduleEventCreate($scope.NewTag).then(function () {
                        modalInstance.close();
                        popupMessageService.ShowSuccess($scope.Translation.EventHasBeenScheduled);
                    }, function (result) { return _this.HandleEventCreateUpdateFailure(result); });
                }
            };
            $scope.DatePickerOptions = {
                Date: date,
                DayOffset: 1,
                MonthOffset: 0,
                Min: this.eventService.Today.toDate()
            };
            $scope.NewTag = {
                Id: $scope.SelectedEventTag ? $scope.SelectedEventTag.TagId : 0,
                Date: this.ConvertDate(date),
                EventProfileId: $scope.SelectedEventTag ? $scope.SelectedEventTag.ProfileId : undefined,
                Note: $scope.SelectedEventTag ? $scope.SelectedEventTag.Note : "",
                EventProfile: null
            };
            $scope.Profiles = [];
            $scope.Profile = null;
            eventService.GetEventProfiles().then(function (result) {
                $scope.Profiles = result.data;
                $scope.Profile = _.find($scope.Profiles, { Id: $scope.NewTag.EventProfileId });
            });
            $scope.OnDatePickerChange = function (d) {
                $scope.ScheduleConflict = false;
                $scope.NewTag.Date = _this.ConvertDate(d);
            };
            $scope.$watch("NewTag.EventProfileId", function (newValue) {
                $scope.ScheduleConflict = false;
                if ($scope.Profiles) {
                    $scope.Profile = _.find($scope.Profiles, { Id: newValue });
                }
            });
        }
        ScheduleEventController.prototype.HandleEventCreateUpdateFailure = function (result) {
            if (result.status === Core.HttpStatus.Conflict) {
                this.$scope.ScheduleConflict = true;
                this.$scope.ScheduleConflictErrorMessage = result.data.Message;
            }
            else {
                this.modalInstance.close();
                this.popupMessageService.ShowError(this.$scope.Translation.ScheduleEventSubmitFail);
            }
        };
        ScheduleEventController.prototype.ConvertDate = function (date) {
            return moment(date).format(this.constants.InternalDateTimeFormat);
        };
        return ScheduleEventController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("ScheduleEventController", ScheduleEventController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Forecasting.Services.$eventService, Core.$popupMessageService, Core.Constants, Core.NG.$typedCustomResolve("Date"), Core.NG.$typedCustomResolve("NoteMaxLength"), Core.NG.$typedCustomResolve("EventTag"));
})(Forecasting || (Forecasting = {}));
