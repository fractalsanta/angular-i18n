var Forecasting;
(function (Forecasting) {
    var Services;
    (function (Services) {
        "use strict";
        var EventService = (function () {
            function EventService($q, $authService, eventService, eventTagService, eventTagNoteService, eventCalendarService, signalR, popupMessageService, constants) {
                this.$q = $q;
                this.$authService = $authService;
                this.eventService = eventService;
                this.eventTagService = eventTagService;
                this.eventTagNoteService = eventTagNoteService;
                this.eventCalendarService = eventCalendarService;
                this.signalR = signalR;
                this.popupMessageService = popupMessageService;
                this.constants = constants;
                this.Today = moment();
                this.Tomorrow = moment();
                this.RegisterSignaRListeners();
                this._eventProfileTag = null;
                this.EventTagHasBeenDeleted = new Core.Events.Event();
                this.EventTagHasBeenUpdated = new Core.Events.Event();
                this.EventTagHasBeenChanged = new Core.Events.Event();
                this.EventProfilesHaveBeenChanged = new Core.Events.Event();
            }
            EventService.prototype.GetSelectedEventProfileTag = function () {
                return this._eventProfileTag;
            };
            EventService.prototype.SetSelectedEventProfileTag = function (tag) {
                this._eventProfileTag = tag;
                this.EventTagHasBeenChanged.Fire(null);
            };
            EventService.prototype.CanViewEvents = function () {
                return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_Event_CanView);
            };
            EventService.prototype.CanEditEvents = function () {
                return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_Event_CanView);
            };
            EventService.prototype.ScheduleEventCreate = function (tag) {
                var user = this.$authService.GetUser();
                var res = this.eventTagService.PostEventProfileTag(tag, user.BusinessUser.MobileSettings.EntityId);
                return res;
            };
            EventService.prototype.ScheduleEventUpdate = function (tag) {
                var user = this.$authService.GetUser();
                var res = this.eventTagService.PutEventProfileTag(tag, user.BusinessUser.MobileSettings.EntityId);
                return res;
            };
            EventService.prototype.SaveProfile = function (profile) {
                var _this = this;
                var user = this.$authService.GetUser();
                var promise = this.eventService.PostEventProfile(profile, user.BusinessUser.MobileSettings.EntityId)
                    .success(function () {
                    _this.ClearCachedEventProfiles();
                    _this.EventProfilesHaveBeenChanged.Fire(null);
                });
                return promise;
            };
            EventService.prototype.DoesEventProfileNameExist = function (profileName) {
                var user = this.$authService.GetUser();
                var entityId = user.BusinessUser.MobileSettings.EntityId;
                var promise = this.eventService.GetProfileNameExistsForEntity(entityId, profileName);
                return promise;
            };
            EventService.prototype.GetEventProfiles = function () {
                var user = this.$authService.GetUser();
                if (this._profilesPromise != null && this._profilesEntityId == user.BusinessUser.MobileSettings.EntityId) {
                    return this._profilesPromise;
                }
                this._profilesPromise = this.eventService.GetEventProfiles(user.BusinessUser.MobileSettings.EntityId);
                this._profilesEntityId = user.BusinessUser.MobileSettings.EntityId;
                return this._profilesPromise;
            };
            EventService.prototype.ClearCachedEventProfiles = function () {
                this._profilesPromise = null;
            };
            EventService.prototype.GetMonthTags = function (month) {
                var user = this.$authService.GetUser();
                var days = this.eventCalendarService.GetCalendarInfo(user.BusinessUser.MobileSettings.EntityId, month.year(), month.month() + 1);
                return days;
            };
            EventService.prototype.GetEventWeekDaysInfo = function (startDate, endDate) {
                var user = this.$authService.GetUser();
                return this.eventCalendarService.GetEventWeekDaysInfo(user.BusinessUser.MobileSettings.EntityId, startDate.format(this.constants.InternalDateFormat), endDate.format(this.constants.InternalDateFormat));
            };
            EventService.prototype.DeleteEventTag = function (tagId) {
                var user = this.$authService.GetUser();
                var signalRconnectionId = this.signalR.GetConnectionId() == null ? "" : this.signalR.GetConnectionId();
                var promise = this.eventTagService.DeleteEventProfileTag(user.BusinessUser.MobileSettings.EntityId, tagId, signalRconnectionId);
                return promise;
            };
            EventService.prototype.UpdateNote = function (tagnote) {
                var user = this.$authService.GetUser();
                var promise = this.eventTagNoteService.PutEventProfileTagNote(tagnote, user.BusinessUser.MobileSettings.EntityId);
                return promise;
            };
            EventService.prototype.ForecastHasBeenRegenerated = function (message) {
                this.popupMessageService.ShowSuccess(message);
            };
            EventService.prototype.ForecastGenerationFailed = function (message) {
                this.popupMessageService.ShowWarning(message);
            };
            EventService.prototype.RegisterSignaRListeners = function () {
                var _this = this;
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ForecastHasBeenRegenerated, function (message) { return _this.ForecastHasBeenRegenerated(message); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ForecastGenerationFailed, function (message) { return _this.ForecastGenerationFailed(message); });
            };
            return EventService;
        }());
        Services.$eventService = Core.NG.ForecastingModule.RegisterService("EventService", EventService, Core.NG.$q, Core.Auth.$authService, Forecasting.Api.$eventService, Forecasting.Api.$eventTagService, Forecasting.Api.$eventTagNoteService, Forecasting.Api.$eventCalendarService, Core.$signalR, Core.$popupMessageService, Core.Constants);
    })(Services = Forecasting.Services || (Forecasting.Services = {}));
})(Forecasting || (Forecasting = {}));
