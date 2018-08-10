var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var OrderContainerController = (function () {
            function OrderContainerController(scope, stateService) {
                this.scope = scope;
                this.stateService = stateService;
                this.Initialize();
            }
            OrderContainerController.prototype.Initialize = function () {
                var _this = this;
                this.scope.IsDetailedState = function () {
                    if (_this.stateService.current.name === Core.UiRouterState.OrderStates.Details
                        || _this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdueDetails) {
                        return true;
                    }
                    return false;
                };
            };
            return OrderContainerController;
        }());
        Order.orderContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderContainerController", OrderContainerController, Core.NG.$typedScope(), Core.NG.$state);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
