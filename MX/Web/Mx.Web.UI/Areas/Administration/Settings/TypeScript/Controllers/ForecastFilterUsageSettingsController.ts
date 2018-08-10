module Administration.Settings {
    "use strict";

    import Task = Core.Api.Models.Task;
    import FApi = Forecasting.Api;
   
    export interface IForecastFilterUsageSettingsControllerScope extends ng.IScope {
        Translations: Administration.Settings.Api.Models.IL10N;
        SaveForecastFilterUsageSettings(): void;
        FilterChanged(): void;

        Vm: {
            IsDirty: boolean;
            Functions: FApi.Models.IForecastFilterAssignRecord[];
            ForecastFilters: FApi.Models.IForecastFilterRecord[];
        };
    }

    export class ForecastFilterUsageSettingsController {
        constructor(
            private $scope: IForecastFilterUsageSettingsControllerScope,
            private translationService: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            $authService: Core.Auth.IAuthService,
            $locationService: ng.ILocationService,
            private forecastFilterService: FApi.IForecastFilterService,
            private forecastFilterAssignService: FApi.IForecastFilterAssignService
            ) {

            var canViewPage = $authService.CheckPermissionAllowance(Task.Administration_Settings_ForecastUsage_CanAccess); 

            if (!canViewPage) {
                $locationService.path("/Core/Forbidden");
                return;
            };

            $scope.Vm = {
                Functions: [], 
                ForecastFilters: [],
                IsDirty: false
            };

            translationService.GetTranslations().then((result) => {
                $scope.Translations = result.Settings;
                popupMessageService.SetPageTitle($scope.Translations.ForecastFilterUsage + " " + $scope.Translations.Settings);

                this.LoadData();
            });

            $scope.SaveForecastFilterUsageSettings = () => {
                forecastFilterAssignService.PostForecastFilterAssign(this.$scope.Vm.Functions).success((): void => {
                    $scope.Vm.IsDirty = false;
                    popupMessageService.ShowSuccess($scope.Translations.ForecastFilterUsageSettingsSaved);
                });
            };

            $scope.FilterChanged = () => {
                $scope.Vm.IsDirty = true;
            }
        }

        public LoadData(): void {
            this.forecastFilterService.GetForecastFilters().success((results: FApi.Models.IForecastFilterRecord[]): void => {
                results.unshift(<FApi.Models.IForecastFilterRecord>{
                    Id: null,
                    Name: this.$scope.Translations.Total
                });
                this.$scope.Vm.ForecastFilters = results;

                this.forecastFilterAssignService.GetForecastFilterAssigns().success((results: FApi.Models.IForecastFilterAssignRecord[]): void => {
                    this.$scope.Vm.Functions = results;
                });
            });
        }
    }

    export var forecastFilterUsageSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("ForecastFilterUsageSettingsController", ForecastFilterUsageSettingsController,
        Core.NG.$typedScope<IForecastFilterUsageSettingsControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Core.NG.$location,
        FApi.$forecastFilterService,
        FApi.$forecastFilterAssignService
        );
}