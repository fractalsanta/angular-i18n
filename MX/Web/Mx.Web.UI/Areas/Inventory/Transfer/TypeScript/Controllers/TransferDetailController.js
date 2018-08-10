var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var TransferDetailController = (function () {
            function TransferDetailController($scope, authService, translationService, notification) {
                translationService.GetTranslations().then(function (result) {
                    var translations = $scope.Translations = result.InventoryTransfer;
                    notification.SetPageTitle(translations.TransferDetail);
                });
            }
            return TransferDetailController;
        }());
        Transfer.TransferDetailController = TransferDetailController;
        Core.NG.InventoryTransferModule.RegisterRouteController("History/:Id", "Templates/TransferDetail.html", TransferDetailController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, Core.$popupMessageService);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
