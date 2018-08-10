var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var OrderService = (function () {
            function OrderService(authService, $orderApiService, $overdueScheduledOrderApiService) {
                this.authService = authService;
                this.$orderApiService = $orderApiService;
                this.$overdueScheduledOrderApiService = $overdueScheduledOrderApiService;
                this.Initialise();
            }
            OrderService.prototype.Initialise = function () {
                this.OrderModified = new Core.Events.Event();
            };
            OrderService.prototype.OrderAddItems = function (orderId, itemCodesToAdd) {
                var user = this.authService.GetUser();
                var promise = {};
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    promise = this.$orderApiService.PostAddItems(user.BusinessUser.MobileSettings.EntityId, orderId, itemCodesToAdd).then(function (result) {
                        return result.data;
                    });
                }
                return promise;
            };
            OrderService.prototype.GetOrder = function (orderId) {
                var user = this.authService.GetUser();
                var promise = {};
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    promise = this.$orderApiService.GetOrder(user.BusinessUser.MobileSettings.EntityId, orderId).then(function (result) {
                        return result.data;
                    });
                }
                return promise;
            };
            OrderService.prototype.GetOrderItemHistory = function (transactionSalesOrderItemId) {
                return this.$orderApiService.GetOrderItemHistory(transactionSalesOrderItemId).then(function (result) { return result.data; });
            };
            OrderService.prototype.GetOrdersByRange = function (entityId, fromDate, toDate) {
                return this.$orderApiService.GetOrdersByRange(entityId, fromDate, toDate).then(function (result) { return result.data; });
            };
            OrderService.prototype.GetScheduledOrders = function (entityId, fromDate) {
                return this.$orderApiService.GetScheduledOrders(entityId, fromDate).then(function (result) { return result.data; });
            };
            OrderService.prototype.GetOverdueScheduledOrders = function (entityId) {
                return this.$overdueScheduledOrderApiService.GetOverdueScheduledOrders(entityId).then(function (result) { return result.data; });
            };
            OrderService.prototype.PutVoidedScheduledOrder = function (entityId, startDate, actionItemInstanceId, currentUserFullName, actionItemId) {
                var _this = this;
                return this.$orderApiService.PutVoidedScheduledOrder(entityId, startDate, actionItemInstanceId, currentUserFullName, actionItemId).then(function () {
                    _this.OrderModified.Fire(null);
                });
            };
            OrderService.prototype.PutPurchaseUnitQuantity = function (salesOrderItemId, supplyOrderItemId, quantity) {
                var user = this.authService.GetUser();
                var promise = {};
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    promise = this.$orderApiService.PutPurchaseUnitQuantity(user.BusinessUser.MobileSettings.EntityId, salesOrderItemId, supplyOrderItemId, quantity);
                }
                return promise;
            };
            OrderService.prototype.PostCreateAutoSelectTemplate = function (entityId, vendorId, deliveryDate, daysToCover) {
                var _this = this;
                return this.$orderApiService.PostCreateAutoSelectTemplate(entityId, vendorId, deliveryDate, daysToCover).then(function (result) {
                    _this.OrderModified.Fire(null);
                    return result.data;
                });
            };
            OrderService.prototype.PostCreateSupplyOrder = function (orderId, autoReceive, invoiceNumber, receiveTime) {
                var _this = this;
                return this.$orderApiService.PostCreateSupplyOrder(orderId, autoReceive, invoiceNumber, receiveTime).then(function (result) {
                    _this.OrderModified.Fire(null);
                    return result.data;
                });
            };
            OrderService.prototype.PostGenerateSalesOrderFromScheduledOrder = function (entityId, startDate, actionItemId, actionItemInstanceId) {
                var _this = this;
                return this.$orderApiService.PostGenerateSalesOrderFromScheduledOrder(entityId, startDate, actionItemId, actionItemInstanceId).then(function (result) {
                    _this.OrderModified.Fire(null);
                    return result.data;
                });
            };
            OrderService.prototype.DeleteOrder = function (orderId) {
                var _this = this;
                return this.$orderApiService.DeleteOrder(orderId).then(function () {
                    _this.OrderModified.Fire(null);
                });
            };
            OrderService.prototype.GetStoreLocalDateTimeString = function () {
                return this.$orderApiService.GetStoreLocalDateTimeString(this.authService.GetUser().BusinessUser.MobileSettings.EntityId);
            };
            return OrderService;
        }());
        Order.$orderService = Core.NG.InventoryOrderModule.RegisterService("OrderService", OrderService, Core.Auth.$authService, Order.Api.$orderService, Order.Api.$overdueScheduledOrdersService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
