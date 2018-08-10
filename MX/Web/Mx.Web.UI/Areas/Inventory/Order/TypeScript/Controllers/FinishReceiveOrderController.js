var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var FinishReceiveOrderController = (function (_super) {
            __extends(FinishReceiveOrderController, _super);
            function FinishReceiveOrderController($scope, instance, translationService, invoiceNumber, authService, periodCloseService, receiveOrderService, constants) {
                var _this = this;
                _super.call(this, $scope, instance, translationService, periodCloseService, authService, receiveOrderService, constants);
                this.invoiceNumber = invoiceNumber;
                $scope.Model.InvoiceNumber = this.invoiceNumber == null ? "" : this.invoiceNumber;
                $scope.Model.ReceiveWithoutInvoiceNumber = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_CanReceiveWithoutInvoiceNumber);
                $scope.Confirm = function () {
                    var finishOrder = {
                        ApplyDate: $scope.Model.ApplyDate,
                        InvoiceNumber: $scope.Model.InvoiceNumber
                    };
                    _this.instance.close(finishOrder);
                };
            }
            return FinishReceiveOrderController;
        }(Order.BaseApplyDateController));
        Order.FinishReceiveOrderController = FinishReceiveOrderController;
        Core.NG.InventoryOrderModule.RegisterNamedController("FinishReceiveOrder", FinishReceiveOrderController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("invoiceNumber"), Core.Auth.$authService, Workforce.PeriodClose.Api.$periodCloseService, Order.$receiveOrderService, Core.Constants);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
