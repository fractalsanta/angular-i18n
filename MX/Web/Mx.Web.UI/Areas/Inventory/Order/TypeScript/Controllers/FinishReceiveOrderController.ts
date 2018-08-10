module Inventory.Order {
    "use strict";

    export class FinishReceiveOrderController extends BaseApplyDateController {

        constructor($scope: IFinishReceiveOrderScope
            , instance: ng.ui.bootstrap.IModalServiceInstance
            , translationService: Core.ITranslationService
            , private invoiceNumber: string
            , authService: Core.Auth.IAuthService
            , periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService
            , receiveOrderService: IReceiveOrderService
            , constants: Core.IConstants
            ) {
            super($scope, instance, translationService, periodCloseService, authService, receiveOrderService, constants);

            $scope.Model.InvoiceNumber = this.invoiceNumber == null ? "" : this.invoiceNumber;
            $scope.Model.ReceiveWithoutInvoiceNumber = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_CanReceiveWithoutInvoiceNumber);

            $scope.Confirm = () => {
                var finishOrder = <IFinishReceiveOrder>{
                    ApplyDate: $scope.Model.ApplyDate,
                    InvoiceNumber: $scope.Model.InvoiceNumber
                };

                this.instance.close(finishOrder);
            };
        }
    }

    Core.NG.InventoryOrderModule.RegisterNamedController("FinishReceiveOrder", FinishReceiveOrderController,
        Core.NG.$typedScope<IFinishReceiveOrderScope>()
        , Core.NG.$modalInstance
        , Core.$translation
        , Core.NG.$typedCustomResolve<string>("invoiceNumber")
        , Core.Auth.$authService
        , Workforce.PeriodClose.Api.$periodCloseService
        , $receiveOrderService
        , Core.Constants
        );
}
