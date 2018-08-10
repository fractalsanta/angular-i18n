module Inventory.Transfer {
    "use strict";
    
    class TransferHistoryContainerController {

        private Initialize() {

            this.scope.IsDetailedState = () => {
                if (this.stateService.current.name != Core.UiRouterState.TransferHistoryStates.History) {
                    return true;
                }
                return false;
            }
        }

        constructor(private scope: ITransferHistoryContainerControllerScope, private stateService: ng.ui.IStateService) {

            this.Initialize();
        }
    }

    export var transferHistoryContainerController = Core.NG.InventoryTransferModule.RegisterNamedController("TransferHistoryContainerController", TransferHistoryContainerController,
        Core.NG.$typedScope<ITransferHistoryContainerControllerScope>(),
        Core.NG.$state
        );
}