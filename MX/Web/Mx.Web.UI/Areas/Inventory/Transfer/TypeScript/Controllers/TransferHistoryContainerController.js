var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var TransferHistoryContainerController = (function () {
            function TransferHistoryContainerController(scope, stateService) {
                this.scope = scope;
                this.stateService = stateService;
                this.Initialize();
            }
            TransferHistoryContainerController.prototype.Initialize = function () {
                var _this = this;
                this.scope.IsDetailedState = function () {
                    if (_this.stateService.current.name != Core.UiRouterState.TransferHistoryStates.History) {
                        return true;
                    }
                    return false;
                };
            };
            return TransferHistoryContainerController;
        }());
        Transfer.transferHistoryContainerController = Core.NG.InventoryTransferModule.RegisterNamedController("TransferHistoryContainerController", TransferHistoryContainerController, Core.NG.$typedScope(), Core.NG.$state);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
