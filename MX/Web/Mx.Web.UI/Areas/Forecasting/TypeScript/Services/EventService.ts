 module Forecasting.Services {
    "use strict";

     export interface IEventService {
         CanViewEvents(): boolean;
         CanEditEvents(): boolean;

         GetEventProfiles(): ng.IHttpPromise<Api.Models.IEventProfile[]>;
         ClearCachedEventProfiles(): void;
         ScheduleEventCreate(tag: Api.Models.IEventProfileTag): ng.IHttpPromise<{}>;
         ScheduleEventUpdate(tag: Api.Models.IEventProfileTag): ng.IHttpPromise<{}>;
         SaveProfile(profile: Forecasting.Api.Models.IEventProfile): ng.IHttpPromise<{}>;
         UpdateNote(note: Forecasting.Api.Models.IEventProfileTagNote): ng.IHttpPromise<{}>;
         DoesEventProfileNameExist(profileName: string): ng.IHttpPromise<{}>;
         GetMonthTags(month: Moment): ng.IHttpPromise<Forecasting.Api.Models.IEventCalendarInfo>;
         GetEventWeekDaysInfo(startDate: Moment, endDate: Moment): ng.IHttpPromise<Api.Models.IEventWeekDayInfo[]>;
         DeleteEventTag(tagId: number): ng.IHttpPromise<{}>;

         GetSelectedEventProfileTag(): Api.Models.IEventProfileTag;
         SetSelectedEventProfileTag(tag: Api.Models.IEventProfileTag);
         
         EventTagHasBeenDeleted: Core.Events.IEvent<Api.Models.IEventProfileTag>;
         EventTagHasBeenUpdated: Core.Events.IEvent<void>;
         EventTagHasBeenChanged: Core.Events.IEvent<void>;
         EventProfilesHaveBeenChanged: Core.Events.IEvent<void>;
         Today: Moment;
         Tomorrow: Moment;
     }
          
     class EventService implements IEventService {

         private _profilesPromise: ng.IHttpPromise<Api.Models.IEventProfile[]>;
         private _profilesEntityId: number;
         private _eventProfileTag: Api.Models.IEventProfileTag;

         public EventTagHasBeenDeleted: Core.Events.IEvent<Api.Models.IEventProfileTag>;
         public EventTagHasBeenUpdated: Core.Events.IEvent<void>;
         public EventTagHasBeenChanged: Core.Events.IEvent<void>;
         public EventProfilesHaveBeenChanged: Core.Events.IEvent<void>;
         public Today: Moment = moment();
         public Tomorrow: Moment = moment();

         constructor(
             private $q: ng.IQService,
             private $authService: Core.Auth.IAuthService,
             private eventService: Api.IEventService,
             private eventTagService: Api.IEventTagService,
             private eventTagNoteService: Api.IEventTagNoteService,
             private eventCalendarService: Api.IEventCalendarService,
             private signalR: Core.ISignalRService,
             private popupMessageService: Core.IPopupMessageService,
             private constants: Core.IConstants
         ) {
             this.RegisterSignaRListeners();
             this._eventProfileTag = null;
             this.EventTagHasBeenDeleted = new Core.Events.Event<Api.Models.IEventProfileTag>();
             this.EventTagHasBeenUpdated = new Core.Events.Event<void>();
             this.EventTagHasBeenChanged = new Core.Events.Event<void>();
             this.EventProfilesHaveBeenChanged = new Core.Events.Event<void>();
         }

         public GetSelectedEventProfileTag() {
             return this._eventProfileTag;
         }

         public SetSelectedEventProfileTag(tag: Api.Models.IEventProfileTag) {
             this._eventProfileTag = tag;
             this.EventTagHasBeenChanged.Fire(null);
         }

         public CanViewEvents(): boolean {
             return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_Event_CanView);
         }

         public CanEditEvents(): boolean {
             return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_Event_CanView);
         }

         public ScheduleEventCreate(tag: Api.Models.IEventProfileTag): ng.IHttpPromise<{}> {
             var user = this.$authService.GetUser();
             var res = this.eventTagService.PostEventProfileTag(tag, user.BusinessUser.MobileSettings.EntityId);
             return res;
         }


         public ScheduleEventUpdate(tag: Api.Models.IEventProfileTag): ng.IHttpPromise<{}> {
             var user = this.$authService.GetUser();
             var res = this.eventTagService.PutEventProfileTag(tag, user.BusinessUser.MobileSettings.EntityId);
             return res;
         }

         public SaveProfile(profile: Forecasting.Api.Models.IEventProfile): ng.IHttpPromise<{}> {
             var user = this.$authService.GetUser();
             var promise = this.eventService.PostEventProfile(profile, user.BusinessUser.MobileSettings.EntityId)
                 .success(() => {
                 this.ClearCachedEventProfiles();
                 this.EventProfilesHaveBeenChanged.Fire(null);
             });
             return promise;
         }

         public DoesEventProfileNameExist(profileName: string): ng.IHttpPromise<boolean> {
             var user = this.$authService.GetUser();
             var entityId = user.BusinessUser.MobileSettings.EntityId;
             var promise = this.eventService.GetProfileNameExistsForEntity(entityId, profileName);
             return promise;
         }

         public GetEventProfiles(): ng.IHttpPromise<Api.Models.IEventProfile[]> {
             var user = this.$authService.GetUser();
             if (this._profilesPromise != null && this._profilesEntityId == user.BusinessUser.MobileSettings.EntityId) {
                 return this._profilesPromise;
             }
             this._profilesPromise = this.eventService.GetEventProfiles(user.BusinessUser.MobileSettings.EntityId);
             this._profilesEntityId = user.BusinessUser.MobileSettings.EntityId;
             return this._profilesPromise;
         }

         public ClearCachedEventProfiles(): void {
             this._profilesPromise = null;
         }

         public GetMonthTags(month: Moment): ng.IHttpPromise<Forecasting.Api.Models.IEventCalendarInfo> {
             var user = this.$authService.GetUser();
             var days = this.eventCalendarService.GetCalendarInfo(user.BusinessUser.MobileSettings.EntityId, month.year(), month.month() + 1);
             return days;
         }

         public GetEventWeekDaysInfo(startDate: Moment, endDate: Moment) {
             var user = this.$authService.GetUser();
             return this.eventCalendarService.GetEventWeekDaysInfo(user.BusinessUser.MobileSettings.EntityId,
                 startDate.format(this.constants.InternalDateFormat),
                 endDate.format(this.constants.InternalDateFormat));
         }

         public DeleteEventTag(tagId: number) {
             var user = this.$authService.GetUser();
             var signalRconnectionId = this.signalR.GetConnectionId() == null ? "" : this.signalR.GetConnectionId();
             var promise = this.eventTagService.DeleteEventProfileTag(user.BusinessUser.MobileSettings.EntityId, tagId, signalRconnectionId);
             return promise;
         }

         public UpdateNote(tagnote: Forecasting.Api.Models.IEventProfileTagNote): ng.IHttpPromise<{}> {
             var user = this.$authService.GetUser();
             var promise = this.eventTagNoteService.PutEventProfileTagNote(tagnote, user.BusinessUser.MobileSettings.EntityId);
             return promise;
         }


         private ForecastHasBeenRegenerated(message: string) {
             this.popupMessageService.ShowSuccess(message);
         }

         private ForecastGenerationFailed(message: string) {
             this.popupMessageService.ShowWarning(message);
         }

         private RegisterSignaRListeners() {
             this.signalR.SetSignalREventListener(
                 Core.SignalRServerMethods.ForecastHasBeenRegenerated, (message: string) => this.ForecastHasBeenRegenerated(message));
             this.signalR.SetSignalREventListener(
                 Core.SignalRServerMethods.ForecastGenerationFailed, (message: string) => this.ForecastGenerationFailed(message));
         }
     }

     export var $eventService: Core.NG.INamedService<IEventService> = Core.NG.ForecastingModule.RegisterService("EventService", EventService,
         Core.NG.$q,
         Core.Auth.$authService,
         Api.$eventService,
         Api.$eventTagService,
         Api.$eventTagNoteService,
         Api.$eventCalendarService,
         Core.$signalR,
         Core.$popupMessageService,
         Core.Constants
     );
 }
