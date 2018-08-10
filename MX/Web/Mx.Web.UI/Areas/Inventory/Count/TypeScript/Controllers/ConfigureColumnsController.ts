module Inventory.Count {
    "use strict";

    interface IConfigureColumnsControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        Cancel(): void;
        Confirm(): void;
        IsPercent: boolean;
        ChangeOption(option: string): void;
        CostOptionRadioBtnValue: string;
    }

    export class CostOption {
        static Cost = "cost";
        static Percent = "percent";
    }

    class ConfigureColumnsController {
        constructor(
            $scope: IConfigureColumnsControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            $translation: Core.ITranslationService,
            isPercent: boolean) {

            $scope.IsPercent = isPercent;

            $scope.CostOptionRadioBtnValue = $scope.IsPercent === true ? CostOption.Percent : CostOption.Cost;

            $translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.InventoryCount;
            });

            $scope.ChangeOption = (option: string): void => {
                $scope.CostOptionRadioBtnValue = option;

                if (<ApplyDateOption>option === CostOption.Cost) {
                    $scope.IsPercent = false;
                } else {
                    $scope.IsPercent = true;
                }
            };

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.Confirm = (): void => {
                $modalInstance.close($scope.IsPercent);
            };
        }
    }

    Core.NG.InventoryCountModule.RegisterNamedController("ConfigureColumnsController", ConfigureColumnsController,
        Core.NG.$typedScope<IConfigureColumnsControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<boolean>("isPercent"));
} 