module Forecasting {

    class EventWeekController {

        private _dateSelected: Date;
        private _weekStartDay: number;

        constructor(
            private scope: IEventWeekControllerScope,
            private $modal: ng.ui.bootstrap.IModalService,
            private eventService: Services.IEventService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private dateService: Core.Date.IDateService,
            private $state: ng.ui.IStateService,
            private constants: Core.IConstants) {

            this.Initialize();

            scope.CheckCanEditPermission = (): boolean => {
                return eventService.CanEditEvents();
            };

            scope.AddEventTag = () => this.AddEventTag();

            scope.EditEventProfile = () => this.EditEventProfile();
            scope.NewEventProfile = () => this.NewEventProfile();

            scope.SelectDate = (day: Date) => this.SelectDate(day);
            scope.CheckAnyEventsScheduled = (day: Forecasting.IWeekDay) => this.CheckAnyEventsScheduled(day);
            scope.CheckDateIsEditable = (date: Date) => this.CheckDateIsEditable(date);
            scope.CheckEventTagIsEditable = () => this.CheckEventTagIsEditable();

            scope.GetSelectedEventProfileTag = () => this.eventService.GetSelectedEventProfileTag();
            scope.SetSelectedEventProfileTag = (tag) => this.SetSelectedEventProfileTag(tag);

            this.eventService.EventTagHasBeenDeleted.Subscribe((eventProfileTag: Api.Models.IEventProfileTag) => {
                var dayTags = _.find(this.scope.Vm.Days, day => moment(day.Date).day() == moment(eventProfileTag.Date).day());
                if (dayTags != null) {
                    var tagToDeleteIdx = _.findIndex(dayTags.EventWeekDayInfo.EventProfileTags, tag => tag.Id === eventProfileTag.Id);
                    if (tagToDeleteIdx >= 0) {
                        dayTags.EventWeekDayInfo.EventProfileTags.splice(tagToDeleteIdx, 1);
                    }
                }
            });

            this.eventService.EventTagHasBeenUpdated.Subscribe(() => this.SetWeekDays(null, null));
        }

        SelectDate(day: Date) {
            this._dateSelected = day;
        }

        CheckAnyEventsScheduled(day: Forecasting.IWeekDay) {
            return day.EventWeekDayInfo && day.EventWeekDayInfo.EventProfileTags && day.EventWeekDayInfo.EventProfileTags.length > 0;
        }

        CheckDateIsEditable(date: Date) {
            if (date != null && moment(date) >= this.eventService.Today) {
                var day = _.find(this.scope.Vm.Days, (d) => moment(d.Date).date() == moment(date).date());
                if (day && day.EventWeekDayInfo != null && day.EventWeekDayInfo.EventProfileTags != null
                    && day.EventWeekDayInfo.EventProfileTags.length > 0) {
                    return false;
                }
                return true;
            }
            return false;
        }

        CheckEventTagIsEditable() {
            var tag = this.eventService.GetSelectedEventProfileTag();
            if (tag != null && moment(tag.Date) >= this.eventService.Today) {
                return true;
            }
            return false;
        }

        AddEventTag() {

            var dateToPass = this._dateSelected >= this.eventService.Today.toDate() ? this._dateSelected : this.eventService.Today.toDate();
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/ScheduleEventDialog.html",
                controller: "Forecasting.ScheduleEventController",
                resolve: {
                    Date: () => dateToPass,
                    NoteMaxLength: (): number => { return this.scope.NoteMaxLength; },
                    EventTag: () => undefined
                }
            }).result.then(() => {
                this.SetWeekDays(null, null);
            });
        }

        NewEventProfile() {
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/EventProfileDialog.html",
                controller: "Forecasting.EventProfileController",
                resolve: {
                    Profile: (): any => { return {}; },
                    Edit: (): boolean => { return false; },
                    NoteMaxLength: (): number => { return this.scope.NoteMaxLength; }
                }
            }).result.then(() => {
                this.SetWeekDays(null, null);
            });
        }

        EditEventProfile() {

            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/EventProfileDialog.html",
                controller: "Forecasting.EventProfileController",
                resolve: {
                    Profile: (): any => { return {}; },
                    Edit: (): boolean => { return true; },
                    NoteMaxLength: (): number => { return this.scope.NoteMaxLength; }
                }
            }).result.then(() => {
                this.SetWeekDays(null, null);
            });
        }

        private Initialize() {

            this._dateSelected = null;
            this.scope.ChangeDates = (startDate: Date, endDate: Date): void => { this.SetWeek(startDate, endDate); };

            this.scope.Vm = {
                Days: [],
                InitialDate: null,
        };

            this.scope.L10N = <Api.Models.ITranslations>{};
            this.scope.NoteMaxLength = 150;

            this.translationService.GetTranslations().then((result: Core.Api.Models.ITranslations) => {
                this.scope.L10N = result.Forecasting;
                this.popupMessageService.SetPageTitle(this.scope.L10N.TitleEvent);
            });

        }

        private CheckTagDateIsEditable() {
            var tag = this.eventService.GetSelectedEventProfileTag();
            if (!tag || !tag.Date) {
                return false;
            }
            return moment(tag.Date) > moment(tag.Date);
        }

        private SetSelectedEventProfileTag(tag: Api.Models.IEventProfileTag) {
            if (tag == null && !this.$state.is('Events.main')) {
                this.$state.go('^');
            }
            this.eventService.SetSelectedEventProfileTag(tag);
        }

        private SetWeek(startDate: Date, endDate: Date) {
            this._dateSelected = null;
            this.SetWeekDays(startDate, endDate);
        }

        private SetWeekDays(startDate: Date, endDate: Date) {
            if (startDate == null) {
                startDate = moment(this.scope.Vm.InitialDate).toDate();
            } else {
                this.scope.Vm.InitialDate = startDate;
            }
            if (endDate == null) {
                endDate = moment(startDate).add({ days: 7 }).toDate();
            }
            this.scope.Vm.Days = [];
            for (var i: number = 0; i < 7; i++) {
                var day = moment(startDate).add({ days: i }).toDate();
                this.scope.Vm.Days.push({ Date: day, EventWeekDayInfo: null });
            }
            this.GetEventWeekDaysInfo(startDate, endDate);
        }

        private GetEventWeekDaysInfo(startDate: Date, endDate: Date) {
            this.eventService.GetEventWeekDaysInfo(moment(startDate), moment(endDate)).then(result => {
                var eventWeekDaysInfo = result.data;
                if (eventWeekDaysInfo != null && eventWeekDaysInfo.length > 0) {
                    _.forEach(eventWeekDaysInfo, (ewd) => {
                        var day = _.find(this.scope.Vm.Days, (d) => moment(d.Date).date() == moment(ewd.Date).date());
                        if (day) {
                            day.EventWeekDayInfo = ewd;
                        }
                    });
                }
            });
        }

        private GetProfiles(): ng.IPromise<Api.Models.IEventProfile[]> {
            return this.eventService.GetEventProfiles().then(result => {
                this.scope.Profiles = result.data;
                return result.data;
            });
        }
    }

    export var eventWeekController = Core.NG.ForecastingModule.RegisterNamedController("EventWeekController", EventWeekController,
        Core.NG.$typedScope<IEventWeekControllerScope>(),
        Core.NG.$modal,
        Forecasting.Services.$eventService,
        Core.$translation,
        Core.$popupMessageService,
        Core.Date.$dateService,
        Core.NG.$state,
        Core.Constants);
}