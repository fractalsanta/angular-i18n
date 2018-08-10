var Forecasting;
(function (Forecasting) {
    "use strict";
    var SelectSalesItemController = (function () {
        function SelectSalesItemController($scope, modalInstance, translationService, ForecastSalesItems) {
            this.$scope = $scope;
            this.modalInstance = modalInstance;
            this.translationService = translationService;
            this.ForecastSalesItems = ForecastSalesItems;
            translationService.GetTranslations().then(function (result) {
                $scope.Translation = result.Forecasting;
            });
            $scope.SelectedSalesItem = null;
            ForecastSalesItems.SearchParam = "";
            $scope.ForecastSalesItems = ForecastSalesItems;
            $scope.Cancel = function () { return modalInstance.dismiss(); };
            $scope.OK = function () { return modalInstance.close($scope.SelectedSalesItem); };
            $scope.$watch("ForecastSalesItems.SelectedSalesItem", function (newValue) {
                if ($scope.ForecastSalesItems.SearchParam.length) {
                    $scope.SelectedSalesItem = newValue;
                }
            }, false);
        }
        return SelectSalesItemController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("SelectSalesItemController", SelectSalesItemController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("ForecastSalesItems"));
})(Forecasting || (Forecasting = {}));
