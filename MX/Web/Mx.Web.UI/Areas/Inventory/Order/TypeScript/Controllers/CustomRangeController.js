var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var CustomRangeController = (function () {
            function CustomRangeController($scope, $modalInstance, customRange, translationService) {
                $scope.EndDate = (customRange && customRange.EndDate) || new Date();
                $scope.StartDate = (customRange && customRange.StartDate) || moment().add("d", -14).toDate();
                $scope.Translations = {};
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.Confirm = function (startDate, endDate) {
                    $modalInstance.close({ StartDate: startDate, EndDate: endDate });
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                });
            }
            return CustomRangeController;
        }());
        Core.NG.InventoryOrderModule.RegisterNamedController("CustomRange", CustomRangeController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$typedCustomResolve("customRange"), Core.$translation);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
