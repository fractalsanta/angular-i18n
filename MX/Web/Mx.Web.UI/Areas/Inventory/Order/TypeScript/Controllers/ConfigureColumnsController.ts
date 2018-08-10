module Inventory.Order {
    "use strict";

    interface IConfigureColumnsControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;

        SortingOptions: Core.Directives.IMxSortableOptions;

        ActiveColumns: IColumnDefinition[];
        InactiveColumns: IColumnDefinition[];

        Cancel(): void;
        Confirm(): void;
    }

    class ConfigureColumnsController {
        constructor(
            $scope: IConfigureColumnsControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            $translation: Core.ITranslationService,
            columnDefinitions: IColumnDefinition[]) {

            $translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.InventoryOrder;
            });

            $scope.SortingOptions = <Core.Directives.IMxSortableOptions>{
                ConnectWith: ".mx-column-container",
                Stop: (): void => {
                    if ($scope.ActiveColumns.length > 3) {
                        $scope.InactiveColumns.unshift($scope.ActiveColumns.pop());
                    } else if ($scope.ActiveColumns.length < 3) {
                        $scope.ActiveColumns.push($scope.InactiveColumns.shift());
                    }
                }
            };

            $scope.ActiveColumns = columnDefinitions.slice(0, 3);
            $scope.InactiveColumns = columnDefinitions.slice(3);

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.Confirm = (): void => {
                $modalInstance.close($scope.ActiveColumns.concat($scope.InactiveColumns));
            };
        }
    }

    Core.NG.InventoryOrderModule.RegisterNamedController("ConfigureColumnsController", ConfigureColumnsController,
        Core.NG.$typedScope<IConfigureColumnsControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<IColumnDefinition[]>("columnDefinitions"));
} 