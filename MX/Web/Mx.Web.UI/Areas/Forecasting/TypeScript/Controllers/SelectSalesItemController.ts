module Forecasting {
    "use strict";

    interface ISelectSalesItemControllerScope extends ng.IScope {
        Cancel(): void;
        OK(): void;
        ForecastSalesItems?: Services.IForecastSalesItems;
        SelectedSalesItem?: any;

        Translation: Forecasting.Api.Models.ITranslations;
    }

    class SelectSalesItemController {
        constructor(
            private $scope: ISelectSalesItemControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private ForecastSalesItems: Services.IForecastSalesItems
        ) {
            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.Forecasting;
            });

            $scope.SelectedSalesItem = null;
            ForecastSalesItems.SearchParam = "";
            $scope.ForecastSalesItems = ForecastSalesItems;

            $scope.Cancel = (): void => modalInstance.dismiss();
            $scope.OK = (): void => modalInstance.close($scope.SelectedSalesItem);

            $scope.$watch("ForecastSalesItems.SelectedSalesItem", (newValue: any): void => {
                if ($scope.ForecastSalesItems.SearchParam.length) {
                    $scope.SelectedSalesItem = newValue;
                }
            }, false);
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("SelectSalesItemController", SelectSalesItemController,
        Core.NG.$typedScope<ISelectSalesItemControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<any>("ForecastSalesItems")
       );
}