/////////////////////////////////////////////////////////////////////////////////////////////////
//
//    TypeScript implementation layer for REST WebAPI services 
//    WARNING: This file has been automatically generated. Any changes may be lost on the next run.
//
/////////////////////////////////////////////////////////////////////////////////////////////////

/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module Administration.DataLoad.Api {
    // Administration.DataLoad.Api.DataLoadController
    class DataLoadService implements IDataLoadService {
        constructor(private $http: ng.IHttpService) { }
        PostFormData(): ng.IHttpPromise<any>{
            return this.$http({
                method: "POST",
                url: "/Administration/DataLoad/Api/DataLoad",
                timeout: 120000
            });
        }
    }
    export var $dataLoadService: Core.NG.INamedDependency<IDataLoadService> = Core.NG.CoreModule.RegisterService("ApiLayer.DataLoadService", DataLoadService, Core.NG.$http);
}

module Administration.DayCharacteristic.Api {
    // Administration.DayCharacteristic.Api.DayCharacteristicController
    class DayCharacteristicService implements IDayCharacteristicService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<Administration.DayCharacteristic.Api.Models.IDayCharacteristic[]>{
            return this.$http({
                method: "GET",
                url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                timeout: 120000
            });
        }
        Put(/*[FromBody]*/ value: Administration.DayCharacteristic.Api.Models.IDayCharacteristic[]): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                timeout: 120000,
                data: value
            });
        }
        Delete(/*[FromBody]*/ value: Administration.DayCharacteristic.Api.Models.IDayCharacteristic[]): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                timeout: 120000,
                data: value
            });
        }
        Get1(entityId: number, businessDay: string): ng.IHttpPromise<Administration.DayCharacteristic.Api.Models.IEntityDayCharacteristic>{
            return this.$http({
                method: "GET",
                url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay }
            });
        }
        Put1(entityId: number, businessDay: string, /*[FromBody]*/ value: Administration.DayCharacteristic.Api.Models.IEntityDayCharacteristic): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay },
                data: value
            });
        }
    }
    export var $dayCharacteristicService: Core.NG.INamedDependency<IDayCharacteristicService> = Core.NG.CoreModule.RegisterService("ApiLayer.DayCharacteristicService", DayCharacteristicService, Core.NG.$http);
}

module Administration.Hierarchy.Api {
    // Administration.Hierarchy.Api.HierarchyController
    class HierarchyService implements IHierarchyService {
        constructor(private $http: ng.IHttpService) { }
        GetHierarchy(baseEntityId: number): ng.IHttpPromise<Administration.Hierarchy.Api.Models.IHierarchyEntity>{
            return this.$http({
                method: "GET",
                url: "/Administration/Hierarchy/Api/Hierarchy",
                timeout: 120000,
                params: { baseEntityId: baseEntityId }
            });
        }
        GetHierarchyLevels(): ng.IHttpPromise<string[]>{
            return this.$http({
                method: "GET",
                url: "/Administration/Hierarchy/Api/Hierarchy",
                timeout: 120000
            });
        }
        PostCreateEntity(number: string, name: string, parentId: number, type: number): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Administration/Hierarchy/Api/Hierarchy",
                timeout: 120000,
                params: { number: number, name: name, parentId: parentId, type: type }
            });
        }
        PutUpdateBarebonesEntity(id: number, number: string, name: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/Hierarchy/Api/Hierarchy/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { number: number, name: name }
            });
        }
        PutMoveHierarchy(id: number, parentId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/Hierarchy/Api/Hierarchy/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { parentId: parentId }
            });
        }
    }
    export var $hierarchyService: Core.NG.INamedDependency<IHierarchyService> = Core.NG.CoreModule.RegisterService("ApiLayer.HierarchyService", HierarchyService, Core.NG.$http);
}

module Administration.MyAccount.Api {
    // Administration.MyAccount.Api.AccountController
    class AccountService implements IAccountService {
        constructor(private $http: ng.IHttpService) { }
        PostPinNumber(password: string, pin: string): ng.IHttpPromise<string>{
            return this.$http({
                method: "POST",
                url: "/Administration/MyAccount/Api/Account",
                timeout: 120000,
                params: { password: password, pin: pin }
            });
        }
        DeleteUserPin(): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Administration/MyAccount/Api/Account",
                timeout: 120000
            });
        }
    }
    export var $accountService: Core.NG.INamedDependency<IAccountService> = Core.NG.CoreModule.RegisterService("ApiLayer.AccountService", AccountService, Core.NG.$http);
}

module Administration.Settings.Api {
    // Administration.Settings.Api.InventoryCountSettingsController
    class InventoryCountSettingsService implements IInventoryCountSettingsService {
        constructor(private $http: ng.IHttpService) { }
        GetInventoryCountSettings(): ng.IHttpPromise<Administration.Settings.Api.Models.IInventoryCountSettingsViewModel>{
            return this.$http({
                method: "GET",
                url: "/Administration/Settings/Api/InventoryCountSettings",
                timeout: 120000
            });
        }
        PostInventoryCountSettings(/*[FromBody]*/ inventoryCountSettings: Administration.Settings.Api.Models.IInventoryCountSettingsViewModel): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Administration/Settings/Api/InventoryCountSettings",
                timeout: 120000,
                data: inventoryCountSettings
            });
        }
    }
    export var $inventoryCountSettingsService: Core.NG.INamedDependency<IInventoryCountSettingsService> = Core.NG.CoreModule.RegisterService("ApiLayer.InventoryCountSettingsService", InventoryCountSettingsService, Core.NG.$http);
}

module Administration.Settings.Api {
    // Administration.Settings.Api.SettingsController
    class SettingsService implements ISettingsService {
        constructor(private $http: ng.IHttpService) { }
        GetMeasures(type: Administration.Settings.Api.Models.SettingEnums, entityId: number): ng.IHttpPromise<Administration.Settings.Api.Models.ISettingGroup[]>{
            return this.$http({
                method: "GET",
                url: "/Administration/Settings/Api/Settings",
                timeout: 120000,
                params: { type: type, entityId: entityId }
            });
        }
        POSTReportMeasureConfig(/*[FromBody]*/ measure: Administration.Settings.Api.Models.ISettingMeasure, action: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Administration/Settings/Api/Settings",
                timeout: 120000,
                params: { action: action },
                data: measure
            });
        }
        GetConfigurationSettings(settings: Core.Api.Models.ConfigurationSetting[]): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Administration/Settings/Api/Settings",
                timeout: 120000,
                params: { settings: settings }
            });
        }
    }
    export var $settingsService: Core.NG.INamedDependency<ISettingsService> = Core.NG.CoreModule.RegisterService("ApiLayer.SettingsService", SettingsService, Core.NG.$http);
}

module Administration.Settings.Api {
    // Administration.Settings.Api.SiteSettingsController
    class SiteSettingsService implements ISiteSettingsService {
        constructor(private $http: ng.IHttpService) { }
        GetSiteSettings(): ng.IHttpPromise<Administration.Settings.Api.Models.ISiteSettings>{
            return this.$http({
                method: "GET",
                url: "/Administration/Settings/Api/SiteSettings",
                timeout: 120000
            });
        }
        PostSiteSettings(/*[FromBody]*/ settings: Administration.Settings.Api.Models.ISiteSettings): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Administration/Settings/Api/SiteSettings",
                timeout: 120000,
                data: settings
            });
        }
    }
    export var $siteSettingsService: Core.NG.INamedDependency<ISiteSettingsService> = Core.NG.CoreModule.RegisterService("ApiLayer.SiteSettingsService", SiteSettingsService, Core.NG.$http);
}

module Administration.User.Api {
    // Administration.User.Api.UserController
    class UserService implements IUserService {
        constructor(private $http: ng.IHttpService) { }
        GetUsers(entityId: number, includeDescendents: boolean, includeTerminated: boolean): ng.IHttpPromise<Administration.User.Api.Models.IUser[]>{
            return this.$http({
                method: "GET",
                url: "/Administration/User/Api/User",
                timeout: 120000,
                params: { entityId: entityId, includeDescendents: includeDescendents, includeTerminated: includeTerminated }
            });
        }
        GetSecurityGroups(): ng.IHttpPromise<Administration.User.Api.Models.ISecurityGroup[]>{
            return this.$http({
                method: "GET",
                url: "/Administration/User/Api/User",
                timeout: 120000
            });
        }
        PostCreateNewUser(entityId: number, employeeNumber: string, firstName: string, lastName: string, middleName: string, userName: string, password: string, securityGroups: number[]): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Administration/User/Api/User",
                timeout: 120000,
                params: { entityId: entityId, employeeNumber: employeeNumber, firstName: firstName, lastName: lastName, middleName: middleName, userName: userName, password: password, securityGroups: securityGroups }
            });
        }
        GetUserNameFromFirstNameAndLastName(firstName: string, lastName: string): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Administration/User/Api/User",
                timeout: 120000,
                params: { firstName: firstName, lastName: lastName }
            });
        }
        PutUpdateBasicUser(id: number, entityId: number, employeeNumber: string, firstName: string, lastName: string, middleName: string, userName: string, password: string, status: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/User/Api/User/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, employeeNumber: employeeNumber, firstName: firstName, lastName: lastName, middleName: middleName, userName: userName, password: password, status: status }
            });
        }
        PutUpdateUserSecurityGroups(userId: number, securityGroups: number[]): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/User/Api/User",
                timeout: 120000,
                params: { userId: userId, securityGroups: securityGroups }
            });
        }
    }
    export var $userService: Core.NG.INamedDependency<IUserService> = Core.NG.CoreModule.RegisterService("ApiLayer.UserService", UserService, Core.NG.$http);
}

module Administration.User.Api {
    // Administration.User.Api.UserSettingsController
    class UserSettingsService implements IUserSettingsService {
        constructor(private $http: ng.IHttpService) { }
        GetUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Administration/User/Api/UserSettings",
                timeout: 120000,
                params: { userSetting: userSetting }
            });
        }
        PutUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum, value: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Administration/User/Api/UserSettings",
                timeout: 120000,
                params: { userSetting: userSetting, value: value }
            });
        }
    }
    export var $userSettingsService: Core.NG.INamedDependency<IUserSettingsService> = Core.NG.CoreModule.RegisterService("ApiLayer.UserSettingsService", UserSettingsService, Core.NG.$http);
}

module Core.Api {
    // Core.Api.BackplaneController
    class BackplaneService implements IBackplaneService {
        constructor(private $http: ng.IHttpService) { }
        IsBackplaneActive(): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Backplane",
                timeout: 120000
            });
        }
    }
    export var $backplaneService: Core.NG.INamedDependency<IBackplaneService> = Core.NG.CoreModule.RegisterService("ApiLayer.BackplaneService", BackplaneService, Core.NG.$http);
}

module Core.Api {
    // Core.Api.EntityController
    class EntityService implements IEntityService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number): ng.IHttpPromise<Core.Api.Models.IEntityModel>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Entity",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        GetOpenEntities(userId: number): ng.IHttpPromise<Core.Api.Models.IEntityModel[]>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Entity",
                timeout: 120000,
                params: { userId: userId }
            });
        }
        GetStartOfWeek(entityId: number, calendarDay: string): ng.IHttpPromise<number>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Entity",
                timeout: 120000,
                params: { entityId: entityId, calendarDay: calendarDay }
            });
        }
        GetEntitiesByIds(entityIds: number[]): ng.IHttpPromise<Core.Api.Models.IEntityModel[]>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Entity",
                timeout: 120000,
                params: { entityIds: entityIds }
            });
        }
        GetEntitiesByEntityType(entityTypeId: Core.Api.Models.EntityType): ng.IHttpPromise<Core.Api.Models.IEntityModel[]>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Entity",
                timeout: 120000,
                params: { entityTypeId: entityTypeId }
            });
        }
    }
    export var $entityService: Core.NG.INamedDependency<IEntityService> = Core.NG.CoreModule.RegisterService("ApiLayer.EntityService", EntityService, Core.NG.$http);
}

module Core.Api {
    // Core.Api.MobileSettingsController
    class MobileSettingsService implements IMobileSettingsService {
        constructor(private $http: ng.IHttpService) { }
        Post(/*[FromBody]*/ mobileSettings: Core.Api.Models.IMobileSettings): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Core/Api/MobileSettings",
                timeout: 120000,
                data: mobileSettings
            });
        }
    }
    export var $mobileSettingsService: Core.NG.INamedDependency<IMobileSettingsService> = Core.NG.CoreModule.RegisterService("ApiLayer.MobileSettingsService", MobileSettingsService, Core.NG.$http);
}

module Core.Api {
    // Core.Api.NotificationsController
    class NotificationsService implements INotificationsService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<Core.Api.Models.INotificationArea[]>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Notifications",
                timeout: 120000
            });
        }
    }
    export var $notificationsService: Core.NG.INamedDependency<INotificationsService> = Core.NG.CoreModule.RegisterService("ApiLayer.NotificationsService", NotificationsService, Core.NG.$http);
}

module Core.Api {
    // Core.Api.TranslationsController
    class TranslationsService implements ITranslationsService {
        constructor(private $http: ng.IHttpService) { }
        Get(culture: string): ng.IHttpPromise<Core.Api.Models.ITranslations>{
            return this.$http({
                method: "GET",
                url: "/Core/Api/Translations",
                timeout: 120000,
                params: { culture: culture }
            });
        }
    }
    export var $translationsService: Core.NG.INamedDependency<ITranslationsService> = Core.NG.CoreModule.RegisterService("ApiLayer.TranslationsService", TranslationsService, Core.NG.$http);
}

module Core.Auth.Api {
    // Core.Auth.Api.LogonController
    class LogonService implements ILogonService {
        constructor(private $http: ng.IHttpService) { }
        PostUserLogon(/*[FromBody]*/ credentials: Core.Auth.Api.Models.ICredentials): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse>{
            return this.$http({
                method: "POST",
                url: "/Core/Auth/Api/Logon",
                timeout: 120000,
                data: credentials
            });
        }
        PostUserLogonWithPin(userName: string, pin: string, pinToken: string): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse>{
            return this.$http({
                method: "POST",
                url: "/Core/Auth/Api/Logon",
                timeout: 120000,
                params: { userName: userName, pin: pin, pinToken: pinToken }
            });
        }
        GetUser(entityId: number): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse>{
            return this.$http({
                method: "GET",
                url: "/Core/Auth/Api/Logon",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $logonService: Core.NG.INamedDependency<ILogonService> = Core.NG.CoreModule.RegisterService("ApiLayer.LogonService", LogonService, Core.NG.$http);
}

module Core.Auth.Api {
    // Core.Auth.Api.LogonImageController
    class LogonImageService implements ILogonImageService {
        constructor(private $http: ng.IHttpService) { }
        Get(key: string): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Core/Auth/Api/LogonImage",
                timeout: 120000,
                params: { key: key }
            });
        }
    }
    export var $logonImageService: Core.NG.INamedDependency<ILogonImageService> = Core.NG.CoreModule.RegisterService("ApiLayer.LogonImageService", LogonImageService, Core.NG.$http);
}

module Core.Auth.Api {
    // Core.Auth.Api.PartnerLoginController
    class PartnerLoginService implements IPartnerLoginService {
        constructor(private $http: ng.IHttpService) { }
        Post(): ng.IHttpPromise<any>{
            return this.$http({
                method: "POST",
                url: "/Core/Auth/Api/PartnerLogin",
                timeout: 120000
            });
        }
    }
    export var $partnerLoginService: Core.NG.INamedDependency<IPartnerLoginService> = Core.NG.CoreModule.RegisterService("ApiLayer.PartnerLoginService", PartnerLoginService, Core.NG.$http);
}

module Core.Auth.Api {
    // Core.Auth.Api.PinChallengeController
    class PinChallengeService implements IPinChallengeService {
        constructor(private $http: ng.IHttpService) { }
        Get(username: string): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Core/Auth/Api/PinChallenge",
                timeout: 120000,
                params: { username: username }
            });
        }
    }
    export var $pinChallengeService: Core.NG.INamedDependency<IPinChallengeService> = Core.NG.CoreModule.RegisterService("ApiLayer.PinChallengeService", PinChallengeService, Core.NG.$http);
}

module Core.Auth.Api {
    // Core.Auth.Api.SsoController
    class SsoService implements ISsoService {
        constructor(private $http: ng.IHttpService) { }
        GetSsoEnabled(): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "GET",
                url: "/Core/Auth/Api/Sso",
                timeout: 120000
            });
        }
        PostSsoLogon(): ng.IHttpPromise<any>{
            return this.$http({
                method: "POST",
                url: "/Core/Auth/Api/Sso",
                timeout: 120000
            });
        }
    }
    export var $ssoService: Core.NG.INamedDependency<ISsoService> = Core.NG.CoreModule.RegisterService("ApiLayer.SsoService", SsoService, Core.NG.$http);
}

module Core.Auth.Api {
    // Core.Auth.Api.SsoLogoutController
    class SsoLogoutService implements ISsoLogoutService {
        constructor(private $http: ng.IHttpService) { }
        PostSsoLogout(): ng.IHttpPromise<Core.Auth.Api.SsoLogoutController.ISsoLogoutResponce>{
            return this.$http({
                method: "POST",
                url: "/Core/Auth/Api/SsoLogout",
                timeout: 120000
            });
        }
    }
    export var $ssoLogoutService: Core.NG.INamedDependency<ISsoLogoutService> = Core.NG.CoreModule.RegisterService("ApiLayer.SsoLogoutService", SsoLogoutService, Core.NG.$http);
}

module Core.Diagnostics.Api.Services {
    // Core.Diagnostics.Api.Services.DiagnosticController
    class DiagnosticService implements IDiagnosticService {
        constructor(private $http: ng.IHttpService) { }
        GetDiagnostic(): ng.IHttpPromise<Core.Diagnostics.Api.Models.IDiagnosticServiceResponse>{
            return this.$http({
                method: "GET",
                url: "/Core/Diagnostics/Api/Services/Diagnostic",
                timeout: 120000
            });
        }
    }
    export var $diagnosticService: Core.NG.INamedDependency<IDiagnosticService> = Core.NG.CoreModule.RegisterService("ApiLayer.DiagnosticService", DiagnosticService, Core.NG.$http);
}

module Core.PartnerRedirect.Api {
    // Core.PartnerRedirect.Api.PartnerRedirectController
    class PartnerRedirectService implements IPartnerRedirectService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<Core.PartnerRedirect.Api.Models.ILinkRequest>{
            return this.$http({
                method: "GET",
                url: "/Core/PartnerRedirect/Api/PartnerRedirect",
                timeout: 120000
            });
        }
    }
    export var $partnerRedirectService: Core.NG.INamedDependency<IPartnerRedirectService> = Core.NG.CoreModule.RegisterService("ApiLayer.PartnerRedirectService", PartnerRedirectService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.CalendarController
    class CalendarService implements ICalendarService {
        constructor(private $http: ng.IHttpService) { }
        GetDaysOfWorkWeek(startOfWeek: string, entityId: number): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Calendar",
                timeout: 120000,
                params: { startOfWeek: startOfWeek, entityId: entityId }
            });
        }
    }
    export var $calendarService: Core.NG.INamedDependency<ICalendarService> = Core.NG.CoreModule.RegisterService("ApiLayer.CalendarService", CalendarService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.CharacteristicCodeController
    class CharacteristicCodeService implements ICharacteristicCodeService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<string[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/CharacteristicCode",
                timeout: 120000
            });
        }
        Get1(id: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/CharacteristicCode/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
        Post(/*[FromBody]*/ value: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/CharacteristicCode",
                timeout: 120000,
                data: value
            });
        }
        Put(id: number, /*[FromBody]*/ value: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Forecasting/Api/CharacteristicCode/" + encodeURI(id.toString()),
                timeout: 120000,
                data: value
            });
        }
        Delete(id: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/CharacteristicCode/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
    }
    export var $characteristicCodeService: Core.NG.INamedDependency<ICharacteristicCodeService> = Core.NG.CoreModule.RegisterService("ApiLayer.CharacteristicCodeService", CharacteristicCodeService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.DaySegmentController
    class DaySegmentService implements IDaySegmentService {
        constructor(private $http: ng.IHttpService) { }
        GetDaysegments(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IDaySegment[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/DaySegment",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $daySegmentService: Core.NG.INamedDependency<IDaySegmentService> = Core.NG.CoreModule.RegisterService("ApiLayer.DaySegmentService", DaySegmentService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.EventCalendarController
    class EventCalendarService implements IEventCalendarService {
        constructor(private $http: ng.IHttpService) { }
        GetEventWeekDaysInfo(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Forecasting.Api.Models.IEventWeekDayInfo[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/EventCalendar",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
            });
        }
        GetCalendarInfo(entityId: number, year: number, month: number): ng.IHttpPromise<Forecasting.Api.Models.IEventCalendarInfo>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/EventCalendar",
                timeout: 120000,
                params: { entityId: entityId, year: year, month: month }
            });
        }
    }
    export var $eventCalendarService: Core.NG.INamedDependency<IEventCalendarService> = Core.NG.CoreModule.RegisterService("ApiLayer.EventCalendarService", EventCalendarService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.EventController
    class EventService implements IEventService {
        constructor(private $http: ng.IHttpService) { }
        GetEventProfiles(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IEventProfile[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Event",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        GetProfileNameExistsForEntity(entityId: number, profileName: string): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Event",
                timeout: 120000,
                params: { entityId: entityId, profileName: profileName }
            });
        }
        PostEventProfile(/*[FromBody]*/ eventProfile: Forecasting.Api.Models.IEventProfile, entityId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/Event",
                timeout: 120000,
                params: { entityId: entityId },
                data: eventProfile
            });
        }
        DeleteEventProfile(eventProfileId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/Event",
                timeout: 120000,
                params: { eventProfileId: eventProfileId }
            });
        }
    }
    export var $eventService: Core.NG.INamedDependency<IEventService> = Core.NG.CoreModule.RegisterService("ApiLayer.EventService", EventService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.EventTagController
    class EventTagService implements IEventTagService {
        constructor(private $http: ng.IHttpService) { }
        GetEventProfileTags(eventProfileId: number): ng.IHttpPromise<Forecasting.Api.Models.IEventProfileTag[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/EventTag",
                timeout: 120000,
                params: { eventProfileId: eventProfileId }
            });
        }
        PostEventProfileTag(/*[FromBody]*/ tag: Forecasting.Api.Models.IEventProfileTag, entityId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/EventTag",
                timeout: 120000,
                params: { entityId: entityId },
                data: tag
            });
        }
        PutEventProfileTag(/*[FromBody]*/ tag: Forecasting.Api.Models.IEventProfileTag, entityId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Forecasting/Api/EventTag",
                timeout: 120000,
                params: { entityId: entityId },
                data: tag
            });
        }
        DeleteEventProfileTag(entityId: number, tagId: number, connectionId: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/EventTag",
                timeout: 120000,
                params: { entityId: entityId, tagId: tagId, connectionId: connectionId }
            });
        }
    }
    export var $eventTagService: Core.NG.INamedDependency<IEventTagService> = Core.NG.CoreModule.RegisterService("ApiLayer.EventTagService", EventTagService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.EventTagNoteController
    class EventTagNoteService implements IEventTagNoteService {
        constructor(private $http: ng.IHttpService) { }
        PutEventProfileTagNote(/*[FromBody]*/ tagnote: Forecasting.Api.Models.IEventProfileTagNote, entityId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Forecasting/Api/EventTagNote",
                timeout: 120000,
                params: { entityId: entityId },
                data: tagnote
            });
        }
    }
    export var $eventTagNoteService: Core.NG.INamedDependency<IEventTagNoteService> = Core.NG.CoreModule.RegisterService("ApiLayer.EventTagNoteService", EventTagNoteService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastController
    class ForecastService implements IForecastService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastById(entityId: number, id: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecast>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Forecast/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, filterId: filterId }
            });
        }
        GetForecastForBusinessDay(entityId: number, businessDay: string): ng.IHttpPromise<Forecasting.Api.Models.IForecast>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Forecast",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay }
            });
        }
        GetForecastsForBusinessDateRange(entityId: number, startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.IForecast[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Forecast",
                timeout: 120000,
                params: { entityId: entityId, startDate: startDate, endDate: endDate }
            });
        }
        GetForecasts(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecast[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Forecast",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        PatchRevertForecast(entityId: number, forecastId: number, /*[FromBody]*/ opcollection: Forecasting.Api.Models.IForecastOperationCollection): ng.IHttpPromise<number>{
            return this.$http({
                method: "PATCH",
                url: "/Forecasting/Api/Forecast",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId },
                data: opcollection
            });
        }
    }
    export var $forecastService: Core.NG.INamedDependency<IForecastService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastService", ForecastService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastFilterAssignController
    class ForecastFilterAssignService implements IForecastFilterAssignService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastFilterAssigns(): ng.IHttpPromise<Forecasting.Api.Models.IForecastFilterAssignRecord[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastFilterAssign",
                timeout: 120000
            });
        }
        PostForecastFilterAssign(/*[FromBody]*/ forecastFilterAssignRecords: Forecasting.Api.Models.IForecastFilterAssignRecord[]): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/ForecastFilterAssign",
                timeout: 120000,
                data: forecastFilterAssignRecords
            });
        }
    }
    export var $forecastFilterAssignService: Core.NG.INamedDependency<IForecastFilterAssignService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastFilterAssignService", ForecastFilterAssignService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastFilterController
    class ForecastFilterService implements IForecastFilterService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastFilters(): ng.IHttpPromise<Forecasting.Api.Models.IForecastFilterRecord[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastFilter",
                timeout: 120000
            });
        }
        DeleteFilterById(id: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/ForecastFilter/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
    }
    export var $forecastFilterService: Core.NG.INamedDependency<IForecastFilterService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastFilterService", ForecastFilterService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastFilterDialogController
    class ForecastFilterDialogService implements IForecastFilterDialogService {
        constructor(private $http: ng.IHttpService) { }
        PostInsertOrUpdateForecastFilter(/*[FromBody]*/ forecastFilterRecord: Forecasting.Api.Models.IForecastFilterRecord): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/ForecastFilterDialog",
                timeout: 120000,
                data: forecastFilterRecord
            });
        }
    }
    export var $forecastFilterDialogService: Core.NG.INamedDependency<IForecastFilterDialogService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastFilterDialogService", ForecastFilterDialogService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastGenerationController
    class ForecastGenerationService implements IForecastGenerationService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number): ng.IHttpPromise<any[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastGeneration",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        Post(entityId: number, /*[FromBody]*/ request: any): ng.IHttpPromise<any>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/ForecastGeneration",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $forecastGenerationService: Core.NG.INamedDependency<IForecastGenerationService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastGenerationService", ForecastGenerationService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastPipelineController
    class ForecastPipelineService implements IForecastPipelineService {
        constructor(private $http: ng.IHttpService) { }
        PostPipeline(entityId: number, forecastId: number, /*[FromBody]*/ request: Forecasting.Api.Models.IForecastPipelineRequest): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/ForecastPipeline",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId },
                data: request
            });
        }
    }
    export var $forecastPipelineService: Core.NG.INamedDependency<IForecastPipelineService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastPipelineService", ForecastPipelineService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastSalesEvaluationController
    class ForecastSalesEvaluationService implements IForecastSalesEvaluationService {
        constructor(private $http: ng.IHttpService) { }
        GetEvaluateSales(entityId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedSalesEvaluationResponse[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastSalesEvaluation",
                timeout: 120000,
                params: { entityId: entityId, date: date, filterId: filterId }
            });
        }
    }
    export var $forecastSalesEvaluationService: Core.NG.INamedDependency<IForecastSalesEvaluationService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastSalesEvaluationService", ForecastSalesEvaluationService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastSalesItemEvaluationController
    class ForecastSalesItemEvaluationService implements IForecastSalesItemEvaluationService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, salesItemId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedSalesItemEvaluationResponse[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastSalesItemEvaluation",
                timeout: 120000,
                params: { entityId: entityId, salesItemId: salesItemId, date: date, filterId: filterId }
            });
        }
    }
    export var $forecastSalesItemEvaluationService: Core.NG.INamedDependency<IForecastSalesItemEvaluationService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastSalesItemEvaluationService", ForecastSalesItemEvaluationService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastTransactionEvaluationController
    class ForecastTransactionEvaluationService implements IForecastTransactionEvaluationService {
        constructor(private $http: ng.IHttpService) { }
        GetEvaluateTransactions(entityId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedTransactionEvaluationResponse[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastTransactionEvaluation",
                timeout: 120000,
                params: { entityId: entityId, date: date, filterId: filterId }
            });
        }
    }
    export var $forecastTransactionEvaluationService: Core.NG.INamedDependency<IForecastTransactionEvaluationService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastTransactionEvaluationService", ForecastTransactionEvaluationService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ForecastZoneController
    class ForecastZoneService implements IForecastZoneService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastZones(): ng.IHttpPromise<Forecasting.Api.Models.IZone[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/ForecastZone",
                timeout: 120000
            });
        }
    }
    export var $forecastZoneService: Core.NG.INamedDependency<IForecastZoneService> = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastZoneService", ForecastZoneService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.FutureOrderController
    class FutureOrderService implements IFutureOrderService {
        constructor(private $http: ng.IHttpService) { }
        GetAllFutureOrdersForEntity(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/FutureOrder",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        GetFutureOrdersByStatusDateRange(entityId: number, startDate: string, endDate: string, statusIds: string): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/FutureOrder",
                timeout: 120000,
                params: { entityId: entityId, startDate: startDate, endDate: endDate, statusIds: statusIds }
            });
        }
        GetFutureOrdersForDateRange(entityId: number, startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/FutureOrder",
                timeout: 120000,
                params: { entityId: entityId, startDate: startDate, endDate: endDate }
            });
        }
        GetFutureOrdersForBusinessDay(entityId: number, businessDay: string): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/FutureOrder",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay }
            });
        }
    }
    export var $futureOrderService: Core.NG.INamedDependency<IFutureOrderService> = Core.NG.CoreModule.RegisterService("ApiLayer.FutureOrderService", FutureOrderService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.HistoricalController
    class HistoricalService implements IHistoricalService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastSalesHistory(entityId: number, forecastId: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IHistoricalBasis[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Historical",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId }
            });
        }
    }
    export var $historicalService: Core.NG.INamedDependency<IHistoricalService> = Core.NG.CoreModule.RegisterService("ApiLayer.HistoricalService", HistoricalService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.InventoryItemMetricController
    class InventoryItemMetricService implements IInventoryItemMetricService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/InventoryItemMetric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        Get1(entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/InventoryItemMetric/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        Get2(entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/InventoryItemMetric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, ids: ids, filterId: filterId, aggregate: aggregate }
            });
        }
    }
    export var $inventoryItemMetricService: Core.NG.INamedDependency<IInventoryItemMetricService> = Core.NG.CoreModule.RegisterService("ApiLayer.InventoryItemMetricService", InventoryItemMetricService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.MetricAllController
    class MetricAllService implements IMetricAllService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastMetricAlls(entityId: number, forecastId: number, filterId: number, includeActuals: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingMetricAlls>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/MetricAll",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals }
            });
        }
        GetForecastMetricAlls1(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecastingMetricAlls>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/MetricAll",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $metricAllService: Core.NG.INamedDependency<IMetricAllService> = Core.NG.CoreModule.RegisterService("ApiLayer.MetricAllService", MetricAllService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.MetricController
    class MetricService implements IMetricService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastMetrics(entityId: number, forecastId: number, filterId: number, includeActuals: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Metric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals }
            });
        }
        GetForecastMetricsByServiceType(entityId: number, forecastId: number, serviceType: number, includeActuals: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Metric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, serviceType: serviceType, includeActuals: includeActuals }
            });
        }
        GetForecastEvaluationById(entityId: number, forecastEvaluationId: string): ng.IHttpPromise<string[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Metric",
                timeout: 120000,
                params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
            });
        }
        GetForecastMetricId(entityId: number, forecastId: number, id: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Metric/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId }
            });
        }
        GetEvaluationMetricId(entityId: number, forecastEvaluationId: string, id: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Metric/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
            });
        }
        PatchForecastMetricDetails(entityId: number, forecastId: number, version: number, /*[FromBody]*/ metricDetailRequests: Forecasting.Api.Models.IForecastMetricDetailsHeader[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>{
            return this.$http({
                method: "PATCH",
                url: "/Forecasting/Api/Metric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, version: version },
                data: metricDetailRequests
            });
        }
    }
    export var $metricService: Core.NG.INamedDependency<IMetricService> = Core.NG.CoreModule.RegisterService("ApiLayer.MetricService", MetricService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.MirroringRegenerationController
    class MirroringRegenerationService implements IMirroringRegenerationService {
        constructor(private $http: ng.IHttpService) { }
        Post(entityId: number, /*[FromBody]*/ request: Forecasting.Api.Models.IMirroringRegenerationRequest): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/MirroringRegeneration",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $mirroringRegenerationService: Core.NG.INamedDependency<IMirroringRegenerationService> = Core.NG.CoreModule.RegisterService("ApiLayer.MirroringRegenerationService", MirroringRegenerationService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.MultiFilterMetricAllController
    class MultiFilterMetricAllService implements IMultiFilterMetricAllService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastMetricAlls(entityId: number, forecastId: number, filterIds: number[], includeActuals: boolean): ng.IHttpPromise<any[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/MultiFilterMetricAll",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterIds: filterIds, includeActuals: includeActuals }
            });
        }
    }
    export var $multiFilterMetricAllService: Core.NG.INamedDependency<IMultiFilterMetricAllService> = Core.NG.CoreModule.RegisterService("ApiLayer.MultiFilterMetricAllService", MultiFilterMetricAllService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.MultiFilterSalesItemMetricAllController
    class MultiFilterSalesItemMetricAllService implements IMultiFilterSalesItemMetricAllService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastingSalesItemMetricAlls(entityId: number, forecastId: number, filterIds: number[], includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/MultiFilterSalesItemMetricAll",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterIds: filterIds, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        GetSalesItemMetrics(entityId: number, forecastId: number, id: number, filterIds: number[], includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/MultiFilterSalesItemMetricAll/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterIds: filterIds, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        GetSalesItemMetricDetailsById(entityId: number, forecastId: number, ids: string, filterIds: number[], aggregate: boolean): ng.IHttpPromise<any[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/MultiFilterSalesItemMetricAll",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, ids: ids, filterIds: filterIds, aggregate: aggregate }
            });
        }
    }
    export var $multiFilterSalesItemMetricAllService: Core.NG.INamedDependency<IMultiFilterSalesItemMetricAllService> = Core.NG.CoreModule.RegisterService("ApiLayer.MultiFilterSalesItemMetricAllService", MultiFilterSalesItemMetricAllService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.PromotionController
    class PromotionService implements IPromotionService {
        constructor(private $http: ng.IHttpService) { }
        Get(startDate: string, endDate: string, status: any): ng.IHttpPromise<Forecasting.Api.Models.IPromotionListItem[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Promotion",
                timeout: 120000,
                params: { startDate: startDate, endDate: endDate, status: status }
            });
        }
        Get1(id: number): ng.IHttpPromise<Forecasting.Api.Models.IPromotion>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
        GetWithTimeline(id: number, withTimeline: boolean): ng.IHttpPromise<Forecasting.Api.Models.IPromotion>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { withTimeline: withTimeline }
            });
        }
        GetFormData(id: number, withFormData: boolean): ng.IHttpPromise<Forecasting.Api.Models.IPromotionFormData>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { withFormData: withFormData }
            });
        }
        Post(/*[FromBody]*/ promo: Forecasting.Api.Models.IPromotion, checkOverlap: boolean): ng.IHttpPromise<Forecasting.Api.Models.IPromotionResult>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/Promotion",
                timeout: 120000,
                params: { checkOverlap: checkOverlap },
                data: promo
            });
        }
        Post1(/*[FromBody]*/ request: any): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/Promotion",
                timeout: 120000,
                data: request
            });
        }
        Delete(id: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
    }
    export var $promotionService: Core.NG.INamedDependency<IPromotionService> = Core.NG.CoreModule.RegisterService("ApiLayer.PromotionService", PromotionService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemController
    class SalesItemService implements ISalesItemService {
        constructor(private $http: ng.IHttpService) { }
        GetSalesItemsForForecast(entityId: number, forecastId: number): ng.IHttpPromise<Forecasting.Api.Models.ISalesItem[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItem",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId }
            });
        }
        Get(entityId: number, forecastId: number, id: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItem/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId }
            });
        }
        GetAll(searchText: string): ng.IHttpPromise<Forecasting.Api.Models.ISalesItem[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItem",
                timeout: 120000,
                params: { searchText: searchText }
            });
        }
    }
    export var $salesItemService: Core.NG.INamedDependency<ISalesItemService> = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemService", SalesItemService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemHistoricalController
    class SalesItemHistoricalService implements ISalesItemHistoricalService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastSalesItemHistory(entityId: number, forecastId: number, salesItemId: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IHistoricalSalesItem[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemHistorical",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, salesItemId: salesItemId, filterId: filterId }
            });
        }
    }
    export var $salesItemHistoricalService: Core.NG.INamedDependency<ISalesItemHistoricalService> = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemHistoricalService", SalesItemHistoricalService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemMetricAllController
    class SalesItemMetricAllService implements ISalesItemMetricAllService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastingSalesItemMetricAlls(entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetricAll",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        GetSalesItemMetrics(entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetricAll/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        GetSalesItemMetricDetailsById(entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetricAll",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, ids: ids, filterId: filterId, aggregate: aggregate }
            });
        }
    }
    export var $salesItemMetricAllService: Core.NG.INamedDependency<ISalesItemMetricAllService> = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemMetricAllService", SalesItemMetricAllService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemMetricController
    class SalesItemMetricService implements ISalesItemMetricService {
        constructor(private $http: ng.IHttpService) { }
        GetForecastSalesItemMetric(entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        GetForecastSalesItemMetric1(entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetric/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
            });
        }
        GetForecastSalesItemMetric2(entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, ids: ids, filterId: filterId, aggregate: aggregate }
            });
        }
        Get(entityId: number, forecastEvaluationId: string): ng.IHttpPromise<string[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetric",
                timeout: 120000,
                params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
            });
        }
        GetEvaluationSalesItemMetricId(entityId: number, forecastEvaluationId: string, id: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMetric/" + encodeURI(id.toString()),
                timeout: 120000,
                params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
            });
        }
        PatchSalesItemMetricDetails(entityId: number, forecastId: number, version: number, /*[FromBody]*/ salesItemMetricDetailRequests: Forecasting.Api.Models.IForecastSalesItemMetricDetailsHeader[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>{
            return this.$http({
                method: "PATCH",
                url: "/Forecasting/Api/SalesItemMetric",
                timeout: 120000,
                params: { entityId: entityId, forecastId: forecastId, version: version },
                data: salesItemMetricDetailRequests
            });
        }
    }
    export var $salesItemMetricService: Core.NG.INamedDependency<ISalesItemMetricService> = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemMetricService", SalesItemMetricService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemMirrorIntervalsController
    class SalesItemMirrorIntervalsService implements ISalesItemMirrorIntervalsService {
        constructor(private $http: ng.IHttpService) { }
        GetSalesItemMirrorInterval(id: number): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMirrorIntervals/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
        GetSalesItemMirrorIntervals(startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/SalesItemMirrorIntervals",
                timeout: 120000,
                params: { startDate: startDate, endDate: endDate }
            });
        }
        PostSalesItemMirrorIntervals(/*[FromBody]*/ salesItemMirrorInterval: Forecasting.Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/SalesItemMirrorIntervals",
                timeout: 120000,
                data: salesItemMirrorInterval
            });
        }
        DeleteSalesItemMirrorIntervals(intervalId: number, resetManagerForecast: boolean): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/SalesItemMirrorIntervals",
                timeout: 120000,
                params: { intervalId: intervalId, resetManagerForecast: resetManagerForecast }
            });
        }
    }
    export var $salesItemMirrorIntervalsService: Core.NG.INamedDependency<ISalesItemMirrorIntervalsService> = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemMirrorIntervalsService", SalesItemMirrorIntervalsService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemSystemAdjustmentController
    class SalesItemSystemAdjustmentService implements ISalesItemSystemAdjustmentService {
        constructor(private $http: ng.IHttpService) { }
        PostSalesItemSystemAdjustments(entityId: number, businessDay: string, /*[FromBody]*/ salesItemSystemAdjustmentRequest: any[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/SalesItemSystemAdjustment",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay },
                data: salesItemSystemAdjustmentRequest
            });
        }
    }
    export var $salesItemSystemAdjustmentService: Core.NG.INamedDependency<ISalesItemSystemAdjustmentService> = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemSystemAdjustmentService", SalesItemSystemAdjustmentService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.StoreMirrorIntervalsController
    class StoreMirrorIntervalsService implements IStoreMirrorIntervalsService {
        constructor(private $http: ng.IHttpService) { }
        GetStoreMirrorInterval(id: number): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorInterval>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/StoreMirrorIntervals/" + encodeURI(id.toString()),
                timeout: 120000
            });
        }
        GetStoreMirrorIntervals(entityId: number, group: any, types: any): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorIntervalGroup[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/StoreMirrorIntervals",
                timeout: 120000,
                params: { entityId: entityId, group: group, types: types }
            });
        }
        PostStoreMirrorIntervals(/*[FromBody]*/ storeMirrorIntervalGroup: Forecasting.Api.Models.IStoreMirrorIntervalGroup): ng.IHttpPromise<any>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/StoreMirrorIntervals",
                timeout: 120000,
                data: storeMirrorIntervalGroup
            });
        }
        DeleteStoreMirrorInterval(entityId: number, userName: string, groupId: any, resetManagerForecasts: boolean): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Forecasting/Api/StoreMirrorIntervals",
                timeout: 120000,
                params: { entityId: entityId, userName: userName, groupId: groupId, resetManagerForecasts: resetManagerForecasts }
            });
        }
    }
    export var $storeMirrorIntervalsService: Core.NG.INamedDependency<IStoreMirrorIntervalsService> = Core.NG.CoreModule.RegisterService("ApiLayer.StoreMirrorIntervalsService", StoreMirrorIntervalsService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SystemAdjustmentController
    class SystemAdjustmentService implements ISystemAdjustmentService {
        constructor(private $http: ng.IHttpService) { }
        PostSystemAdjustments(entityId: number, businessDay: string, /*[FromBody]*/ systemAdjustmentRequest: any[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/SystemAdjustment",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay },
                data: systemAdjustmentRequest
            });
        }
    }
    export var $systemAdjustmentService: Core.NG.INamedDependency<ISystemAdjustmentService> = Core.NG.CoreModule.RegisterService("ApiLayer.SystemAdjustmentService", SystemAdjustmentService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.SystemForecastGenerationController
    class SystemForecastGenerationService implements ISystemForecastGenerationService {
        constructor(private $http: ng.IHttpService) { }
        Post(entityId: number, /*[FromBody]*/ request: Forecasting.Api.Models.ISystemForecastGenerationRequest): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Forecasting/Api/SystemForecastGeneration",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $systemForecastGenerationService: Core.NG.INamedDependency<ISystemForecastGenerationService> = Core.NG.CoreModule.RegisterService("ApiLayer.SystemForecastGenerationService", SystemForecastGenerationService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.TransitionController
    class TransitionService implements ITransitionService {
        constructor(private $http: ng.IHttpService) { }
        GetTransition(): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/Transition",
                timeout: 120000
            });
        }
    }
    export var $transitionService: Core.NG.INamedDependency<ITransitionService> = Core.NG.CoreModule.RegisterService("ApiLayer.TransitionService", TransitionService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.TranslatedPosServiceTypeController
    class TranslatedPosServiceTypeService implements ITranslatedPosServiceTypeService {
        constructor(private $http: ng.IHttpService) { }
        GetPosServiceTypeEnumTranslations(): ng.IHttpPromise<Core.Api.Models.ITranslatedEnum[]>{
            return this.$http({
                method: "GET",
                url: "/Forecasting/Api/TranslatedPosServiceType",
                timeout: 120000
            });
        }
    }
    export var $translatedPosServiceTypeService: Core.NG.INamedDependency<ITranslatedPosServiceTypeService> = Core.NG.CoreModule.RegisterService("ApiLayer.TranslatedPosServiceTypeService", TranslatedPosServiceTypeService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.CountController
    class CountService implements ICountService {
        constructor(private $http: ng.IHttpService) { }
        Get(countType: Inventory.Count.Api.Models.CountType, entityId: number, countId: number): ng.IHttpPromise<Inventory.Count.Api.Models.IInventoryCount>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/Count",
                timeout: 120000,
                params: { countType: countType, entityId: entityId, countId: countId }
            });
        }
        Delete(countType: Inventory.Count.Api.Models.CountType, countId: number, entityId: number, connectionId: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Inventory/Count/Api/Count",
                timeout: 120000,
                params: { countType: countType, countId: countId, entityId: entityId, connectionId: connectionId }
            });
        }
        PutCount(/*[FromBody]*/ countUpdates: Inventory.Count.Api.Models.ICountUpdate[], entityId: number, connectionId: string): ng.IHttpPromise<Inventory.Count.Api.Models.IUpdatedItemCountStatus[]>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Count/Api/Count",
                timeout: 30000,
                params: { entityId: entityId, connectionId: connectionId },
                data: countUpdates
            });
        }
        GetCheckIfCountApplied(countId: number): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/Count",
                timeout: 120000,
                params: { countId: countId }
            });
        }
        GetEntityItemsAndVendorEntityItemsNotInCurrentCount(entityId: number, countId: number, locationId: number, stockCountItemType: number, search: string): ng.IHttpPromise<Inventory.Count.Api.Models.ICountItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/Count",
                timeout: 120000,
                params: { entityId: entityId, countId: countId, locationId: locationId, stockCountItemType: stockCountItemType, search: search }
            });
        }
        PostUpdateCountWithCountItems(entityId: number, countId: number, locationId: number, /*[FromBody]*/ countItems: Inventory.Count.Api.Models.ICountItem[], countType: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Count/Api/Count",
                timeout: 120000,
                params: { entityId: entityId, countId: countId, locationId: locationId, countType: countType },
                data: countItems
            });
        }
    }
    export var $countService: Core.NG.INamedDependency<ICountService> = Core.NG.CoreModule.RegisterService("ApiLayer.CountService", CountService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.CountTypeController
    class CountTypeService implements ICountTypeService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ICountStatusResponse[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/CountType",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $countTypeService: Core.NG.INamedDependency<ICountTypeService> = Core.NG.CoreModule.RegisterService("ApiLayer.CountTypeService", CountTypeService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.CountVarianceController
    class CountVarianceService implements ICountVarianceService {
        constructor(private $http: ng.IHttpService) { }
        GetCountItemsVariances(entityId: number, countId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ICountItemVariance[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/CountVariance",
                timeout: 120000,
                params: { entityId: entityId, countId: countId }
            });
        }
    }
    export var $countVarianceService: Core.NG.INamedDependency<ICountVarianceService> = Core.NG.CoreModule.RegisterService("ApiLayer.CountVarianceService", CountVarianceService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.FinishController
    class FinishService implements IFinishService {
        constructor(private $http: ng.IHttpService) { }
        Post(/*[FromBody]*/ model: Inventory.Count.Api.Models.IFinishCountRequest): ng.IHttpPromise<Inventory.Count.Api.Models.IApplyCount>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Count/Api/Finish",
                timeout: 120000,
                data: model
            });
        }
        GetApplyDateByCountType(entityId: number, countType: any): ng.IHttpPromise<Inventory.Count.Api.Models.IApplyDateSettings>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/Finish",
                timeout: 120000,
                params: { entityId: entityId, countType: countType }
            });
        }
    }
    export var $finishService: Core.NG.INamedDependency<IFinishService> = Core.NG.CoreModule.RegisterService("ApiLayer.FinishService", FinishService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.ReviewController
    class ReviewService implements IReviewService {
        constructor(private $http: ng.IHttpService) { }
        GetReview(stockCountLocationId: number, countType: Inventory.Count.Api.Models.CountType, entityIdCurrent: number): ng.IHttpPromise<Inventory.Count.Api.Models.ICountReviewViewModel>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/Review",
                timeout: 120000,
                params: { stockCountLocationId: stockCountLocationId, countType: countType, entityIdCurrent: entityIdCurrent }
            });
        }
    }
    export var $reviewService: Core.NG.INamedDependency<IReviewService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReviewService", ReviewService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathAddItemsController
    class TravelPathAddItemsService implements ITravelPathAddItemsService {
        constructor(private $http: ng.IHttpService) { }
        GetSearchItemsLimited(searchCriteria: string, currentEntityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.IInventoryCountLocationItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/TravelPathAddItems",
                timeout: 120000,
                params: { searchCriteria: searchCriteria, currentEntityId: currentEntityId }
            });
        }
    }
    export var $travelPathAddItemsService: Core.NG.INamedDependency<ITravelPathAddItemsService> = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathAddItemsService", TravelPathAddItemsService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathController
    class TravelPathService implements ITravelPathService {
        constructor(private $http: ng.IHttpService) { }
        GetTravelPathData(entityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPathEntity>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/TravelPath",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        GetTravelPathDataForLocation(entityId: number, locationId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPath>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Count/Api/TravelPath",
                timeout: 120000,
                params: { entityId: entityId, locationId: locationId }
            });
        }
        PostUpdateTravelPath(/*[FromBody]*/ update: Inventory.Count.Api.Models.IUpdateTravelPath, connectionId: string, currentEntityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPathPartialUpdate[]>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Count/Api/TravelPath",
                timeout: 120000,
                params: { connectionId: connectionId, currentEntityId: currentEntityId },
                data: update
            });
        }
    }
    export var $travelPathService: Core.NG.INamedDependency<ITravelPathService> = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathService", TravelPathService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathItemController
    class TravelPathItemService implements ITravelPathItemService {
        constructor(private $http: ng.IHttpService) { }
        PostUpdateCount(/*[FromBody]*/ travelPathItemUpdate: Inventory.Count.Api.Models.ITravelPathItemUpdate): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Count/Api/TravelPathItem",
                timeout: 120000,
                data: travelPathItemUpdate
            });
        }
    }
    export var $travelPathItemService: Core.NG.INamedDependency<ITravelPathItemService> = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathItemService", TravelPathItemService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathLocationController
    class TravelPathLocationService implements ITravelPathLocationService {
        constructor(private $http: ng.IHttpService) { }
        PostAddLocation(currentEntityId: number, locationName: string, connectionId: string): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPath>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Count/Api/TravelPathLocation",
                timeout: 120000,
                params: { currentEntityId: currentEntityId, locationName: locationName, connectionId: connectionId }
            });
        }
        PutLocation(locationId: number, currentEntityId: number, newLocationName: string, targetLocationId: number, movingLocationId: number, activateLocation: boolean, deactivateLocation: boolean, renameLocation: boolean, resortLocation: boolean, connectionId: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Count/Api/TravelPathLocation",
                timeout: 120000,
                params: { locationId: locationId, currentEntityId: currentEntityId, newLocationName: newLocationName, targetLocationId: targetLocationId, movingLocationId: movingLocationId, activateLocation: activateLocation, deactivateLocation: deactivateLocation, renameLocation: renameLocation, resortLocation: resortLocation, connectionId: connectionId }
            });
        }
        DeleteLocation(locationId: number, currentEntityId: number, connectionId: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Inventory/Count/Api/TravelPathLocation",
                timeout: 120000,
                params: { locationId: locationId, currentEntityId: currentEntityId, connectionId: connectionId }
            });
        }
    }
    export var $travelPathLocationService: Core.NG.INamedDependency<ITravelPathLocationService> = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathLocationService", TravelPathLocationService, Core.NG.$http);
}

module Inventory.Count.Api {
    // Inventory.Count.Api.UpdateCostController
    class UpdateCostService implements IUpdateCostService {
        constructor(private $http: ng.IHttpService) { }
        PostUpdateCost(/*[FromBody]*/ updateCostItems: Inventory.Count.Api.Models.IUpdateCostViewModel[], currentEntityId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Count/Api/UpdateCost",
                timeout: 120000,
                params: { currentEntityId: currentEntityId },
                data: updateCostItems
            });
        }
    }
    export var $updateCostService: Core.NG.INamedDependency<IUpdateCostService> = Core.NG.CoreModule.RegisterService("ApiLayer.UpdateCostService", UpdateCostService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OrderAddItemsController
    class OrderAddItemsService implements IOrderAddItemsService {
        constructor(private $http: ng.IHttpService) { }
        GetVendorItems(entityId: number, vendorId: number, searchText: string): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderDetail[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/OrderAddItems",
                timeout: 120000,
                params: { entityId: entityId, vendorId: vendorId, searchText: searchText }
            });
        }
    }
    export var $orderAddItemsService: Core.NG.INamedDependency<IOrderAddItemsService> = Core.NG.CoreModule.RegisterService("ApiLayer.OrderAddItemsService", OrderAddItemsService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OrderController
    class OrderService implements IOrderService {
        constructor(private $http: ng.IHttpService) { }
        GetOrdersByRange(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
            });
        }
        GetOrder(entityId: number, orderId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IOrder>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, orderId: orderId }
            });
        }
        PostAddItems(entityId: number, orderId: number, /*[FromBody]*/ itemCodes: string[]): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderDetail[]>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, orderId: orderId },
                data: itemCodes
            });
        }
        PostCreateAutoSelectTemplate(entityId: number, vendorId: number, deliveryDate: string, daysToCover: number): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, vendorId: vendorId, deliveryDate: deliveryDate, daysToCover: daysToCover }
            });
        }
        PutPurchaseUnitQuantity(entityId: number, salesOrderItemId: number, supplyOrderItemId: number, quantity: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, salesOrderItemId: salesOrderItemId, supplyOrderItemId: supplyOrderItemId, quantity: quantity }
            });
        }
        PostCreateSupplyOrder(orderId: number, autoReceive: boolean, invoiceNumber: string, receiveTime: string): ng.IHttpPromise<Inventory.Order.Api.Models.ICreateOrderResult>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { orderId: orderId, autoReceive: autoReceive, invoiceNumber: invoiceNumber, receiveTime: receiveTime }
            });
        }
        DeleteOrder(orderId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { orderId: orderId }
            });
        }
        GetOrderItemHistory(transactionSalesOrderItemId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderItemHistoryHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { transactionSalesOrderItemId: transactionSalesOrderItemId }
            });
        }
        GetScheduledOrders(entityId: number, fromDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IScheduledOrderHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate }
            });
        }
        PutVoidedScheduledOrder(entityId: number, startDate: string, actionItemInstanceId: number, currentUserFullName: string, actionItemId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, startDate: startDate, actionItemInstanceId: actionItemInstanceId, currentUserFullName: currentUserFullName, actionItemId: actionItemId }
            });
        }
        PostGenerateSalesOrderFromScheduledOrder(entityId: number, startDate: string, actionItemId: number, actionItemInstanceId: number): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId, startDate: startDate, actionItemId: actionItemId, actionItemInstanceId: actionItemInstanceId }
            });
        }
        GetStoreLocalDateTimeString(entityId: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/Order",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $orderService: Core.NG.INamedDependency<IOrderService> = Core.NG.CoreModule.RegisterService("ApiLayer.OrderService", OrderService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OrderHistoryController
    class OrderHistoryService implements IOrderHistoryService {
        constructor(private $http: ng.IHttpService) { }
        GetOrdersByRange(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/OrderHistory",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
            });
        }
    }
    export var $orderHistoryService: Core.NG.INamedDependency<IOrderHistoryService> = Core.NG.CoreModule.RegisterService("ApiLayer.OrderHistoryService", OrderHistoryService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OverdueScheduledOrdersController
    class OverdueScheduledOrdersService implements IOverdueScheduledOrdersService {
        constructor(private $http: ng.IHttpService) { }
        GetOverdueScheduledOrders(entityId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IScheduledOrderHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/OverdueScheduledOrders",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $overdueScheduledOrdersService: Core.NG.INamedDependency<IOverdueScheduledOrdersService> = Core.NG.CoreModule.RegisterService("ApiLayer.OverdueScheduledOrdersService", OverdueScheduledOrdersService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReceiveOrderController
    class ReceiveOrderService implements IReceiveOrderService {
        constructor(private $http: ng.IHttpService) { }
        GetReceiveOrder(orderId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrder>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/ReceiveOrder",
                timeout: 120000,
                params: { orderId: orderId }
            });
        }
        GetPlacedAndReceivedOrders(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrderHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/ReceiveOrder",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
            });
        }
        PostPushForTomorrow(orderId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReceiveOrder",
                timeout: 120000,
                params: { orderId: orderId }
            });
        }
        PostAddItems(entityId: number, orderId: number, /*[FromBody]*/ itemCodes: string[]): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrderDetail[]>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReceiveOrder",
                timeout: 120000,
                params: { entityId: entityId, orderId: orderId },
                data: itemCodes
            });
        }
        GetLocalStoreDateTimeString(entityId: number): ng.IHttpPromise<string>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/ReceiveOrder",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $receiveOrderService: Core.NG.INamedDependency<IReceiveOrderService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReceiveOrderService", ReceiveOrderService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReceiveOrderDetailController
    class ReceiveOrderDetailService implements IReceiveOrderDetailService {
        constructor(private $http: ng.IHttpService) { }
        PostReceiveOrder(entityId: number, applyDate: string, orderId: number, invoiceNumber: string, /*[FromBody]*/ items: Inventory.Order.Api.Models.IReceiveOrderDetail[]): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReceiveOrderDetail",
                timeout: 120000,
                params: { entityId: entityId, applyDate: applyDate, orderId: orderId, invoiceNumber: invoiceNumber },
                data: items
            });
        }
        PostAdjustment(entityId: number, orderId: number, /*[FromBody]*/ items: Inventory.Order.Api.Models.IReceiveOrderDetail[]): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReceiveOrderDetail",
                timeout: 120000,
                params: { entityId: entityId, orderId: orderId },
                data: items
            });
        }
        PostChangeApplyDate(orderId: number, newApplyDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IChangeApplyDateResponse>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReceiveOrderDetail",
                timeout: 120000,
                params: { orderId: orderId, newApplyDate: newApplyDate }
            });
        }
    }
    export var $receiveOrderDetailService: Core.NG.INamedDependency<IReceiveOrderDetailService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReceiveOrderDetailService", ReceiveOrderDetailService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReturnEntireOrderController
    class ReturnEntireOrderService implements IReturnEntireOrderService {
        constructor(private $http: ng.IHttpService) { }
        PostReturnEntireOrder(orderId: number): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReturnEntireOrder",
                timeout: 120000,
                params: { orderId: orderId }
            });
        }
    }
    export var $returnEntireOrderService: Core.NG.INamedDependency<IReturnEntireOrderService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReturnEntireOrderService", ReturnEntireOrderService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReturnOrderController
    class ReturnOrderService implements IReturnOrderService {
        constructor(private $http: ng.IHttpService) { }
        GetReceivedOrders(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrderHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/ReturnOrder",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
            });
        }
        PostReturnItemsInOrder(orderId: number, /*[FromBody]*/ items: Inventory.Order.Api.Models.IReceiveOrderDetail[]): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Order/Api/ReturnOrder",
                timeout: 120000,
                params: { orderId: orderId },
                data: items
            });
        }
    }
    export var $returnOrderService: Core.NG.INamedDependency<IReturnOrderService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReturnOrderService", ReturnOrderService, Core.NG.$http);
}

module Inventory.Order.Api {
    // Inventory.Order.Api.VendorController
    class VendorService implements IVendorService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IVendor[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Order/Api/Vendor",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
    }
    export var $vendorService: Core.NG.INamedDependency<IVendorService> = Core.NG.CoreModule.RegisterService("ApiLayer.VendorService", VendorService, Core.NG.$http);
}

module Inventory.Production.Api {
    // Inventory.Production.Api.PrepAdjustController
    class PrepAdjustService implements IPrepAdjustService {
        constructor(private $http: ng.IHttpService) { }
        GetPrepAdjustItemsByEntityId(entityId: number): ng.IHttpPromise<Inventory.Production.Api.Models.IPrepAdjustedItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Production/Api/PrepAdjust",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        PostPrepAdjustItems(entityId: number, /*[FromBody]*/ items: Inventory.Production.Api.Models.IPrepAdjustedItem[], applyDate: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Production/Api/PrepAdjust",
                timeout: 120000,
                params: { entityId: entityId, applyDate: applyDate },
                data: items
            });
        }
    }
    export var $prepAdjustService: Core.NG.INamedDependency<IPrepAdjustService> = Core.NG.CoreModule.RegisterService("ApiLayer.PrepAdjustService", PrepAdjustService, Core.NG.$http);
}

module Inventory.Production.Api {
    // Inventory.Production.Api.PrepAdjustFavoriteController
    class PrepAdjustFavoriteService implements IPrepAdjustFavoriteService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number): ng.IHttpPromise<Inventory.Production.Api.Models.IPrepAdjustedItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Production/Api/PrepAdjustFavorite",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        PostAddFavorite(entityId: number, itemId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Production/Api/PrepAdjustFavorite",
                timeout: 120000,
                params: { entityId: entityId, itemId: itemId }
            });
        }
        DeleteFavorite(entityId: number, itemId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Inventory/Production/Api/PrepAdjustFavorite",
                timeout: 120000,
                params: { entityId: entityId, itemId: itemId }
            });
        }
    }
    export var $prepAdjustFavoriteService: Core.NG.INamedDependency<IPrepAdjustFavoriteService> = Core.NG.CoreModule.RegisterService("ApiLayer.PrepAdjustFavoriteService", PrepAdjustFavoriteService, Core.NG.$http);
}

module Inventory.Production.Api {
    // Inventory.Production.Api.PrepAdjustItemSearchController
    class PrepAdjustItemSearchService implements IPrepAdjustItemSearchService {
        constructor(private $http: ng.IHttpService) { }
        GetPrepAdjustItemsByEntityId(entityId: number, description: string, recordLimit: number): ng.IHttpPromise<Inventory.Production.Api.Models.IPrepAdjustedItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Production/Api/PrepAdjustItemSearch",
                timeout: 120000,
                params: { entityId: entityId, description: description, recordLimit: recordLimit }
            });
        }
    }
    export var $prepAdjustItemSearchService: Core.NG.INamedDependency<IPrepAdjustItemSearchService> = Core.NG.CoreModule.RegisterService("ApiLayer.PrepAdjustItemSearchService", PrepAdjustItemSearchService, Core.NG.$http);
}

module Inventory.Transfer.Api {
    // Inventory.Transfer.Api.TransferController
    class TransferService implements ITransferService {
        constructor(private $http: ng.IHttpService) { }
        GetByTransferIdAndEntityId(transferId: number, entityId: number): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransfer>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                params: { transferId: transferId, entityId: entityId }
            });
        }
        GetPendingTransfersFromStoreByEntityId(transferEntityId: number, showTransferIn: boolean, showTransferOut: boolean): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                params: { transferEntityId: transferEntityId, showTransferIn: showTransferIn, showTransferOut: showTransferOut }
            });
        }
        GetTransfersByStoreAndDateRange(entityId: number, startTime: string, endTime: string): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeader[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                params: { entityId: entityId, startTime: startTime, endTime: endTime }
            });
        }
        PostCreateInventoryTransfer(transferFromEntityId: number, transferToEntityId: number, /*[FromBody]*/ body: Inventory.Transfer.Api.Models.ITransferItemsRequest): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                params: { transferFromEntityId: transferFromEntityId, transferToEntityId: transferToEntityId },
                data: body
            });
        }
        PutUpdateTransferQuantities(/*[FromBody]*/ transfer: Inventory.Transfer.Api.Models.ITransfer, isApproved: boolean, reason: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                params: { isApproved: isApproved, reason: reason },
                data: transfer
            });
        }
        PutTransferDetailWithUpdatedCostAndQuantity(/*[FromBody]*/ transferDetail: Inventory.Transfer.Api.Models.ITransferDetail): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferDetail>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                data: transferDetail
            });
        }
        PutUpdateNoCostItems(transferId: number, entityId: number, /*[FromBody]*/ updateCostItems: Inventory.Count.Api.Models.IUpdateCostViewModel[]): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Inventory/Transfer/Api/Transfer",
                timeout: 120000,
                params: { transferId: transferId, entityId: entityId },
                data: updateCostItems
            });
        }
    }
    export var $transferService: Core.NG.INamedDependency<ITransferService> = Core.NG.CoreModule.RegisterService("ApiLayer.TransferService", TransferService, Core.NG.$http);
}

module Inventory.Transfer.Api {
    // Inventory.Transfer.Api.TransferHistoryController
    class TransferHistoryService implements ITransferHistoryService {
        constructor(private $http: ng.IHttpService) { }
        GetTransfersWithEntitiesByStoreAndDateRange(entityId: number, startTime: string, endTime: string): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeaderWithEntities[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/TransferHistory",
                timeout: 120000,
                params: { entityId: entityId, startTime: startTime, endTime: endTime }
            });
        }
        GetByTransferIdWithReportingUnits(transferId: number, entityId: number): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferReporting>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/TransferHistory",
                timeout: 120000,
                params: { transferId: transferId, entityId: entityId }
            });
        }
    }
    export var $transferHistoryService: Core.NG.INamedDependency<ITransferHistoryService> = Core.NG.CoreModule.RegisterService("ApiLayer.TransferHistoryService", TransferHistoryService, Core.NG.$http);
}

module Inventory.Transfer.Api {
    // Inventory.Transfer.Api.TransferStoreController
    class TransferStoreService implements ITransferStoreService {
        constructor(private $http: ng.IHttpService) { }
        GetNeighboringStores(currentStoreId: number, direction: Inventory.Transfer.Api.Enums.TransferDirection): ng.IHttpPromise<Inventory.Transfer.Api.Models.IStoreItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/TransferStore",
                timeout: 120000,
                params: { currentStoreId: currentStoreId, direction: direction }
            });
        }
        GetTransferableItemsBetweenStoresLimited(fromEntityId: number, toEntityId: number, filter: string, direction: Inventory.Transfer.Api.Enums.TransferDirection): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferableItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Transfer/Api/TransferStore",
                timeout: 120000,
                params: { fromEntityId: fromEntityId, toEntityId: toEntityId, filter: filter, direction: direction }
            });
        }
    }
    export var $transferStoreService: Core.NG.INamedDependency<ITransferStoreService> = Core.NG.CoreModule.RegisterService("ApiLayer.TransferStoreService", TransferStoreService, Core.NG.$http);
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteController
    class WasteService implements IWasteService {
        constructor(private $http: ng.IHttpService) { }
        GetWasteItemsLimited(entityId: number, filter: string): ng.IHttpPromise<Inventory.Waste.Api.Models.IWastedItemCount[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Waste/Api/Waste",
                timeout: 120000,
                params: { entityId: entityId, filter: filter }
            });
        }
        PostWasteItems(entityId: number, /*[FromBody]*/ items: Inventory.Waste.Api.Models.IWastedItemCount[], applyDate: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Waste/Api/Waste",
                timeout: 120000,
                params: { entityId: entityId, applyDate: applyDate },
                data: items
            });
        }
    }
    export var $wasteService: Core.NG.INamedDependency<IWasteService> = Core.NG.CoreModule.RegisterService("ApiLayer.WasteService", WasteService, Core.NG.$http);
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteFavoriteController
    class WasteFavoriteService implements IWasteFavoriteService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number): ng.IHttpPromise<Inventory.Waste.Api.Models.IWastedItemCount[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Waste/Api/WasteFavorite",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        PostAdd(entityId: number, itemId: number, isInventoryItem: boolean): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Inventory/Waste/Api/WasteFavorite",
                timeout: 120000,
                params: { entityId: entityId, itemId: itemId, isInventoryItem: isInventoryItem }
            });
        }
        Delete(entityId: number, itemId: number, isInventoryItem: boolean): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Inventory/Waste/Api/WasteFavorite",
                timeout: 120000,
                params: { entityId: entityId, itemId: itemId, isInventoryItem: isInventoryItem }
            });
        }
    }
    export var $wasteFavoriteService: Core.NG.INamedDependency<IWasteFavoriteService> = Core.NG.CoreModule.RegisterService("ApiLayer.WasteFavoriteService", WasteFavoriteService, Core.NG.$http);
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteHistoryController
    class WasteHistoryService implements IWasteHistoryService {
        constructor(private $http: ng.IHttpService) { }
        GetWasteHistory(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Waste.Api.Models.IWasteHistoryItem[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Waste/Api/WasteHistory",
                timeout: 120000,
                params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
            });
        }
    }
    export var $wasteHistoryService: Core.NG.INamedDependency<IWasteHistoryService> = Core.NG.CoreModule.RegisterService("ApiLayer.WasteHistoryService", WasteHistoryService, Core.NG.$http);
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteReasonController
    class WasteReasonService implements IWasteReasonService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<Inventory.Waste.Api.Models.IDropKeyValuePair[]>{
            return this.$http({
                method: "GET",
                url: "/Inventory/Waste/Api/WasteReason",
                timeout: 120000
            });
        }
    }
    export var $wasteReasonService: Core.NG.INamedDependency<IWasteReasonService> = Core.NG.CoreModule.RegisterService("ApiLayer.WasteReasonService", WasteReasonService, Core.NG.$http);
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ColumnsController
    class ColumnsService implements IColumnsService {
        constructor(private $http: ng.IHttpService) { }
        Get(reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<Operations.Reporting.Api.Models.IColumnResponse>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/Columns",
                timeout: 120000,
                params: { reportType: reportType }
            });
        }
    }
    export var $columnsService: Core.NG.INamedDependency<IColumnsService> = Core.NG.CoreModule.RegisterService("ApiLayer.ColumnsService", ColumnsService, Core.NG.$http);
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ProductController
    class ProductService implements IProductService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, viewId: number, searchText: string): ng.IHttpPromise<Operations.Reporting.Api.Models.IProductData>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/Product",
                timeout: 120000,
                params: { entityId: entityId, dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, viewId: viewId, searchText: searchText }
            });
        }
    }
    export var $productService: Core.NG.INamedDependency<IProductService> = Core.NG.CoreModule.RegisterService("ApiLayer.ProductService", ProductService, Core.NG.$http);
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ProductExportController
    class ProductExportService implements IProductExportService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, viewId: number): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/ProductExport",
                timeout: 120000,
                params: { entityId: entityId, dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, viewId: viewId }
            });
        }
    }
    export var $productExportService: Core.NG.INamedDependency<IProductExportService> = Core.NG.CoreModule.RegisterService("ApiLayer.ProductExportService", ProductExportService, Core.NG.$http);
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ReportController
    class ReportService implements IReportService {
        constructor(private $http: ng.IHttpService) { }
        Get(dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, entityId: number, viewId: number): ng.IHttpPromise<Operations.Reporting.Api.Models.IReportData>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/Report",
                timeout: 120000,
                params: { dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, entityId: entityId, viewId: viewId }
            });
        }
    }
    export var $reportService: Core.NG.INamedDependency<IReportService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReportService", ReportService, Core.NG.$http);
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ReportExportController
    class ReportExportService implements IReportExportService {
        constructor(private $http: ng.IHttpService) { }
        Get(dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, entityId: number, viewId: number): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/ReportExport",
                timeout: 120000,
                params: { dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, entityId: entityId, viewId: viewId }
            });
        }
    }
    export var $reportExportService: Core.NG.INamedDependency<IReportExportService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReportExportService", ReportExportService, Core.NG.$http);
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ViewController
    class ViewService implements IViewService {
        constructor(private $http: ng.IHttpService) { }
        GetView(entityId: number, viewId: number, reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<Operations.Reporting.Api.Models.IViewModel>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/View",
                timeout: 120000,
                params: { entityId: entityId, viewId: viewId, reportType: reportType }
            });
        }
        GetReportViews(entityId: number, reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<Operations.Reporting.Api.Models.IViewModel[]>{
            return this.$http({
                method: "GET",
                url: "/Operations/Reporting/Api/View",
                timeout: 120000,
                params: { entityId: entityId, reportType: reportType }
            });
        }
        PostCreateView(entityId: number, /*[FromBody]*/ view: Operations.Reporting.Api.Models.IViewModel): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Operations/Reporting/Api/View",
                timeout: 120000,
                params: { entityId: entityId },
                data: view
            });
        }
        PutUpdateView(entityId: number, /*[FromBody]*/ view: Operations.Reporting.Api.Models.IViewModel): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Operations/Reporting/Api/View",
                timeout: 120000,
                params: { entityId: entityId },
                data: view
            });
        }
        DeleteView(entityId: number, viewId: number, reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Operations/Reporting/Api/View",
                timeout: 120000,
                params: { entityId: entityId, viewId: viewId, reportType: reportType }
            });
        }
    }
    export var $viewService: Core.NG.INamedDependency<IViewService> = Core.NG.CoreModule.RegisterService("ApiLayer.ViewService", ViewService, Core.NG.$http);
}

module Reporting.Dashboard.Api {
    // Reporting.Dashboard.Api.MeasuresController
    class MeasuresService implements IMeasuresService {
        constructor(private $http: ng.IHttpService) { }
        GetMeasures(entityId: number, typeId: number, groupId: number, selectedDate: string): ng.IHttpPromise<Reporting.Dashboard.Api.Models.IEntityMeasure[]>{
            return this.$http({
                method: "GET",
                url: "/Reporting/Dashboard/Api/Measures",
                timeout: 120000,
                params: { entityId: entityId, typeId: typeId, groupId: groupId, selectedDate: selectedDate }
            });
        }
        GetMeasureDrilldown(entityId: number, date: string, measureKey: string): ng.IHttpPromise<Reporting.Dashboard.Api.Models.IDrillDownData>{
            return this.$http({
                method: "GET",
                url: "/Reporting/Dashboard/Api/Measures",
                timeout: 120000,
                params: { entityId: entityId, date: date, measureKey: measureKey }
            });
        }
    }
    export var $measuresService: Core.NG.INamedDependency<IMeasuresService> = Core.NG.CoreModule.RegisterService("ApiLayer.MeasuresService", MeasuresService, Core.NG.$http);
}

module Reporting.Dashboard.Api {
    // Reporting.Dashboard.Api.ReferenceDataController
    class ReferenceDataService implements IReferenceDataService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<Reporting.Dashboard.Api.Models.IReferenceData>{
            return this.$http({
                method: "GET",
                url: "/Reporting/Dashboard/Api/ReferenceData",
                timeout: 120000
            });
        }
    }
    export var $referenceDataService: Core.NG.INamedDependency<IReferenceDataService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReferenceDataService", ReferenceDataService, Core.NG.$http);
}

module Forecasting.Api {
    // Forecasting.Api.ReportMeasureGenerationController
    class ReportMeasureGenerationService implements IReportMeasureGenerationService {
        constructor(private $http: ng.IHttpService) { }
        Post(entityId: number, businessDay: string): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Reporting/Dashboard/Api/ReportMeasureGeneration",
                timeout: 120000,
                params: { entityId: entityId, businessDay: businessDay }
            });
        }
    }
    export var $reportMeasureGenerationService: Core.NG.INamedDependency<IReportMeasureGenerationService> = Core.NG.CoreModule.RegisterService("ApiLayer.ReportMeasureGenerationService", ReportMeasureGenerationService, Core.NG.$http);
}

module Workforce.Deliveries.Api {
    // Workforce.Deliveries.Api.AvailableUsersController
    class AvailableUsersService implements IAvailableUsersService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, date: string): ng.IHttpPromise<Workforce.Deliveries.Api.Models.IClockedOnUser[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/Deliveries/Api/AvailableUsers",
                timeout: 120000,
                params: { entityId: entityId, date: date }
            });
        }
    }
    export var $availableUsersService: Core.NG.INamedDependency<IAvailableUsersService> = Core.NG.CoreModule.RegisterService("ApiLayer.AvailableUsersService", AvailableUsersService, Core.NG.$http);
}

module Workforce.Deliveries.Api {
    // Workforce.Deliveries.Api.DeliveriesAuthorizeController
    class DeliveriesAuthorizeService implements IDeliveriesAuthorizeService {
        constructor(private $http: ng.IHttpService) { }
        Put(entityId: number, /*[FromBody]*/ request: Workforce.Deliveries.Api.Models.IDeliveryAuthorisedRequest): ng.IHttpPromise<boolean>{
            return this.$http({
                method: "PUT",
                url: "/Workforce/Deliveries/Api/DeliveriesAuthorize",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $deliveriesAuthorizeService: Core.NG.INamedDependency<IDeliveriesAuthorizeService> = Core.NG.CoreModule.RegisterService("ApiLayer.DeliveriesAuthorizeService", DeliveriesAuthorizeService, Core.NG.$http);
}

module Workforce.Deliveries.Api {
    // Workforce.Deliveries.Api.DeliveriesController
    class DeliveriesService implements IDeliveriesService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, date: string): ng.IHttpPromise<Workforce.Deliveries.Api.Models.IDeliveryData>{
            return this.$http({
                method: "GET",
                url: "/Workforce/Deliveries/Api/Deliveries",
                timeout: 120000,
                params: { entityId: entityId, date: date }
            });
        }
        Post(entityId: number, /*[FromBody]*/ request: Workforce.Deliveries.Api.Models.IExtraDeliveryRequest): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Workforce/Deliveries/Api/Deliveries",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $deliveriesService: Core.NG.INamedDependency<IDeliveriesService> = Core.NG.CoreModule.RegisterService("ApiLayer.DeliveriesService", DeliveriesService, Core.NG.$http);
}

module Workforce.DriverDistance.Api {
    // Workforce.DriverDistance.Api.DriverDistanceEmployeeController
    class DriverDistanceEmployeeService implements IDriverDistanceEmployeeService {
        constructor(private $http: ng.IHttpService) { }
        GetRecordsForEmployeeByEntityAndDate(employeeId: number, entityId: number, date: string): ng.IHttpPromise<Workforce.DriverDistance.Api.Models.IDriverDistanceRecord[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/DriverDistance/Api/DriverDistanceEmployee",
                timeout: 120000,
                params: { employeeId: employeeId, entityId: entityId, date: date }
            });
        }
        Post(entityId: number, /*[FromBody]*/ request: Workforce.DriverDistance.Api.Models.ICreateDriverDistanceRequest): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Workforce/DriverDistance/Api/DriverDistanceEmployee",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $driverDistanceEmployeeService: Core.NG.INamedDependency<IDriverDistanceEmployeeService> = Core.NG.CoreModule.RegisterService("ApiLayer.DriverDistanceEmployeeService", DriverDistanceEmployeeService, Core.NG.$http);
}

module Workforce.DriverDistance.Api {
    // Workforce.DriverDistance.Api.DriverDistanceManagerController
    class DriverDistanceManagerService implements IDriverDistanceManagerService {
        constructor(private $http: ng.IHttpService) { }
        GetRecordsForEntityByDate(entityId: number, date: string): ng.IHttpPromise<Workforce.DriverDistance.Api.Models.IDriverDistanceRecord[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                timeout: 120000,
                params: { entityId: entityId, date: date }
            });
        }
        PutActionDriverDistanceRecord(entityId: number, /*[FromBody]*/ request: Workforce.DriverDistance.Api.Models.IActionDriverDistanceRequest): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
        GetActiveUsersByAssignedEntity(entityId: number): ng.IHttpPromise<Administration.User.Api.Models.IUser[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                timeout: 120000,
                params: { entityId: entityId }
            });
        }
        Post(entityId: number, /*[FromBody]*/ request: Workforce.DriverDistance.Api.Models.ICreateAuthorizedDriverDistanceRequest): ng.IHttpPromise<number>{
            return this.$http({
                method: "POST",
                url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                timeout: 120000,
                params: { entityId: entityId },
                data: request
            });
        }
    }
    export var $driverDistanceManagerService: Core.NG.INamedDependency<IDriverDistanceManagerService> = Core.NG.CoreModule.RegisterService("ApiLayer.DriverDistanceManagerService", DriverDistanceManagerService, Core.NG.$http);
}

module Workforce.MyAvailability.Api {
    // Workforce.MyAvailability.Api.MyAvailabilityController
    class MyAvailabilityService implements IMyAvailabilityService {
        constructor(private $http: ng.IHttpService) { }
        Get(): ng.IHttpPromise<Workforce.MyAvailability.Api.Models.IAvailability>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MyAvailability/Api/MyAvailability",
                timeout: 120000
            });
        }
        PutAvailability(/*[FromBody]*/ availability: Workforce.MyAvailability.Api.Models.IDayAvailability): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Workforce/MyAvailability/Api/MyAvailability",
                timeout: 120000,
                data: availability
            });
        }
        Delete(dayOfWeek: number, start: string, end: string, isAllDay: boolean): ng.IHttpPromise<{}>{
            return this.$http({
                method: "DELETE",
                url: "/Workforce/MyAvailability/Api/MyAvailability",
                timeout: 120000,
                params: { dayOfWeek: dayOfWeek, start: start, end: end, isAllDay: isAllDay }
            });
        }
    }
    export var $myAvailabilityService: Core.NG.INamedDependency<IMyAvailabilityService> = Core.NG.CoreModule.RegisterService("ApiLayer.MyAvailabilityService", MyAvailabilityService, Core.NG.$http);
}

module Workforce.MyDetails.Api {
    // Workforce.MyDetails.Api.MyDetailsController
    class MyDetailsService implements IMyDetailsService {
        constructor(private $http: ng.IHttpService) { }
        GetUserById(): ng.IHttpPromise<Workforce.MyDetails.Api.Models.IUserContact>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MyDetails/Api/MyDetails",
                timeout: 120000
            });
        }
        PutUserContact(/*[FromBody]*/ userContact: Workforce.MyDetails.Api.Models.IUserContact): ng.IHttpPromise<{}>{
            return this.$http({
                method: "PUT",
                url: "/Workforce/MyDetails/Api/MyDetails",
                timeout: 120000,
                data: userContact
            });
        }
    }
    export var $myDetailsService: Core.NG.INamedDependency<IMyDetailsService> = Core.NG.CoreModule.RegisterService("ApiLayer.MyDetailsService", MyDetailsService, Core.NG.$http);
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.MyScheduleController
    class MyScheduleService implements IMyScheduleService {
        constructor(private $http: ng.IHttpService) { }
        Get(startDate: string, endDate: string): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ICalendarEntry[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MySchedule/Api/MySchedule",
                timeout: 120000,
                params: { startDate: startDate, endDate: endDate }
            });
        }
    }
    export var $myScheduleService: Core.NG.INamedDependency<IMyScheduleService> = Core.NG.CoreModule.RegisterService("ApiLayer.MyScheduleService", MyScheduleService, Core.NG.$http);
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.MyScheduleDownloadController
    class MyScheduleDownloadService implements IMyScheduleDownloadService {
        constructor(private $http: ng.IHttpService) { }
        Get(beginDate: string, endDate: string): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MySchedule/Api/MyScheduleDownload",
                timeout: 120000,
                params: { beginDate: beginDate, endDate: endDate }
            });
        }
    }
    export var $myScheduleDownloadService: Core.NG.INamedDependency<IMyScheduleDownloadService> = Core.NG.CoreModule.RegisterService("ApiLayer.MyScheduleDownloadService", MyScheduleDownloadService, Core.NG.$http);
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.MyTimeOffController
    class MyTimeOffService implements IMyTimeOffService {
        constructor(private $http: ng.IHttpService) { }
        Get(selectedDate: string): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ITimeOffRequest[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MySchedule/Api/MyTimeOff",
                timeout: 120000,
                params: { selectedDate: selectedDate }
            });
        }
        GetFutureTimeOffRequests(): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ITimeOffRequest[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MySchedule/Api/MyTimeOff",
                timeout: 120000
            });
        }
        PostCancelRequest(requestId: number): ng.IHttpPromise<{}>{
            return this.$http({
                method: "POST",
                url: "/Workforce/MySchedule/Api/MyTimeOff",
                timeout: 120000,
                params: { requestId: requestId }
            });
        }
        PostNewRequest(/*[FromBody]*/ request: Workforce.MyTimeOff.Api.Models.INewTimeOffRequest): ng.IHttpPromise<Workforce.MyTimeOff.Api.Models.INewTimeOffResult>{
            return this.$http({
                method: "POST",
                url: "/Workforce/MySchedule/Api/MyTimeOff",
                timeout: 120000,
                data: request
            });
        }
    }
    export var $myTimeOffService: Core.NG.INamedDependency<IMyTimeOffService> = Core.NG.CoreModule.RegisterService("ApiLayer.MyTimeOffService", MyTimeOffService, Core.NG.$http);
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.TeamScheduleController
    class TeamScheduleService implements ITeamScheduleService {
        constructor(private $http: ng.IHttpService) { }
        Get(entityId: number, startDate: string, stopDate: string): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ICalendarEntry[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MySchedule/Api/TeamSchedule",
                timeout: 120000,
                params: { entityId: entityId, startDate: startDate, stopDate: stopDate }
            });
        }
    }
    export var $teamScheduleService: Core.NG.INamedDependency<ITeamScheduleService> = Core.NG.CoreModule.RegisterService("ApiLayer.TeamScheduleService", TeamScheduleService, Core.NG.$http);
}

module Workforce.MyTimeCard.Api {
    // Workforce.MyTimeCard.Api.MyTimeCardController
    class MyTimeCardService implements IMyTimeCardService {
        constructor(private $http: ng.IHttpService) { }
        GetTimeCards(start: string, end: string): ng.IHttpPromise<Workforce.MyTimeCard.Api.Models.ITimeCardEntry[]>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MyTimeCard/Api/MyTimeCard",
                timeout: 120000,
                params: { start: start, end: end }
            });
        }
    }
    export var $myTimeCardService: Core.NG.INamedDependency<IMyTimeCardService> = Core.NG.CoreModule.RegisterService("ApiLayer.MyTimeCardService", MyTimeCardService, Core.NG.$http);
}

module Workforce.MyTimeOff.Api {
    // Workforce.MyTimeOff.Api.TimeOffReasonController
    class TimeOffReasonService implements ITimeOffReasonService {
        constructor(private $http: ng.IHttpService) { }
        GetReasons(): ng.IHttpPromise<any>{
            return this.$http({
                method: "GET",
                url: "/Workforce/MyTimeOff/Api/TimeOffReason",
                timeout: 120000
            });
        }
    }
    export var $timeOffReasonService: Core.NG.INamedDependency<ITimeOffReasonService> = Core.NG.CoreModule.RegisterService("ApiLayer.TimeOffReasonService", TimeOffReasonService, Core.NG.$http);
}

module Workforce.PeriodClose.Api {
    // Workforce.PeriodClose.Api.PeriodCloseController
    class PeriodCloseService implements IPeriodCloseService {
        constructor(private $http: ng.IHttpService) { }
        GetPeriodLockStatus(entityId: number, calendarDay: string): ng.IHttpPromise<Workforce.PeriodClose.Api.Models.IPeriodClose>{
            return this.$http({
                method: "GET",
                url: "/Workforce/PeriodClose/Api/PeriodClose",
                timeout: 120000,
                params: { entityId: entityId, calendarDay: calendarDay }
            });
        }
    }
    export var $periodCloseService: Core.NG.INamedDependency<IPeriodCloseService> = Core.NG.CoreModule.RegisterService("ApiLayer.PeriodCloseService", PeriodCloseService, Core.NG.$http);
}
