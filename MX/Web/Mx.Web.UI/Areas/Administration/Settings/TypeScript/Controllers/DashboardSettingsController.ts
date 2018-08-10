module Administration.Settings {

    import Task = Core.Api.Models.Task;

    interface IDashboardSettingsControllerScope extends ng.IScope {
        GetStoreMeasures();
        GetApplicationMeasures();
        GetGlobalMeasures();
        UpdateApplicationReportMeasureConfig(measure: Administration.Settings.Api.Models.ISettingMeasure, visible: boolean);
        UpdateGlobalReportMeasureConfig(measure: Administration.Settings.Api.Models.ISettingMeasure, enable: boolean);
        UpdateStoreReportMeasureConfig(measure: Administration.Settings.Api.Models.ISettingMeasure, enable: boolean);
        RestoreDefault(measure: Administration.Settings.Api.Models.ISettingMeasure);
        category: number;
        measures: Administration.Settings.Api.Models.ISettingMeasure[];
        Groups: Administration.Settings.Api.Models.ISettingGroup[];
        DefaultGroups: Administration.Settings.Api.Models.ISettingGroup[];
        ApplicationSettingAccess: boolean;
        GlobalSettingAccess: boolean;
        StoreSettingAccess: boolean;
        EnableRestoreDefault(storeMeasure: Administration.Settings.Api.Models.ISettingMeasure): boolean;
        GlobalMeasureStatus: string;
        Translation: Administration.Settings.Api.Models.IL10N;
        UpdateGlobalTolerance(measure: Administration.Settings.Api.Models.ISettingMeasure);
        UpdateStoreTolerance(measure: Administration.Settings.Api.Models.ISettingMeasure);
        GetDisplayMeasureKeyName(measureKey: string): string;
        GetDisplayGroupName(measureKey: string): string;

        CanView: {
            ApplicationReportMeasures: boolean;
            GlobalReportMeasures: boolean;
            StoreReportMeasures: boolean;
        }
    }

    class DashboardSettingsController {
        private static DISPLAY_NAME = 'DisplayName';
        constructor(
            private $scope: IDashboardSettingsControllerScope,
            private settingService: Administration.Settings.Api.ISettingsService,
            private $q: ng.IQService,
            private translationService: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            $authService: Core.Auth.IAuthService
            ) {
                $scope.GlobalMeasureStatus = "";
                $scope.DefaultGroups = [];
                $scope.category = 0; //Application
                //Load the Measures for Application by default
                if ($authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Application_CanUpdate)) {
                    this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Application,0 ).then((result) => {
                        $scope.Groups = result.data;
                    });
                }

                //Load Translations
                translationService.GetTranslations().then((result) => {
                    $scope.Translation = result.Settings;
                    popupMessageService.SetPageTitle(result.Settings.Settings);
                });

                $scope.GetApplicationMeasures= ()=> {
                    this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Application, 0).then((result)=> {
                        $scope.Groups = result.data;
                    });
                };

                $scope.GetGlobalMeasures = () => {
                    this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Global, 0).then((result) => {
                        $scope.Groups = result.data;
                    });
                };


            $scope.GetStoreMeasures = () => {
                this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Store, $authService.GetUser().BusinessUser.MobileSettings.EntityId).then((result) => {
                    $scope.Groups = result.data;
                });
                if ($authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Global_CanUpdate)){
                        this.settingService.GetMeasures(Administration.Settings.Api.Models.SettingEnums.Global, 0).then((result) => {
                        $scope.DefaultGroups = result.data;
                    });
                }
            };

                $scope.UpdateApplicationReportMeasureConfig = (measure: Administration.Settings.Api.Models.ISettingMeasure, visible: boolean) => {
                    measure.Visible = visible;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Application;
               this.settingService.POSTReportMeasureConfig(measure,"");
                };

                $scope.UpdateGlobalReportMeasureConfig = (measure: Administration.Settings.Api.Models.ISettingMeasure, enable: boolean) => {
                    measure.Enabled = enable;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Global;
                    this.settingService.POSTReportMeasureConfig(measure,"");
                };

                $scope.UpdateStoreReportMeasureConfig = (measure: Administration.Settings.Api.Models.ISettingMeasure, enable: boolean) => {
                    measure.Enabled = enable;
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Store;
                    this.settingService.POSTReportMeasureConfig(measure,"");
                };

                $scope.RestoreDefault = (measure: Administration.Settings.Api.Models.ISettingMeasure) => {
                    var defaultMeasure = this.GetDefaultMeasure(measure, $scope.DefaultGroups);
                        if (defaultMeasure != null) {
                            measure.Enabled = defaultMeasure.Enabled;
                        }
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Store;
                        this.settingService.POSTReportMeasureConfig(measure, "RESTORE");
                };

                $scope.EnableRestoreDefault = (storeMeasure: Administration.Settings.Api.Models.ISettingMeasure) => {
                    $scope.GlobalMeasureStatus = "Enabled Off";
                    var defaultMeasure = this.GetDefaultMeasure(storeMeasure, $scope.DefaultGroups);
                    if (defaultMeasure != null) {
                        if (defaultMeasure.Enabled)
                            $scope.GlobalMeasureStatus = "Enabled On";

                        return (defaultMeasure.Enabled != storeMeasure.Enabled);
                    }
                    return false;
                };

                $scope.UpdateGlobalTolerance = (measure: Administration.Settings.Api.Models.ISettingMeasure) => {
                    measure.ToleranceMin = measure.EditableToleranceMin;
                    measure.ToleranceMax = measure.EditableToleranceMax;
                    if (measure.ToleranceFormatEnum == Administration.Settings.Api.Models.SettingToleranceFormatEnums.Percentage) {
                        measure.ToleranceMin = measure.EditableToleranceMin / 100;
                        measure.ToleranceMax = measure.EditableToleranceMax / 100;
                    }
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Global;
                    this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.UpdateStoreTolerance = (measure: Administration.Settings.Api.Models.ISettingMeasure) => {
                    measure.ToleranceMin = measure.EditableToleranceMin;
                    measure.ToleranceMax = measure.EditableToleranceMax;
                    if (measure.ToleranceFormatEnum == Administration.Settings.Api.Models.SettingToleranceFormatEnums.Percentage) {
                        measure.ToleranceMin = measure.EditableToleranceMin / 100;
                        measure.ToleranceMax = measure.EditableToleranceMax / 100;
                    }
                    measure.EntityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                    measure.SettingType = Administration.Settings.Api.Models.SettingEnums.Store;
                    this.settingService.POSTReportMeasureConfig(measure, "");
                };

                $scope.GetDisplayMeasureKeyName = (measureKey: string)=> {
                    var displayName = $scope.Translation[measureKey + DashboardSettingsController.DISPLAY_NAME];
                    if (displayName != null)
                        return displayName;
                    return measureKey;
                };

                $scope.GetDisplayGroupName = (groupName: string) => {
                    var displayName = $scope.Translation[groupName];
                    if (displayName != null)
                        return displayName;
                    return groupName;
                };

                $scope.CanView = {
                    ApplicationReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_Settings_Dashboard_Application_CanUpdate),
                    GlobalReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_Settings_Dashboard_Global_CanUpdate),
                    StoreReportMeasures: $authService.CheckPermissionAllowance(Task.Administration_Settings_Dashboard_Store_CanUpdate)
                }
            }

        GetDefaultMeasure(measure: Administration.Settings.Api.Models.ISettingMeasure, defaultGroups: Administration.Settings.Api.Models.ISettingGroup[]): Administration.Settings.Api.Models.ISettingMeasure {            
            var group = _.find(defaultGroups, i => i.GroupId.toString() == measure.Group);
            if (group != null) {
               return _.find(group.Measures, { 'MeasureKey': measure.MeasureKey });
            }
            return null;
        }
    }

    export var dashboardSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("DashboardSettingsController", DashboardSettingsController
        , Core.NG.$typedScope<IDashboardSettingsControllerScope>()
        , Administration.Settings.Api.$settingsService
        , Core.NG.$q
        , Core.$translation
        , Core.$popupMessageService
        , Core.Auth.$authService
        );

} 