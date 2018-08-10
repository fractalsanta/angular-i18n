module Inventory.Order {
    "use strict";

    class OrderContainerController {

        private Initialize() {

            this.scope.IsDetailedState = () => {
                if (this.stateService.current.name === Core.UiRouterState.OrderStates.Details
                    || this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdueDetails) {
                    return true;
                }
                return false;
            }
        }

        constructor(private scope: IOrderContainerControllerScope, private stateService: ng.ui.IStateService) {

            this.Initialize();
        }
    }

    export var orderContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderContainerController", OrderContainerController,
        Core.NG.$typedScope<IOrderContainerControllerScope>(),
        Core.NG.$state
        );
}