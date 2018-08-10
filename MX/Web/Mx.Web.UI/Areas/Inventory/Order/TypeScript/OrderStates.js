var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("OrderPlace", "Place", "/:OrderId", { controller: Order.orderContainerController, templateUrl: "Templates/OrderContainer.html" }, { controller: Order.orderController, templateUrl: "Templates/Place.html" }, { controller: Order.orderDetailController, templateUrl: "Templates/OrderDetails.html" }, "Place", "Details");
        Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("OrderScheduled", "Scheduled", "/:OrderId", { controller: Order.orderContainerController, templateUrl: "Templates/OrderContainer.html" }, { controller: Order.orderController, templateUrl: "Templates/Place.html" }, { controller: Order.orderDetailController, templateUrl: "Templates/OrderDetails.html" }, "Scheduled", "Details");
        Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("OrderScheduledOverdue", "ScheduledOverdue", "/:OrderId", { controller: Order.orderContainerController, templateUrl: "Templates/OrderContainer.html" }, { controller: Order.orderController, templateUrl: "Templates/Place.html" }, { controller: Order.orderDetailController, templateUrl: "Templates/OrderDetails.html" }, "ScheduledOverdue", "Details");
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
