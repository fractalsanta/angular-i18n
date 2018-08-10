var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var TransferPickStoreController = (function () {
            function TransferPickStoreController($scope, $authService, $location, transferStoreService, translationService, popupMessageService, $routeParams) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.$location = $location;
                this.transferStoreService = transferStoreService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.$routeParams = $routeParams;
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
                translationService.GetTranslations().then(function (result) {
                    var title = _this.$scope.IsOutbound ? result.InventoryTransfer.CreateTransfer : result.InventoryTransfer.RequestTransfer;
                    $scope.Translations = result.InventoryTransfer;
                    popupMessageService.SetPageTitle(title);
                    var direction = _this.$scope.IsOutbound ? Transfer.Api.Enums.TransferDirection.TransferOut : Transfer.Api.Enums.TransferDirection.TransferIn;
                    transferStoreService.GetNeighboringStores(entityId, direction).then(function (stores) {
                        _this._transferStores = stores.data;
                    });
                });
                this.$scope.GetStores = function () { return _this._transferStores; };
                $scope.SelectStore = function (storeId) { return $location.path("/Inventory/Transfer/InitiateTransfer/" + storeId + "/" + _this.$routeParams.Type); };
            }
            return TransferPickStoreController;
        }());
        Transfer.TransferPickStoreController = TransferPickStoreController;
        Core.NG.InventoryTransferModule.RegisterRouteController("InitiateTransfer/:Type", "Templates/TransferPickStore.html", TransferPickStoreController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$location, Transfer.Api.$transferStoreService, Core.$translation, Core.$popupMessageService, Core.NG.$typedStateParams());
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
