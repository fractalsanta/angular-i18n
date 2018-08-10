var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var ActionTransferController = (function () {
            function ActionTransferController($scope, $modalInstance, translation, transfers, transfer, isApproval, transferDirection) {
                $scope.ViewModel = {
                    IsApproval: isApproval,
                    DenyMessage: "",
                    Reason: "",
                    TransferDirection: transferDirection,
                    Title: "",
                    Message: "",
                    IsDisabled: false
                };
                translation.GetTranslations().then(function (result) {
                    var vm = $scope.ViewModel, t = result.InventoryTransfer;
                    $scope.Translations = t;
                    if (transferDirection === Transfer.Api.Enums.TransferDirection.TransferOut) {
                        vm.Title = (vm.IsApproval) ? t.ConfirmApproval : t.ConfirmDenial;
                        vm.Message = (vm.IsApproval) ? t.ConfirmApprovalMessage : t.ConfirmDenialMessage;
                    }
                    else {
                        vm.Title = (vm.IsApproval) ? t.ConfirmReceive : t.ConfirmDenial;
                        vm.Message = (vm.IsApproval) ? t.ConfirmReceiveMessage : t.ConfirmDenialMessage;
                    }
                    vm.Reason = t.DenialReason;
                });
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.Confirm = function () {
                    if (!$scope.ViewModel.IsDisabled) {
                        $scope.ViewModel.IsDisabled = true;
                        transfers.PutUpdateTransferQuantities(transfer, isApproval, $scope.ViewModel.DenyMessage).success(function () {
                            $modalInstance.close();
                        }).finally(function () { $scope.ViewModel.IsDisabled = false; });
                    }
                };
            }
            return ActionTransferController;
        }());
        Transfer.ActionTransferController = ActionTransferController;
        Core.NG.InventoryTransferModule.RegisterNamedController("ActionTransferController", ActionTransferController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Transfer.Api.$transferService, Core.NG.$typedCustomResolve("transfer"), Core.NG.$typedCustomResolve("isApproval"), Core.NG.$typedCustomResolve("transferDirection"));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
