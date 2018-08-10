var Administration;
(function (Administration) {
    (function (Settings) {
        var Task = Core.Api.Models.Task;

        var SettingsController = (function () {
            function SettingsController($scope, settingService, $q, translationService, popupMessageService, $authService) {
                var _this = this;
                this.$scope = $scope;
                this.settingService = settingService;
                this.$q = $q;
                this.translationService = translationService;
                $scope.GlobalMeasureStatus = "";
                $scope.category = 0;

                this.settingService.GetMeasures(0 /* Application */, 0).then(function (result) {
                    $scope.Groups = result.data;
                });

                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.Settings;
                    popupMessageService.SetPageTitle(result.Settings.Settings);
                });

                $scope.GetApplicationMeasures = function () {
                    _this.settingService.GetMeasures(0 /* Application */, 0).then(function (result) {
                        $scope.Groups = result.data;
                    });
                };

                $scope.GetGlobalMeasures = function () {
                    _this.settingService.GetMeasures(1 /* Global */, 0).then(function (result) {
                        $scope.Groups = result.data;
                    });
                };

                $scope.GetStoreMeasures = function () {
                    $q.all([
                        _this.settingService.GetMeasures(2 /* Store */, $authService.GetUser().BusinessUser.MobileSettings.EntityId),
                        _this.settingService.GetMeasures(1 /* Global */, 0)
                    ]).then(function (data) {
                        $scope.Groups = data[0].data;
                        $scope.DefaultGroups = data[1].data;
                    });
                };

                $scope.UpdateApplicationReportMeasureConfig = function (measure, visible) {
                    measure.Visible = visible;
                    measure.SettingType = 0 /* Application */;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.UpdateGlobalReportMeasureConfig = function (measure, enable) {
                    measure.Enabled = enable;
                    measure.SettingType = 1 /* Global */;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.UpdateStoreReportMeasureConfig = function (measure, enable) {
                    measure.Enabled = enable;
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = 2 /* Store */;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.RestoreDefault = function (measure) {
                    var defaultMeasure = _this.GetDefaultMeasure(measure, $scope.DefaultGroups);
                    if (defaultMeasure != null) {
                        measure.Enabled = defaultMeasure.Enabled;
                    }
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = 2 /* Store */;
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
                    if (measure.ToleranceFormatEnum == 1 /* Percentage */) {
                        measure.ToleranceMin = measure.EditableToleranceMin / 100;
                        measure.ToleranceMax = measure.EditableToleranceMax / 100;
                    }
                    measure.SettingType = 1 /* Global */;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.UpdateStoreTolerance = function (measure) {
                    measure.ToleranceMin = measure.EditableToleranceMin;
                    measure.ToleranceMax = measure.EditableToleranceMax;
                    if (measure.ToleranceFormatEnum == 1 /* Percentage */) {
                        measure.ToleranceMin = measure.EditableToleranceMin / 100;
                        measure.ToleranceMax = measure.EditableToleranceMax / 100;
                    }
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = 2 /* Store */;
                    _this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.GetDisplayMeasureKeyName = function (measureKey) {
                    var displayName = $scope.Translation[measureKey + SettingsController.DISPLAY_NAME];
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
                    ApplicationReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_ReportMeasures_Application_CanUpdate),
                    GlobalReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_ReportMeasures_Global_CanUpdate),
                    StoreReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_ReportMeasures_Store_CanUpdate)
                };
            }
            SettingsController.prototype.GetDefaultMeasure = function (measure, defaultGroups) {
                var group = _.find(defaultGroups, function (i) {
                    return i.GroupId.toString() == measure.Group;
                });
                if (group != null) {
                    return _.find(group.Measures, { 'MeasureKey': measure.MeasureKey });
                }
                return null;
            };
            SettingsController.DISPLAY_NAME = 'DisplayName';
            return SettingsController;
        })();

        Core.NG.AdministrationSettingsModule.RegisterRouteController("", "Templates/Settings.html", SettingsController, Core.NG.$typedScope(), Administration.Settings.Api.$settingsService, Core.NG.$q, Core.$translation, Core.$popupMessageService, Core.Auth.$authService);
    })(Administration.Settings || (Administration.Settings = {}));
    var Settings = Administration.Settings;
})(Administration || (Administration = {}));
//# sourceMappingURL=SettingsController.js.map
