var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("ReceiveOrder", "Receive", "/Details/:OrderId", { controller: Order.receiveOrderContainerController, templateUrl: "Templates/ReceiveContainer.html" }, { controller: Order.receiveOrderController, templateUrl: "Templates/Receive.html" }, { controller: Order.receiveOrderDetailController, templateUrl: "Templates/ReceiveOrderDetails.html" }, "Receive", "Details");
        Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("ReceiveOrderExist", "Receive/OrdersExist", "/Details/:OrderId", { controller: Order.receiveOrderContainerController, templateUrl: "Templates/ReceiveContainer.html" }, { controller: Order.receiveOrderController, templateUrl: "Templates/Receive.html" }, { controller: Order.receiveOrderDetailController, templateUrl: "Templates/ReceiveOrderDetails.html" }, "Receive", "Details");
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
