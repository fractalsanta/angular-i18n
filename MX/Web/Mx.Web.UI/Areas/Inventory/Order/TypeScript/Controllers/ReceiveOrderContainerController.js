var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReceiveOrderContainerController = (function () {
            function ReceiveOrderContainerController(scope, stateService) {
                this.scope = scope;
                this.stateService = stateService;
                this.Initialize();
            }
            ReceiveOrderContainerController.prototype.Initialize = function () {
                var _this = this;
                this.scope.IsDetailedState = function () {
                    if (_this.stateService.current.name != Core.UiRouterState.ReceiveOrderStates.ReceiveOrder
                        && _this.stateService.current.name != Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist) {
                        return true;
                    }
                    return false;
                };
            };
            return ReceiveOrderContainerController;
        }());
        Order.receiveOrderContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("ReceiveOrderContainerController", ReceiveOrderContainerController, Core.NG.$typedScope(), Core.NG.$state);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
