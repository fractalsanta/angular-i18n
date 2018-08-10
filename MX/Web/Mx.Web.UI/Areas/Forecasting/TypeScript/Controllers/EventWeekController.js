var Forecasting;
(function (Forecasting) {
    var EventWeekController = (function () {
        function EventWeekController(scope, $modal, eventService, translationService, popupMessageService, dateService, $state, constants) {
            var _this = this;
            this.scope = scope;
            this.$modal = $modal;
            this.eventService = eventService;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.dateService = dateService;
            this.$state = $state;
            this.constants = constants;
            this.Initialize();
            scope.CheckCanEditPermission = function () {
                return eventService.CanEditEvents();
            };
            scope.AddEventTag = function () { return _this.AddEventTag(); };
            scope.EditEventProfile = function () { return _this.EditEventProfile(); };
            scope.NewEventProfile = function () { return _this.NewEventProfile(); };
            scope.SelectDate = function (day) { return _this.SelectDate(day); };
            scope.CheckAnyEventsScheduled = function (day) { return _this.CheckAnyEventsScheduled(day); };
            scope.CheckDateIsEditable = function (date) { return _this.CheckDateIsEditable(date); };
            scope.CheckEventTagIsEditable = function () { return _this.CheckEventTagIsEditable(); };
            scope.GetSelectedEventProfileTag = function () { return _this.eventService.GetSelectedEventProfileTag(); };
            scope.SetSelectedEventProfileTag = function (tag) { return _this.SetSelectedEventProfileTag(tag); };
            this.eventService.EventTagHasBeenDeleted.Subscribe(function (eventProfileTag) {
                var dayTags = _.find(_this.scope.Vm.Days, function (day) { return moment(day.Date).day() == moment(eventProfileTag.Date).day(); });
                if (dayTags != null) {
                    var tagToDeleteIdx = _.findIndex(dayTags.EventWeekDayInfo.EventProfileTags, function (tag) { return tag.Id === eventProfileTag.Id; });
                    if (tagToDeleteIdx >= 0) {
                        dayTags.EventWeekDayInfo.EventProfileTags.splice(tagToDeleteIdx, 1);
                    }
                }
            });
            this.eventService.EventTagHasBeenUpdated.Subscribe(function () { return _this.SetWeekDays(null, null); });
        }
        EventWeekController.prototype.SelectDate = function (day) {
            this._dateSelected = day;
        };
        EventWeekController.prototype.CheckAnyEventsScheduled = function (day) {
            return day.EventWeekDayInfo && day.EventWeekDayInfo.EventProfileTags && day.EventWeekDayInfo.EventProfileTags.length > 0;
        };
        EventWeekController.prototype.CheckDateIsEditable = function (date) {
            if (date != null && moment(date) >= this.eventService.Today) {
                var day = _.find(this.scope.Vm.Days, function (d) { return moment(d.Date).date() == moment(date).date(); });
                if (day && day.EventWeekDayInfo != null && day.EventWeekDayInfo.EventProfileTags != null
                    && day.EventWeekDayInfo.EventProfileTags.length > 0) {
                    return false;
                }
                return true;
            }
            return false;
        };
        EventWeekController.prototype.CheckEventTagIsEditable = function () {
            var tag = this.eventService.GetSelectedEventProfileTag();
            if (tag != null && moment(tag.Date) >= this.eventService.Today) {
                return true;
            }
            return false;
        };
        EventWeekController.prototype.AddEventTag = function () {
            var _this = this;
            var dateToPass = this._dateSelected >= this.eventService.Today.toDate() ? this._dateSelected : this.eventService.Today.toDate();
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/ScheduleEventDialog.html",
                controller: "Forecasting.ScheduleEventController",
                resolve: {
                    Date: function () { return dateToPass; },
                    NoteMaxLength: function () { return _this.scope.NoteMaxLength; },
                    EventTag: function () { return undefined; }
                }
            }).result.then(function () {
                _this.SetWeekDays(null, null);
            });
        };
        EventWeekController.prototype.NewEventProfile = function () {
            var _this = this;
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/EventProfileDialog.html",
                controller: "Forecasting.EventProfileController",
                resolve: {
                    Profile: function () { return {}; },
                    Edit: function () { return false; },
                    NoteMaxLength: function () { return _this.scope.NoteMaxLength; }
                }
            }).result.then(function () {
                _this.SetWeekDays(null, null);
            });
        };
        EventWeekController.prototype.EditEventProfile = function () {
            var _this = this;
            this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/EventProfileDialog.html",
                controller: "Forecasting.EventProfileController",
                resolve: {
                    Profile: function () { return {}; },
                    Edit: function () { return true; },
                    NoteMaxLength: function () { return _this.scope.NoteMaxLength; }
                }
            }).result.then(function () {
                _this.SetWeekDays(null, null);
            });
        };
        EventWeekController.prototype.Initialize = function () {
            var _this = this;
            this._dateSelected = null;
            this.scope.ChangeDates = function (startDate, endDate) { _this.SetWeek(startDate, endDate); };
            this.scope.Vm = {
                Days: [],
                InitialDate: null
            };
            this.scope.L10N = {};
            this.scope.NoteMaxLength = 150;
            this.translationService.GetTranslations().then(function (result) {
                _this.scope.L10N = result.Forecasting;
                _this.popupMessageService.SetPageTitle(_this.scope.L10N.TitleEvent);
            });
        };
        EventWeekController.prototype.CheckTagDateIsEditable = function () {
            var tag = this.eventService.GetSelectedEventProfileTag();
            if (!tag || !tag.Date) {
                return false;
            }
            return moment(tag.Date) > moment(tag.Date);
        };
        EventWeekController.prototype.SetSelectedEventProfileTag = function (tag) {
            if (tag == null && !this.$state.is('Events.main')) {
                this.$state.go('^');
            }
            this.eventService.SetSelectedEventProfileTag(tag);
        };
        EventWeekController.prototype.SetWeek = function (startDate, endDate) {
            this._dateSelected = null;
            this.SetWeekDays(startDate, endDate);
        };
        EventWeekController.prototype.SetWeekDays = function (startDate, endDate) {
            if (startDate == null) {
                startDate = moment(this.scope.Vm.InitialDate).toDate();
            }
            else {
                this.scope.Vm.InitialDate = startDate;
            }
            if (endDate == null) {
                endDate = moment(startDate).add({ days: 7 }).toDate();
            }
            this.scope.Vm.Days = [];
            for (var i = 0; i < 7; i++) {
                var day = moment(startDate).add({ days: i }).toDate();
                this.scope.Vm.Days.push({ Date: day, EventWeekDayInfo: null });
            }
            this.GetEventWeekDaysInfo(startDate, endDate);
        };
        EventWeekController.prototype.GetEventWeekDaysInfo = function (startDate, endDate) {
            var _this = this;
            this.eventService.GetEventWeekDaysInfo(moment(startDate), moment(endDate)).then(function (result) {
                var eventWeekDaysInfo = result.data;
                if (eventWeekDaysInfo != null && eventWeekDaysInfo.length > 0) {
                    _.forEach(eventWeekDaysInfo, function (ewd) {
                        var day = _.find(_this.scope.Vm.Days, function (d) { return moment(d.Date).date() == moment(ewd.Date).date(); });
                        if (day) {
                            day.EventWeekDayInfo = ewd;
                        }
                    });
                }
            });
        };
        EventWeekController.prototype.GetProfiles = function () {
            var _this = this;
            return this.eventService.GetEventProfiles().then(function (result) {
                _this.scope.Profiles = result.data;
                return result.data;
            });
        };
        return EventWeekController;
    }());
    Forecasting.eventWeekController = Core.NG.ForecastingModule.RegisterNamedController("EventWeekController", EventWeekController, Core.NG.$typedScope(), Core.NG.$modal, Forecasting.Services.$eventService, Core.$translation, Core.$popupMessageService, Core.Date.$dateService, Core.NG.$state, Core.Constants);
})(Forecasting || (Forecasting = {}));
