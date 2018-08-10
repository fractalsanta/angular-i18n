var Forecasting;
(function (Forecasting) {
    var EventDetailsController = (function () {
        function EventDetailsController(scope, $state, $modal, eventService, popupMessageService, confirmService, constants, translation) {
            var _this = this;
            this.scope = scope;
            this.$state = $state;
            this.$modal = $modal;
            this.eventService = eventService;
            this.popupMessageService = popupMessageService;
            this.confirmService = confirmService;
            this.constants = constants;
            this.translation = translation;
            this.Initialize();
            this.eventService.EventTagHasBeenChanged.Subscribe(function () {
                scope.EditCancel();
            });
            this.eventService.EventProfilesHaveBeenChanged.Subscribe(function () {
                _this.LoadProfiles();
            });
            scope.GetSelectedProfile = function () {
                if (!scope.Model.IsEdit || !scope.Model.Profile)
                    return _this.eventService.GetSelectedEventProfileTag().EventProfile;
                return scope.Model.Profile;
            };
            scope.SelectEventProfile = function () {
                scope.Model.Profile = _.find(scope.Model.Profiles, function (profile) { return profile.Id == scope.Model.ProfileId; });
            };
            scope.Back = function () {
                _this.ResetState();
            };
            scope.GetSelectedEventProfileTag = function () { return _this.eventService.GetSelectedEventProfileTag(); };
            this.scope.OnDatePickerChange = function (d) {
                _this.scope.Model.EditDate = d;
            };
            scope.Edit = function () {
                var eventProfileTag = _this.eventService.GetSelectedEventProfileTag();
                _this.LoadProfiles();
                scope.Model.IsEdit = true;
                scope.Model.IsFullEdit = !_this.IsPastDate();
                scope.Model.EditDate = moment(eventProfileTag.Date).toDate();
                scope.DatePickerOptions.Date = scope.Model.EditDate;
                scope.Model.ProfileId = eventProfileTag.EventProfile.Id;
                scope.Model.Note = eventProfileTag.Note;
            };
            scope.IsManual = function () {
                var source = scope.GetSelectedProfile().Source;
                return source === Forecasting.Api.Enums.EventProfileSource.Empirical;
            };
            scope.EditSave = function () {
                var eventProfileTag;
                var date = moment(scope.Model.EditDate).format(_this.constants.InternalDateFormat);
                var oldTag = _this.eventService.GetSelectedEventProfileTag();
                eventProfileTag = {
                    Date: date,
                    Id: oldTag.Id,
                    EventProfileId: scope.Model.ProfileId,
                    Note: oldTag.Note,
                    EventProfile: scope.Model.Profile
                };
                if (scope.Model.Note != oldTag.Note) {
                    oldTag.Note = scope.Model.Note;
                    scope.UpdateNote();
                }
                if (!_this.IsPastDate()
                    && (oldTag.EventProfileId != scope.Model.ProfileId
                        || oldTag.Date != date)) {
                    _this.eventService.ScheduleEventUpdate(eventProfileTag).success(function () {
                        _this.ResetState();
                        _this.eventService.EventTagHasBeenUpdated.Fire(null);
                    }).error(function (data) {
                        _this.popupMessageService.ShowError(data.Message);
                    });
                }
                else {
                    _this.scope.Model.IsEdit = false;
                    _this.scope.Model.IsFullEdit = false;
                }
            };
            scope.EditCancel = function () {
                scope.Model.Profile = null;
                scope.Model.IsEdit = false;
                _this.scope.Model.IsFullEdit = false;
            };
            scope.IsPastEdit = function () {
                if (!eventService.CanEditEvents()) {
                    return false;
                }
                return _this.IsPastDate();
            };
            scope.DisableEdit = function () {
                if (!eventService.CanEditEvents()) {
                    return true;
                }
                return _this.IsPastDate();
            };
            scope.CheckCanEditPermission = function () { return eventService.CanEditEvents(); };
            scope.UpdateNote = function () {
                var tag = _this.eventService.GetSelectedEventProfileTag();
                var eventTag = {
                    Id: tag.Id,
                    Note: tag.Note.substring(0, _this.scope.NoteMaxLength)
                };
                eventService.UpdateNote(eventTag);
            };
            scope.EditEventTag = function () {
                var eventProfileTag = _this.eventService.GetSelectedEventProfileTag();
                if (eventProfileTag != null) {
                    if (_this.eventService.GetSelectedEventProfileTag() != null) {
                        _this.$modal.open({
                            templateUrl: "/Areas/Forecasting/Templates/ScheduleEventDialog.html",
                            controller: "Forecasting.ScheduleEventController",
                            resolve: {
                                Date: function () { return eventProfileTag.Date; },
                                NoteMaxLength: function () { return scope.NoteMaxLength; },
                                EventTag: function () {
                                    return {
                                        Name: eventProfileTag.EventProfile.Name,
                                        Note: eventProfileTag.Note,
                                        ProfileId: eventProfileTag.EventProfile.Id,
                                        TagId: eventProfileTag.Id
                                    };
                                }
                            }
                        });
                    }
                }
            };
            scope.DeleteEventTag = function () {
                var eventProfileTag = _this.eventService.GetSelectedEventProfileTag();
                if (eventProfileTag) {
                    _this.confirmService.Confirm({
                        Title: _this.scope.L10N.DeleteEventConfirmationTitle,
                        Message: _this.scope.L10N.DeleteEventConfirmationMessage,
                        ConfirmText: _this.scope.L10N.Confirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(function () {
                        _this.eventService.DeleteEventTag(eventProfileTag.Id).then(function () {
                            _this.popupMessageService.ShowSuccess(_this.scope.L10N.DeleteEventHasBeenSuccessful);
                            _this.ResetState();
                            _this.eventService.EventTagHasBeenDeleted.Fire(eventProfileTag);
                        });
                    });
                }
            };
        }
        EventDetailsController.prototype.IsPastDate = function () {
            var eventTag = this.eventService.GetSelectedEventProfileTag();
            return eventTag && moment(eventTag.Date).diff(moment(this._firstDate)) < 0;
        };
        EventDetailsController.prototype.ResetState = function () {
            this.$state.go('^');
            this.scope.SetDetailedView(false);
            this.scope.Model.IsEdit = false;
        };
        EventDetailsController.prototype.LoadProfiles = function () {
            var _this = this;
            this.eventService.GetEventProfiles().success(function (profiles) {
                _this.scope.Model.Profiles = profiles;
            });
        };
        EventDetailsController.prototype.Initialize = function () {
            var _this = this;
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
            this.scope.L10N = {};
            this.translation.GetTranslations().then(function (result) {
                _this.scope.L10N = result.Forecasting;
            });
        };
        return EventDetailsController;
    }());
    Forecasting.EventDetailsController = EventDetailsController;
    Forecasting.eventDetailsController = Core.NG.ForecastingModule.RegisterNamedController("EventDetailsController", EventDetailsController, Core.NG.$typedScope(), Core.NG.$state, Core.NG.$modal, Forecasting.Services.$eventService, Core.$popupMessageService, Core.$confirmationService, Core.Constants, Core.$translation);
})(Forecasting || (Forecasting = {}));
