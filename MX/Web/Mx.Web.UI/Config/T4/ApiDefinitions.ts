/////////////////////////////////////////////////////////////////////////////////////////////////
//
//    TypeScript definitions for REST WebAPI services 
//    WARNING: This file has been automatically generated. Any changes may be lost on the next run.
//
/////////////////////////////////////////////////////////////////////////////////////////////////

/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module Administration.DataLoad.Api {
    // Administration.DataLoad.Api.DataLoadController
    export interface IDataLoadService {

        // PostFormData()
        PostFormData(): ng.IHttpPromise<any>;
    }
}

module Administration.DayCharacteristic.Api {
    // Administration.DayCharacteristic.Api.DayCharacteristicController
    export interface IDayCharacteristicService {

        // Get()
        Get(): ng.IHttpPromise<Administration.DayCharacteristic.Api.Models.IDayCharacteristic[]>;

        // Put(value)
        Put(/*[FromBody]*/ value: Administration.DayCharacteristic.Api.Models.IDayCharacteristic[]): ng.IHttpPromise<{}>;

        // Delete(value)
        Delete(/*[FromBody]*/ value: Administration.DayCharacteristic.Api.Models.IDayCharacteristic[]): ng.IHttpPromise<{}>;

        // Get(entityId, businessDay)
        Get1(entityId: number, businessDay: string): ng.IHttpPromise<Administration.DayCharacteristic.Api.Models.IEntityDayCharacteristic>;

        // Put(entityId, businessDay, value)
        Put1(entityId: number, businessDay: string, /*[FromBody]*/ value: Administration.DayCharacteristic.Api.Models.IEntityDayCharacteristic): ng.IHttpPromise<{}>;
    }
}

module Administration.Hierarchy.Api {
    // Administration.Hierarchy.Api.HierarchyController
    export interface IHierarchyService {

        // GetHierarchy(baseEntityId)
        GetHierarchy(baseEntityId: number): ng.IHttpPromise<Administration.Hierarchy.Api.Models.IHierarchyEntity>;

        // GetHierarchyLevels()
        GetHierarchyLevels(): ng.IHttpPromise<string[]>;

        // PostCreateEntity(number, name, parentId, type)
        PostCreateEntity(number: string, name: string, parentId: number, type: number): ng.IHttpPromise<number>;

        // PutUpdateBarebonesEntity(id, number, name)
        PutUpdateBarebonesEntity(id: number, number: string, name: string): ng.IHttpPromise<{}>;

        // PutMoveHierarchy(id, parentId)
        PutMoveHierarchy(id: number, parentId: number): ng.IHttpPromise<{}>;
    }
}

module Administration.MyAccount.Api {
    // Administration.MyAccount.Api.AccountController
    export interface IAccountService {

        // PostPinNumber(password, pin)
        PostPinNumber(password: string, pin: string): ng.IHttpPromise<string>;

        // DeleteUserPin()
        DeleteUserPin(): ng.IHttpPromise<{}>;
    }
}

module Administration.Settings.Api {
    // Administration.Settings.Api.InventoryCountSettingsController
    export interface IInventoryCountSettingsService {

        // GetInventoryCountSettings()
        GetInventoryCountSettings(): ng.IHttpPromise<Administration.Settings.Api.Models.IInventoryCountSettingsViewModel>;

        // PostInventoryCountSettings(inventoryCountSettings)
        PostInventoryCountSettings(/*[FromBody]*/ inventoryCountSettings: Administration.Settings.Api.Models.IInventoryCountSettingsViewModel): ng.IHttpPromise<{}>;
    }
}

module Administration.Settings.Api {
    // Administration.Settings.Api.SettingsController
    export interface ISettingsService {

        // GetMeasures(type, entityId)
        GetMeasures(type: Administration.Settings.Api.Models.SettingEnums, entityId: number): ng.IHttpPromise<Administration.Settings.Api.Models.ISettingGroup[]>;

        // POSTReportMeasureConfig(measure, action)
        POSTReportMeasureConfig(/*[FromBody]*/ measure: Administration.Settings.Api.Models.ISettingMeasure, action: string): ng.IHttpPromise<{}>;

        // GetConfigurationSettings(settings)
        GetConfigurationSettings(settings: Core.Api.Models.ConfigurationSetting[]): ng.IHttpPromise<any>;
    }
}

module Administration.Settings.Api {
    // Administration.Settings.Api.SiteSettingsController
    export interface ISiteSettingsService {

        // GetSiteSettings()
        GetSiteSettings(): ng.IHttpPromise<Administration.Settings.Api.Models.ISiteSettings>;

        // PostSiteSettings(settings)
        PostSiteSettings(/*[FromBody]*/ settings: Administration.Settings.Api.Models.ISiteSettings): ng.IHttpPromise<{}>;
    }
}

module Administration.User.Api {
    // Administration.User.Api.UserController
    export interface IUserService {

        // GetUsers(entityId, includeDescendents, includeTerminated)
        GetUsers(entityId: number, includeDescendents: boolean, includeTerminated: boolean): ng.IHttpPromise<Administration.User.Api.Models.IUser[]>;

        // GetSecurityGroups()
        GetSecurityGroups(): ng.IHttpPromise<Administration.User.Api.Models.ISecurityGroup[]>;

        // PostCreateNewUser(entityId, employeeNumber, firstName, lastName, middleName, userName, password, securityGroups)
        PostCreateNewUser(entityId: number, employeeNumber: string, firstName: string, lastName: string, middleName: string, userName: string, password: string, securityGroups: number[]): ng.IHttpPromise<number>;

        // GetUserNameFromFirstNameAndLastName(firstName, lastName)
        GetUserNameFromFirstNameAndLastName(firstName: string, lastName: string): ng.IHttpPromise<string>;

        // PutUpdateBasicUser(id, entityId, employeeNumber, firstName, lastName, middleName, userName, password, status)
        PutUpdateBasicUser(id: number, entityId: number, employeeNumber: string, firstName: string, lastName: string, middleName: string, userName: string, password: string, status: string): ng.IHttpPromise<{}>;

        // PutUpdateUserSecurityGroups(userId, securityGroups)
        PutUpdateUserSecurityGroups(userId: number, securityGroups: number[]): ng.IHttpPromise<{}>;
    }
}

module Administration.User.Api {
    // Administration.User.Api.UserSettingsController
    export interface IUserSettingsService {

        // GetUserSetting(userSetting)
        GetUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum): ng.IHttpPromise<string>;

        // PutUserSetting(userSetting, value)
        PutUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum, value: string): ng.IHttpPromise<{}>;
    }
}

module Core.Api {
    // Core.Api.BackplaneController
    export interface IBackplaneService {

        // IsBackplaneActive()
        IsBackplaneActive(): ng.IHttpPromise<boolean>;
    }
}

module Core.Api {
    // Core.Api.EntityController
    export interface IEntityService {

        // Get(entityId)
        Get(entityId: number): ng.IHttpPromise<Core.Api.Models.IEntityModel>;

        // GetOpenEntities(userId)
        GetOpenEntities(userId: number): ng.IHttpPromise<Core.Api.Models.IEntityModel[]>;

        // GetStartOfWeek(entityId, calendarDay)
        GetStartOfWeek(entityId: number, calendarDay: string): ng.IHttpPromise<number>;

        // GetEntitiesByIds(entityIds)
        GetEntitiesByIds(entityIds: number[]): ng.IHttpPromise<Core.Api.Models.IEntityModel[]>;

        // GetEntitiesByEntityType(entityTypeId)
        GetEntitiesByEntityType(entityTypeId: Core.Api.Models.EntityType): ng.IHttpPromise<Core.Api.Models.IEntityModel[]>;
    }
}

module Core.Api {
    // Core.Api.MobileSettingsController
    export interface IMobileSettingsService {

        // Post(mobileSettings)
        Post(/*[FromBody]*/ mobileSettings: Core.Api.Models.IMobileSettings): ng.IHttpPromise<{}>;
    }
}

module Core.Api {
    // Core.Api.NotificationsController
    export interface INotificationsService {

        // Get()
        Get(): ng.IHttpPromise<Core.Api.Models.INotificationArea[]>;
    }
}

module Core.Api {
    // Core.Api.TranslationsController
    export interface ITranslationsService {

        // Get(culture)
        Get(culture: string): ng.IHttpPromise<Core.Api.Models.ITranslations>;
    }
}

module Core.Auth.Api {
    // Core.Auth.Api.LogonController
    export interface ILogonService {

        // PostUserLogon(credentials)
        PostUserLogon(/*[FromBody]*/ credentials: Core.Auth.Api.Models.ICredentials): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse>;

        // PostUserLogonWithPin(userName, pin, pinToken)
        PostUserLogonWithPin(userName: string, pin: string, pinToken: string): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse>;

        // GetUser(entityId)
        GetUser(entityId: number): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse>;
    }
}

module Core.Auth.Api {
    // Core.Auth.Api.LogonImageController
    export interface ILogonImageService {

        // Get(key)
        Get(key: string): ng.IHttpPromise<any>;
    }
}

module Core.Auth.Api {
    // Core.Auth.Api.PartnerLoginController
    export interface IPartnerLoginService {

        // Post()
        Post(): ng.IHttpPromise<any>;
    }
}

module Core.Auth.Api {
    // Core.Auth.Api.PinChallengeController
    export interface IPinChallengeService {

        // Get(username)
        Get(username: string): ng.IHttpPromise<any>;
    }
}

module Core.Auth.Api {
    // Core.Auth.Api.SsoController
    export interface ISsoService {

        // GetSsoEnabled()
        GetSsoEnabled(): ng.IHttpPromise<boolean>;

        // Error in method 'SsoLogoutLanding': [FromBody] parameters are not allowed in GET methods

        // PostSsoLogon()
        PostSsoLogon(): ng.IHttpPromise<any>;
    }
}

module Core.Auth.Api {
    // Core.Auth.Api.SsoLogoutController
    export interface ISsoLogoutService {

        // PostSsoLogout()
        PostSsoLogout(): ng.IHttpPromise<Core.Auth.Api.SsoLogoutController.ISsoLogoutResponce>;
    }
}

module Core.Diagnostics.Api.Services {
    // Core.Diagnostics.Api.Services.DiagnosticController
    export interface IDiagnosticService {

        // GetDiagnostic()
        GetDiagnostic(): ng.IHttpPromise<Core.Diagnostics.Api.Models.IDiagnosticServiceResponse>;
    }
}

module Core.PartnerRedirect.Api {
    // Core.PartnerRedirect.Api.PartnerRedirectController
    export interface IPartnerRedirectService {

        // Get()
        Get(): ng.IHttpPromise<Core.PartnerRedirect.Api.Models.ILinkRequest>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.CalendarController
    export interface ICalendarService {

        // GetDaysOfWorkWeek(startOfWeek, entityId)
        GetDaysOfWorkWeek(startOfWeek: string, entityId: number): ng.IHttpPromise<any>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.CharacteristicCodeController
    export interface ICharacteristicCodeService {

        // Get()
        Get(): ng.IHttpPromise<string[]>;

        // Get(id)
        Get1(id: number): ng.IHttpPromise<string>;

        // Post(value)
        Post(/*[FromBody]*/ value: string): ng.IHttpPromise<{}>;

        // Put(id, value)
        Put(id: number, /*[FromBody]*/ value: string): ng.IHttpPromise<{}>;

        // Delete(id)
        Delete(id: number): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.DaySegmentController
    export interface IDaySegmentService {

        // GetDaysegments(entityId)
        GetDaysegments(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IDaySegment[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.EventCalendarController
    export interface IEventCalendarService {

        // GetEventWeekDaysInfo(entityId, fromDate, toDate)
        GetEventWeekDaysInfo(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Forecasting.Api.Models.IEventWeekDayInfo[]>;

        // GetCalendarInfo(entityId, year, month)
        GetCalendarInfo(entityId: number, year: number, month: number): ng.IHttpPromise<Forecasting.Api.Models.IEventCalendarInfo>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.EventController
    export interface IEventService {

        // GetEventProfiles(entityId)
        GetEventProfiles(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IEventProfile[]>;

        // GetProfileNameExistsForEntity(entityId, profileName)
        GetProfileNameExistsForEntity(entityId: number, profileName: string): ng.IHttpPromise<boolean>;

        // PostEventProfile(eventProfile, entityId)
        PostEventProfile(/*[FromBody]*/ eventProfile: Forecasting.Api.Models.IEventProfile, entityId: number): ng.IHttpPromise<{}>;

        // DeleteEventProfile(eventProfileId)
        DeleteEventProfile(eventProfileId: number): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.EventTagController
    export interface IEventTagService {

        // GetEventProfileTags(eventProfileId)
        GetEventProfileTags(eventProfileId: number): ng.IHttpPromise<Forecasting.Api.Models.IEventProfileTag[]>;

        // PostEventProfileTag(tag, entityId)
        PostEventProfileTag(/*[FromBody]*/ tag: Forecasting.Api.Models.IEventProfileTag, entityId: number): ng.IHttpPromise<{}>;

        // PutEventProfileTag(tag, entityId)
        PutEventProfileTag(/*[FromBody]*/ tag: Forecasting.Api.Models.IEventProfileTag, entityId: number): ng.IHttpPromise<{}>;

        // DeleteEventProfileTag(entityId, tagId, connectionId)
        DeleteEventProfileTag(entityId: number, tagId: number, connectionId: string): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.EventTagNoteController
    export interface IEventTagNoteService {

        // PutEventProfileTagNote(tagnote, entityId)
        PutEventProfileTagNote(/*[FromBody]*/ tagnote: Forecasting.Api.Models.IEventProfileTagNote, entityId: number): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastController
    export interface IForecastService {

        // GetForecastById(entityId, id, filterId)
        GetForecastById(entityId: number, id: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecast>;

        // GetForecastForBusinessDay(entityId, businessDay)
        GetForecastForBusinessDay(entityId: number, businessDay: string): ng.IHttpPromise<Forecasting.Api.Models.IForecast>;

        // GetForecastsForBusinessDateRange(entityId, startDate, endDate)
        GetForecastsForBusinessDateRange(entityId: number, startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.IForecast[]>;

        // GetForecasts(entityId)
        GetForecasts(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecast[]>;

        // PatchRevertForecast(entityId, forecastId, opcollection)
        PatchRevertForecast(entityId: number, forecastId: number, /*[FromBody]*/ opcollection: Forecasting.Api.Models.IForecastOperationCollection): ng.IHttpPromise<number>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastFilterAssignController
    export interface IForecastFilterAssignService {

        // GetForecastFilterAssigns()
        GetForecastFilterAssigns(): ng.IHttpPromise<Forecasting.Api.Models.IForecastFilterAssignRecord[]>;

        // PostForecastFilterAssign(forecastFilterAssignRecords)
        PostForecastFilterAssign(/*[FromBody]*/ forecastFilterAssignRecords: Forecasting.Api.Models.IForecastFilterAssignRecord[]): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastFilterController
    export interface IForecastFilterService {

        // GetForecastFilters()
        GetForecastFilters(): ng.IHttpPromise<Forecasting.Api.Models.IForecastFilterRecord[]>;

        // DeleteFilterById(id)
        DeleteFilterById(id: number): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastFilterDialogController
    export interface IForecastFilterDialogService {

        // PostInsertOrUpdateForecastFilter(forecastFilterRecord)
        PostInsertOrUpdateForecastFilter(/*[FromBody]*/ forecastFilterRecord: Forecasting.Api.Models.IForecastFilterRecord): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastGenerationController
    export interface IForecastGenerationService {

        // Get(entityId)
        Get(entityId: number): ng.IHttpPromise<any[]>;

        // Post(entityId, request)
        Post(entityId: number, /*[FromBody]*/ request: any): ng.IHttpPromise<any>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastPipelineController
    export interface IForecastPipelineService {

        // PostPipeline(entityId, forecastId, request)
        PostPipeline(entityId: number, forecastId: number, /*[FromBody]*/ request: Forecasting.Api.Models.IForecastPipelineRequest): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastSalesEvaluationController
    export interface IForecastSalesEvaluationService {

        // GetEvaluateSales(entityId, date, filterId)
        GetEvaluateSales(entityId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedSalesEvaluationResponse[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastSalesItemEvaluationController
    export interface IForecastSalesItemEvaluationService {

        // Get(entityId, salesItemId, date, filterId)
        Get(entityId: number, salesItemId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedSalesItemEvaluationResponse[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastTransactionEvaluationController
    export interface IForecastTransactionEvaluationService {

        // GetEvaluateTransactions(entityId, date, filterId)
        GetEvaluateTransactions(entityId: number, date: string, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IDenormalizedTransactionEvaluationResponse[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ForecastZoneController
    export interface IForecastZoneService {

        // GetForecastZones()
        GetForecastZones(): ng.IHttpPromise<Forecasting.Api.Models.IZone[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.FutureOrderController
    export interface IFutureOrderService {

        // GetAllFutureOrdersForEntity(entityId)
        GetAllFutureOrdersForEntity(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>;

        // GetFutureOrdersByStatusDateRange(entityId, startDate, endDate, statusIds)
        GetFutureOrdersByStatusDateRange(entityId: number, startDate: string, endDate: string, statusIds: string): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>;

        // GetFutureOrdersForDateRange(entityId, startDate, endDate)
        GetFutureOrdersForDateRange(entityId: number, startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>;

        // GetFutureOrdersForBusinessDay(entityId, businessDay)
        GetFutureOrdersForBusinessDay(entityId: number, businessDay: string): ng.IHttpPromise<Forecasting.Api.Models.IFutureOrder[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.HistoricalController
    export interface IHistoricalService {

        // GetForecastSalesHistory(entityId, forecastId, filterId)
        GetForecastSalesHistory(entityId: number, forecastId: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IHistoricalBasis[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.InventoryItemMetricController
    export interface IInventoryItemMetricService {

        // Get(entityId, forecastId, filterId, includeActuals, aggregate)
        Get(entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>;

        // Get(entityId, forecastId, id, filterId, includeActuals, aggregate)
        Get1(entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>;

        // Get(entityId, forecastId, ids, filterId, aggregate)
        Get2(entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<any>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.MetricAllController
    export interface IMetricAllService {

        // GetForecastMetricAlls(entityId, forecastId, filterId, includeActuals)
        GetForecastMetricAlls(entityId: number, forecastId: number, filterId: number, includeActuals: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingMetricAlls>;

        // GetForecastMetricAlls(entityId)
        GetForecastMetricAlls1(entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IForecastingMetricAlls>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.MetricController
    export interface IMetricService {

        // GetForecastMetrics(entityId, forecastId, filterId, includeActuals)
        GetForecastMetrics(entityId: number, forecastId: number, filterId: number, includeActuals: boolean): ng.IHttpPromise<any>;

        // GetForecastMetricsByServiceType(entityId, forecastId, serviceType, includeActuals)
        GetForecastMetricsByServiceType(entityId: number, forecastId: number, serviceType: number, includeActuals: boolean): ng.IHttpPromise<any>;

        // GetForecastEvaluationById(entityId, forecastEvaluationId)
        GetForecastEvaluationById(entityId: number, forecastEvaluationId: string): ng.IHttpPromise<string[]>;

        // GetForecastMetricId(entityId, forecastId, id)
        GetForecastMetricId(entityId: number, forecastId: number, id: number): ng.IHttpPromise<string>;

        // GetEvaluationMetricId(entityId, forecastEvaluationId, id)
        GetEvaluationMetricId(entityId: number, forecastEvaluationId: string, id: number): ng.IHttpPromise<string>;

        // PatchForecastMetricDetails(entityId, forecastId, version, metricDetailRequests)
        PatchForecastMetricDetails(entityId: number, forecastId: number, version: number, /*[FromBody]*/ metricDetailRequests: Forecasting.Api.Models.IForecastMetricDetailsHeader[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.MirroringRegenerationController
    export interface IMirroringRegenerationService {

        // Post(entityId, request)
        Post(entityId: number, /*[FromBody]*/ request: Forecasting.Api.Models.IMirroringRegenerationRequest): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.MultiFilterMetricAllController
    export interface IMultiFilterMetricAllService {

        // GetForecastMetricAlls(entityId, forecastId, filterIds, includeActuals)
        GetForecastMetricAlls(entityId: number, forecastId: number, filterIds: number[], includeActuals: boolean): ng.IHttpPromise<any[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.MultiFilterSalesItemMetricAllController
    export interface IMultiFilterSalesItemMetricAllService {

        // GetForecastingSalesItemMetricAlls(entityId, forecastId, filterIds, includeActuals, aggregate)
        GetForecastingSalesItemMetricAlls(entityId: number, forecastId: number, filterIds: number[], includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any[]>;

        // GetSalesItemMetrics(entityId, forecastId, id, filterIds, includeActuals, aggregate)
        GetSalesItemMetrics(entityId: number, forecastId: number, id: number, filterIds: number[], includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any[]>;

        // GetSalesItemMetricDetailsById(entityId, forecastId, ids, filterIds, aggregate)
        GetSalesItemMetricDetailsById(entityId: number, forecastId: number, ids: string, filterIds: number[], aggregate: boolean): ng.IHttpPromise<any[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.PromotionController
    export interface IPromotionService {

        // Get(startDate, endDate, status)
        Get(startDate: string, endDate: string, status: any): ng.IHttpPromise<Forecasting.Api.Models.IPromotionListItem[]>;

        // Get(id)
        Get1(id: number): ng.IHttpPromise<Forecasting.Api.Models.IPromotion>;

        // GetWithTimeline(id, withTimeline)
        GetWithTimeline(id: number, withTimeline: boolean): ng.IHttpPromise<Forecasting.Api.Models.IPromotion>;

        // GetFormData(id, withFormData)
        GetFormData(id: number, withFormData: boolean): ng.IHttpPromise<Forecasting.Api.Models.IPromotionFormData>;

        // Post(promo, checkOverlap)
        Post(/*[FromBody]*/ promo: Forecasting.Api.Models.IPromotion, checkOverlap: boolean): ng.IHttpPromise<Forecasting.Api.Models.IPromotionResult>;

        // Post(request)
        Post1(/*[FromBody]*/ request: any): ng.IHttpPromise<{}>;

        // Delete(id)
        Delete(id: number): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemController
    export interface ISalesItemService {

        // GetSalesItemsForForecast(entityId, forecastId)
        GetSalesItemsForForecast(entityId: number, forecastId: number): ng.IHttpPromise<Forecasting.Api.Models.ISalesItem[]>;

        // Get(entityId, forecastId, id)
        Get(entityId: number, forecastId: number, id: number): ng.IHttpPromise<string>;

        // GetAll(searchText)
        GetAll(searchText: string): ng.IHttpPromise<Forecasting.Api.Models.ISalesItem[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemHistoricalController
    export interface ISalesItemHistoricalService {

        // GetForecastSalesItemHistory(entityId, forecastId, salesItemId, filterId)
        GetForecastSalesItemHistory(entityId: number, forecastId: number, salesItemId: number, filterId: number): ng.IHttpPromise<Forecasting.Api.Models.IHistoricalSalesItem[]>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemMetricAllController
    export interface ISalesItemMetricAllService {

        // GetForecastingSalesItemMetricAlls(entityId, forecastId, filterId, includeActuals, aggregate)
        GetForecastingSalesItemMetricAlls(entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls>;

        // GetSalesItemMetrics(entityId, forecastId, id, filterId, includeActuals, aggregate)
        GetSalesItemMetrics(entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls>;

        // GetSalesItemMetricDetailsById(entityId, forecastId, ids, filterId, aggregate)
        GetSalesItemMetricDetailsById(entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<Forecasting.Api.Models.IForecastingSalesItemMetricAlls>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemMetricController
    export interface ISalesItemMetricService {

        // GetForecastSalesItemMetric(entityId, forecastId, filterId, includeActuals, aggregate)
        GetForecastSalesItemMetric(entityId: number, forecastId: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>;

        // GetForecastSalesItemMetric(entityId, forecastId, id, filterId, includeActuals, aggregate)
        GetForecastSalesItemMetric1(entityId: number, forecastId: number, id: number, filterId: number, includeActuals: boolean, aggregate: boolean): ng.IHttpPromise<any>;

        // GetForecastSalesItemMetric(entityId, forecastId, ids, filterId, aggregate)
        GetForecastSalesItemMetric2(entityId: number, forecastId: number, ids: string, filterId: number, aggregate: boolean): ng.IHttpPromise<any>;

        // Get(entityId, forecastEvaluationId)
        Get(entityId: number, forecastEvaluationId: string): ng.IHttpPromise<string[]>;

        // GetEvaluationSalesItemMetricId(entityId, forecastEvaluationId, id)
        GetEvaluationSalesItemMetricId(entityId: number, forecastEvaluationId: string, id: number): ng.IHttpPromise<string>;

        // PatchSalesItemMetricDetails(entityId, forecastId, version, salesItemMetricDetailRequests)
        PatchSalesItemMetricDetails(entityId: number, forecastId: number, version: number, /*[FromBody]*/ salesItemMetricDetailRequests: Forecasting.Api.Models.IForecastSalesItemMetricDetailsHeader[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemMirrorIntervalsController
    export interface ISalesItemMirrorIntervalsService {

        // GetSalesItemMirrorInterval(id)
        GetSalesItemMirrorInterval(id: number): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval>;

        // GetSalesItemMirrorIntervals(startDate, endDate)
        GetSalesItemMirrorIntervals(startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval[]>;

        // PostSalesItemMirrorIntervals(salesItemMirrorInterval)
        PostSalesItemMirrorIntervals(/*[FromBody]*/ salesItemMirrorInterval: Forecasting.Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}>;

        // DeleteSalesItemMirrorIntervals(intervalId, resetManagerForecast)
        DeleteSalesItemMirrorIntervals(intervalId: number, resetManagerForecast: boolean): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SalesItemSystemAdjustmentController
    export interface ISalesItemSystemAdjustmentService {

        // PostSalesItemSystemAdjustments(entityId, businessDay, salesItemSystemAdjustmentRequest)
        PostSalesItemSystemAdjustments(entityId: number, businessDay: string, /*[FromBody]*/ salesItemSystemAdjustmentRequest: any[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.StoreMirrorIntervalsController
    export interface IStoreMirrorIntervalsService {

        // GetStoreMirrorInterval(id)
        GetStoreMirrorInterval(id: number): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorInterval>;

        // GetStoreMirrorIntervals(entityId, group, types)
        GetStoreMirrorIntervals(entityId: number, group: any, types: any): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorIntervalGroup[]>;

        // PostStoreMirrorIntervals(storeMirrorIntervalGroup)
        PostStoreMirrorIntervals(/*[FromBody]*/ storeMirrorIntervalGroup: Forecasting.Api.Models.IStoreMirrorIntervalGroup): ng.IHttpPromise<any>;

        // DeleteStoreMirrorInterval(entityId, userName, groupId, resetManagerForecasts)
        DeleteStoreMirrorInterval(entityId: number, userName: string, groupId: any, resetManagerForecasts: boolean): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SystemAdjustmentController
    export interface ISystemAdjustmentService {

        // PostSystemAdjustments(entityId, businessDay, systemAdjustmentRequest)
        PostSystemAdjustments(entityId: number, businessDay: string, /*[FromBody]*/ systemAdjustmentRequest: any[]): ng.IHttpPromise<Forecasting.Api.Models.IForecastUpdateHeader>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.SystemForecastGenerationController
    export interface ISystemForecastGenerationService {

        // Post(entityId, request)
        Post(entityId: number, /*[FromBody]*/ request: Forecasting.Api.Models.ISystemForecastGenerationRequest): ng.IHttpPromise<{}>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.TransitionController
    export interface ITransitionService {

        // GetTransition()
        GetTransition(): ng.IHttpPromise<boolean>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.TranslatedPosServiceTypeController
    export interface ITranslatedPosServiceTypeService {

        // GetPosServiceTypeEnumTranslations()
        GetPosServiceTypeEnumTranslations(): ng.IHttpPromise<Core.Api.Models.ITranslatedEnum[]>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.CountController
    export interface ICountService {

        // Get(countType, entityId, countId)
        Get(countType: Inventory.Count.Api.Models.CountType, entityId: number, countId: number): ng.IHttpPromise<Inventory.Count.Api.Models.IInventoryCount>;

        // Delete(countType, countId, entityId, connectionId)
        Delete(countType: Inventory.Count.Api.Models.CountType, countId: number, entityId: number, connectionId: string): ng.IHttpPromise<{}>;

        // PutCount(countUpdates, entityId, connectionId)
        PutCount(/*[FromBody]*/ countUpdates: Inventory.Count.Api.Models.ICountUpdate[], entityId: number, connectionId: string): ng.IHttpPromise<Inventory.Count.Api.Models.IUpdatedItemCountStatus[]>;

        // GetCheckIfCountApplied(countId)
        GetCheckIfCountApplied(countId: number): ng.IHttpPromise<boolean>;

        // GetEntityItemsAndVendorEntityItemsNotInCurrentCount(entityId, countId, locationId, stockCountItemType, search)
        GetEntityItemsAndVendorEntityItemsNotInCurrentCount(entityId: number, countId: number, locationId: number, stockCountItemType: number, search: string): ng.IHttpPromise<Inventory.Count.Api.Models.ICountItem[]>;

        // PostUpdateCountWithCountItems(entityId, countId, locationId, countItems, countType)
        PostUpdateCountWithCountItems(entityId: number, countId: number, locationId: number, /*[FromBody]*/ countItems: Inventory.Count.Api.Models.ICountItem[], countType: number): ng.IHttpPromise<{}>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.CountTypeController
    export interface ICountTypeService {

        // Get(entityId)
        Get(entityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ICountStatusResponse[]>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.CountVarianceController
    export interface ICountVarianceService {

        // GetCountItemsVariances(entityId, countId)
        GetCountItemsVariances(entityId: number, countId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ICountItemVariance[]>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.FinishController
    export interface IFinishService {

        // Post(model)
        Post(/*[FromBody]*/ model: Inventory.Count.Api.Models.IFinishCountRequest): ng.IHttpPromise<Inventory.Count.Api.Models.IApplyCount>;

        // GetApplyDateByCountType(entityId, countType)
        GetApplyDateByCountType(entityId: number, countType: any): ng.IHttpPromise<Inventory.Count.Api.Models.IApplyDateSettings>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.ReviewController
    export interface IReviewService {

        // GetReview(stockCountLocationId, countType, entityIdCurrent)
        GetReview(stockCountLocationId: number, countType: Inventory.Count.Api.Models.CountType, entityIdCurrent: number): ng.IHttpPromise<Inventory.Count.Api.Models.ICountReviewViewModel>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathAddItemsController
    export interface ITravelPathAddItemsService {

        // GetSearchItemsLimited(searchCriteria, currentEntityId)
        GetSearchItemsLimited(searchCriteria: string, currentEntityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.IInventoryCountLocationItem[]>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathController
    export interface ITravelPathService {

        // GetTravelPathData(entityId)
        GetTravelPathData(entityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPathEntity>;

        // GetTravelPathDataForLocation(entityId, locationId)
        GetTravelPathDataForLocation(entityId: number, locationId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPath>;

        // PostUpdateTravelPath(update, connectionId, currentEntityId)
        PostUpdateTravelPath(/*[FromBody]*/ update: Inventory.Count.Api.Models.IUpdateTravelPath, connectionId: string, currentEntityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPathPartialUpdate[]>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathItemController
    export interface ITravelPathItemService {

        // PostUpdateCount(travelPathItemUpdate)
        PostUpdateCount(/*[FromBody]*/ travelPathItemUpdate: Inventory.Count.Api.Models.ITravelPathItemUpdate): ng.IHttpPromise<{}>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.TravelPathLocationController
    export interface ITravelPathLocationService {

        // PostAddLocation(currentEntityId, locationName, connectionId)
        PostAddLocation(currentEntityId: number, locationName: string, connectionId: string): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPath>;

        // PutLocation(locationId, currentEntityId, newLocationName, targetLocationId, movingLocationId, activateLocation, deactivateLocation, renameLocation, resortLocation, connectionId)
        PutLocation(locationId: number, currentEntityId: number, newLocationName: string, targetLocationId: number, movingLocationId: number, activateLocation: boolean, deactivateLocation: boolean, renameLocation: boolean, resortLocation: boolean, connectionId: string): ng.IHttpPromise<{}>;

        // DeleteLocation(locationId, currentEntityId, connectionId)
        DeleteLocation(locationId: number, currentEntityId: number, connectionId: string): ng.IHttpPromise<{}>;
    }
}

module Inventory.Count.Api {
    // Inventory.Count.Api.UpdateCostController
    export interface IUpdateCostService {

        // PostUpdateCost(updateCostItems, currentEntityId)
        PostUpdateCost(/*[FromBody]*/ updateCostItems: Inventory.Count.Api.Models.IUpdateCostViewModel[], currentEntityId: number): ng.IHttpPromise<{}>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OrderAddItemsController
    export interface IOrderAddItemsService {

        // GetVendorItems(entityId, vendorId, searchText)
        GetVendorItems(entityId: number, vendorId: number, searchText: string): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderDetail[]>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OrderController
    export interface IOrderService {

        // GetOrdersByRange(entityId, fromDate, toDate)
        GetOrdersByRange(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderHeader[]>;

        // GetOrder(entityId, orderId)
        GetOrder(entityId: number, orderId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IOrder>;

        // PostAddItems(entityId, orderId, itemCodes)
        PostAddItems(entityId: number, orderId: number, /*[FromBody]*/ itemCodes: string[]): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderDetail[]>;

        // PostCreateAutoSelectTemplate(entityId, vendorId, deliveryDate, daysToCover)
        PostCreateAutoSelectTemplate(entityId: number, vendorId: number, deliveryDate: string, daysToCover: number): ng.IHttpPromise<number>;

        // PutPurchaseUnitQuantity(entityId, salesOrderItemId, supplyOrderItemId, quantity)
        PutPurchaseUnitQuantity(entityId: number, salesOrderItemId: number, supplyOrderItemId: number, quantity: number): ng.IHttpPromise<{}>;

        // PostCreateSupplyOrder(orderId, autoReceive, invoiceNumber, receiveTime)
        PostCreateSupplyOrder(orderId: number, autoReceive: boolean, invoiceNumber: string, receiveTime: string): ng.IHttpPromise<Inventory.Order.Api.Models.ICreateOrderResult>;

        // DeleteOrder(orderId)
        DeleteOrder(orderId: number): ng.IHttpPromise<{}>;

        // GetOrderItemHistory(transactionSalesOrderItemId)
        GetOrderItemHistory(transactionSalesOrderItemId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderItemHistoryHeader[]>;

        // GetScheduledOrders(entityId, fromDate)
        GetScheduledOrders(entityId: number, fromDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IScheduledOrderHeader[]>;

        // PutVoidedScheduledOrder(entityId, startDate, actionItemInstanceId, currentUserFullName, actionItemId)
        PutVoidedScheduledOrder(entityId: number, startDate: string, actionItemInstanceId: number, currentUserFullName: string, actionItemId: number): ng.IHttpPromise<{}>;

        // PostGenerateSalesOrderFromScheduledOrder(entityId, startDate, actionItemId, actionItemInstanceId)
        PostGenerateSalesOrderFromScheduledOrder(entityId: number, startDate: string, actionItemId: number, actionItemInstanceId: number): ng.IHttpPromise<number>;

        // GetStoreLocalDateTimeString(entityId)
        GetStoreLocalDateTimeString(entityId: number): ng.IHttpPromise<string>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OrderHistoryController
    export interface IOrderHistoryService {

        // GetOrdersByRange(entityId, fromDate, toDate)
        GetOrdersByRange(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IOrderHeader[]>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.OverdueScheduledOrdersController
    export interface IOverdueScheduledOrdersService {

        // GetOverdueScheduledOrders(entityId)
        GetOverdueScheduledOrders(entityId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IScheduledOrderHeader[]>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReceiveOrderController
    export interface IReceiveOrderService {

        // GetReceiveOrder(orderId)
        GetReceiveOrder(orderId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrder>;

        // GetPlacedAndReceivedOrders(entityId, fromDate, toDate)
        GetPlacedAndReceivedOrders(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrderHeader[]>;

        // PostPushForTomorrow(orderId)
        PostPushForTomorrow(orderId: number): ng.IHttpPromise<{}>;

        // PostAddItems(entityId, orderId, itemCodes)
        PostAddItems(entityId: number, orderId: number, /*[FromBody]*/ itemCodes: string[]): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrderDetail[]>;

        // GetLocalStoreDateTimeString(entityId)
        GetLocalStoreDateTimeString(entityId: number): ng.IHttpPromise<string>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReceiveOrderDetailController
    export interface IReceiveOrderDetailService {

        // PostReceiveOrder(entityId, applyDate, orderId, invoiceNumber, items)
        PostReceiveOrder(entityId: number, applyDate: string, orderId: number, invoiceNumber: string, /*[FromBody]*/ items: Inventory.Order.Api.Models.IReceiveOrderDetail[]): ng.IHttpPromise<boolean>;

        // PostAdjustment(entityId, orderId, items)
        PostAdjustment(entityId: number, orderId: number, /*[FromBody]*/ items: Inventory.Order.Api.Models.IReceiveOrderDetail[]): ng.IHttpPromise<boolean>;

        // PostChangeApplyDate(orderId, newApplyDate)
        PostChangeApplyDate(orderId: number, newApplyDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IChangeApplyDateResponse>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReturnEntireOrderController
    export interface IReturnEntireOrderService {

        // PostReturnEntireOrder(orderId)
        PostReturnEntireOrder(orderId: number): ng.IHttpPromise<boolean>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.ReturnOrderController
    export interface IReturnOrderService {

        // GetReceivedOrders(entityId, fromDate, toDate)
        GetReceivedOrders(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Order.Api.Models.IReceiveOrderHeader[]>;

        // PostReturnItemsInOrder(orderId, items)
        PostReturnItemsInOrder(orderId: number, /*[FromBody]*/ items: Inventory.Order.Api.Models.IReceiveOrderDetail[]): ng.IHttpPromise<boolean>;
    }
}

module Inventory.Order.Api {
    // Inventory.Order.Api.VendorController
    export interface IVendorService {

        // Get(entityId)
        Get(entityId: number): ng.IHttpPromise<Inventory.Order.Api.Models.IVendor[]>;
    }
}

module Inventory.Production.Api {
    // Inventory.Production.Api.PrepAdjustController
    export interface IPrepAdjustService {

        // GetPrepAdjustItemsByEntityId(entityId)
        GetPrepAdjustItemsByEntityId(entityId: number): ng.IHttpPromise<Inventory.Production.Api.Models.IPrepAdjustedItem[]>;

        // PostPrepAdjustItems(entityId, items, applyDate)
        PostPrepAdjustItems(entityId: number, /*[FromBody]*/ items: Inventory.Production.Api.Models.IPrepAdjustedItem[], applyDate: string): ng.IHttpPromise<{}>;
    }
}

module Inventory.Production.Api {
    // Inventory.Production.Api.PrepAdjustFavoriteController
    export interface IPrepAdjustFavoriteService {

        // Get(entityId)
        Get(entityId: number): ng.IHttpPromise<Inventory.Production.Api.Models.IPrepAdjustedItem[]>;

        // PostAddFavorite(entityId, itemId)
        PostAddFavorite(entityId: number, itemId: number): ng.IHttpPromise<{}>;

        // DeleteFavorite(entityId, itemId)
        DeleteFavorite(entityId: number, itemId: number): ng.IHttpPromise<{}>;
    }
}

module Inventory.Production.Api {
    // Inventory.Production.Api.PrepAdjustItemSearchController
    export interface IPrepAdjustItemSearchService {

        // GetPrepAdjustItemsByEntityId(entityId, description, recordLimit)
        GetPrepAdjustItemsByEntityId(entityId: number, description: string, recordLimit: number): ng.IHttpPromise<Inventory.Production.Api.Models.IPrepAdjustedItem[]>;
    }
}

module Inventory.Transfer.Api {
    // Inventory.Transfer.Api.TransferController
    export interface ITransferService {

        // GetByTransferIdAndEntityId(transferId, entityId)
        GetByTransferIdAndEntityId(transferId: number, entityId: number): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransfer>;

        // GetPendingTransfersFromStoreByEntityId(transferEntityId, showTransferIn, showTransferOut)
        GetPendingTransfersFromStoreByEntityId(transferEntityId: number, showTransferIn: boolean, showTransferOut: boolean): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeader[]>;

        // GetTransfersByStoreAndDateRange(entityId, startTime, endTime)
        GetTransfersByStoreAndDateRange(entityId: number, startTime: string, endTime: string): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeader[]>;

        // PostCreateInventoryTransfer(transferFromEntityId, transferToEntityId, body)
        PostCreateInventoryTransfer(transferFromEntityId: number, transferToEntityId: number, /*[FromBody]*/ body: Inventory.Transfer.Api.Models.ITransferItemsRequest): ng.IHttpPromise<{}>;

        // PutUpdateTransferQuantities(transfer, isApproved, reason)
        PutUpdateTransferQuantities(/*[FromBody]*/ transfer: Inventory.Transfer.Api.Models.ITransfer, isApproved: boolean, reason: string): ng.IHttpPromise<{}>;

        // PutTransferDetailWithUpdatedCostAndQuantity(transferDetail)
        PutTransferDetailWithUpdatedCostAndQuantity(/*[FromBody]*/ transferDetail: Inventory.Transfer.Api.Models.ITransferDetail): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferDetail>;

        // PutUpdateNoCostItems(transferId, entityId, updateCostItems)
        PutUpdateNoCostItems(transferId: number, entityId: number, /*[FromBody]*/ updateCostItems: Inventory.Count.Api.Models.IUpdateCostViewModel[]): ng.IHttpPromise<{}>;
    }
}

module Inventory.Transfer.Api {
    // Inventory.Transfer.Api.TransferHistoryController
    export interface ITransferHistoryService {

        // GetTransfersWithEntitiesByStoreAndDateRange(entityId, startTime, endTime)
        GetTransfersWithEntitiesByStoreAndDateRange(entityId: number, startTime: string, endTime: string): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeaderWithEntities[]>;

        // GetByTransferIdWithReportingUnits(transferId, entityId)
        GetByTransferIdWithReportingUnits(transferId: number, entityId: number): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferReporting>;
    }
}

module Inventory.Transfer.Api {
    // Inventory.Transfer.Api.TransferStoreController
    export interface ITransferStoreService {

        // GetNeighboringStores(currentStoreId, direction)
        GetNeighboringStores(currentStoreId: number, direction: Inventory.Transfer.Api.Enums.TransferDirection): ng.IHttpPromise<Inventory.Transfer.Api.Models.IStoreItem[]>;

        // GetTransferableItemsBetweenStoresLimited(fromEntityId, toEntityId, filter, direction)
        GetTransferableItemsBetweenStoresLimited(fromEntityId: number, toEntityId: number, filter: string, direction: Inventory.Transfer.Api.Enums.TransferDirection): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferableItem[]>;
    }
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteController
    export interface IWasteService {

        // GetWasteItemsLimited(entityId, filter)
        GetWasteItemsLimited(entityId: number, filter: string): ng.IHttpPromise<Inventory.Waste.Api.Models.IWastedItemCount[]>;

        // PostWasteItems(entityId, items, applyDate)
        PostWasteItems(entityId: number, /*[FromBody]*/ items: Inventory.Waste.Api.Models.IWastedItemCount[], applyDate: string): ng.IHttpPromise<{}>;
    }
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteFavoriteController
    export interface IWasteFavoriteService {

        // Get(entityId)
        Get(entityId: number): ng.IHttpPromise<Inventory.Waste.Api.Models.IWastedItemCount[]>;

        // PostAdd(entityId, itemId, isInventoryItem)
        PostAdd(entityId: number, itemId: number, isInventoryItem: boolean): ng.IHttpPromise<{}>;

        // Delete(entityId, itemId, isInventoryItem)
        Delete(entityId: number, itemId: number, isInventoryItem: boolean): ng.IHttpPromise<{}>;
    }
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteHistoryController
    export interface IWasteHistoryService {

        // GetWasteHistory(entityId, fromDate, toDate)
        GetWasteHistory(entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Inventory.Waste.Api.Models.IWasteHistoryItem[]>;
    }
}

module Inventory.Waste.Api {
    // Inventory.Waste.Api.WasteReasonController
    export interface IWasteReasonService {

        // Get()
        Get(): ng.IHttpPromise<Inventory.Waste.Api.Models.IDropKeyValuePair[]>;
    }
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ColumnsController
    export interface IColumnsService {

        // Get(reportType)
        Get(reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<Operations.Reporting.Api.Models.IColumnResponse>;
    }
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ProductController
    export interface IProductService {

        // Get(entityId, dateFrom, dateTo, reportType, viewId, searchText)
        Get(entityId: number, dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, viewId: number, searchText: string): ng.IHttpPromise<Operations.Reporting.Api.Models.IProductData>;
    }
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ProductExportController
    export interface IProductExportService {

        // Get(entityId, dateFrom, dateTo, reportType, viewId)
        Get(entityId: number, dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, viewId: number): ng.IHttpPromise<any>;
    }
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ReportController
    export interface IReportService {

        // Get(dateFrom, dateTo, reportType, entityId, viewId)
        Get(dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, entityId: number, viewId: number): ng.IHttpPromise<Operations.Reporting.Api.Models.IReportData>;
    }
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ReportExportController
    export interface IReportExportService {

        // Get(dateFrom, dateTo, reportType, entityId, viewId)
        Get(dateFrom: string, dateTo: string, reportType: Operations.Reporting.Api.Models.ReportType, entityId: number, viewId: number): ng.IHttpPromise<any>;
    }
}

module Operations.Reporting.Api {
    // Operations.Reporting.Api.ViewController
    export interface IViewService {

        // GetView(entityId, viewId, reportType)
        GetView(entityId: number, viewId: number, reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<Operations.Reporting.Api.Models.IViewModel>;

        // GetReportViews(entityId, reportType)
        GetReportViews(entityId: number, reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<Operations.Reporting.Api.Models.IViewModel[]>;

        // PostCreateView(entityId, view)
        PostCreateView(entityId: number, /*[FromBody]*/ view: Operations.Reporting.Api.Models.IViewModel): ng.IHttpPromise<number>;

        // PutUpdateView(entityId, view)
        PutUpdateView(entityId: number, /*[FromBody]*/ view: Operations.Reporting.Api.Models.IViewModel): ng.IHttpPromise<{}>;

        // DeleteView(entityId, viewId, reportType)
        DeleteView(entityId: number, viewId: number, reportType: Operations.Reporting.Api.Models.ReportType): ng.IHttpPromise<{}>;
    }
}

module Reporting.Dashboard.Api {
    // Reporting.Dashboard.Api.MeasuresController
    export interface IMeasuresService {

        // GetMeasures(entityId, typeId, groupId, selectedDate)
        GetMeasures(entityId: number, typeId: number, groupId: number, selectedDate: string): ng.IHttpPromise<Reporting.Dashboard.Api.Models.IEntityMeasure[]>;

        // GetMeasureDrilldown(entityId, date, measureKey)
        GetMeasureDrilldown(entityId: number, date: string, measureKey: string): ng.IHttpPromise<Reporting.Dashboard.Api.Models.IDrillDownData>;
    }
}

module Reporting.Dashboard.Api {
    // Reporting.Dashboard.Api.ReferenceDataController
    export interface IReferenceDataService {

        // Get()
        Get(): ng.IHttpPromise<Reporting.Dashboard.Api.Models.IReferenceData>;
    }
}

module Forecasting.Api {
    // Forecasting.Api.ReportMeasureGenerationController
    export interface IReportMeasureGenerationService {

        // Post(entityId, businessDay)
        Post(entityId: number, businessDay: string): ng.IHttpPromise<{}>;
    }
}

module Workforce.Deliveries.Api {
    // Workforce.Deliveries.Api.AvailableUsersController
    export interface IAvailableUsersService {

        // Get(entityId, date)
        Get(entityId: number, date: string): ng.IHttpPromise<Workforce.Deliveries.Api.Models.IClockedOnUser[]>;
    }
}

module Workforce.Deliveries.Api {
    // Workforce.Deliveries.Api.DeliveriesAuthorizeController
    export interface IDeliveriesAuthorizeService {

        // Put(entityId, request)
        Put(entityId: number, /*[FromBody]*/ request: Workforce.Deliveries.Api.Models.IDeliveryAuthorisedRequest): ng.IHttpPromise<boolean>;
    }
}

module Workforce.Deliveries.Api {
    // Workforce.Deliveries.Api.DeliveriesController
    export interface IDeliveriesService {

        // Get(entityId, date)
        Get(entityId: number, date: string): ng.IHttpPromise<Workforce.Deliveries.Api.Models.IDeliveryData>;

        // Post(entityId, request)
        Post(entityId: number, /*[FromBody]*/ request: Workforce.Deliveries.Api.Models.IExtraDeliveryRequest): ng.IHttpPromise<{}>;
    }
}

module Workforce.DriverDistance.Api {
    // Workforce.DriverDistance.Api.DriverDistanceEmployeeController
    export interface IDriverDistanceEmployeeService {

        // GetRecordsForEmployeeByEntityAndDate(employeeId, entityId, date)
        GetRecordsForEmployeeByEntityAndDate(employeeId: number, entityId: number, date: string): ng.IHttpPromise<Workforce.DriverDistance.Api.Models.IDriverDistanceRecord[]>;

        // Post(entityId, request)
        Post(entityId: number, /*[FromBody]*/ request: Workforce.DriverDistance.Api.Models.ICreateDriverDistanceRequest): ng.IHttpPromise<number>;
    }
}

module Workforce.DriverDistance.Api {
    // Workforce.DriverDistance.Api.DriverDistanceManagerController
    export interface IDriverDistanceManagerService {

        // GetRecordsForEntityByDate(entityId, date)
        GetRecordsForEntityByDate(entityId: number, date: string): ng.IHttpPromise<Workforce.DriverDistance.Api.Models.IDriverDistanceRecord[]>;

        // PutActionDriverDistanceRecord(entityId, request)
        PutActionDriverDistanceRecord(entityId: number, /*[FromBody]*/ request: Workforce.DriverDistance.Api.Models.IActionDriverDistanceRequest): ng.IHttpPromise<{}>;

        // GetActiveUsersByAssignedEntity(entityId)
        GetActiveUsersByAssignedEntity(entityId: number): ng.IHttpPromise<Administration.User.Api.Models.IUser[]>;

        // Post(entityId, request)
        Post(entityId: number, /*[FromBody]*/ request: Workforce.DriverDistance.Api.Models.ICreateAuthorizedDriverDistanceRequest): ng.IHttpPromise<number>;
    }
}

module Workforce.MyAvailability.Api {
    // Workforce.MyAvailability.Api.MyAvailabilityController
    export interface IMyAvailabilityService {

        // Get()
        Get(): ng.IHttpPromise<Workforce.MyAvailability.Api.Models.IAvailability>;

        // PutAvailability(availability)
        PutAvailability(/*[FromBody]*/ availability: Workforce.MyAvailability.Api.Models.IDayAvailability): ng.IHttpPromise<{}>;

        // Delete(dayOfWeek, start, end, isAllDay)
        Delete(dayOfWeek: number, start: string, end: string, isAllDay: boolean): ng.IHttpPromise<{}>;
    }
}

module Workforce.MyDetails.Api {
    // Workforce.MyDetails.Api.MyDetailsController
    export interface IMyDetailsService {

        // GetUserById()
        GetUserById(): ng.IHttpPromise<Workforce.MyDetails.Api.Models.IUserContact>;

        // PutUserContact(userContact)
        PutUserContact(/*[FromBody]*/ userContact: Workforce.MyDetails.Api.Models.IUserContact): ng.IHttpPromise<{}>;
    }
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.MyScheduleController
    export interface IMyScheduleService {

        // Get(startDate, endDate)
        Get(startDate: string, endDate: string): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ICalendarEntry[]>;
    }
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.MyScheduleDownloadController
    export interface IMyScheduleDownloadService {

        // Get(beginDate, endDate)
        Get(beginDate: string, endDate: string): ng.IHttpPromise<any>;
    }
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.MyTimeOffController
    export interface IMyTimeOffService {

        // Get(selectedDate)
        Get(selectedDate: string): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ITimeOffRequest[]>;

        // GetFutureTimeOffRequests()
        GetFutureTimeOffRequests(): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ITimeOffRequest[]>;

        // PostCancelRequest(requestId)
        PostCancelRequest(requestId: number): ng.IHttpPromise<{}>;

        // PostNewRequest(request)
        PostNewRequest(/*[FromBody]*/ request: Workforce.MyTimeOff.Api.Models.INewTimeOffRequest): ng.IHttpPromise<Workforce.MyTimeOff.Api.Models.INewTimeOffResult>;
    }
}

module Workforce.MySchedule.Api {
    // Workforce.MySchedule.Api.TeamScheduleController
    export interface ITeamScheduleService {

        // Get(entityId, startDate, stopDate)
        Get(entityId: number, startDate: string, stopDate: string): ng.IHttpPromise<Workforce.MySchedule.Api.Models.ICalendarEntry[]>;
    }
}

module Workforce.MyTimeCard.Api {
    // Workforce.MyTimeCard.Api.MyTimeCardController
    export interface IMyTimeCardService {

        // GetTimeCards(start, end)
        GetTimeCards(start: string, end: string): ng.IHttpPromise<Workforce.MyTimeCard.Api.Models.ITimeCardEntry[]>;
    }
}

module Workforce.MyTimeOff.Api {
    // Workforce.MyTimeOff.Api.TimeOffReasonController
    export interface ITimeOffReasonService {

        // GetReasons()
        GetReasons(): ng.IHttpPromise<any>;
    }
}

module Workforce.PeriodClose.Api {
    // Workforce.PeriodClose.Api.PeriodCloseController
    export interface IPeriodCloseService {

        // GetPeriodLockStatus(entityId, calendarDay)
        GetPeriodLockStatus(entityId: number, calendarDay: string): ng.IHttpPromise<Workforce.PeriodClose.Api.Models.IPeriodClose>;
    }
}

module Core.Api.Models {
    export interface IConstants {
        NumericalInputBoxPattern: string;
        InternalDateFormat: string;
        InternalDateTimeFormat: string;
        DateCompactFormat: string;
        GoogleAnalyticsAccounts: any;
        SystemCulture: string;
        VersionInfo: Core.Api.Models.IVersionInformation;
        TouchKeyboardEnabled: boolean;
        SystemCurrencyId: number;
        SystemCurrencySymbol: string;
        LoginPageColorScheme: number;
        SignaRReconnectionTimeout: number;
        NotificationRefreshInterval: number;
        IsBackplane: boolean;
        CheckBackplaneInterval: number;
        EntitiesWithDifferentCurrencySymbol: Core.Api.Models.IEntityIdWithCurrencySymbol[];
    }
}

module Core.Api.Models {
    export interface IVersionInformation {
        ProductVersion: string;
        FileVersion: string;
    }
}

module Core.Api.Models {
    export interface IEntityIdWithCurrencySymbol {
        EntityId: number;
        CurrencyId: number;
        CurrencySymbol: string;
    }
}

module Core.Api.Models {
    export interface ICurrency {
        CurrencyId: number;
        CurrencyCode: string;
        Title: string;
        ConversionRate: number;
        ReportingRate: number;
        Symbol: string;
        DenominatonCode: string;
        Format: string;
        DecimalSep: string;
        ThousandsSep: string;
        DenominationSet: string;
        MinorSymbol: string;
        MerchantCurrencyCode: string;
    }
}

module Core.Api.Models {
    export interface IJsTreeNode {
        id: string;
        text: string;
        parent: string;
        data: any;
    }
}

module Core.Api.Models {
    export interface ISystemSettings {
        Id: number;
        CurrencyId: number;
        CurrentFiscalYear: string;
        CurrentPeriodDetailNum?: number;
        CurrentStartDate?: string;
        CurrentEndDate?: string;
        CurrentPeriodNo?: number;
        TaxCode?: number;
        CurrencyConversionRate?: number;
        Currency: Core.Api.Models.ICurrency;
    }
}

module Forecasting.Api.Models {
    export interface IPromotion {
        Id: number;
        Name: string;
        StartDate: string;
        EndDate: string;
        UseZones: boolean;
        LimitedTimeOffer: boolean;
        OverwriteManager: boolean;
        Status: Forecasting.Api.Enums.PromotionStatus;
        Timeline: Forecasting.Api.Enums.PromotionTimeline;
        Items: Forecasting.Api.Models.IPromotionSalesItem[];
        Entities: number[];
        Zones: number[];
    }
}

module Forecasting.Api.Models {
    export interface IPromotionSalesItem {
        Id: number;
        ItemCode: string;
        Description: string;
        AdjustmentPercent: number;
        Impacted: boolean;
    }
}

module Forecasting.Api.Models {
    export interface IPromotionFormData {
        Promotion: Forecasting.Api.Models.IPromotion;
        Today: string;
        Zones: Forecasting.Api.Models.IZone[];
        Entities: Core.Api.Models.IJsTreeNode[];
    }
}

module Forecasting.Api.Models {
    export interface IZone {
        Id: number;
        Name: string;
        EntityCount: number;
    }
}

module Forecasting.Api.Models {
    export interface IPromotionOverlap {
        ItemCode: string;
        Description: string;
        Promotions: string[];
    }
}

module Forecasting.Api.Models {
    export interface IPromotionResult {
        Id: number;
        Overlaps: Forecasting.Api.Models.IPromotionOverlap[];
    }
}

module Mx.Web.UI.Config.WebApi {
    export interface IErrorMessage {
        Message: string;
    }
}

module Administration.DayCharacteristic.Api.Models {
    export interface IDayCharacteristic {
        Code: string;
        Description: string;
    }
}

module Administration.DayCharacteristic.Api.Models {
    export interface IEntityDayCharacteristic {
        Notes: string;
        DayCharacteristics: Administration.DayCharacteristic.Api.Models.IDayCharacteristic[];
    }
}

module Administration.Hierarchy.Api.Models {
    export interface IHierarchyEntity {
        Id: number;
        Name: string;
        Number: string;
        Status: string;
        Type: number;
        Children: Administration.Hierarchy.Api.Models.IHierarchyEntity[];
    }
}

module Administration.Settings.Api.Models {
    export interface IInventoryCountSettingsViewModel {
        PendingColor: string;
        OutOfToleranceColor: string;
        CountedColor: string;
    }
}

module Administration.Settings.Api.Models {
    export interface ISettingGroup {
        GroupId: number;
        Group: string;
        Measures: Administration.Settings.Api.Models.ISettingMeasure[];
    }
}

module Administration.Settings.Api.Models {
    export interface ISettingMeasure {
        MeasureKey: string;
        EntityId: number;
        Enabled: boolean;
        ToleranceMin: number;
        ToleranceMax: number;
        Visible: boolean;
        DisplayName: string;
        ToleranceFormat: string;
        Group: string;
        GroupHeading: string;
        ToleranceReadOnly: boolean;
        SettingType: Administration.Settings.Api.Models.SettingEnums;
        ToleranceFormatEnum: Administration.Settings.Api.Models.SettingToleranceFormatEnums;
        ToleranceSymbol: string;
        EditableToleranceMin: number;
        EditableToleranceMax: number;
    }
}

module Administration.Settings.Api.Models {
    export interface ISiteSettings {
        LoginColorScheme: number;
    }
}

module Administration.User.Api.Models {
    export interface IUser {
        Id: number;
        FirstName: string;
        LastName: string;
        MiddleName: string;
        EmployeeNumber: string;
        UserName: string;
        Status: string;
        SecurityGroups: number[];
        Entity: Administration.User.Api.Models.IEntity;
    }
}

module Administration.User.Api.Models {
    export interface IEntity {
        Id: number;
        Name: string;
        Number: string;
    }
}

module Administration.User.Api.Models {
    export interface ISecurityGroup {
        Id: number;
        Name: string;
        Description: string;
        IsDefault: boolean;
        IsEditable: boolean;
    }
}

module Core.Api.Models {
    export interface IEntityModel {
        Id: number;
        Name: string;
        Number: string;
        Status: string;
        ParentId: number;
        TypeId: number;
        CultureName: string;
        CurrentStoreTime: string;
        CurrentBusinessDay: string;
    }
}

module Core.Api.Models {
    export interface IMobileSettings {
        EntityId: number;
        EntityName: string;
        EntityNumber: string;
        FavouriteStores: number[];
    }
}

module Core.Api.Models {
    export interface INotificationArea {
        Name: string;
        Notifications: Core.Api.Models.INotification[];
    }
}

module Core.Api.Models {
    export interface INotification {
        Url: string;
        Title: string;
    }
}

module Core.Api.Models {
    export interface ITranslations {
        Core: Core.Api.Models.IL10N;
        ChangeStore: Administration.ChangeStore.Api.Models.IL10N;
        MyAccount: Administration.MyAccount.Api.Models.IL10N;
        Settings: Administration.Settings.Api.Models.IL10N;
        Authentication: Core.Auth.Api.Models.IL10N;
        InventoryCount: Inventory.Count.Api.Models.IL10N;
        InventoryOrder: Inventory.Order.Api.Models.IL10N;
        InventoryTransfer: Inventory.Transfer.Api.Models.IL10N;
        InventoryWaste: Inventory.Waste.Api.Models.IL10N;
        Dashboard: Reporting.Dashboard.Api.Models.IL10N;
        Forecasting: Forecasting.Api.Models.ITranslations;
        ForecastingPromotions: Forecasting.Api.Models.IPromotionTranslations;
        DataLoad: Administration.DataLoad.Api.Models.IL10N;
        Hierarchy: Administration.Hierarchy.Api.Models.ITranslations;
        User: Administration.User.Api.Models.ITranslations;
        Notifications: Core.Api.Models.Notifications.IL10N;
        WorkforceMySchedule: Workforce.MySchedule.Api.Models.IL10N;
        WorkforceMyAvailability: Workforce.MyAvailability.Api.Models.IL10N;
        WorkforceMyTimeCard: Workforce.MyTimeCard.Api.Models.IL10N;
        WorkforceMyTimeOff: Workforce.MyTimeOff.Api.Models.IL10N;
        WorkforceMyDetails: Workforce.MyDetails.Api.Models.IL10N;
        PartnerRedirect: Core.PartnerRedirect.Api.Models.IL10N;
        WorkforceDeliveries: Workforce.Deliveries.Api.Models.IL10N;
        WorkforceDriverDistance: Workforce.DriverDistance.Api.Models.IL10N;
        OperationsReporting: Operations.Reporting.Api.Models.IL10N;
        OperationsReportingStoreSummary: Operations.Reporting.StoreSummary.Api.Models.IL10N;
        OperationsReportingAreaSummary: Operations.Reporting.AreaSummary.Api.Models.IL10N;
        OperationsReportingInventoryMovement: Operations.Reporting.InventoryMovement.Api.Models.IL10N;
        OperationsReportingProductMix: Operations.Reporting.ProductMix.Api.Models.IL10N;
        InventoryProduction: Inventory.Production.Api.Models.IL10N;
    }
}

module Core.Api.Models {
    export interface IL10N {
        Workforce: string;
        MenuOperations: string;
        HsSsoRedirect: string;
        Cancel: string;
        Apply: string;
        Last: string;
        Days: string;
        CustomRange: string;
        To: string;
        From: string;
        SelectCustomRange: string;
        PickerApply: string;
        PickerCancel: string;
        PickerRange: string;
        PickerWeek: string;
        PickerMonth: string;
        PickerTitle: string;
        BackplaneRefresh: string;
        BackplaneMessage: string;
        BackplaneTitle: string;
    }
}

module Administration.ChangeStore.Api.Models {
    export interface IL10N {
        ChangeStore: string;
        Store: string;
        Select: string;
        TypeToSearch: string;
        UnexpectedError: string;
        StoreSelected: string;
    }
}

module Administration.MyAccount.Api.Models {
    export interface IL10N {
        Off: string;
        On: string;
        MyAccount: string;
        ManagePIN: string;
        SetPIN: string;
        UpdatePIN: string;
        YourCurrentPassword: string;
        YourNewPIN: string;
        ConfirmYourPIN: string;
        Save: string;
        Reset: string;
        Enable: string;
        Cancel: string;
        PINsDoNotMatch: string;
        InvalidCredentials: string;
        TurnOFFMessageTitle: string;
        TurnOFFMessage: string;
        TurnOFFConfirm: string;
    }
}

module Administration.Settings.Api.Models {
    export interface IL10N {
        LaborCostPercentageDisplayName: string;
        Off: string;
        SpeedOfServiceDisplayName: string;
        RefundsDisplayName: string;
        LaborActualVsScheduledDisplayName: string;
        Store: string;
        NetSalesVsBudgetDisplayName: string;
        On: string;
        NetSalesDisplayName: string;
        Application: string;
        WasteAsPercentageOfSalesDisplayName: string;
        SelectStore: string;
        Global: string;
        Product: string;
        SalesPerLaborHourDisplayName: string;
        DeletionsDisplayName: string;
        InventoryActualVsTheoreticalDisplayName: string;
        GrossProfitPercentageDisplayName: string;
        VoidsDisplayName: string;
        Back: string;
        Status: string;
        Settings: string;
        Kpis: string;
        CashVarianceDisplayName: string;
        InventoryVarianceDisplayName: string;
        TransactionsPerLaborHourDisplayName: string;
        TransactionCountDisplayName: string;
        Labor: string;
        Sales: string;
        DiscountsDisplayName: string;
        TicketAverageDisplayName: string;
        Dashboard: string;
        Tolerance: string;
        Enabled: string;
        Site: string;
        Save: string;
        LoginBackground: string;
        LoginBackgroundSelectMessage: string;
        SiteSettingsSaved: string;
        ForecastFilterUsage: string;
        Function: string;
        Ordering: string;
        Production: string;
        WorkforceScheduling: string;
        Filter: string;
        Total: string;
        ForecastFilterUsageSettingsSaved: string;
        ForecastFilterSetup: string;
        NoForecastFiltersDefined: string;
        NewForecastFilter: string;
        EditForecastFilter: string;
        AddForecastFilter: string;
        SaveForecastFilter: string;
        ForecastFilters: string;
        CanEditForecast: string;
        ForecastFilterName: string;
        Edit: string;
        ServiceTypes: string;
        ForecastFilterNameIsNotUnique: string;
        InUse: string;
        Delete: string;
        DeleteModalWindowTitle: string;
        DeleteModalWindowMessage: string;
        FilterDeleted: string;
        FilterDeleteError: string;
        InventoryCountSettings: string;
        InventoryCountSettingsIndicator: string;
        InventoryCountSettingsPending: string;
        InventoryCountSettingsOutOfTolerance: string;
        InventoryCountSettingsCounted: string;
        InventoryCountSettingsSaved: string;
    }
}

module Core.Auth.Api.Models {
    export interface IL10N {
        Login: string;
        Username: string;
        Password: string;
        AccessDenied: string;
        YouDontHaveAccess: string;
        PleaseContactYourAdmin: string;
        ResourceNotFound: string;
        PageUnavailableWhileOffline: string;
        ResourceUnavailable: string;
        InvalidCredentials: string;
        PasswordExpired: string;
        AccountDisabled: string;
        AccountDisabledPleaseWait: string;
        ServerUnavailable: string;
        SignIn: string;
        LogOut: string;
        Lock: string;
        WelcomeBack: string;
        NotYou: string;
        InvalidPin: string;
        LogoutFromMMS: string;
    }
}

module Inventory.Count.Api.Models {
    export interface IL10N {
        FoodCost: string;
        Value: string;
        Weekly: string;
        TransferInValue: string;
        TransferInTitle: string;
        Items: string;
        ItemCode: string;
        Locations: string;
        ProductCode: string;
        FinishNow: string;
        Menu: string;
        InventoryCountDeleted: string;
        Location: string;
        Review: string;
        NoCategory: string;
        DoneText: string;
        NoUpdatePermission: string;
        FirstCount: string;
        Counting: string;
        InventoryCountLater: string;
        InventoryCount: string;
        LoadingMoreItemsMsg: string;
        PreviousMonthlyCountExists: string;
        UpdateTravelPathSubmitFailure: string;
        TravelPathAddNewItems: string;
        TravelPathAddItems: string;
        LocationExceedsSizeLimitMsg: string;
        CountHasBeenApplied: string;
        Search: string;
        SearchItems: string;
        SearchForItems: string;
        Save: string;
        TotalSales: string;
        SubmitCount: string;
        Inner: string;
        Daily: string;
        Back: string;
        Units: string;
        ConfirmDeleteButton: string;
        Cost: string;
        NotCounted: string;
        Pending: string;
        Variance: string;
        Partial: string;
        Counted: string;
        FinishLater: string;
        EndCost: string;
        AddLocation: string;
        SameLocationWarning: string;
        DeleteNoticeMessage: string;
        ItemsNotCounted: string;
        PendingOrders: string;
        Inners: string;
        InventoryCountSubmitSuccess: string;
        InventoryCountSubmitInProgress: string;
        InventoryCountSaved: string;
        CountingNow: string;
        Description: string;
        Item: string;
        SubmitNoticeMessage: string;
        DeleteText: string;
        Category: string;
        TotalCostValue: string;
        Total: string;
        Outers: string;
        InventoryTransfer: string;
        TravelPath: string;
        EmptyCountList: string;
        DeleteNotice: string;
        Add: string;
        Receive: string;
        Of: string;
        Supplier: string;
        SelectLocationAdd: string;
        RemoveCount: string;
        Unit: string;
        SalesValue: string;
        Finish: string;
        OrderDetails: string;
        MonthlyCountExists: string;
        NameRequired: string;
        CouldNotApply: string;
        InventoryWaste: string;
        OpeningStockValue: string;
        Spot: string;
        ReturnToCount: string;
        UpdateCost: string;
        WasteValue: string;
        LocationNameExistsMsg: string;
        Count: string;
        NewItemMessage: string;
        NewItemsLocationWarning: string;
        Monthly: string;
        SelectTime: string;
        Copy: string;
        MissingUpdateCost: string;
        TransferOutValue: string;
        TransferOutTitle: string;
        CountInProgress: string;
        For: string;
        ContinueCount: string;
        ConfirmDeleteMessage: string;
        UpdateCountTime: string;
        InventoryActivity: string;
        ReviewCount: string;
        ViewCount: string;
        ViewActiveCount: string;
        Bump: string;
        CannotCalculateVariance: string;
        SubmitNotice: string;
        CountIsOverDueMessage: string;
        DeleteKey: string;
        SelectCountTime: string;
        EndCount: string;
        ItemDetails: string;
        CountOverDue: string;
        InventoryOrder: string;
        ActualUsage: string;
        ExpectedDate: string;
        MonthlyCountCompleted: string;
        OfflineQueueWarning: string;
        UOM: string;
        AddItem: string;
        AddItemMessage: string;
        BeginCount: string;
        LocationNameBlankMsg: string;
        Continue: string;
        WithATimeOf: string;
        OrderId: string;
        OpeningCost: string;
        ConfirmDelete: string;
        Cancel: string;
        FCPercentage: string;
        DeliveryDate: string;
        FinishCount: string;
        ItemsWithWarning: string;
        ItemsWithWarningPositive: string;
        ItemsWithWarningNegative: string;
        CountInProgressExists: string;
        Outer: string;
        CategorySales: string;
        ConfirmDeleteLocation: string;
        Other: string;
        InventoryCountSubmitFail: string;
        Periodic: string;
        ManageLocations: string;
        Place: string;
        Sales: string;
        DeleteCount: string;
        DeleteCurrentCountQuestion: string;
        PurchaseExclReturnsValue: string;
        NotReceived: string;
        OpeningStockQuantity: string;
        ManageTravelPath: string;
        OnHand: string;
        CountDoesNotExist: string;
        Move: string;
        Weight: string;
        GeneralNotice: string;
        ChangeCountTime: string;
        Saved: string;
        InventoryCountType: string;
        NoData: string;
        NoProductsForLocation: string;
        Order: string;
        ItemAlreadyExistsInLocation: string;
        ItemsHaveBeenCopied: string;
        ItemsHaveBeenDeleted: string;
        ItemsHaveBeenMoved: string;
        ErrorHacOccuredPleaseContactSysAdmin: string;
        DeleteItems: string;
        DeleteLocation: string;
        DoYouWantToDeleteItems: string;
        TravelPathDoYouWantToDeleteLocation: string;
        TravelPathLocationHasBeenUpdated: string;
        TravelPathLocationHasBeenAdded: string;
        TravelPathLocationHasBeenDeleted: string;
        TravelPathLocations: string;
        TravelPathEditLocation: string;
        TravelPathLocationAlreadyExists: string;
        NoItemsHaveBeenFound: string;
        Name: string;
        TravelPathTypeLocationName: string;
        TravelPathManageLocations: string;
        TravelPathTitle: string;
        OfflineMode: string;
        PendingChanges: string;
        NoLocationsForCount: string;
        Actions: string;
        Close: string;
        CountUpdateCostPermission: string;
        MoveToLocation: string;
        CopyToLocations: string;
        WeekEnding: string;
        MidPeriod: string;
        EndOfPeriod: string;
        CustomDate: string;
        CountAlreadyExists: string;
        DuplicateApplyDate: string;
        APeriodCount: string;
        CanNotBeFinalized: string;
        FoundInXLocations: string;
        FoundInOneLocations: string;
        SelectItemDescription: string;
        NoMatches: string;
        Period: string;
        CountHasBeenSubmitted: string;
        ManageColumns: string;
        Confirm: string;
        SelectValue: string;
        CountHasBeenSubmittedOffline: string;
        OnHandValue: string;
        InvalidDate: string;
        StoreDateTimeNotAvailable: string;
        AppliedAsAt: string;
        PeriodClosed: string;
        UnitOfMeasure: string;
        CountFrequency: string;
        Groups: string;
        NoGroupsForCount: string;
        AddItems: string;
        VendorEntityItem: string;
        EntityItem: string;
        AllItems: string;
        ItemType: string;
        InventoryItems: string;
        VendorItems: string;
    }
}

module Inventory.Order.Api.Models {
    export interface IL10N {
        Pending: string;
        PastDue: string;
        InProgress: string;
        ReceiveOrderSubmitInProgress: string;
        ChangeApplyDateSuccessful: string;
        PeriodIsClosed: string;
        Cancelled: string;
        Placed: string;
        Ordered: string;
        Shipped: string;
        AutoReceived: string;
        Received: string;
        Returned: string;
        OnHold: string;
        Rejected: string;
        ItemsInDelivery: string;
        DeliveryTotal: string;
        InventoryOrder: string;
        Place: string;
        Receive: string;
        MenuReturn: string;
        Orders: string;
        Scheduled: string;
        ScheduledOrders: string;
        AllScheduledOrders: string;
        OverdueScheduledOrders: string;
        Supplier: string;
        OrderNumber: string;
        OrderDate: string;
        DeliveryDate: string;
        ApplyDate: string;
        DaysToCover: string;
        Status: string;
        ItemCounts: string;
        TotalAmount: string;
        View: string;
        Cutoff: string;
        SkipOrder: string;
        CreateNewOrder: string;
        AddOrder: string;
        Last: string;
        CustomRange: string;
        Days: string;
        SelectCustomRange: string;
        To: string;
        From: string;
        Apply: string;
        Draft: string;
        InvoiceNumber: string;
        ReceiveDate: string;
        ItemsInOrder: string;
        ItemsReceived: string;
        OrderTotal: string;
        Min: string;
        ItemCode: string;
        Unit: string;
        ExtendedPrice: string;
        Extended: string;
        OnHand: string;
        Taxable: string;
        Price: string;
        Quantity: string;
        OnOrder: string;
        BuildTo: string;
        AllCategories: string;
        LastOrder: string;
        Max: string;
        Forecast: string;
        Description: string;
        OrderDetails: string;
        ItemDetails: string;
        DeletedSuccessfully: string;
        Youmustorderatleastoneitem: string;
        AllItems: string;
        NoMatchingItems: string;
        CustomizeColumns: string;
        ActiveColumns: string;
        Columns: string;
        PreviousOrders: string;
        Date: string;
        Back: string;
        TheOrderHasBeenPushedToTomorrow: string;
        InvalidQuantityMessage: string;
        InvalidQuantityMessageNoMax: string;
        ConversionRate: string;
        InvalidHistoricalOrderForm: string;
        CoverUntil: string;
        SelectDate: string;
        Actions: string;
        FinishReceive: string;
        FinishLater: string;
        FinishNow: string;
        ChangeApplyDate: string;
        Delete: string;
        Return: string;
        PushToTomorrow: string;
        Cancel: string;
        Confirm: string;
        DeleteOrder: string;
        ConfirmDeleteOrder: string;
        ConfirmPlaceOrderMessage: string;
        AutoReceive: string;
        ChangeApplyDateMessage: string;
        NewApplyDate: string;
        GenericElectronicOrderError: string;
        History: string;
        OrderHistory: string;
        SearchItems: string;
        SearchOrders: string;
        PageSummary: string;
        ErrorHasOccuredPleaseContactSysAdmin: string;
        PlacedOrdersExist: string;
        PlacedOrders: string;
        OrderPlacedSuccessfully: string;
        ManageColumns: string;
        ReceiveOrder: string;
        ReceiveSelected: string;
        ReceiveOrderDetail: string;
        CorrectReceive: string;
        SaveChanges: string;
        CancelChanges: string;
        CancelConfirmation: string;
        ReceiveAdjustmentSuccess: string;
        ReturnOrder: string;
        ReturnOrderDetail: string;
        ReturnEntireOrder: string;
        ReturnSelected: string;
        ReturnQuantityGreaterThanReceived: string;
        ReturnQuantityCannotExceedReceivedQuantity: string;
        ReturnQty: string;
        PreviousReturned: string;
        ReturnSuccessful: string;
        ReturnConfirmation: string;
        ReturnConfirmationMessage: string;
        EntireOrderSuccessfullyReturned: string;
        DiscardChanges: string;
        Cases: string;
        AddItems: string;
        AddItemsShort: string;
        PeriodClosed: string;
        GenericCreateOrderError: string;
        OrderConflictError: string;
        ConversionRatesMissing: string;
    }
}

module Inventory.Transfer.Api.Models {
    export interface IL10N {
        InventoryAdjustment: string;
        Transfers: string;
        History: string;
        TransfersToApproveAndReceive: string;
        TransferZoneStores: string;
        Select: string;
        TransferDetails: string;
        TransferRequestSummary: string;
        Details: string;
        Back: string;
        Actions: string;
        Create: string;
        OpenTransfers: string;
        Approve: string;
        Deny: string;
        TransferTo: string;
        TransferFrom: string;
        RequestDate: string;
        Requester: string;
        ItemsRequested: string;
        TotalCost: string;
        Description: string;
        ItemCode: string;
        QuantityRequested: string;
        UnitCost: string;
        ExtendedCost: string;
        ResultingOnHand: string;
        Unit: string;
        InventoryTransfers: string;
        NolocationsInYourTransferZone: string;
        NoTransfersToApproveOrRequest: string;
        View: string;
        Cancel: string;
        Confirm: string;
        ConfirmApproval: string;
        ConfirmDenial: string;
        ConfirmCancel: string;
        ConfirmReceive: string;
        ConfirmApprovalMessage: string;
        ConfirmDenialMessage: string;
        ConfirmReceiveMessage: string;
        ConfirmCancelMessage: string;
        DenialReason: string;
        CancelReason: string;
        TransferApproved: string;
        TransferDenied: string;
        TransferReceived: string;
        AddNewItems: string;
        SearchForItems: string;
        Search: string;
        NoItemsHaveBeenFound: string;
        Close: string;
        AddItems: string;
        NoItemsMessage: string;
        Submit: string;
        From: string;
        To: string;
        CreateTransferRequest: string;
        ProductCode: string;
        QtyAtLocation: string;
        QtyOnHand: string;
        QtyRequested: string;
        QtyTransferred: string;
        TranferSubmitSuccess: string;
        TransferSubmitError: string;
        InventoryTransfer: string;
        ApproveTransfer: string;
        Request: string;
        RequestTransfer: string;
        CreateTransfer: string;
        AltUnit1: string;
        AltUnit2: string;
        AltUnit3: string;
        BaseUnit: string;
        Items: string;
        ItemDetails: string;
        TransferHistory: string;
        SearchStore: string;
        Direction: string;
        Store: string;
        RequestedDate: string;
        Status: string;
        NoMatchingItems: string;
        TransferDetail: string;
        Dash: string;
        BaseUnitCost: string;
        DiscardNewTransferConfirmation: string;
        TransferNotSubmitted: string;
        Continue: string;
        DenialReasonDefaultText: string;
        Date: string;
        Creator: string;
        Receive: string;
        RequestSent: string;
        ReadyToApprove: string;
        ReadyToReceive: string;
        TransferSent: string;
        PeriodClosed: string;
    }
}

module Inventory.Waste.Api.Models {
    export interface IL10N {
        WasteTotal: string;
        Outer: string;
        AddItemMessage: string;
        Ordering: string;
        CountingMessage: string;
        Unit: string;
        RawItems: string;
        ItemDescription: string;
        PleaseEnterReasonMsg: string;
        AddItem: string;
        FinishedItems: string;
        AllItems: string;
        Delete: string;
        Transfers: string;
        Count: string;
        Partial: string;
        Location: string;
        FinishedWaste: string;
        Cancel: string;
        SearchResults: string;
        Back: string;
        Menu: string;
        Waste: string;
        ConfirmDelete: string;
        Finish: string;
        PleaseEnterQuantityMsg: string;
        Reason: string;
        DeleteKey: string;
        Search: string;
        WasteSubmitted: string;
        Units: string;
        Outers: string;
        NewItemMessage: string;
        ItemNameSearch: string;
        LoadingMoreItemsMsg: string;
        TotalsMessage: string;
        SelectReason: string;
        InventoryCount: string;
        RawWaste: string;
        Description: string;
        ItemCode: string;
        ProductCode: string;
        Inner: string;
        History: string;
        AddNewItems: string;
        NoProductsMessage: string;
        Date: string;
        User: string;
        ItemQuantity: string;
        ViewDetails: string;
        PageTitle: string;
        Last: string;
        Days: string;
        CustomRange: string;
        SearchForItems: string;
        NoItemsHaveBeenFound: string;
        Close: string;
        AddItems: string;
        Type: string;
        Raw: string;
        Finished: string;
        FinishAdjustment: string;
        ItemsBeingModified: string;
        AdjustmentSubmit: string;
        AdjustmentSubmitSuccess: string;
        AdjustmentSubmitFail: string;
        Cost: string;
        WasteHistory: string;
        NoItemsOfType: string;
        AddNewItemToBegin: string;
        InventoryWaste: string;
        MenuHistory: string;
        MenuRecord: string;
        RemoveItem: string;
        ToggleFavorite: string;
        PeriodClosed: string;
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IL10N {
        Back: string;
        Up: string;
        PreviousMeasure: string;
        NextMeasure: string;
        GraphOn: string;
        DeletionsDisplayName: string;
        Sep: string;
        GraphOff: string;
        Graph: string;
        Apr: string;
        GrossProfitPercentageChartSubTitle: string;
        InventoryActualVsTheoreticalChartSubTitle: string;
        CashVarianceDisplayName: string;
        Week: string;
        WeekToDate: string;
        SpeedOfServiceDisplayName: string;
        DiscountsDisplayName: string;
        InventoryActualVsTheoreticalDisplayName: string;
        Status: string;
        VoidsDisplayName: string;
        Month: string;
        MonthToDate: string;
        FavoriteStores: string;
        NetSalesVsBudgetDisplayName: string;
        RefundsDisplayName: string;
        NetSalesVsBudgetChartSubTitle: string;
        Jun: string;
        NetSalesDisplayName: string;
        Product: string;
        GrossProfitPercentageDisplayName: string;
        TicketAverageDisplayName: string;
        SalesPerLaborHourDisplayName: string;
        InventoryVarianceChartSubTitle: string;
        Company: string;
        NetSalesChartSubTitle: string;
        Aug: string;
        Oct: string;
        Today: string;
        ThisDay: string;
        NoGroupData: string;
        WasteAsPercentageOfSalesDisplayName: string;
        Jan: string;
        Jul: string;
        Areas: string;
        DiscountsChartSubTitle: string;
        Regions: string;
        SearchOff: string;
        TypeToSearch: string;
        Labor: string;
        SpeedOfServiceChartSubTitle: string;
        LastYearButton: string;
        SalesPerLaborHourChartSubTitle: string;
        LaborActualVsScheduledChartSubTitle: string;
        TransactionsPerLaborHourChartSubTitle: string;
        RefundsChartSubTitle: string;
        ReportingComingSoon: string;
        MonthButton: string;
        DeletionsChartSubTitle: string;
        Feb: string;
        May: string;
        WasteAsPercentageOfSalesChartSubTitle: string;
        DayButton: string;
        LaborActualVsScheduledDisplayName: string;
        Nov: string;
        TransactionsPerLaborHourDisplayName: string;
        LastYear: string;
        MaxFavourtiesMessage: string;
        SearchOn: string;
        LaborCostPercentageDisplayName: string;
        WeekButton: string;
        GraphNotAvailable: string;
        Mar: string;
        Dec: string;
        LaborCostPercentageChartSubTitle: string;
        Sales: string;
        Grid: string;
        Dashboard: string;
        ToDate: string;
        TransactionCountDisplayName: string;
        Stores: string;
        InventoryVarianceDisplayName: string;
        Yesterday: string;
        TicketAverageChartSubTitle: string;
        VoidsChartSubTitle: string;
        Kpis: string;
        TransactionCountChartSubTitle: string;
        CashVarianceChartSubTitle: string;
        HorizontalBars: string;
        VerticalBars: string;
        LineGraph: string;
        PieChart: string;
        NoDataToDisplay: string;
    }
}

module Forecasting.Api.Models {
    export interface ITranslations {
        AllDay: string;
        DayPart: string;
        Metric: string;
        MenuForecast: string;
        MenuForecastEvaluator: string;
        MenuSales: string;
        MenuTransactions: string;
        MenuSalesItems: string;
        MenuEvents: string;
        MenuSalesItemMirroring: string;
        MenuStoreMirroring: string;
        MenuPromotions: string;
        Sales: string;
        Transactions: string;
        SalesItems: string;
        TitleForecasting: string;
        Time: string;
        Forecasted: string;
        LastYear: string;
        SystemForecast: string;
        ManagerForecast: string;
        Totals: string;
        ForecastSales: string;
        LastYearSales: string;
        LastYearSalesNotAvailable: string;
        ForecastDayGrid: string;
        ForecastDayGraph: string;
        ToggleGrid: string;
        ToggleGraph: string;
        SaveAdjustments: string;
        ForecastExists: string;
        AdjustmentsCancelLocation: string;
        AdjustmentsCancelAggregate: string;
        AdjustmentsCancelMessage: string;
        AdjustmentsCancelTitle: string;
        AdjustmentsCancelConfirm: string;
        Day: string;
        NoDataMessage: string;
        NothingToEvaluateIndicator: string;
        ForecastEditTitle: string;
        Value: string;
        Percentage: string;
        Apply: string;
        Cancel: string;
        Save: string;
        SavedSuccessfully: string;
        Error: string;
        NoForecastForDay: string;
        SalesitemEditTitle: string;
        NewValue: string;
        GenericErrorMessage: string;
        EditSalesTitle: string;
        EditTransactionCountTitle: string;
        MissingFiscalPeriod: string;
        SearchSalesItem: string;
        NoSalesItemResults: string;
        SearchPlaceholder: string;
        TitleEvaluator: string;
        WeekOf: string;
        History: string;
        HistoryTitle: string;
        ForecastReset: string;
        HistoryConfirmation: string;
        HistorySuccessful: string;
        Actual: string;
        SystemGenerated: string;
        ManagerEdited: string;
        SystemAccuracy: string;
        ManagerAccuracy: string;
        SalesDropDown: string;
        TransactionsDropDown: string;
        SalesItemsDropDown: string;
        SearchForItems: string;
        Search: string;
        Select: string;
        TitleEvent: string;
        Actions: string;
        NewEventProfile: string;
        EditEventProfile: string;
        ScheduleEvent: string;
        AddEvent: string;
        AddEventProfile: string;
        ScheduleEventTitle: string;
        EditEventButton: string;
        DeleteEvent: string;
        DeleteEventConfirmationTitle: string;
        DeleteEventConfirmationMessage: string;
        EditEventTitle: string;
        Delete: string;
        DeleteEventHasBeenSuccessful: string;
        EventDate: string;
        NoEventsScheduled: string;
        NoEventsTapToAdd: string;
        PleaseSelectAnEvent: string;
        Adjustments: string;
        Date: string;
        EventProfile: string;
        EventProfileName: string;
        EventProfileInPast: string;
        AdjustmentMethod: string;
        PastOccurrences: string;
        Notes: string;
        SelectProfile: string;
        ForecastAdjustmentsFromPastOccurrences: string;
        AddDate: string;
        EnterAdjustments: string;
        SaveProfile: string;
        CreateAdjustmentsManually: string;
        TitleEventAdjustments: string;
        BaseAdjustment: string;
        ManagerAdjustment: string;
        ScheduleEventSubmitFail: string;
        ProfileCancelConfirmationTitle: string;
        ProfileCancelConfirmationMessage: string;
        ProfileCancelConfirm: string;
        OK: string;
        Confirm: string;
        CancelManualAdjustmentsTitle: string;
        CancelManualAdjustments: string;
        CancelEditManualAdjustmentsTitle: string;
        CancelEditManualAdjustments: string;
        CancelManualAdjustmentsYes: string;
        CancelManualAdjustmentsNo: string;
        EditEventManuallyTitle: string;
        Closed: string;
        To: string;
        ProfileNameExists: string;
        ProfileNameHasBeenCanceled: string;
        EventAlreadyScheduled: string;
        EventHasNotBeenFound: string;
        CannotScheduleEventOnClosedDay: string;
        Back: string;
        ManageEventProfiles: string;
        ForecastGenerationFailed: string;
        EnterEventNotes: string;
        EventHasBeenScheduled: string;
        EventHasBeenUpdated: string;
        SingleEventDay: string;
        MultiEventDay: string;
        AllScheduledEventsFor: string;
        NoForecastFiltersDefined: string;
        NewForecastFilter: string;
        EditForecastFilter: string;
        AddForecastFilter: string;
        SaveForecastFilter: string;
        ForecastFilters: string;
        CanEditForecast: string;
        ForecastFilterSetup: string;
        ForecastFilterName: string;
        Edit: string;
        ServiceTypes: string;
        ForecastFilterNameIsNotUnique: string;
        ForecastFilter: string;
        Total: string;
        DayTotals: string;
        ResetForecastModalWindowTitle: string;
        SelectEditableFilter: string;
        TitleMirroring: string;
        Stores: string;
        SearchItems: string;
        TargetSalesItemCode: string;
        Status: string;
        MirrorDates: string;
        Zone: string;
        Active: string;
        Cancelled: string;
        Completed: string;
        All: string;
        InProgress: string;
        Scheduled: string;
        PendingCancellation: string;
        PartiallyCompleted: string;
        AddItem: string;
        AddMirror: string;
        TargetSalesItem: string;
        SourceSalesItem: string;
        TargetDateRange: string;
        TargetStartDate: string;
        TargetEndDate: string;
        SourceStartDate: string;
        SourceEndDate: string;
        RestaurantZone: string;
        AdditionalAdjustment: string;
        StopMirror: string;
        DeleteMirror: string;
        CancelMirror: string;
        ChangeEndDate: string;
        SelectDates: string;
        SelectDate: string;
        SelectZone: string;
        LastDays: string;
        CustomRange: string;
        Restaurants: string;
        MustStartSameDay: string;
        SourceDateRangeError: string;
        DeleteMirrorMessage: string;
        DeleteMirrorSuccess: string;
        MirrorOverlapMessage: string;
        ChangeMirrorEndDateMessage: string;
        CancelStoreMirrorMessage: string;
        CancelMirrorSuccess: string;
        MirrorCancelTitle: string;
        MirrorCancelStoreMessage: string;
        MirrorCancelItemMessage: string;
        MirrorCancelConfirm: string;
        SaveMirrorTitle: string;
        SaveMirrorMessage: string;
        SaveCheckboxOption: string;
        OverwriteManagerReadOnlyMessage: string;
        SearchForStores: string;
        SelectAStore: string;
        NoStoresResultMessage: string;
        SourceStore: string;
        MirrorAllDay: string;
        MirrorAllDayOn: string;
        MirrorAllDayOff: string;
        TargetDate: string;
        SourceDate: string;
        TargetTime: string;
        SourceTime: string;
        MirrorAddDate: string;
        SaveStoreMirrorMessage: string;
        StoreMirrorOverlapMessage: string;
        AM: string;
        PM: string;
        CancelledOn: string;
        CancelledByUser: string;
        OverwriteManagerForecast: string;
    }
}

module Forecasting.Api.Models {
    export interface IPromotionTranslations {
        PageTitle: string;
        PleaseSelectOrCreateAPromotion: string;
        Search: string;
        SelectDates: string;
        AddPromotion: string;
        ListColumnDescription: string;
        ListColumnPeriod: string;
        ListColumnStatus: string;
        NoPromotions: string;
        TimelineCompleted: string;
        TimelineInProgress: string;
        TimelinePending: string;
        Back: string;
        Actions: string;
        Save: string;
        Delete: string;
        Description: string;
        LimitedTimeOffer: string;
        Period: string;
        PromotionalItems: string;
        ImpactedItems: string;
        Add: string;
        DescriptionCode: string;
        Adjustment: string;
        Zones: string;
        PleaseAddItem: string;
        PleaseSelectZone: string;
        PleaseSelectStore: string;
        AddPromotionalItems: string;
        AddImpactedItems: string;
        DeletePromotion: string;
        DeletePromotionConfirmation: string;
        PromotionDeleted: string;
        CreatePromotion: string;
        UpdatePromotion: string;
        SavePromotionConfirmation: string;
        PromotionCreated: string;
        PromotionUpdated: string;
        DiscardPromotion: string;
        DiscardPromotionConfirmation: string;
        Confirm: string;
        Cancel: string;
        ConfirmPromotion: string;
        OverlapConfirmation: string;
        OverwriteManagerForecast: string;
        Stores: string;
    }
}

module Administration.DataLoad.Api.Models {
    export interface IL10N {
        DataLoad: string;
    }
}

module Administration.Hierarchy.Api.Models {
    export interface ITranslations {
        Setup: string;
        Hierarchy: string;
        AddLocation: string;
        Add: string;
        Edit: string;
        View: string;
        NumberNotUnique: string;
        NameNotUnique: string;
        RequestInsufficient: string;
        Children: string;
        UserNameNotUnique: string;
        ReportsTo: string;
        EmployeeNumberNotUnique: string;
        AddedSingleLocation: string;
        AddedMultipleLocations: string;
        Number: string;
        Name: string;
        Cancel: string;
        AddAnother: string;
        SaveAndClose: string;
        LocationWillBeAdded: string;
        Update: string;
        ChangesMadeTo: string;
        SuccessfullySaved: string;
        WillBeEdited: string;
        EditLocation: string;
        SearchLocations: string;
        CannotBeMoved: string;
        PossibleParentsFor: string;
        SaveSuccessful: string;
        NoMatchingRecordsFound: string;
        ID: string;
        Move: string;
    }
}

module Administration.User.Api.Models {
    export interface ITranslations {
        UserSetup: string;
        AddUser: string;
        LocationNumber: string;
        LocationName: string;
        FirstName: string;
        LastName: string;
        EmployeeNumber: string;
        Username: string;
        Edit: string;
        On: string;
        Off: string;
        IncludeTerminated: string;
        IncludeChildLocations: string;
        Terminated: string;
        NoUsers: string;
        SelectedLocation: string;
        Cancel: string;
        AddAnother: string;
        SaveAndClose: string;
        Attributes: string;
        SecurityGroups: string;
        HomeLocation: string;
        Password: string;
        MiddleName: string;
        ConfirmPassword: string;
        RequestInsufficient: string;
        UserNameNotUnique: string;
        EmployeeNumberNotUnique: string;
        SuccessfullyAdded: string;
        UsersSuccessfullyAdded: string;
        PswdLengthMustBeSixAndSixteen: string;
        PswdDoNotMatch: string;
        NoSpecialCharacterForEmployeeNumber: string;
        EditUser: string;
        Status: string;
        Active: string;
        Update: string;
        TerminateUser: string;
        TerminateUserConfirmMsg: string;
        TerminateUserTerminate: string;
        SaveSuccessful: string;
        ChangesMadeTo: string;
        SuccessfullySaved: string;
    }
}

module Core.Api.Models.Notifications {
    export interface IL10N {
        InventoryTravelPath: string;
        InventoryTravelPathItemsToAdd: string;
        InventoryCount: string;
        InventoryTransfer: string;
        InventoryTransferNeedsApproval: string;
        InventoryTransferNeedsToBeReceived: string;
        InventoryTransferNeedsAction: string;
        ClickForMore: string;
        OverdueOrderReceipts: string;
        OverdueOrderLayout: string;
        ScheduledOrders: string;
        ScheduledOrdersDueToBePlaced: string;
        ExtraDelivery: string;
        ExtraDeliveriesAwaitingApproval: string;
        DeviceIsConnected: string;
        DeviceIsOffline: string;
        OfflineModeMessage: string;
        PendingUpdates: string;
        PendingTasksLowCase: string;
        YouHaveNoNotifications: string;
        YouHaveNotifications: string;
        DriverDistanceArea: string;
        DriverDistanceRecordAwaitingApproval: string;
        DriverDistanceRecordsAwaitingApproval: string;
    }
}

module Workforce.MySchedule.Api.Models {
    export interface IL10N {
        MySchedule: string;
        Refresh: string;
        Share: string;
        ScheduledHours: string;
        Hours: string;
        Minutes: string;
        ShareSchedule: string;
        AddToCalendar: string;
        ShareViaEmail: string;
        Close: string;
        TimeOffRequestApproved: string;
        TimeOffRequestPending: string;
        TimeOffRequestDenied: string;
        TimeOffRequestExpired: string;
        TimeOffRequestCancelled: string;
        Back: string;
        Break: string;
        Manager: string;
        Team: string;
        NoConfirmedSchedules: string;
        PleaseSelectShift: string;
        ScheduleEmailIntroMessage: string;
        ScheduleAllDay: string;
    }
}

module Workforce.MyAvailability.Api.Models {
    export interface IL10N {
        MyAvailability: string;
        NoAvailability: string;
        Hours: string;
        Minutes: string;
        Close: string;
        Available: string;
        AvailabilityFor: string;
        AddAvailability: string;
        EditAvailability: string;
        AllDay: string;
        DayOfWeek: string;
        Day: string;
        Yes: string;
        No: string;
        Back: string;
        AvailabilitySave: string;
        Cancel: string;
        Time: string;
        StartTime: string;
        EndTime: string;
        PleaseSelectDay: string;
        Add: string;
        Update: string;
        OverLappingTimes: string;
        StartTimeBeforeEnd: string;
        TimeInvalid: string;
    }
}

module Workforce.MyTimeCard.Api.Models {
    export interface IL10N {
        MyTimeCard: string;
        Paid: string;
        Unpaid: string;
        Meal: string;
        Rest: string;
        Break: string;
        HoursFormat: string;
        TotalHours: string;
    }
}

module Workforce.MyTimeOff.Api.Models {
    export interface IL10N {
        MyTimeOff: string;
        NoTimeOffRequestsFound: string;
        TimeOffRequest: string;
        Approved: string;
        Pending: string;
        Denied: string;
        AllDay: string;
        Starts: string;
        Ends: string;
        Reason: string;
        Comment: string;
        SubmittedOn: string;
        By: string;
        ManagerComment: string;
        Back: string;
        RemoveRequest: string;
        ConfirmRemoveRequest: string;
        Remove: string;
        RequestRemoved: string;
        RemoveRequestConfirmation: string;
        RemoveTimeOffRequest: string;
        PleaseSelectRequest: string;
        Add: string;
        DiscardRequestConfirmation: string;
        DiscardTimeOffRequest: string;
        AddTimeOffRequest: string;
        Submit: string;
        TimeOffRequestOverlaps: string;
        StartAndEndTimeCannotBeTheSame: string;
        Confirm: string;
    }
}

module Workforce.MyDetails.Api.Models {
    export interface IL10N {
        MyDetails: string;
        Cancel: string;
        Edit: string;
        ContactDetails: string;
        Name: string;
        Phone: string;
        Mobile: string;
        Email: string;
        AddressDetails: string;
        Home: string;
        Mailing: string;
        SameAsHome: string;
        EmergencyContact: string;
        Relationship: string;
        Save: string;
        CancelChanges: string;
        ExitMyDetails: string;
        Yes: string;
        No: string;
        UpdateSuccess: string;
        Confirm: string;
        ExitMyDetailsConfirmationMessage: string;
    }
}

module Core.PartnerRedirect.Api.Models {
    export interface IL10N {
        PartnerRedirect: string;
    }
}

module Workforce.Deliveries.Api.Models {
    export interface IL10N {
        Deliveries: string;
        AddExtraDelivery: string;
        TotalDeliveries: string;
        ExtraDeliveries: string;
        Employee: string;
        Comment: string;
        AuthorisedBy: string;
        Status: string;
        Approve: string;
        ApproveExtraDeliveryFor: string;
        DenyExtraDeliveryFor: string;
        Deny: string;
        Authorization: string;
        DeliveryDeny: string;
        Approved: string;
        Denied: string;
        PendingApproval: string;
        OrderNumber: string;
        Username: string;
        Password: string;
        Submit: string;
        Cancel: string;
        Authorize: string;
        ExtraDelivery: string;
        InvalidCredentials: string;
        PleaseSelect: string;
    }
}

module Workforce.DriverDistance.Api.Models {
    export interface IL10N {
        DriverDistance: string;
        DriveDistanceRecords: string;
        Employee: string;
        TotalShiftDistance: string;
        AuthorizedBy: string;
        Status: string;
        AddDriveRecord: string;
        Approve: string;
        Deny: string;
        Approved: string;
        Denied: string;
        PendingApproval: string;
        DriveRecord: string;
        PleaseSelect: string;
        ShiftStartOdom: string;
        ShiftEndOdom: string;
        Authorize: string;
        Submit: string;
        Cancel: string;
        ApproveTitle: string;
        ApproveMessage: string;
        DenyTitle: string;
        DenyMessage: string;
        InvalidCredentials: string;
        OdomError: string;
    }
}

module Operations.Reporting.Api.Models {
    export interface IL10N {
        ViewManager: string;
        VmBack: string;
        VmDefault: string;
        VmCreate: string;
        VmActions: string;
        VmActionSave: string;
        VmActionDelete: string;
        VmViewName: string;
        VmManageColumns: string;
        VmColumns: string;
        VmActiveColumns: string;
        VmCreateNewMessage: string;
        VmUpdated: string;
        VmCreated: string;
        VmDeleted: string;
        VmGlobalView: string;
        VmAddColumns: string;
        VmNoAvailableColumns: string;
    }
}

module Operations.Reporting.StoreSummary.Api.Models {
    export interface IL10N {
        StoreSummary: string;
        Total: string;
        ViewManager: string;
        Actions: string;
        ExportToCsvCurrentView: string;
        ExportStoreName: string;
        ColumnDate: string;
        ColumnGrossSales: string;
        ColumnNetSales: string;
        ColumnTax: string;
        ColumnTransactionCount: string;
        ColumnTransactionCountMonthToDate: string;
        ColumnTransactionCountYearToDate: string;
        ColumnTransactionCountPercentageChangeLastWeek: string;
        ColumnTransactionCountPercentageChangeLastyear: string;
        ColumnNetSalesLastWeek: string;
        ColumnNetSalesLastYear: string;
        ColumnNetSalesMonthToDate: string;
        ColumnNetSalesYearToDate: string;
        ColumnNetSalesPercentageChangeLastWeek: string;
        ColumnNetSalesPercentageChangeLastYear: string;
        ColumnTransactionAverage: string;
        ColumnTransactionAverageLastWeek: string;
        ColumnTransactionAverageLastYear: string;
        ColumnVoids: string;
        ColumnDiscounts: string;
        ColumnCoupons: string;
        ColumnVoidsPercentage: string;
        ColumnDiscountsPercentage: string;
        ColumnCouponsPercentage: string;
        ColumnProjectedSales: string;
        ColumnBudgetedSales: string;
        ColumnProjectedTransactionCount: string;
    }
}

module Operations.Reporting.AreaSummary.Api.Models {
    export interface IL10N {
        AreaSummary: string;
        Total: string;
        ViewManager: string;
        Actions: string;
        ExportToCsvCurrentView: string;
        ExportStoreName: string;
        AllAreas: string;
        ColumnStore: string;
        ColumnDate: string;
        ColumnGrossSales: string;
        ColumnNetSales: string;
        ColumnTax: string;
        ColumnTransactionCount: string;
        ColumnTransactionCountMonthToDate: string;
        ColumnTransactionCountYearToDate: string;
        ColumnTransactionCountPercentageChangeLastWeek: string;
        ColumnTransactionCountPercentageChangeLastyear: string;
        ColumnNetSalesLastWeek: string;
        ColumnNetSalesLastYear: string;
        ColumnNetSalesMonthToDate: string;
        ColumnNetSalesYearToDate: string;
        ColumnNetSalesPercentageChangeLastWeek: string;
        ColumnNetSalesPercentageChangeLastYear: string;
        ColumnTransactionAverage: string;
        ColumnTransactionAverageLastWeek: string;
        ColumnTransactionAverageLastYear: string;
        ColumnVoids: string;
        ColumnDiscounts: string;
        ColumnCoupons: string;
        ColumnVoidsPercentage: string;
        ColumnDiscountsPercentage: string;
        ColumnCouponsPercentage: string;
        ColumnProjectedSales: string;
        ColumnBudgetedSales: string;
        ColumnProjectedTransactionCount: string;
        ColumnTransactionCountLastWeek: string;
        ColumnTransactionCountLastYear: string;
    }
}

module Operations.Reporting.InventoryMovement.Api.Models {
    export interface IL10N {
        InventoryMovement: string;
        Search: string;
        DatePickerTitle: string;
        NoData: string;
        Total: string;
        Totals: string;
        Categories: string;
        ExportStoreName: string;
        ColumnItemCode: string;
        ColumnItemDescription: string;
        ExportToCsvCurrentView: string;
        ColumnUnitOfMeasure: string;
        ColumnAverageUnitCost: string;
        ColumnBeginInventory: string;
        ColumnReceivedQuantity: string;
        ColumnReceivedValue: string;
        ColumnDeliveredQuantity: string;
        ColumnDeliveredValue: string;
        ColumnReturns: string;
        ColumnTransferIn: string;
        ColumnTransferOut: string;
        ColumnEndInventory: string;
        ColumnActualUsage: string;
        ColumnTheoreticalUsage: string;
        ColumnVarianceQuantity: string;
        ColumnVarianceDollars: string;
        ColumnVariancePercentageSales: string;
        ColumnWasteUnits: string;
        ColumnWasteDollars: string;
        ColumnWastePercentage: string;
        ColumnMissingDollars: string;
        ColumnMissingQuantity: string;
        ColumnMissingPercentage: string;
        ColumnEfficiencyPercentage: string;
        ColumnStockOutstanding: string;
        ColumnUnitCost: string;
        ColumnSalesValue: string;
    }
}

module Operations.Reporting.ProductMix.Api.Models {
    export interface IL10N {
        ProductMix: string;
        NoData: string;
        Total: string;
        Totals: string;
        Categories: string;
        ColumnItemCode: string;
        ColumnItemDescription: string;
        Search: string;
        ExportStoreName: string;
        ExportToCsvCurrentView: string;
        SalesDepartment: string;
        SalesCategory: string;
        ItemDescription: string;
        ItemCode: string;
        InventoryUnit: string;
        InventoryCost: string;
        PercOfTotalSales: string;
        Units: string;
        UnitsLastWeek: string;
        UnitsLastMonth: string;
        UnitsLastYear: string;
        UnitsWeekToDate: string;
        UnitsMonthToDate: string;
        UnitsYearToDate: string;
        NetSales: string;
        NetSalesLastWeek: string;
        NetSalesLastMonth: string;
        NetSalesLastYear: string;
        NetSalesWeekToDate: string;
        NetSalesMonthToDate: string;
        NetSalesYearToDate: string;
        SalesMixPerc: string;
        SalesMixPercLastWeek: string;
        SalesMixPercLastMonth: string;
        SalesMixPercLastYear: string;
        SalesMixPercWeekToDate: string;
        SalesMixPercMonthToDate: string;
        SalesMixPercYearToDate: string;
    }
}

module Inventory.Production.Api.Models {
    export interface IL10N {
        Production: string;
        PrepAdjustment: string;
        Finish: string;
        AddNewItems: string;
        Description: string;
        ItemCode: string;
        Outer: string;
        Inner: string;
        Unit: string;
        Cost: string;
        PageTitle: string;
        AddNewItemToBegin: string;
        FinishAdjustment: string;
        ItemsBeingModified: string;
        Cancel: string;
        AdjustmentSubmit: string;
        AdjustmentSubmitSuccess: string;
        AdjustmentSubmitFail: string;
        SearchPrepAdjustItemTitle: string;
        SearchPrepAdjustItemNoRecordsFound: string;
        Search: string;
        Submit: string;
        Code: string;
        DescriptionCode: string;
        ToggleFavorite: string;
    }
}

module Core.Auth.Api.Models {
    export interface ILogonResponse {
        User: Core.Api.Models.IBusinessUser;
        AuthToken: string;
        IsSharedCookieUsed: boolean;
    }
}

module Core.Api.Models {
    export interface IBusinessUser {
        Id: number;
        UserName: string;
        FirstName: string;
        LastName: string;
        EmployeeId: number;
        EmployeeNumber: string;
        Culture: string;
        PinToken: string;
        Status: Core.Api.Models.BusinessUser.BusinessUserStatusEnum;
        MobileSettings: Core.Api.Models.IMobileSettings;
        Permission: Core.Api.Models.IPermissions;
        AssignedLocations: number[];
        EntityIdBase: number;
        EntityTypeId: number;
    }
}

module Core.Api.Models {
    export interface IPermissions {
        Usage: any;
        GroupIds: number[];
        AllowedTasks: Core.Api.Models.Task[];
    }
}

module Core.Auth.Api.Models {
    export interface ICredentials {
        Username: string;
        Password: string;
    }
}

module Core.Auth.Api.SsoLogoutController {
    export interface ISsoLogoutResponce {
        RedirectUrl: string;
    }
}

module Core.Diagnostics.Api.Models {
    export interface IDiagnosticServiceResponse {
        Success: boolean;
        Errors: Core.Diagnostics.Api.Models.IDiagnosticServiceDetail[];
    }
}

module Core.Diagnostics.Api.Models {
    export interface IDiagnosticServiceDetail {
        Success: boolean;
        Message: string;
        Component: string;
    }
}

module Core.PartnerRedirect.Api.Models {
    export interface ILinkRequest {
        Url: string;
        UserId: number;
        Timestamp: string;
        Signature: string;
        Site: string;
    }
}

module Forecasting.Api.Models {
    export interface IDaySegment {
        Id: number;
        DaySegmentType: Forecasting.Api.Models.IDaySegmentType;
        StartTime: string;
        EndTime: string;
        StartHour: number;
        EndHour: number;
    }
}

module Forecasting.Api.Models {
    export interface IDaySegmentType {
        Id: number;
        Description: string;
        SortOrder: number;
    }
}

module Forecasting.Api.Models {
    export interface IEventWeekDayInfo {
        Date: string;
        IsClosed: boolean;
        EventProfileTags: Forecasting.Api.Models.IEventProfileTag[];
    }
}

module Forecasting.Api.Models {
    export interface IEventProfileTag {
        Id: number;
        EventProfileId: number;
        Date: string;
        Note: string;
        EventProfile: Forecasting.Api.Models.IEventProfile;
    }
}

module Forecasting.Api.Models {
    export interface IEventProfile {
        Id: number;
        EntityId: number;
        Name: string;
        Source: Forecasting.Api.Enums.EventProfileSource;
        History: Forecasting.Api.Models.IEventProfileHistory[];
        Adjustments: number[];
    }
}

module Forecasting.Api.Models {
    export interface IEventProfileHistory {
        EventProfileId: number;
        Date: string;
        Note: string;
    }
}

module Forecasting.Api.Models {
    export interface IEventCalendarInfo {
        FirstDayOnCalendar: string;
        FirstDayDayOfWeek: number;
        NumberOfDays: number;
        DayInfo: Forecasting.Api.Models.IEventCalendarDayInfo[];
    }
}

module Forecasting.Api.Models {
    export interface IEventCalendarDayInfo {
        IsClosed: boolean;
        EventTagNotes: string[];
        EventProfileIds: number[];
        EventProfileTagIds: number[];
    }
}

module Forecasting.Api.Models {
    export interface IEventProfileTagNote {
        Id: number;
        Note: string;
    }
}

module Forecasting.Api.Models {
    export interface IForecast {
        Id: number;
        EntityId: number;
        ForecastStatus: number;
        BusinessDay: string;
        BusinessDayStart: string;
        BusinessDayEnd: string;
        GenerationDate: string;
        LastYearSales: number;
        ManagerSales: number;
        LastYearTransactionCount: number;
        ManagerTransactionCount: number;
        Version: number;
        IsDayLocked: boolean;
        HasBeenEdited: boolean;
    }
}

module Forecasting.Api.Models {
    export interface IForecastOperationCollection {
        Version: number;
        Operations: Forecasting.Api.Models.IForecastOperation[];
    }
}

module Forecasting.Api.Models {
    export interface IForecastOperation {
        OpCode: string;
    }
}

module Forecasting.Api.Models {
    export interface IForecastFilterAssignRecord {
        Id: number;
        FunctionId: any;
        ServiceGroupId?: number;
        IsActive: boolean;
        Name: string;
    }
}

module Forecasting.Api.Models {
    export interface IForecastFilterRecord {
        Id: number;
        Name: string;
        IsForecastEditableViaGroup: boolean;
        ForecastFilterGroupTypes: any[];
    }
}

module Forecasting.Api.Models {
    export interface IForecastPipelineRequest {
        PipelineType: any;
        PipelineDecorators: any;
        CalculateSalesItemMetrics: boolean;
        CalculateInventoryItemMetrics: boolean;
    }
}

module Forecasting.Api.Models {
    export interface IDenormalizedSalesEvaluationResponse {
        DaySegmentId: number;
        DaySegmentDescription: string;
        HasBeenEdited: boolean[];
        BusinessDate: string[];
        SystemSales: number[];
        ManagerSales: number[];
        ActualSales: number[];
        SystemAccuracy: number[];
        ManagerAccuracy: number[];
    }
}

module Forecasting.Api.Models {
    export interface IDenormalizedSalesItemEvaluationResponse {
        DaySegmentId: number;
        DaySegmentDescription: string;
        HasBeenEdited: boolean[];
        BusinessDate: string[];
        SystemQuantity: number[];
        ManagerQuantity: number[];
        ActualQuantity: number[];
        SystemAccuracy: number[];
        ManagerAccuracy: number[];
    }
}

module Forecasting.Api.Models {
    export interface IDenormalizedTransactionEvaluationResponse {
        DaySegmentId: number;
        DaySegmentDescription: string;
        HasBeenEdited: boolean[];
        BusinessDate: string[];
        SystemTransactions: number[];
        ManagerTransactions: number[];
        ActualTransactions: number[];
        SystemAccuracy: number[];
        ManagerAccuracy: number[];
    }
}

module Forecasting.Api.Models {
    export interface IFutureOrder {
        Id: number;
        PosTransactionId: number;
        EntityId: number;
        PromisedDateTime: string;
        TotalTransactionAmount: number;
        Status: number;
        ServiceType: number;
        CustomerName: string;
        FutureOrderDetailsList: Forecasting.Api.Models.IFutureOrderDetail[];
    }
}

module Forecasting.Api.Models {
    export interface IFutureOrderDetail {
        Id: number;
        FutureOrderId: number;
        SalesItemId: number;
        Quantity: number;
        TotalPrice: number;
        Description: string;
    }
}

module Forecasting.Api.Models {
    export interface IHistoricalBasis {
        BusinessDate: string;
        IntervalStart: string;
        Sales: number;
        Transactions: number;
    }
}

module Forecasting.Api.Models {
    export interface IForecastingMetricAlls {
        Forecast: Forecasting.Api.Models.IForecast;
        DaySegments: Forecasting.Api.Models.IDaySegment[];
        IntervalStarts: string[];
        DaySegmentIndexes: number[];
        IntervalTypes: number[];
        TypeIndexes: any[];
        ManagerSales: number[];
        NewManagerSales: number[];
        ManagerTransactions: number[];
        NewManagerTransactions: number[];
        ManagerAdjustments: number[];
        NewManagerAdjustments: number[];
        LastYearSales: number[];
        LastYearTransactions: number[];
        ActualSales: number[];
        ActualTransactions: number[];
        ServiceTypes: number[];
        SystemSales: number[];
        SystemTransactions: number[];
    }
}

module Forecasting.Api.Models {
    export interface IForecastUpdateHeader {
        EntityId: number;
        Id: number;
        Version: number;
    }
}

module Forecasting.Api.Models {
    export interface IForecastMetricDetailsHeader {
        MetricDetails: any[];
        FilterId?: number;
    }
}

module Forecasting.Api.Models {
    export interface IMirroringRegenerationRequest {
        SourceDate: string;
    }
}

module Forecasting.Api.Models {
    export interface IPromotionListItem {
        PromotionId: number;
        Name: string;
        StartDate: string;
        EndDate: string;
        LimitedTimeOffer: boolean;
        Status: Forecasting.Api.Enums.PromotionStatus;
        Timeline: Forecasting.Api.Enums.PromotionTimeline;
        TimelineText: string;
    }
}

module Forecasting.Api.Models {
    export interface ISalesItem {
        Id: number;
        ItemCode: string;
        Description: string;
    }
}

module Forecasting.Api.Models {
    export interface IHistoricalSalesItem {
        BusinessDate: string;
        IntervalStart: string;
        SalesItemId: number;
        Transactions: number;
    }
}

module Forecasting.Api.Models {
    export interface IForecastingSalesItemMetricAlls {
        Id: number;
        EntityId: number;
        GenerationDate: string;
        BusinessDay: string;
        IntervalStarts: string[];
        DaySegments: Forecasting.Api.Models.IDaySegment[];
        DaySegmentIndexes: number[];
        IntervalTypes: number[];
        TypeIndexes: any[];
        ManagerTransactions: number[];
        NewManagerTransactions: number[];
        SystemTransactions: number[];
        LastYearTransactions: number[];
        ActualQuantitys: number[];
    }
}

module Forecasting.Api.Models {
    export interface IForecastSalesItemMetricDetailsHeader {
        SalesItemMetricDetails: any[];
        FilterId?: number;
    }
}

module Forecasting.Api.Models {
    export interface ISalesItemMirrorInterval {
        Id: number;
        SourceDateStart: string;
        TargetDateStart: string;
        TargetDateEnd: string;
        Adjustment: number;
        OverwriteManager: boolean;
        IsReadOnly: boolean;
        IsMirrorClosed: boolean;
        SourceSalesItem: Forecasting.Api.Models.ISalesItem;
        TargetSalesItem: Forecasting.Api.Models.ISalesItem;
        Zone: Forecasting.Api.Models.IZone;
    }
}

module Forecasting.Api.Models {
    export interface IStoreMirrorInterval {
        Id: number;
        SourceDateStart: string;
        TargetDateStart: string;
        TargetDateEnd: string;
        Adjustment: number;
        GroupId: any;
        SourceEntity: Forecasting.Api.Models.IEntity;
        TargetEntity: Forecasting.Api.Models.IEntity;
        IsCorporateMirror: boolean;
        OverwriteManager: boolean;
    }
}

module Forecasting.Api.Models {
    export interface IEntity {
        EntityId: number;
    }
}

module Forecasting.Api.Models {
    export interface IStoreMirrorIntervalGroup {
        Intervals: Forecasting.Api.Models.IStoreMirrorInterval[];
        GroupId: any;
        CancelledDate?: string;
        CancelledByUser: string;
        SourceDateStart: string;
        SourceDateEnd: string;
        TargetDateStart: string;
        TargetDateEnd: string;
        OverallStatus: any;
        OverallStatusGroup: any;
        OverwriteManager: boolean;
        SourceEntity: Forecasting.Api.Models.IEntity;
        TargetEntity: Forecasting.Api.Models.IEntity;
    }
}

module Forecasting.Api.Models {
    export interface ISystemForecastGenerationRequest {
        ForecastDate: string;
        ForecastId?: number;
        SalesItemId?: number;
    }
}

module Core.Api.Models {
    export interface ITranslatedEnum {
        Value: number;
        Name: string;
        Translation: string;
    }
}

module Inventory.Count.Api.Models {
    export interface IInventoryCount {
        Id: number;
        EntityId: number;
        CountName: string;
        TypeId: number;
        CreateDate: string;
        HasInner: boolean;
        HasWeight: boolean;
        Locations: Inventory.Count.Api.Models.ICountLocation[];
        HasPlacedOrders: boolean;
        IsApplyDateReadOnly: boolean;
        LocalStoreDateTime: string;
    }
}

module Inventory.Count.Api.Models {
    export interface ICountLocation {
        Id: number;
        Name: string;
        SortOrder: number;
        CountedTotal: number;
        UncountedTotal: number;
        SystemLocation: boolean;
        Items: Inventory.Count.Api.Models.ICountItem[];
    }
}

module Inventory.Count.Api.Models {
    export interface ICountItem {
        Id: number;
        ItemId: number;
        VendorItemId: number;
        Description: string;
        OuterUnit: string;
        DisableOuterUnit: boolean;
        InnerUnit: string;
        DisableInnerUnit: boolean;
        InventoryUnit: string;
        DisableInventoryUnit: boolean;
        WeightUnit: string;
        DisableWeightUnit: boolean;
        OuterCount?: number;
        InnerCount?: number;
        InventoryCount?: number;
        WeightCount?: number;
        ReadyToApply: boolean;
        SortOrder: number;
        LocationId: number;
        Location: string;
        HasVariance: boolean;
        VariancePercent: number;
        ItemCost: number;
        ZeroCostItem: boolean;
        ProductCode: string;
        CreateDate: string;
        StocktakeGroup: string;
        Status: Inventory.Count.Api.Models.CountStatus;
        LastPurchaseDate: string;
    }
}

module Inventory.Count.Api.Models {
    export interface IUpdatedItemCountStatus {
        CountUpdate: Inventory.Count.Api.Models.ICountUpdate;
        CountStatus: Inventory.Count.Api.Models.CountStatus;
    }
}

module Inventory.Count.Api.Models {
    export interface ICountUpdate {
        CountId: number;
        CountDetailId: number;
        ItemId: number;
        LocationId: number;
        UnitType: string;
        Amount: number;
        ReadyToApply: boolean;
        ToClear: boolean;
        CheckVariance: boolean;
        VariancePercent: number;
        IsProcessed: boolean;
    }
}

module Inventory.Count.Api.Models {
    export interface ICountStatusResponse {
        CountOf: Inventory.Count.Api.Models.CountType;
        IsActive: boolean;
    }
}

module Inventory.Count.Api.Models {
    export interface ICountItemVariance {
        EntityId: number;
        CountId: number;
        ItemId: number;
        CalendarDate: string;
        HasVariance: boolean;
        VariancePercent: number;
    }
}

module Inventory.Count.Api.Models {
    export interface IApplyCount {
        Id: number;
        CountTypeName: string;
        Applied: boolean;
        MonthlyCountAlreadyExists: boolean;
        IsDuplicateApplyDate: boolean;
        ApplyDate?: string;
    }
}

module Inventory.Count.Api.Models {
    export interface IFinishCountRequest {
        CountId: number;
        EntityId: number;
        CountKey: string;
        ApplyDate: string;
        IsSuggestedDate: boolean;
        CountType: string;
        ConnectionId: string;
    }
}

module Inventory.Count.Api.Models {
    export interface IApplyDateSettings {
        StoreDateTime: string;
        ApplyDateTime: string;
        IsApplyReadOnly: boolean;
        AllowCustomDate: boolean;
        Detail: string;
    }
}

module Inventory.Count.Api.Models {
    export interface ICountReviewViewModel {
        EntityTimeOffset: number;
        ActivitySinceDate: string;
        TotalCounted: number;
        TotalPercent: number;
        Groups: Inventory.Count.Api.Models.ICountReviewGroupViewModel[];
    }
}

module Inventory.Count.Api.Models {
    export interface ICountReviewGroupViewModel {
        Name: string;
        GroupValue: number;
        GroupPercentValue: number;
        Items: Inventory.Count.Api.Models.ICountReviewItemViewModel[];
    }
}

module Inventory.Count.Api.Models {
    export interface ICountReviewItemViewModel {
        ItemId: number;
        Description: string;
        UnitOfMeasure: string;
        CurrentCount: number;
        PreviousCount?: number;
        Cost: number;
        PreviousCost?: number;
        CurrentCountValue: number;
        PreviousCountValue: number;
        PurchasesValue: number;
        ItemSalesValue: number;
        TransfersInValue: number;
        TransfersOutValue: number;
        WasteValue: number;
        Usage: number;
        CostPercent: number;
        ClassificationSalesValue?: number;
        ProductCode: string;
        CountVariance: number;
        CountVariancePercent: number;
    }
}

module Inventory.Count.Api.Models {
    export interface IInventoryCountLocationItem {
        Id: string;
        Name: string;
        Outer: string;
        Inner: string;
        Unit: string;
        Tp: number;
        Freq: string;
        Type: string;
        Code: string;
        EnabledForSelection: boolean;
    }
}

module Inventory.Count.Api.Models {
    export interface ITravelPathEntity {
        EntityId: number;
        TravelPath: Inventory.Count.Api.Models.ITravelPath[];
        CanShowDisableCountForStockTakeUnits: boolean;
    }
}

module Inventory.Count.Api.Models {
    export interface ITravelPath {
        Id: number;
        Location: string;
        LocationType: string;
        Items: Inventory.Count.Api.Models.ITravelPathItem[];
    }
}

module Inventory.Count.Api.Models {
    export interface ITravelPathItem {
        Id: number;
        ItemId: number;
        Description: string;
        Code: string;
        TravelPath: number;
        Frequency: string;
        OuterUom: string;
        InnerUom: string;
        WeightUom: string;
        InventoryUnitUom: string;
        DisableOuterUnit: boolean;
        DisableInnerUnit: boolean;
        DisableWeightUnit: boolean;
        DisableInventoryUnit: boolean;
        EnabledForSelection: boolean;
        IsSpotCounted: boolean;
        IsDailyCounted: boolean;
        IsWeeklyCounted: boolean;
        IsPeriodicCounted: boolean;
        IsMonthlyCounted: boolean;
        IsOuterUomSet: boolean;
        IsInnerUomSet: boolean;
        IsWeightUomSet: boolean;
        IsInventoryUnitUomSet: boolean;
    }
}

module Inventory.Count.Api.Models {
    export interface ITravelPathPartialUpdate {
        Id: number;
        EntityId: number;
    }
}

module Inventory.Count.Api.Models {
    export interface IUpdateTravelPath {
        Type: Inventory.Count.Api.Models.TravelPathActionType;
        LocationId: number;
        TargetLocationId: number;
        TargetId: number;
        ItemIds: number[];
        AddItems: string[];
        Frequencies: string[];
        TravelPathInfo: any;
    }
}

module Inventory.Count.Api.Models {
    export interface ITravelPathItemUpdate {
        CountType: number;
        Enabled: boolean;
        EntityId: number;
        Frequency: string;
        ItemId: number;
        LocationId: number;
        UpdateMode: Inventory.Count.Api.Models.TravelPathCountUpdateMode;
    }
}

module Inventory.Count.Api.Models {
    export interface IUpdateCostViewModel {
        ItemId: number;
        InventoryUnitCost: number;
        ReportingUnit: string;
        InventoryUnit: string;
    }
}

module Inventory.Order.Api.Models {
    export interface IOrderDetail {
        Id: number;
        SupplyOrderDetailId: number;
        VendorEntityItemId: number;
        ItemCode: string;
        VendorCode: string;
        Description: string;
        UnitCode: string;
        UnitPrice?: number;
        ExtendedAmount?: number;
        ItemId?: number;
        CategoryId?: number;
        CategoryName: string;
        PurchaseUnitQuantity?: number;
        TaxableFlag: string;
        MinOrderQty: number;
        MaxOrderQty: number;
        BuildToLevelQty: number;
        Usage: number;
        OnOrderQuantity: number;
        OnHandQuantity: number;
        LastOrderQuantity: number;
        UsageExtended: number;
        UsageExtendedDisplay: string;
        ConversionRate: number;
    }
}

module Inventory.Order.Api.Models {
    export interface IOrderHeader {
        Id: number;
        DisplayId: number;
        VendorName: string;
        VendorId: number;
        OrderDate: string;
        DeliveryDate: string;
        ReceivedDate?: string;
        ApplyDate?: string;
        DaysToCover: number;
        Status: string;
        CoverUntilDate?: string;
        OrderedItems: number;
        OrderedCases: number;
        TotalItems: number;
        TotalCases: number;
        OrderStatus: Inventory.Order.Api.Models.OrderStatus;
    }
}

module Inventory.Order.Api.Models {
    export interface IOrder {
        Id: number;
        DisplayId: number;
        VendorId: number;
        VendorName: string;
        Status: string;
        DaysToCover?: number;
        DeliveryDate: string;
        CoverUntilDate?: string;
        ItemsInOrder: number;
        ForecastTotal: number;
        TotalAmount: number;
        Details: Inventory.Order.Api.Models.IOrderDetail[];
        Categories: Inventory.Order.Api.Models.ICategory[];
    }
}

module Inventory.Order.Api.Models {
    export interface ICategory {
        CategoryId: number;
        Name: string;
        TotalItems: number;
        ItemsInOrder: number;
    }
}

module Inventory.Order.Api.Models {
    export interface ICreateOrderResult {
        SupplyOrderId: number;
        ElectronicOrderResult: Inventory.Order.Api.Models.IElectronicOrderResult;
        EntityId: number;
    }
}

module Inventory.Order.Api.Models {
    export interface IElectronicOrderResult {
        OrderSent: boolean;
        OrderError: string;
        OrderNumber: string;
    }
}

module Inventory.Order.Api.Models {
    export interface IOrderItemHistoryHeader {
        Id: number;
        OrderedQuantity: number;
        OrderedUnit: string;
        DateOrdered?: string;
        DateOrderedString: string;
    }
}

module Inventory.Order.Api.Models {
    export interface IScheduledOrderHeader {
        Supplier: string;
        VendorId: number;
        DeliveryDate: string;
        CutoffTime?: string;
        TransactionSupplyOrderId: number;
        TransactionSalesOrderId: number;
        Status: string;
        AuthorizedTime: string;
        ActionItemInstanceId: number;
        ActionItemId: number;
        ActionItemDate: string;
        IsSkipped: boolean;
        ActionItemDateDisplay: string;
        CutoffTimeDisplay?: string;
        CutoffMinutesRemaining: number;
    }
}

module Inventory.Order.Api.Models {
    export interface IReceiveOrder {
        Id: number;
        OrderNumber: number;
        VendorId: number;
        Supplier: string;
        DeliveryDate: string;
        ApplyDate: string;
        TotalAmount: number;
        InvoiceNumber: string;
        OrderStatus: number;
        OrderStatusDisplay: string;
        Items: Inventory.Order.Api.Models.IReceiveOrderDetail[];
        CanBePushedToTomorrow: boolean;
        HasBeenCopied: boolean;
        ReceivedShippingNotification: boolean;
        Categories: Inventory.Order.Api.Models.ICategory[];
        CaseQuantity: number;
        ReceivedCaseQuantity: number;
        TotalReceivedAmount: number;
        ItemsInOrder: number;
    }
}

module Inventory.Order.Api.Models {
    export interface IReceiveOrderDetail {
        Id: number;
        ItemId: number;
        ItemCode: string;
        Description: string;
        Unit: string;
        Price: number;
        OrderedQuantity: number;
        ReceivedQuantity: number;
        ReturnedQuantity: number;
        BackOrderedQuantity: number;
        VendorShippedQuantity: number;
        CategoryId?: number;
        CategoryName: string;
        Received: boolean;
        IsReadyToBeReceived: boolean;
    }
}

module Inventory.Order.Api.Models {
    export interface IReceiveOrderHeader {
        Id: number;
        DisplayId: number;
        VendorName: string;
        OrderDate: string;
        DeliveryDate: string;
        ReceivedDate: string;
        ApplyDate: string;
        Status: string;
        TotalAmount?: number;
        ItemCounts: number;
    }
}

module Inventory.Order.Api.Models {
    export interface IChangeApplyDateResponse {
        NewOrderId: number;
        IsPeriodClosed: boolean;
    }
}

module Inventory.Order.Api.Models {
    export interface IVendor {
        Id: number;
        Name: string;
    }
}

module Inventory.Production.Api.Models {
    export interface IPrepAdjustedItem {
        IsFavorite: boolean;
        Id: number;
        UnitsPerOuter: number;
        UnitsPerInner: number;
        ItemCode: string;
        Name: string;
        Outer: string;
        Inner: string;
        Unit: string;
        InventoryUnitCost: number;
        Units?: number;
        Inners?: number;
        Outers?: number;
        Cost: number;
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransfer {
        Id: number;
        CreateDate: string;
        InitiatedBy: string;
        RequestingEntityId: number;
        SendingEntityId: number;
        Status: string;
        Direction: Inventory.Transfer.Api.Enums.TransferDirection;
        Comment: string;
        Details: Inventory.Transfer.Api.Models.ITransferDetail[];
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferDetail {
        Id: number;
        ItemId: number;
        ItemCode: string;
        Description: string;
        Unit: string;
        Quantity: number;
        UnitCost: number;
        OnHand: number;
        VendorItemId: number;
        TransferUnit1: string;
        TransferUnit2: string;
        TransferUnit3: string;
        TransferUnit4: string;
        TransferQty1: number;
        TransferQty2: number;
        TransferQty3: number;
        TransferQty4: number;
        OriginalTransferQty1: number;
        OriginalTransferQty2: number;
        OriginalTransferQty3: number;
        OriginalTransferQty4: number;
        TransferCost: number;
        TransferQty: number;
        OriginalTransferQty: number;
        OuterUom: string;
        InnerUom: string;
        InventoryUnit: string;
        PurchaseUnit: string;
        ZeroCostItem: boolean;
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferHeader {
        Id: number;
        TransferToEntityId: number;
        TransferFromEntityId: number;
        CreateDate: string;
        InitiatedBy: string;
        TransferQty: number;
        Status: string;
        Direction: Inventory.Transfer.Api.Enums.TransferDirection;
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferItemsRequest {
        Direction: Inventory.Transfer.Api.Enums.TransferDirection;
        Items: Inventory.Transfer.Api.Models.ITransferableItem[];
        UpdateCosts: Inventory.Count.Api.Models.IUpdateCostViewModel[];
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferableItem {
        Code: string;
        Conversion: number;
        Description: string;
        Id: number;
        InventoryIndicator: string;
        TransferUnit1: string;
        TransferUnit2: string;
        TransferUnit3: string;
        TransferUnit4: string;
        InventoryUnitCost: number;
        PurchaseUnit: string;
        Suggested: boolean;
        OnHandQuantity: number;
        TransferQty1: number;
        TransferQty2: number;
        TransferQty3: number;
        TransferQty4: number;
        VendorItemId: number;
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferHeaderWithEntities {
        Id: number;
        TransferToEntityId: number;
        TransferFromEntityId: number;
        CreateDate: string;
        InitiatedBy: string;
        TransferQty: number;
        TransferStatus: string;
        ToEntityName: string;
        FromEntityName: string;
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferReporting {
        Id: number;
        CreateDate: string;
        InitiatedBy: string;
        RequestingEntityId: number;
        SendingEntityId: number;
        Status: string;
        Comment: string;
        Details: Inventory.Transfer.Api.Models.ITransferDetailReporting[];
    }
}

module Inventory.Transfer.Api.Models {
    export interface ITransferDetailReporting {
        Id: number;
        ItemId: number;
        ItemCode: string;
        Description: string;
        Unit: string;
        Quantity: number;
        UnitCost: number;
        OnHand: number;
        VendorItemId: number;
        TransferUnit1: string;
        TransferUnit2: string;
        TransferUnit3: string;
        TransferUnit4: string;
        TransferQty1: number;
        TransferQty2: number;
        TransferQty3: number;
        TransferQty4: number;
        OriginalTransferQty1: number;
        OriginalTransferQty2: number;
        OriginalTransferQty3: number;
        OriginalTransferQty4: number;
        TransferCost: number;
        ReportingUom: string;
        ReportingRequested: number;
        ReportingTransferred: number;
        ReportingOnHand: number;
        ReportingUnitCost: number;
        TransferQty: number;
        OriginalTransferQty: number;
    }
}

module Inventory.Transfer.Api.Models {
    export interface IStoreItem {
        Id: number;
        StoreName: string;
        DistanceInMiles: string;
        DistanceInMilesDisplay: string;
    }
}

module Inventory.Waste.Api.Models {
    export interface IWastedItemCount {
        IsRaw: boolean;
        Counts: Inventory.Waste.Api.Models.IWastedItemUnitCount;
        IsFavorite: boolean;
        Id: number;
        UnitsPerOuter: number;
        UnitsPerInner: number;
        ItemCode: string;
        Name: string;
        Outer: string;
        Inner: string;
        Unit: string;
        InventoryUnitCost: number;
    }
}

module Inventory.Waste.Api.Models {
    export interface IWastedItemUnitCount {
        Units?: number;
        Inners?: number;
        Outers?: number;
        Reason: Inventory.Waste.Api.Models.IWasteReason;
    }
}

module Inventory.Waste.Api.Models {
    export interface IWasteReason {
        Id: number;
        Description: string;
    }
}

module Inventory.Waste.Api.Models {
    export interface IWasteHistoryItem {
        Description: string;
        ProductCode: string;
        Unit: string;
        UnitCost: number;
        Qty: number;
        TotalValue: number;
        WasteDate: string;
        UserId: number;
        UserName: string;
        Reason: string;
        IsFinished: boolean;
    }
}

module Inventory.Waste.Api.Models {
    export interface IDropKeyValuePair {
        Id: number;
        Text: string;
    }
}

module Operations.Reporting.Api.Models {
    export interface IColumnResponse {
        Columns: Operations.Reporting.Api.Models.IReportColumnName[];
        DefaultColumnIds: number[];
    }
}

module Operations.Reporting.Api.Models {
    export interface IReportColumnName {
        ColumnId: number;
        ColumnName: string;
    }
}

module Operations.Reporting.Api.Models {
    export interface IProductData {
        Columns: Operations.Reporting.Api.Models.IReportColumnData[];
        Products: Operations.Reporting.Api.Models.IProductDetails[];
        Groups: Operations.Reporting.Api.Models.IProductGroupDetails[];
        ViewName: string;
        CurrentEntity: Core.Api.Models.IEntityModel;
        ExportFileName: string;
    }
}

module Operations.Reporting.Api.Models {
    export interface IReportColumnData {
        Values: any[];
        Summary: any;
        IsSortable: boolean;
        ColumnId: number;
        ColumnLocalisationKey: string;
        ColumnValueType: Operations.Reporting.Api.Models.ReportColumnValueType;
    }
}

module Operations.Reporting.Api.Models {
    export interface IProductDetails {
        Code: string;
        Description: string;
        GroupId: number;
    }
}

module Operations.Reporting.Api.Models {
    export interface IProductGroupDetails {
        GroupId: number;
        GroupDescription: string;
        SortOrder: number;
    }
}

module Operations.Reporting.Api.Models {
    export interface IReportData {
        Columns: Operations.Reporting.Api.Models.IReportColumnData[];
        Entities: Core.Api.Models.IEntityModel[];
        DateFrom: string;
        DateTo: string;
        ExportFileName: string;
    }
}

module Operations.Reporting.Api.Models {
    export interface IViewModel {
        EntityId: number;
        UserId: number;
        ReportType: Operations.Reporting.Api.Models.ReportType;
        ViewId: number;
        IsDefault: boolean;
        ViewName: string;
        ColumnIds: number[];
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IEntityMeasure {
        Id: number;
        TypeId: number;
        ParentId: number;
        Name: string;
        LastUpdated: string;
        Measures: Reporting.Dashboard.Api.Models.IMeasure[];
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IMeasure {
        Id: string;
        Intervals: Reporting.Dashboard.Api.Models.IInterval[];
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IInterval {
        Id: number;
        Value: number;
        DisplayValue: string;
        Class: string;
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IDrillDownData {
        Points: Reporting.Dashboard.Api.Models.IGraphPoint[];
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IGraphPoint {
        Axis: string;
        Label: string;
        Value: number;
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IReferenceData {
        Today: string;
        Groups: Reporting.Dashboard.Api.Models.IReferenceGroup[];
        Intervals: Reporting.Dashboard.Api.Models.ReferenceInterval[];
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IReferenceGroup {
        Id: number;
        Name: string;
        Measures: Reporting.Dashboard.Api.Models.IReferenceMeasure[];
    }
}

module Reporting.Dashboard.Api.Models {
    export interface IReferenceMeasure {
        Id: string;
        Name: string;
        Chart: string;
        ChartSubtitle: string;
    }
}

module Workforce.Deliveries.Api.Models {
    export interface IClockedOnUser {
        Id: number;
        EntityId: number;
        EmployeeId: number;
        FirstName: string;
        MiddleName: string;
        LastName: string;
    }
}

module Workforce.Deliveries.Api.Models {
    export interface IDeliveryAuthorisedRequest {
        Id: number;
        Status: Workforce.Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus;
        DenyReason: string;
        Authorization: Core.Api.Models.ISupervisorAuthorization;
    }
}

module Core.Api.Models {
    export interface ISupervisorAuthorization {
        UserName: string;
        Password: string;
    }
}

module Workforce.Deliveries.Api.Models {
    export interface IDeliveryData {
        SelectedDate: string;
        MaxDate: string;
        TotalDeliveriesQty: number;
        DeliveriesQty: number;
        ExtraDeliveriesQty: number;
        ExtraDeliveryRequests: Workforce.Deliveries.Api.Models.IExtraDeliveryRequest[];
    }
}

module Workforce.Deliveries.Api.Models {
    export interface IExtraDeliveryRequest {
        Id: number;
        EntityId: number;
        Status: Workforce.Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus;
        Comment: string;
        DenyReason: string;
        OrderNumber: string;
        AuthorisedByUserId?: number;
        AuthorisedByUserName: string;
        TransactionDriverDispatchId?: number;
        TransactionSummaryId?: number;
        PromiseTime?: string;
        DeliveryTime?: string;
        BusinessDay: string;
        DeliverySequence?: number;
        DeliveryDuration?: number;
        SourceId?: number;
        DeliveryType: Workforce.Deliveries.Api.Models.Enums.TransactionDeliveryType;
        DeliveryLocation: string;
        Authorization: Core.Api.Models.ISupervisorAuthorization;
        EmployeeId?: number;
        User: Workforce.Deliveries.Api.Models.IClockedOnUser;
    }
}

module Workforce.DriverDistance.Api.Models {
    export interface IDriverDistanceRecord {
        Id: number;
        EntityId: number;
        SubmitTime: string;
        StartDistance: number;
        EndDistance: number;
        Status: Workforce.DriverDistance.Api.Models.Enums.DriverDistanceStatus;
        AuthorizedByName: string;
        EmployeeName: string;
    }
}

module Workforce.DriverDistance.Api.Models {
    export interface ICreateDriverDistanceRequest {
        EmployeeUserId: number;
        TripBusinessDay: string;
        StartDistance: number;
        EndDistance: number;
    }
}

module Workforce.DriverDistance.Api.Models {
    export interface IActionDriverDistanceRequest {
        DriverDistanceId: number;
        Authorization: Core.Api.Models.ISupervisorAuthorization;
        Status: Workforce.DriverDistance.Api.Models.Enums.DriverDistanceStatus;
    }
}

module Workforce.DriverDistance.Api.Models {
    export interface ICreateAuthorizedDriverDistanceRequest {
        CreateDriverDistanceRequest: Workforce.DriverDistance.Api.Models.ICreateDriverDistanceRequest;
        Authorization: Core.Api.Models.ISupervisorAuthorization;
    }
}

module Workforce.MyAvailability.Api.Models {
    export interface IAvailability {
        AvailableDays: Workforce.MyAvailability.Api.Models.IDayAvailability[];
    }
}

module Workforce.MyAvailability.Api.Models {
    export interface IDayAvailability {
        DayOfWeek: any;
        Date: string;
        Times: Workforce.MyAvailability.Api.Models.ITimeRange[];
    }
}

module Workforce.MyAvailability.Api.Models {
    export interface ITimeRange {
        Start: string;
        End: string;
        IsAllDay: boolean;
    }
}

module Workforce.MyDetails.Api.Models {
    export interface IUserContact {
        FirstName: string;
        LastName: string;
        Phone: string;
        MobilePhone: string;
        Email: string;
        Address1: string;
        Address2: string;
        City: string;
        State: string;
        PostCode: string;
        MailAddress1: string;
        MailAddress2: string;
        MailCity: string;
        MailState: string;
        MailPostCode: string;
        EmergencyContactName: string;
        EmergencyContactRelationship: string;
        EmergencyContactPhone: string;
        EmergencyContactMobile: string;
    }
}

module Workforce.MySchedule.Api.Models {
    export interface ICalendarEntry {
        EmployeeId: number;
        EmployeeFirstName: string;
        EmployeeLastName: string;
        JobId: number;
        StartDateTime: string;
        EndDateTime: string;
        EntityId: number;
        EntityName: string;
        EntityAddress1: string;
        EntityPhone: string;
        EntityCity: string;
        EntityState: string;
        EntityPostCode: string;
        JobName: string;
        RoleId: number;
        RoleName: string;
        IsInDirect: boolean;
        IsManagement: boolean;
        Telephone: string;
        Mobile: string;
        Email: string;
        Breaks: Workforce.MySchedule.Api.Models.CalendarEntry.IBreak[];
        TeamShifts: Workforce.MySchedule.Api.Models.ICalendarEntry[];
        IsTimeOffRequest: boolean;
        TimeOffRequestSubmitted: string;
        TimeOffRequestMessage: string;
        TimeOffRequestManagerComment: string;
        TimeOffRequestStatus: number;
    }
}

module Workforce.MySchedule.Api.Models.CalendarEntry {
    export interface IBreak {
        ScheduledBreakId: number;
        Duration: number;
        OffSetFromStart: number;
        TypeId: number;
        IsPaid: boolean;
        StartDateTime: string;
        EndDateTime: string;
    }
}

module Workforce.MySchedule.Api.Models {
    export interface ITimeOffRequest {
        EntityId: number;
        EntityName: string;
        RequestId: number;
        ReasonId: number;
        StartDateTime: string;
        EndDateTime: string;
        SubmitDateTime: string;
        Status: Workforce.MySchedule.Api.Models.TimeOffRequestStatus;
        Comments: string;
        ManagerActionUserId?: number;
        ManagerActionUserFirstName: string;
        ManagerActionUserLastName: string;
        ManagerActionDateTime?: string;
        ManagerActionComment: string;
    }
}

module Workforce.MyTimeOff.Api.Models {
    export interface INewTimeOffResult {
        Id: number;
        Successful: boolean;
        Message: string;
    }
}

module Workforce.MyTimeOff.Api.Models {
    export interface INewTimeOffRequest {
        StartDateTime: string;
        EndDateTime: string;
        ReasonId: number;
        Comments: string;
        Hours: number;
    }
}

module Workforce.MyTimeCard.Api.Models {
    export interface ITimeCardEntry {
        EntityId: number;
        EntityName: string;
        StartTime: string;
        EndTime: string;
        JobName: string;
        Breaks: Workforce.MyTimeCard.Api.Models.ITimeCardBreak[];
    }
}

module Workforce.MyTimeCard.Api.Models {
    export interface ITimeCardBreak {
        Start: string;
        End: string;
        Type: Workforce.MyTimeCard.Api.Models.BreakType;
        IsPaid: boolean;
    }
}

module Workforce.PeriodClose.Api.Models {
    export interface IPeriodClose {
        PeriodStartDate: string;
        PeriodEndDate: string;
        IsClosed: boolean;
    }
}

module Forecasting.Api.Enums {
    export enum PromotionStatus {
        Deleted = 0,
        Active,
    }
}

module Forecasting.Api.Enums {
    export enum PromotionTimeline {
        Uninitialized = -10,
        Completed = -1,
        InProgress,
        Pending,
    }
}

module Administration.Settings.Api.Models {
    export enum SettingEnums {
        Application = 0,
        Global = 1,
        Store = 2,
    }
}

module Administration.Settings.Api.Models {
    export enum SettingToleranceFormatEnums {
        Currency = 0,
        Percentage = 1,
        Number = 2,
    }
}

module Core.Api.Models {
    export enum ConfigurationSetting {
        System_Operations_HotSchedulesSamlSsoUrl = 84001,
    }
}

module Administration.User.Api.Models {
    export enum UserSettingEnum {
        OrderColumnPreferences = 1,
        DefaultSupplierPreference = 2,
        StoreSummaryFavouriteView = 3,
        AreaSummaryFavoriteView = 4,
        InventoryMovementFavouriteView = 5,
        InventoryCountViewPreference = 6,
        ProductMixFavouriteView = 7,
    }
}

module Core.Api.Models {
    export enum EntityType {
        Corporate = 1,
        Principle = 2,
        Master = 3,
        Store = 4,
    }
}

module Core.Api.Models.BusinessUser {
    export enum BusinessUserStatusEnum {
        Unknown,
        Active,
        OnLeave,
        Terminated,
    }
}

module Core.Api.Models {
    export enum Task {
        EmployeeManager_CanAccess = 60,
        Security_CanAccessAllGroups = 128 + 13,
        EntityManager_FullAccess = 128 + 44,
        EntityManager_CanAccess = 640 + 14,
        Inventory_InventoryCount_CanView = 1216 + 1,
        Inventory_InventoryCount_CanUpdate = 1216 + 2,
        Reporting_Dashboard_CanView = 1216 + 3,
        Labor_EmployeePortal_CanView = 1216 + 4,
        Inventory_Transfers_CanRequestTransferIn = 1216 + 5,
        Labor_EmployeePortal_TimeCard_CanView = 1216 + 6,
        Labor_EmployeePortal_Availability_CanView = 1216 + 7,
        Labor_EmployeePortal_MyDetails_CanView = 1216 + 8,
        Inventory_Waste_CanView = 1216 + 9,
        Inventory_Ordering_CanView = 1216 + 10,
        Labor_EmployeePortal_MyDetails_CanUpdate = 1216 + 11,
        Labor_EmployeePortal_Availability_CanUpdate = 1216 + 12,
        Administration_Settings_Dashboard_Application_CanUpdate = 1216 + 13,
        Administration_Settings_Dashboard_Global_CanUpdate = 1216 + 14,
        Administration_Settings_Dashboard_Store_CanUpdate = 1216 + 15,
        Labor_EmployeePortal_MyTimeOff_CanView = 1216 + 16,
        Inventory_InventoryCount_CanView_Variance = 1216 + 17,
        Inventory_InventoryCount_CanView_Review = 1216 + 18,
        Inventory_InventoryCount_CanUpdate_Cost = 1216 + 19,
        Inventory_Receiving_CanReceive = 1216 + 20,
        Inventory_TravelPath_SpotFrequency_CanView = 1216 + 21,
        Inventory_TravelPath_DailyFrequency_CanView = 1216 + 22,
        Inventory_TravelPath_WeeklyFrequency_CanView = 1216 + 23,
        Inventory_TravelPath_MonthlyFrequency_CanView = 1216 + 24,
        Inventory_TravelPath_PeriodicFrequency_CanView = 1216 + 25,
        Inventory_Ordering_CanCreate = 1216 + 26,
        Inventory_TravelPath_CanDeleteItem = 1216 + 27,
        Inventory_TravelPath_CanDeleteLocation = 1216 + 28,
        Labor_EmployeePortal_MySchedule_CanViewTeamMembers = 1216 + 29,
        Forecasting_CanView = 1216 + 32,
        DataLoad_CanView = 1216 + 35,
        Forecasting_PastDates_CanEdit = 1216 + 36,
        Inventory_Ordering_Place_CanView = 1216 + 37,
        Inventory_Ordering_Receive_CanView = 1216 + 38,
        Forecasting_CanEdit = 1216 + 39,
        Forecasting_History = 1216 + 40,
        Forecasting_Reset = 1216 + 41,
        Administration_Hierarchy_CanView = 1216 + 42,
        Administration_UserSetup_CanView = 1216 + 43,
        Labor_EmployeePortal_MySchedule_CanView = 1216 + 44,
        Inventory_Ordering_Receive_CanCorrect = 1216 + 45,
        Forecasting_Event_CanView = 1216 + 46,
        Inventory_Ordering_CanReturn = 1216 + 48,
        Core_PartnerRedirect_CanAccess = 1216 + 49,
        Inventory_Waste_History_CanView = 1216 + 50,
        Inventory_Ordering_CanChangeApplyDate = 1216 + 51,
        Administration_Settings_Site_CanAccess = 1216 + 52,
        Labor_EmployeePortal_Deliveries_CanView = 1216 + 53,
        Labor_EmployeePortal_ExtraDeliveries_CanAuthorise = 1216 + 54,
        Labor_EmployeePortal_Deliveries_CanViewOthersEntries = 1216 + 55,
        Labor_EmployeePortal_DriverDistance_CanView = 1216 + 56,
        Labor_EmployeePortal_DriverDistance_CanAuthorise = 1216 + 57,
        Labor_EmployeePortal_DriverDistance_CanViewOthersEntries = 1216 + 58,
        Administration_Settings_ForecastFilter_CanAccess = 1216 + 59,
        Inventory_Ordering_History_CanView = 1216 + 60,
        Administration_Settings_ForecastUsage_CanAccess = 1216 + 61,
        Forecasting_SalesItemMirroring_CanAccess = 1280 + 1,
        Operations_StoreSummary_CanAccess = 1280 + 2,
        Forecasting_StoreMirroring_CanAccess = 1280 + 3,
        Operations_StoreSummary_CanAccessViewManager = 1280 + 4,
        Inventory_Ordering_CanAddItemToOrder = 1280 + 5,
        Inventory_Receiving_CanAddItemToReceipt = 1280 + 6,
        Inventory_Transfers_CanCreateTransferOut = 1280 + 7,
        Operations_StoreSummary_CanCreateSharedViews = 1280 + 8,
        Operations_AreaSummary_CanAccess = 1280 + 9,
        Operations_InventoryMovement_CanAccess = 1280 + 10,
        Operations_AreaSummary_CanAccessViewManager = 1280 + 11,
        Operations_AreaSummary_CanCreateSharedViews = 1280 + 12,
        Inventory_InventoryCount_CanView_Count_Variance = 1280 + 13,
        Forecasting_Promotions_CanView = 1280 + 14,
        Inventory_Ordering_CanAutoReceiveOrder = 1280 + 15,
        Administration_Settings_InventoryCount_CanAccess = 1280 + 16,
        Inventory_PrepAdjust_CanView = 1280 + 17,
        Inventory_Receiving_CanReceiveWithoutInvoiceNumber = 1280 + 18,
        Waste_CanEditClosedPeriods = 1280 + 19,
        Transfers_CanEditClosedPeriods = 1280 + 20,
        Orders_CanEditClosedPeriods = 1280 + 21,
        Returns_CanEditClosedPeriods = 1280 + 22,
        InventoryCount_CanEditClosedPeriods = 1280 + 23,
        Operations_HotSchedulesSamlSso_CanAccess = 1280 + 24,
        Inventory_Receiving_EditPriceOnReceive = 1280 + 25,
        Inventory_Receiving_EditPriceOnCorrectReceive = 1280 + 26,
        Inventory_TravelPath_UnitsOfMeasure_CanView = 1280 + 27,
        Inventory_InventoryCount_CanAddDisabledItem = 1280 + 28,
        Operations_ProductMix_CanAccess = 1280 + 29,
        Operations_ProductMix_CanAccessViewManager = 1280 + 30,
        Operations_ProductMix_CanCreateSharedViews = 1280 + 31,
    }
}

module Forecasting.Api.Enums {
    export enum EventProfileSource {
        Empirical = 1,
        Manual,
    }
}

module Inventory.Count.Api.Models {
    export enum CountStatus {
        NotCounted = 0,
        Pending = 1,
        Variance = 2,
        Partial = 3,
        Counted = 4,
    }
}

module Inventory.Count.Api.Models {
    export enum CountType {
        Spot = 0,
        Daily = 1,
        Weekly = 2,
        Periodic = 3,
        Monthly = 4,
    }
}

module Inventory.Count.Api.Models {
    export enum TravelPathActionType {
        Sort = 1,
        Move = 2,
        Copy = 3,
        Delete = 4,
        Add = 5,
    }
}

module Inventory.Count.Api.Models {
    export enum TravelPathCountUpdateMode {
        Frequency = 0,
        UnitOfMeasure = 1,
    }
}

module Inventory.Order.Api.Models {
    export enum OrderStatus {
        Pending = 0,
        PastDue = 1,
        InProgress = 2,
        Cancelled = 3,
        Placed = 4,
        Received = 5,
        OnHold = 6,
        Rejected = 7,
        Shipped = 8,
        AutoReceived = 9,
    }
}

module Inventory.Transfer.Api.Enums {
    export enum TransferDirection {
        TransferOut,
        TransferIn,
    }
}

module Operations.Reporting.Api.Models {
    export enum ReportType {
        StoreSummary = 1,
        AreaSummary,
        InventoryMovement,
        ProductMix,
    }
}

module Operations.Reporting.Api.Models {
    export enum ReportColumnValueType {
        Currency = 1,
        Decimal = 2,
        Integer = 3,
        Percentage = 4,
        Date = 5,
        String = 6,
        Currency4 = 7,
    }
}

module Reporting.Dashboard.Api.Models {
    export enum ReferenceInterval {
        Today = 10,
        WeekToDate = 20,
        MonthToDate = 30,
        Yesterday = 40,
        LastYear = 50,
    }
}

module Workforce.Deliveries.Api.Models.Enums {
    export enum ExtraDeliveryOrderStatus {
        Pending = 1,
        Approved = 2,
        Denied = 3,
    }
}

module Workforce.Deliveries.Api.Models.Enums {
    export enum TransactionDeliveryType {
        Regular = 1,
        Extra = 2,
    }
}

module Workforce.DriverDistance.Api.Models.Enums {
    export enum DriverDistanceStatus {
        Pending = 0,
        Approved = 1,
        Denied = 2,
    }
}

module Workforce.MySchedule.Api.Models {
    export enum TimeOffRequestStatus {
        Requested = 0,
        Approved = 1,
        Declined = 2,
        Cancelled = 3,
    }
}

module Workforce.MyTimeCard.Api.Models {
    export enum BreakType {
        Rest = 0,
        Meal = 1,
    }
}
