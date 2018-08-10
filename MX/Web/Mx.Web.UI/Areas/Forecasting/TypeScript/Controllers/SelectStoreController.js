var Forecasting;
(function (Forecasting) {
    "use strict";
    var SelectStoreController = (function () {
        function SelectStoreController($scope, modalInstance, translationService, StoreList) {
            this.$scope = $scope;
            this.modalInstance = modalInstance;
            this.translationService = translationService;
            this.StoreList = StoreList;
            translationService.GetTranslations().then(function (result) {
                $scope.Model.L10N = result.Forecasting;
            });
            $scope.Model = {
                Stores: StoreList,
                SelectedStore: null
            };
            $scope.Cancel = function () { return modalInstance.dismiss(); };
            $scope.OK = function () { return modalInstance.close($scope.Model.SelectedStore); };
        }
        return SelectStoreController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("SelectStoreController", SelectStoreController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("Stores"));
})(Forecasting || (Forecasting = {}));
