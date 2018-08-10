module Inventory.Order {
    "use strict";

    class ReceiveOrderContainerController {

        private Initialize() {
            this.scope.IsDetailedState = () => {
                if (this.stateService.current.name != Core.UiRouterState.ReceiveOrderStates.ReceiveOrder
                    && this.stateService.current.name != Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist) {
                    return true;
                }
                return false;
            }
        }

        constructor(private scope: IReceiveOrderContainerControllerScope, private stateService: ng.ui.IStateService) {

            this.Initialize();
        }
    }

    export var receiveOrderContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("ReceiveOrderContainerController", ReceiveOrderContainerController,
        Core.NG.$typedScope<IReceiveOrderContainerControllerScope>(),
        Core.NG.$state
        );
} 