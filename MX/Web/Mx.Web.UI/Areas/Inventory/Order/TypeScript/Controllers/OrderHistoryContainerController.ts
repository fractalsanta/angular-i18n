module Inventory.Order {
    "use strict";

    class OrderHistoryContainerController {

        private Initialize() {

            this.scope.IsDetailedState = () => {
                if (this.stateService.current.name != Core.UiRouterState.OrderHistoryStates.History) {
                    return true;
                }
                return false;
            }
        }

        constructor(private scope: IOrderHistoryContainerControllerScope, private stateService: ng.ui.IStateService) {

            this.Initialize();
        }
    }

    export var orderHistoryContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderHistoryContainerController", OrderHistoryContainerController,
        Core.NG.$typedScope<IOrderHistoryContainerControllerScope>(),
        Core.NG.$state
        );
}