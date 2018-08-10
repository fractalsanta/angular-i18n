module Administration.Settings {
    "use strict";

    export var AdmSettingsContainer: ISettingTypeContainer = {
        L10N: <any>{},
        SettingTypes: [],
        StateName: "Settings",
        Template: "Templates/Settings.html",
        Url: ""
    }

    var l10N = () => AdmSettingsContainer.L10N;

    var admSettings: ISettingType[] = [
        {
            SettingDisplayName: () => l10N().Dashboard,
            SettingName: "DashboardSettings",
            Url: "Dashboard",
            TemplateUrl: "Templates/DashboardSettings.html",
            Controller: dashboardSettingsController,
            Permissions: [Core.Api.Models.Task.Administration_Settings_Dashboard_Application_CanUpdate, Core.Api.Models.Task.Administration_Settings_Dashboard_Global_CanUpdate, Core.Api.Models.Task.Administration_Settings_Dashboard_Store_CanUpdate]
        },
        {
            SettingDisplayName: () => l10N().Site,
            SettingName: "SiteSettings",
            Url: "Site",
            TemplateUrl: "Templates/SiteSettings.html",
            Controller: siteSettingsController,
            Permissions: [Core.Api.Models.Task.Administration_Settings_Site_CanAccess]
        },
        {
            SettingDisplayName: () => l10N().ForecastFilterSetup,
            SettingName: "ForecastFilterSettings",
            Url: "Forecasting/Filters",
            TemplateUrl: "Templates/ForecastFilterSettings.html",
            Controller: forecastFilterSettingsController,
            Permissions: [Core.Api.Models.Task.Administration_Settings_ForecastFilter_CanAccess]
        },
        {
            SettingDisplayName: () => l10N().ForecastFilterUsage,
            SettingName: "ForecastFilterUsageSettings",
            Url: "Forecasting/FiltersUsage",
            TemplateUrl: "Templates/ForecastFilterUsageSettings.html",
            Controller: forecastFilterUsageSettingsController,
            Permissions: [Core.Api.Models.Task.Administration_Settings_ForecastUsage_CanAccess]
        },
        {
            SettingDisplayName: () => l10N().InventoryCountSettings,
            SettingName: "InventoryCountSettings",
            Url: "InventoryCountSettings",
            TemplateUrl: "Templates/InventoryCountSettings.html",
            Controller: inventoryCountSettingsController,
            Permissions: [Core.Api.Models.Task.Administration_Settings_InventoryCount_CanAccess]
        }
    ];

    AdmSettingsContainer.SettingTypes = admSettings;

    export var AdministrationSettings: Core.NG.INamedDependency<ISettingTypeContainer> = { name: "AdministrationSettings" };
    angular.module("Administration.Settings").constant("AdministrationSettings", AdmSettingsContainer);
}