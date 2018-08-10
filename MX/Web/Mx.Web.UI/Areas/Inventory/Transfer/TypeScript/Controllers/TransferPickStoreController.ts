module Inventory.Transfer {
    "use strict";

    import Task = Core.Api.Models.Task;

    export interface ITransferPickStoreControllerScope extends ng.IScope {
        GetStores(): Api.Models.IStoreItem[];      
        Translations: Api.Models.IL10N;
        SelectStore(storeId: number): void;
        IsOutbound: boolean;
    }

    export interface ITransferPickStoreControllerRouteParams {
        Type?: string;
    }

    export class TransferPickStoreController {

        private _transferStores: Api.Models.IStoreItem[];

        constructor(
            private $scope: ITransferPickStoreControllerScope,
            private $authService: Core.Auth.IAuthService,
            private $location: ng.ILocationService,
            private transferStoreService: Api.ITransferStoreService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private $routeParams: ITransferPickStoreControllerRouteParams
            ) {

            $scope.IsOutbound = $routeParams.Type === "create";

            var canViewPage = ($scope.IsOutbound && $authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanCreateTransferOut))
                || (!$scope.IsOutbound && $authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanRequestTransferIn));
                
            if (!canViewPage) {
                $location.path("/Core/Forbidden");
                return;
            }

            var user = $authService.GetUser();
            var entityId = user.BusinessUser.MobileSettings.EntityId;
            this._transferStores = [];

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations) => {
                var title: string = this.$scope.IsOutbound ? result.InventoryTransfer.CreateTransfer : result.InventoryTransfer.RequestTransfer;

                $scope.Translations = result.InventoryTransfer;
                popupMessageService.SetPageTitle(title);

                var direction = this.$scope.IsOutbound ? Api.Enums.TransferDirection.TransferOut : Api.Enums.TransferDirection.TransferIn;

                transferStoreService.GetNeighboringStores(entityId, direction).then((stores) => {
                    this._transferStores = stores.data;
                });
            });

            this.$scope.GetStores = () => this._transferStores;

            $scope.SelectStore = (storeId: number) => $location.path("/Inventory/Transfer/InitiateTransfer/" + storeId + "/" + this.$routeParams.Type);
        }
    }

    Core.NG.InventoryTransferModule.RegisterRouteController("InitiateTransfer/:Type", "Templates/TransferPickStore.html", TransferPickStoreController,
        Core.NG.$typedScope<ITransferPickStoreControllerScope>(),
        Core.Auth.$authService,
        Core.NG.$location,
        Api.$transferStoreService,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$typedStateParams<ITransferPickStoreControllerRouteParams>());

}
