var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        "use strict";
        Settings.AdmSettingsContainer = {
            L10N: {},
            SettingTypes: [],
            StateName: "Settings",
            Template: "Templates/Settings.html",
            Url: ""
        };
        var l10N = function () { return Settings.AdmSettingsContainer.L10N; };
        var admSettings = [
            {
                SettingDisplayName: function () { return l10N().Dashboard; },
                SettingName: "DashboardSettings",
                Url: "Dashboard",
                TemplateUrl: "Templates/DashboardSettings.html",
                Controller: Settings.dashboardSettingsController,
                Permissions: [Core.Api.Models.Task.Administration_Settings_Dashboard_Application_CanUpdate, Core.Api.Models.Task.Administration_Settings_Dashboard_Global_CanUpdate, Core.Api.Models.Task.Administration_Settings_Dashboard_Store_CanUpdate]
            },
            {
                SettingDisplayName: function () { return l10N().Site; },
                SettingName: "SiteSettings",
                Url: "Site",
                TemplateUrl: "Templates/SiteSettings.html",
                Controller: Settings.siteSettingsController,
                Permissions: [Core.Api.Models.Task.Administration_Settings_Site_CanAccess]
            },
            {
                SettingDisplayName: function () { return l10N().ForecastFilterSetup; },
                SettingName: "ForecastFilterSettings",
                Url: "Forecasting/Filters",
                TemplateUrl: "Templates/ForecastFilterSettings.html",
                Controller: Settings.forecastFilterSettingsController,
                Permissions: [Core.Api.Models.Task.Administration_Settings_ForecastFilter_CanAccess]
            },
            {
                SettingDisplayName: function () { return l10N().ForecastFilterUsage; },
                SettingName: "ForecastFilterUsageSettings",
                Url: "Forecasting/FiltersUsage",
                TemplateUrl: "Templates/ForecastFilterUsageSettings.html",
                Controller: Settings.forecastFilterUsageSettingsController,
                Permissions: [Core.Api.Models.Task.Administration_Settings_ForecastUsage_CanAccess]
            },
            {
                SettingDisplayName: function () { return l10N().InventoryCountSettings; },
                SettingName: "InventoryCountSettings",
                Url: "InventoryCountSettings",
                TemplateUrl: "Templates/InventoryCountSettings.html",
                Controller: Settings.inventoryCountSettingsController,
                Permissions: [Core.Api.Models.Task.Administration_Settings_InventoryCount_CanAccess]
            }
        ];
        Settings.AdmSettingsContainer.SettingTypes = admSettings;
        Settings.AdministrationSettings = { name: "AdministrationSettings" };
        angular.module("Administration.Settings").constant("AdministrationSettings", Settings.AdmSettingsContainer);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
