module Inventory.Order {
    "use strict";

    interface ICustomRangeControllerScope extends ng.IScope {
        StartDate: Date;
        EndDate: Date;
        Cancel(): void;
        Confirm(startDate: Date, endDate: Date): void;

        Translations: Api.Models.IL10N;
    }

    class CustomRangeController {
        constructor(
            $scope: ICustomRangeControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            customRange: Core.IDateRange,
            translationService: Core.ITranslationService) {
            // TODO: Possible passing of number of days?
            $scope.EndDate = (customRange && customRange.EndDate) || new Date();
            $scope.StartDate = (customRange && customRange.StartDate) || moment().add("d", -14).toDate();

            $scope.Translations = <Api.Models.IL10N>{};

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.Confirm = (startDate: Date, endDate: Date): void => {
                $modalInstance.close(<Core.IDateRange>{ StartDate: startDate, EndDate: endDate });
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.InventoryOrder;

            });
        }
    }

    Core.NG.InventoryOrderModule.RegisterNamedController("CustomRange", CustomRangeController,
        Core.NG.$typedScope<ICustomRangeControllerScope>(),
        Core.NG.$modalInstance,
        Core.NG.$typedCustomResolve<Core.IDateRange>("customRange"),
        Core.$translation
        );
}