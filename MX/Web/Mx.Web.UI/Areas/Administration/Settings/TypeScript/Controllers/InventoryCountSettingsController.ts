module Administration.Settings {
    "use strict";

    import Task = Core.Api.Models.Task;
    import ICApi = Administration.Settings.Api;
   
    export interface IInventoryCountSettingsControllerScope extends ng.IScope {
        Translations: Administration.Settings.Api.Models.IL10N;
        SaveInventoryCountSettings(): void;
        ValueChanged(): void;

        Vm: {
            IsDirty: boolean;
            PendingColor: string;
            OutOfToleranceColor: string;
            CountedColor: string;
        };
    }

    export class InventoryCountSettingsController {
        constructor(
            private $scope: IInventoryCountSettingsControllerScope,
            private translationService: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            $authService: Core.Auth.IAuthService,
            $locationService: ng.ILocationService,
            private inventoryCountSettingsService: ICApi.IInventoryCountSettingsService
            ) {

            var canViewPage = $authService.CheckPermissionAllowance(Task.Administration_Settings_InventoryCount_CanAccess); 

            if (!canViewPage) {
                $locationService.path("/Core/Forbidden");
                return;
            };

            $scope.Vm = {
                PendingColor: "", 
                OutOfToleranceColor: "",
                CountedColor: "",
                IsDirty: false
            };

            translationService.GetTranslations().then((result) => {
                $scope.Translations = result.Settings;
                popupMessageService.SetPageTitle($scope.Translations.InventoryCountSettings + " " + $scope.Translations.Settings);

                this.LoadData();
            });

            $scope.SaveInventoryCountSettings = () => {
                if (this.$scope.Vm.IsDirty) {
                    inventoryCountSettingsService.PostInventoryCountSettings(this.$scope.Vm).success((): void => {
                        $scope.Vm.IsDirty = false;
                        popupMessageService.ShowSuccess($scope.Translations.InventoryCountSettingsSaved);
                    });

                    popupMessageService.ShowSuccess($scope.Translations.InventoryCountSettingsSaved);
                }
            };

            $scope.ValueChanged = () => {
                $scope.Vm.IsDirty = true;
            };
        }

        public LoadData(): void {
            this.inventoryCountSettingsService.GetInventoryCountSettings().success((results: Administration.Settings.Api.Models.IInventoryCountSettingsViewModel): void => {
                
                this.$scope.Vm.PendingColor = results.PendingColor;
                this.$scope.Vm.OutOfToleranceColor = results.OutOfToleranceColor;
                this.$scope.Vm.CountedColor = results.CountedColor;

            });
        }
    }

    export var inventoryCountSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("InventoryCountSettingsController", InventoryCountSettingsController,
        Core.NG.$typedScope<IInventoryCountSettingsControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Core.NG.$location,
        ICApi.$inventoryCountSettingsService
        );
}