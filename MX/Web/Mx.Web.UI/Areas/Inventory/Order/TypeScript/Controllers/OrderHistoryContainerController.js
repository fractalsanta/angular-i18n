var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var OrderHistoryContainerController = (function () {
            function OrderHistoryContainerController(scope, stateService) {
                this.scope = scope;
                this.stateService = stateService;
                this.Initialize();
            }
            OrderHistoryContainerController.prototype.Initialize = function () {
                var _this = this;
                this.scope.IsDetailedState = function () {
                    if (_this.stateService.current.name != Core.UiRouterState.OrderHistoryStates.History) {
                        return true;
                    }
                    return false;
                };
            };
            return OrderHistoryContainerController;
        }());
        Order.orderHistoryContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderHistoryContainerController", OrderHistoryContainerController, Core.NG.$typedScope(), Core.NG.$state);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
