module Forecasting {
    "use strict";
        
    export class EventProfileController {
        private _user: Core.Auth.IUser;
        private _isDirty: boolean = false;
        private _calendarDateFormat: string = "ddd MMM DD YYYY";

        private Initialize() {
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

            this.$scope.Profile = <Api.Models.IEventProfile>{
                Id: 0,
                EntityId: 0,
                Name: "",
                Source: 1,
                History: [],
                Adjustments: null
            };
        }

        constructor(
            private $scope: IEventProfileControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private eventService: Services.IEventService,
            private profile: Forecasting.Api.Models.IEventProfile,
            private editMode: boolean,
            private noteMaxLength: number,
            private confirmationService: Core.IConfirmationService,
            private popupMessageService: Core.IPopupMessageService,
            private $authService: Core.Auth.IAuthService,
            private forecastingObjectService: Services.IForecastingObjectService
            ) {

            this.Initialize();

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.Forecasting;

                if ($scope.EditMode) {
                    eventService.GetEventProfiles().then((result: any): void => {
                        $scope.Profiles = result.data;
                    });
                }
            });

            $scope.MarkPageAsDirty = (): void => {
                this._isDirty = true;
            };

            $scope.MarkPageAsClean = (): void => {
                this._isDirty = false;
            };

            $scope.SelectEventProfile = (): void => {
                $scope.Profile = _.find($scope.Profiles, { Id: $scope.ProfileIdWrapper.Id });
                $scope.EventProfileSourceSelected.Source = $scope.Profile.Source;

                for (var index = 0; index < $scope.Profile.History.length; index++) {
                    var date = moment($scope.Profile.History[index].Date).toDate();
                    var dateString = moment(date).format(this._calendarDateFormat);
                    $scope.Profile.History[index].Date = dateString;
                }

                this.SortOccurrencesByDate($scope.Profile.History);
            };

            $scope.Cancel = (): void => {
                if (this._isDirty) {
                    confirmationService.Confirm( {
                        Title: this.$scope.Translation.ProfileCancelConfirmationTitle,
                        Message: this.$scope.Translation.ProfileCancelConfirmationMessage,
                        ConfirmText: this.$scope.Translation.ProfileCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then((result: boolean) : void => {
                            if (result) {
                                modalInstance.dismiss();
                            }
                        });
                } else {
                    modalInstance.dismiss();
                }
            };

            $scope.EnterAdjustments = (): void => {
                if ($scope.EditMode) {
                    $scope.NavigateToManualAdjustmentsGrid();
                } else {
                    eventService.DoesEventProfileNameExist($scope.Profile.Name).then((result: any): void => {
                        var profileNameIsTaken = (result.data);

                        if (profileNameIsTaken) {
                            $scope.MarkInvalidProfileName();
                        } else {
                            $scope.NavigateToManualAdjustmentsGrid();
                        }
                    });
                }
            };

            $scope.NavigateToManualAdjustmentsGrid = (): void => {
                modalInstance.dismiss();

                forecastingObjectService.EditEventAdjustments($scope.Profile)
                    .then((profile: Forecasting.Api.Models.IEventProfile): void => {
                        if (profile) {
                            $scope.SaveProfileFromGrid();
                        }
                    });
            };

            $scope.SaveProfileModalClick = (): void => {
                var saveResult = this.GetSaveProfilePromise();

                saveResult.success((): void => {
                    modalInstance.close();
                }).error((data: any, status: any): void => {
                    if (status === Core.HttpStatus.Conflict) {
                        $scope.MarkInvalidProfileName();
                    } else {
                        modalInstance.close();
                        popupMessageService.ShowError($scope.Translation.GenericErrorMessage);
                    }
                });
            };

            $scope.SaveProfileFromGrid = (): void=> {
                var saveResult = this.GetSaveProfilePromise();

                saveResult.success((): void=> {
                }).error((data: any, status: any): void=> {
                    if (status === Core.HttpStatus.Conflict) {
                        $scope.AlertInvalidProfileNameFromGrid();
                    } else {
                        popupMessageService.ShowError($scope.Translation.GenericErrorMessage);
                    }
                });
            };

            $scope.MarkInvalidProfileName = (): void => {
                $scope.InvalidProfileName = true;
                $scope.ErrorMessage = $scope.Translation.ProfileNameExists;
            };

            $scope.AlertInvalidProfileNameFromGrid = (): void => {
                popupMessageService.ShowError($scope.Translation.ProfileNameHasBeenCanceled);
            };

            $scope.DatePickerOptions = <Core.NG.IMxDayPickerOptions>{
                Date: $scope.Yesterday,
                DayOffset: 1,
                MonthOffset: 0,
                Max: $scope.Yesterday
            };

            $scope.UpdateMethod = (): void => {
                $scope.MarkPageAsDirty();
            };

            $scope.UpdateName = (): void => {
                $scope.InvalidProfileName = false;
                $scope.MarkPageAsDirty();                
            };

            $scope.OnDatePickerChange = (selectedDate: Date): void => {
                $scope.SelectedDate = selectedDate;
            };

            $scope.AddPastOccurrence = (date: Date): void => {
                var newPastOccurrence = <Forecasting.Api.Models.IEventProfileHistory>{
                    Date: date.toDateString(),
                    Note: ""
                };
                
                for (var index = 0; index < $scope.Profile.History.length; index++) {
                    if ($scope.Profile.History[index].Date === newPastOccurrence.Date) {
                        return;
                    }
                }

                $scope.Profile.History.push(newPastOccurrence);

                this.SortOccurrencesByDate($scope.Profile.History);

                this.RemoveAllButFiveMostRecentOccurrences($scope.Profile.History);

                $scope.MarkPageAsDirty();
            };

            $scope.RemovePastOccurrence = (date: Date): void => {
                for (var index = 0; index < $scope.Profile.History.length; index++) {
                    var dateString = moment(date).format(this._calendarDateFormat);
                    if ($scope.Profile.History[index].Date === dateString) {
                        $scope.Profile.History.splice(index, 1);
                        break;
                    }
                }
                $scope.MarkPageAsDirty();
            };
        }

        GetSaveProfilePromise(): ng.IHttpPromise<{}> {
            var saveResult;
            this.$scope.Profile.EntityId = this._user.BusinessUser.MobileSettings.EntityId;
            this.$scope.Profile.Source = this.$scope.EventProfileSourceSelected.Source;
            saveResult = this.eventService.SaveProfile(this.$scope.Profile).success((): void => { return; });
            return saveResult;
        }

        SortProfilesAlphabetically(profiles: Array<Forecasting.Api.Models.IEventProfile>): void {
            profiles.sort(
                (profile1: Forecasting.Api.Models.IEventProfile,
                    profile2: Forecasting.Api.Models.IEventProfile): number => {

                var name1: string = profile1.Name.toString().toUpperCase(),
                    name2: string = profile2.Name.toString().toUpperCase(),
                    returnValue: number;

                if (name1 < name2) {
                    returnValue = -1;
                } else if (name1 > name2) {
                    returnValue = 1;
                } else {
                    returnValue = 0;
                }

                return returnValue;
            });
        }

        SortOccurrencesByDate(occurrences: Array<Forecasting.Api.Models.IEventProfileHistory>): void {
            occurrences.sort((occurrence1: Forecasting.Api.Models.IEventProfileHistory,
                occurrence2: Forecasting.Api.Models.IEventProfileHistory): number => {
                return moment(occurrence2.Date).valueOf() - moment(occurrence1.Date).valueOf();
            });
        }

        RemoveAllButFiveMostRecentOccurrences(occurrences: Array<Forecasting.Api.Models.IEventProfileHistory>): void {
            if (occurrences.length > 5) {
                occurrences.splice(5, occurrences.length - 5);
            }
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("EventProfileController", EventProfileController,
        Core.NG.$typedScope<IEventProfileControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Forecasting.Services.$eventService,
        Core.NG.$typedCustomResolve<Forecasting.Api.Models.IEventProfile>("Profile"),
        Core.NG.$typedCustomResolve<boolean>("Edit"),
        Core.NG.$typedCustomResolve<number>("NoteMaxLength"),
        Core.$confirmationService,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Forecasting.Services.$forecastingObjectService
        );
}