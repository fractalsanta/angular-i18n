var Inventory;
(function (Inventory) {
    (function (Transfer) {
        "use strict";

        var Task = Core.Api.Models.Task;

        var TransferInController = (function () {
            function TransferInController($scope, $authService, $location, transferStoreService, translationService, popupMessageService, $routeParams) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.$location = $location;
                this.transferStoreService = transferStoreService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.$routeParams = $routeParams;
                $scope.IsOutbound = $routeParams.Type === "create";

                var canViewPage = ($scope.IsOutbound && $authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanCreateTransferOut)) || (!$scope.IsOutbound && $authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanRequestTransferIn));

                if (!canViewPage) {
                    $location.path("/Core/Forbidden");
                    return;
                }

                var user = $authService.GetUser();
                var entityId = user.BusinessUser.MobileSettings.EntityId;
                this._transferStores = [];

                translationService.GetTranslations().then(function (result) {
                    var title = _this.$scope.IsOutbound ? result.InventoryTransfer.CreateTransfer : result.InventoryTransfer.RequestTransfer;

                    $scope.Translations = result.InventoryTransfer;
                    popupMessageService.SetPageTitle(title);

                    transferStoreService.GetNeighboringStores(entityId).then(function (stores) {
                        _this._transferStores = stores.data;
                    });
                });

                this.$scope.GetStores = function () {
                    return _this._transferStores;
                };

                $scope.SelectStore = function (storeId) {
                    return $location.path("/Inventory/Transfer/Request/" + storeId + "/" + _this.$routeParams.Type);
                };
            }
            return TransferInController;
        })();
        Transfer.TransferInController = TransferInController;

        Core.NG.InventoryTransferModule.RegisterRouteController("TransferIn/:Type", "Templates/TransferIn.html", TransferInController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$location, Transfer.Api.$transferStoreService, Core.$translation, Core.$popupMessageService, Core.NG.$typedStateParams());
    })(Inventory.Transfer || (Inventory.Transfer = {}));
    var Transfer = Inventory.Transfer;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=TransferInController.js.map
