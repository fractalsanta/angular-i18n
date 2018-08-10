module Forecasting {
    "use strict";

    interface IScheduleEventControllerScope extends ng.IScope {
        Cancel(): void;
        Save(): void;

        Translation: Forecasting.Api.Models.ITranslations;
        NoteMaxLength: number;
        DatePickerOptions: Core.NG.IMxDayPickerOptions;
        OnDatePickerChange(selectedDate: Date): void;
        Profiles: any[];
        Profile: any;
        NewTag: Api.Models.IEventProfileTag;
        ScheduleConflict: boolean;
        ScheduleConflictErrorMessage: string;
        SelectedEventTag: IMyEventTag;
    }

    class ScheduleEventController {
        constructor(
            private $scope: IScheduleEventControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private eventService: Services.IEventService,
            private popupMessageService: Core.IPopupMessageService,
            private constants: Core.IConstants,
            private date: Date,
            private noteMaxLength: number,
            private eventTag: IMyEventTag
            ) {
            $scope.SelectedEventTag = eventTag;
            $scope.NoteMaxLength = noteMaxLength;
            $scope.ScheduleConflict = false;
            $scope.ScheduleConflictErrorMessage = "";

            if (moment(date) < eventService.Today) {
                date = eventService.Today.toDate();
            }

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations) => {
                $scope.Translation = result.Forecasting;
            });

            $scope.Cancel = () => modalInstance.dismiss();
            $scope.Save = (): void => {
                if ($scope.SelectedEventTag != null) {
                    eventService.ScheduleEventUpdate($scope.NewTag).then(
                        () => {
                            modalInstance.close();
                            popupMessageService.ShowSuccess($scope.Translation.EventHasBeenUpdated);

                        },
                        (result) => this.HandleEventCreateUpdateFailure(result)
                    );
                } else {
                    eventService.ScheduleEventCreate($scope.NewTag).then(
                        () => {
                            modalInstance.close();
                            popupMessageService.ShowSuccess($scope.Translation.EventHasBeenScheduled);

                        },
                        (result) => this.HandleEventCreateUpdateFailure(result)
                        );
                    
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

            eventService.GetEventProfiles().then((result: any): void => {
                $scope.Profiles = result.data;

                $scope.Profile = _.find($scope.Profiles, { Id: $scope.NewTag.EventProfileId });
            });

            $scope.OnDatePickerChange = (d: Date) => {
                $scope.ScheduleConflict = false;
                $scope.NewTag.Date = this.ConvertDate(d);
            };

            $scope.$watch("NewTag.EventProfileId", newValue => {
                $scope.ScheduleConflict = false;
                if ($scope.Profiles) {
                    $scope.Profile = _.find($scope.Profiles, { Id: newValue } );
                }
            });
        }

        private HandleEventCreateUpdateFailure(result: ng.IHttpPromiseCallbackArg<Mx.Web.UI.Config.WebApi.IErrorMessage>) {
            if (result.status === Core.HttpStatus.Conflict) {
                this.$scope.ScheduleConflict = true;
                this.$scope.ScheduleConflictErrorMessage = result.data.Message;
            } else {
                this.modalInstance.close();
                this.popupMessageService.ShowError(this.$scope.Translation.ScheduleEventSubmitFail);
            }
        }

        private ConvertDate(date: Date): string {
            return moment(date).format(this.constants.InternalDateTimeFormat);
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("ScheduleEventController", ScheduleEventController,
        Core.NG.$typedScope<IScheduleEventControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Forecasting.Services.$eventService,
        Core.$popupMessageService,
        Core.Constants,
        Core.NG.$typedCustomResolve<Date>("Date"),
        Core.NG.$typedCustomResolve<Number>("NoteMaxLength"),
        Core.NG.$typedCustomResolve<IMyEventTag>("EventTag")
        );
}