module Inventory.Transfer {
    "use strict";

    export interface IActionTransferControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        
        ViewModel: {
            IsApproval: boolean;
            DenyMessage: string;
            Reason: string;
            TransferDirection: Api.Enums.TransferDirection;
            Title: string;
            Message: string;
            IsDisabled: boolean;
        };        
        Cancel(): void;
        Confirm(): void;
    }

    export class ActionTransferController {
        constructor(
            $scope: IActionTransferControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            translation: Core.ITranslationService,
            transfers: Api.ITransferService,
            transfer: Api.Models.ITransfer,
            isApproval: boolean,
            transferDirection: Api.Enums.TransferDirection) {

            $scope.ViewModel = {
                IsApproval: isApproval,
                DenyMessage: "",
                Reason: "",
                TransferDirection: transferDirection,
                Title: "",
                Message: "",
                IsDisabled: false
            };

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var vm = $scope.ViewModel, t = result.InventoryTransfer;

                $scope.Translations = t;
                if (transferDirection === Api.Enums.TransferDirection.TransferOut) {
                    vm.Title = (vm.IsApproval) ? t.ConfirmApproval : t.ConfirmDenial;
                    vm.Message = (vm.IsApproval) ? t.ConfirmApprovalMessage : t.ConfirmDenialMessage;
                } else {
                    vm.Title = (vm.IsApproval) ? t.ConfirmReceive : t.ConfirmDenial;
                    vm.Message = (vm.IsApproval) ? t.ConfirmReceiveMessage : t.ConfirmDenialMessage;
                }
                vm.Reason = t.DenialReason;
            });

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };
            $scope.Confirm = (): void => {
                if (!$scope.ViewModel.IsDisabled) {
                    $scope.ViewModel.IsDisabled = true;
                    transfers.PutUpdateTransferQuantities(transfer, isApproval, $scope.ViewModel.DenyMessage).success((): void => {
                        $modalInstance.close();
                    }).finally((): void => { $scope.ViewModel.IsDisabled = false; });
                }
            };
        }
    }

    Core.NG.InventoryTransferModule.RegisterNamedController("ActionTransferController", ActionTransferController,
        Core.NG.$typedScope<IActionTransferControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Api.$transferService,
        Core.NG.$typedCustomResolve<Api.Models.ITransfer>("transfer"),
        Core.NG.$typedCustomResolve<boolean>("isApproval"),
        Core.NG.$typedCustomResolve<Api.Enums.TransferDirection>("transferDirection"));
} 