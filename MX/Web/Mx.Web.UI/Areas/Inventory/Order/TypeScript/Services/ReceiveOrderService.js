var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReceiveOrderService = (function () {
            function ReceiveOrderService(authService, signalR, $receiveOrderApiService, $receiveOrderDetailsApiService, constants) {
                this.authService = authService;
                this.signalR = signalR;
                this.$receiveOrderApiService = $receiveOrderApiService;
                this.$receiveOrderDetailsApiService = $receiveOrderDetailsApiService;
                this.constants = constants;
                this.Initialise();
            }
            ReceiveOrderService.prototype.Initialise = function () {
                this.OrderModified = new Core.Events.Event();
            };
            ReceiveOrderService.prototype.OrderAddItems = function (orderId, itemCodesToAdd) {
                var user = this.authService.GetUser();
                var promise = {};
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    promise = this.$receiveOrderApiService.PostAddItems(user.BusinessUser.MobileSettings.EntityId, orderId, itemCodesToAdd).then(function (result) {
                        return result.data;
                    });
                }
                return promise;
            };
            ReceiveOrderService.prototype.GetReceiveOrder = function (orderId) {
                return this.$receiveOrderApiService.GetReceiveOrder(orderId);
            };
            ReceiveOrderService.prototype.FinishReceiveOrder = function (applyDate, order) {
                var _this = this;
                var user = this.authService.GetUser(), items = _.where(order.Items, function (item) {
                    return item.IsReadyToBeReceived && !item.Received;
                });
                return this.$receiveOrderDetailsApiService.PostReceiveOrder(user.BusinessUser.MobileSettings.EntityId, moment(applyDate).format(this.constants.InternalDateTimeFormat), order.OrderNumber, order.InvoiceNumber, items)
                    .then(function (result) {
                    _this.OrderModified.Fire(null);
                    return result.data;
                });
            };
            ReceiveOrderService.prototype.AdjustReceiveOrder = function (order) {
                var _this = this;
                var user = this.authService.GetUser(), items = _.where(order.Items, function (item) {
                    return item.Received;
                });
                return this.$receiveOrderDetailsApiService.PostAdjustment(user.BusinessUser.MobileSettings.EntityId, order.OrderNumber, items).then(function (result) {
                    _this.OrderModified.Fire(null);
                    return result.data;
                });
            };
            ReceiveOrderService.prototype.ChangeApplyDate = function (applyDate, order) {
                var _this = this;
                return this.$receiveOrderDetailsApiService.PostChangeApplyDate(order.OrderNumber, moment(applyDate).format(this.constants.InternalDateTimeFormat)).then(function (result) {
                    _this.OrderModified.Fire(null);
                    return result.data;
                });
            };
            ReceiveOrderService.prototype.IsOffline = function () {
                return this.signalR.IsOffline();
            };
            ReceiveOrderService.prototype.PushOrderToTomorrow = function (order) {
                var _this = this;
                return this.$receiveOrderApiService.PostPushForTomorrow(order.OrderNumber).then(function () {
                    _this.OrderModified.Fire(null);
                });
            };
            ReceiveOrderService.prototype.GetLocalStoreDateTimeString = function () {
                return this.$receiveOrderApiService.GetLocalStoreDateTimeString(this.authService.GetUser().BusinessUser.MobileSettings.EntityId);
            };
            return ReceiveOrderService;
        }());
        Order.$receiveOrderService = Core.NG.InventoryOrderModule.RegisterService("ReceiveOrderSrv", ReceiveOrderService, Core.Auth.$authService, Core.$signalR, Order.Api.$receiveOrderService, Order.Api.$receiveOrderDetailService, Core.Constants);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
