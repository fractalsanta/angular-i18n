var Inventory;
(function (Inventory) {
    (function (Order) {
        var DeleteOrderController = (function () {
            function DeleteOrderController($scope, $modalInstance, $stateService, $orderService, $popupService, orderId, translationService) {
                $scope.Translations = {};

                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };

                $scope.Confirm = function () {
                    $orderService.DeleteOrder(orderId).then(function () {
                        $modalInstance.close();
                        $stateService.go(Core.UiRouterState.OrderStates.Place);
                        $popupService.ShowSuccess($scope.Translations.OrderNumber + " " + orderId + " " + $scope.Translations.DeletedSuccessfully);
                    });
                };

                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                });
            }
            return DeleteOrderController;
        })();

        Core.NG.InventoryOrderModule.RegisterNamedController("DeleteOrderController", DeleteOrderController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$state, Order.$orderService, Core.$popupMessageService, Core.NG.$typedCustomResolve("orderId"), Core.$translation);
    })(Inventory.Order || (Inventory.Order = {}));
    var Order = Inventory.Order;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=DeleteOrderController.js.map
