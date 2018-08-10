module Forecasting {

    export class EventDetailsController {

        private _firstDate: Date;

        constructor(
            private scope: IEventDetailsControllerScope,
            private $state: ng.ui.IStateService,
            private $modal: ng.ui.bootstrap.IModalService,
            private eventService: Services.IEventService,
            private popupMessageService: Core.IPopupMessageService,
            private confirmService: Core.IConfirmationService,
            private constants: Core.IConstants,
            private translation: Core.ITranslationService) {

            this.Initialize();

            this.eventService.EventTagHasBeenChanged.Subscribe(() => {
                scope.EditCancel();
            });
            this.eventService.EventProfilesHaveBeenChanged.Subscribe(() => {
                this.LoadProfiles();
            });

            scope.GetSelectedProfile = () => {
                if (!scope.Model.IsEdit || !scope.Model.Profile)
                    return this.eventService.GetSelectedEventProfileTag().EventProfile;
                return scope.Model.Profile;
            };

            scope.SelectEventProfile = () => {
                scope.Model.Profile = _.find(scope.Model.Profiles, (profile) => { return profile.Id == scope.Model.ProfileId; });
            };

            scope.Back=() => {
                this.ResetState();
            }

            scope.GetSelectedEventProfileTag = () => this.eventService.GetSelectedEventProfileTag();

            this.scope.OnDatePickerChange = (d: Date) => {
                this.scope.Model.EditDate = d;
            };

            scope.Edit = () => {
                var eventProfileTag = this.eventService.GetSelectedEventProfileTag();
                this.LoadProfiles();
                scope.Model.IsEdit = true;
                scope.Model.IsFullEdit = ! this.IsPastDate();
                scope.Model.EditDate = moment(eventProfileTag.Date).toDate();
                scope.DatePickerOptions.Date = scope.Model.EditDate;
                scope.Model.ProfileId = eventProfileTag.EventProfile.Id;
                scope.Model.Note = eventProfileTag.Note;
            }

            scope.IsManual = () => {
                var source = scope.GetSelectedProfile().Source;
                return source === Forecasting.Api.Enums.EventProfileSource.Empirical;
            }

            scope.EditSave = () => {
                var eventProfileTag: Api.Models.IEventProfileTag;
                var date = moment(scope.Model.EditDate).format(this.constants.InternalDateFormat);
                var oldTag = this.eventService.GetSelectedEventProfileTag();
                eventProfileTag = {
                    Date: date,
                    Id: oldTag.Id,
                    EventProfileId: scope.Model.ProfileId,
                    Note: oldTag.Note,
                    EventProfile: scope.Model.Profile
                }
                if (scope.Model.Note != oldTag.Note) {
                    oldTag.Note = scope.Model.Note;
                    scope.UpdateNote();
                }

                if (!this.IsPastDate()
                    && (oldTag.EventProfileId != scope.Model.ProfileId
                     || oldTag.Date != date)) {
                    this.eventService.ScheduleEventUpdate(eventProfileTag).success(() => {
                        this.ResetState();
                        this.eventService.EventTagHasBeenUpdated.Fire(null);
                    }).error((data:any) => {
                        this.popupMessageService.ShowError(data.Message);
                    });
                } else {
                    this.scope.Model.IsEdit = false;
                    this.scope.Model.IsFullEdit = false;
                }
            }
            scope.EditCancel = () => {
                scope.Model.Profile = null;
                scope.Model.IsEdit = false;
                this.scope.Model.IsFullEdit = false;
            }

            scope.IsPastEdit = () => {
                if (!eventService.CanEditEvents()) {
                    return false;
                }
                return this.IsPastDate();
            };

            scope.DisableEdit = () => {
                if (!eventService.CanEditEvents()) {
                    return true;
                }
                return this.IsPastDate();
            };

            scope.CheckCanEditPermission = () => eventService.CanEditEvents();

            scope.UpdateNote = () => {
                var tag = this.eventService.GetSelectedEventProfileTag();
                var eventTag: Api.Models.IEventProfileTagNote = {
                    Id: tag.Id,
                    Note: tag.Note.substring(0, this.scope.NoteMaxLength)
                };
                eventService.UpdateNote(eventTag);
            };

            scope.EditEventTag = () => {
                var eventProfileTag = this.eventService.GetSelectedEventProfileTag();

                if (eventProfileTag != null) {
                    if (this.eventService.GetSelectedEventProfileTag() != null) {
                        this.$modal.open({
                            templateUrl: "/Areas/Forecasting/Templates/ScheduleEventDialog.html",
                            controller: "Forecasting.ScheduleEventController",
                            resolve: {
                                Date: () => eventProfileTag.Date,
                                NoteMaxLength: (): number => { return scope.NoteMaxLength; },
                                EventTag: (): IMyEventTag => {
                                    return {
                                        Name: eventProfileTag.EventProfile.Name,
                                        Note: eventProfileTag.Note,
                                        ProfileId: eventProfileTag.EventProfile.Id,
                                        TagId: eventProfileTag.Id
                                    }
                                }
                            }
                        });
                    }
                }
            };

            scope.DeleteEventTag = () => {
                var eventProfileTag = this.eventService.GetSelectedEventProfileTag();
                if (eventProfileTag) {
                    this.confirmService.Confirm({
                        Title: this.scope.L10N.DeleteEventConfirmationTitle,
                        Message: this.scope.L10N.DeleteEventConfirmationMessage,
                        ConfirmText: this.scope.L10N.Confirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(() => {
                        this.eventService.DeleteEventTag(eventProfileTag.Id).then(() => {
                            this.popupMessageService.ShowSuccess(this.scope.L10N.DeleteEventHasBeenSuccessful);
                            this.ResetState();
                            this.eventService.EventTagHasBeenDeleted.Fire(eventProfileTag);
                        });
                    });
                }
            };

        }

        private IsPastDate(): boolean {
            var eventTag = this.eventService.GetSelectedEventProfileTag();
            return eventTag && moment(eventTag.Date).diff(moment(this._firstDate)) < 0;
        }

        private ResetState() {
            this.$state.go('^');
            this.scope.SetDetailedView(false);
            this.scope.Model.IsEdit = false;
        }

        private LoadProfiles() {
            this.eventService.GetEventProfiles().success((profiles) => {
                this.scope.Model.Profiles = profiles;
            });
        }

        private Initialize() {
            this.scope.NoteMaxLength = 150;

            this._firstDate = this.eventService.Today.toDate();

            this.scope.Model = {
                IsEdit: false,
                IsFullEdit: false,
                EditDate: moment(this.eventService.GetSelectedEventProfileTag().Date).toDate(),
                Profile: null,
                ProfileId: 0,
                Profiles: null,
                Note: null
            };

            this.scope.DatePickerOptions = {
                Date: this.scope.Model.EditDate,
                DayOffset: 1,
                MonthOffset: 0,
                Min: this._firstDate
            };


            this.scope.L10N = <Api.Models.ITranslations>{};
            this.translation.GetTranslations().then((result: Core.Api.Models.ITranslations) => {
                this.scope.L10N = result.Forecasting;
            });
        }
    }

    export var eventDetailsController = Core.NG.ForecastingModule.RegisterNamedController("EventDetailsController", EventDetailsController,
        Core.NG.$typedScope<IEventDetailsControllerScope>(),
        Core.NG.$state,
        Core.NG.$modal,
        Forecasting.Services.$eventService,
        Core.$popupMessageService,
        Core.$confirmationService,
        Core.Constants,
        Core.$translation);
}