var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Task = Core.Api.Models.Task;
        var DashboardSettingsController = (function () {
            function DashboardSettingsController($scope, settingService, $q, translationService, popupMessageService, $authService) {
                var _this = this;
                this.$scope = $scope;
                this.settingService = settingService;
                this.$q = $q;
                this.translationService = translationService;
                $scope.GlobalMeasureStatus = "";
                $scope.DefaultGroups = [];
                $scope.category = 0;
                if ($authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Application_CanUpdate)) {
                    this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Application, 0).then(function (result) {
                        $scope.Groups = result.data;
                    });
                }
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.Settings;
                    popupMessageService.SetPageTitle(result.Settings.Settings);
                });
                $scope.GetApplicationMeasures = function () {
                    _this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Application, 0).then(function (result) {
                        $scope.Groups = result.data;
                    });
                };
                $scope.GetGlobalMeasures = function () {
                    _this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Global, 0).then(function (result) {
                        $scope.Groups = result.data;
                    });
                };
                $scope.GetStoreMeasures = function () {
                    _this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Store, $authService.GetUser().BusinessUser.MobileSettings.EntityId).then(function (result) {
                        $scope.Groups = result.data;
                    });
                    if ($authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Global_CanUpdate)) {
                        _this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Global, 0).then(function (result) {
                            $scope.DefaultGroups = result.data;
                        });
                    }
                };
                $scope.UpdateApplicationReportMeasureConfig = function (measure, visible) {
                    measure.Visible = visible;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Application;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };
                $scope.UpdateGlobalReportMeasureConfig = function (measure, enable) {
                    measure.Enabled = enable;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Global;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };
                $scope.UpdateStoreReportMeasureConfig = function (measure, enable) {
                    measure.Enabled = enable;
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Store;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };
                $scope.RestoreDefault = function (measure) {
                    var defaultMeasure = _this.GetDefaultMeasure(measure, $scope.DefaultGroups);
                    if (defaultMeasure != null) {
                        measure.Enabled = defaultMeasure.Enabled;
                    }
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Store;
                    _this.settingService.POSTReportMeasureConfig(measure, "RESTORE");
                };
                $scope.EnableRestoreDefault = function (storeMeasure) {
                    $scope.GlobalMeasureStatus = "Enabled Off";
                    var defaultMeasure = _this.GetDefaultMeasure(storeMeasure, $scope.DefaultGroups);
                    if (defaultMeasure != null) {
                        if (defaultMeasure.Enabled)
                            $scope.GlobalMeasureStatus = "Enabled On";
                        return (defaultMeasure.Enabled != storeMeasure.Enabled);
                    }
                    return false;
                };
                $scope.UpdateGlobalTolerance = function (measure) {
                    measure.ToleranceMin = measure.EditableToleranceMin;
                    measure.ToleranceMax = measure.EditableToleranceMax;
                    if (measure.ToleranceFormatEnum == Administration.Settings.Api.Models.SettingToleranceFormatEnums.Percentage) {
                        measure.ToleranceMin = measure.EditableToleranceMin / 100;
                        measure.ToleranceMax = measure.EditableToleranceMax / 100;
                    }
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Global;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };
                $scope.UpdateStoreTolerance = function (measure) {
                    measure.ToleranceMin = measure.EditableToleranceMin;
                    measure.ToleranceMax = measure.EditableToleranceMax;
                    if (measure.ToleranceFormatEnum == Administration.Settings.Api.Models.SettingToleranceFormatEnums.Percentage) {
                        measure.ToleranceMin = measure.EditableToleranceMin / 100;
                        measure.ToleranceMax = measure.EditableToleranceMax / 100;
                    }
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Store;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };
                $scope.GetDisplayMeasureKeyName = function (measureKey) {
                    var displayName = $scope.Translation[measureKey + DashboardSettingsController.DISPLAY_NAME];
                    if (displayName != null)
                        return displayName;
                    return measureKey;
                };
                $scope.GetDisplayGroupName = function (groupName) {
                    var displayName = $scope.Translation[groupName];
                    if (displayName != null)
                        return displayName;
                    return groupName;
                };
                $scope.CanView = {
                    ApplicationReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_Settings_Dashboard_Application_CanUpdate),
                    GlobalReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_Settings_Dashboard_Global_CanUpdate),
                    StoreReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_Settings_Dashboard_Store_CanUpdate)
                };
            }
            DashboardSettingsController.prototype.GetDefaultMeasure = function (measure, defaultGroups) {
                var group = _.find(defaultGroups, function (i) { return i.GroupId.toString() == measure.Group; });
                if (group != null) {
                    return _.find(group.Measures, { 'MeasureKey': measure.MeasureKey });
                }
                return null;
            };
            DashboardSettingsController.DISPLAY_NAME = 'DisplayName';
            return DashboardSettingsController;
        }());
        Settings.dashboardSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("DashboardSettingsController", DashboardSettingsController, Core.NG.$typedScope(), Administration.Settings.Api.$settingsService, Core.NG.$q, Core.$translation, Core.$popupMessageService, Core.Auth.$authService);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
