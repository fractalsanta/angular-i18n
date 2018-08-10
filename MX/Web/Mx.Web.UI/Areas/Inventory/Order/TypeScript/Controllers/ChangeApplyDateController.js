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
        var ChangeApplyDateController = (function (_super) {
            __extends(ChangeApplyDateController, _super);
            function ChangeApplyDateController($scope, instance, translationService, periodCloseService, authService, receiveOrderService, constants) {
                _super.call(this, $scope, instance, translationService, periodCloseService, authService, receiveOrderService, constants);
            }
            return ChangeApplyDateController;
        }(Order.BaseApplyDateController));
        Order.ChangeApplyDateController = ChangeApplyDateController;
        Core.NG.InventoryOrderModule.RegisterNamedController("ChangeApplyDate", ChangeApplyDateController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Workforce.PeriodClose.Api.$periodCloseService, Core.Auth.$authService, Order.$receiveOrderService, Core.Constants);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
