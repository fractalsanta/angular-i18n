var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReturnOrderService = (function () {
            function ReturnOrderService(returnOrderApiService, returnEntireOrderApiService) {
                this.returnOrderApiService = returnOrderApiService;
                this.returnEntireOrderApiService = returnEntireOrderApiService;
            }
            ReturnOrderService.prototype.ReturnItemsInOrder = function (order) {
                var items = _.where(order.Items, function (item) {
                    return item.Received && item.ReturnedQuantity > 0;
                });
                return this.returnOrderApiService.PostReturnItemsInOrder(order.OrderNumber, items);
            };
            ReturnOrderService.prototype.ReturnEntireOrder = function (order) {
                return this.returnEntireOrderApiService.PostReturnEntireOrder(order.OrderNumber);
            };
            return ReturnOrderService;
        }());
        Order.$returnOrderService = Core.NG.InventoryOrderModule.RegisterService("ReturnOrderSrv", ReturnOrderService, Order.Api.$returnOrderService, Order.Api.$returnEntireOrderService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
