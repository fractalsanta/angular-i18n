var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var parent = new Core.NG.StateNode("OrderHistory", null, "Templates/OrderHistoryContainer.html", Order.orderHistoryContainerController, null, true);
        var main = new Core.NG.StateNode("History", "History", "Templates/OrderHistory.html", Order.orderHistoryController);
        var placedOrderDetails = new Core.NG.StateNode("PlacedOrderDetails", "Cancelled/:OrderId", null, null);
        placedOrderDetails.AddView("Details" + "@" + "OrderHistory", "Templates/OrderDetails.html", Order.orderDetailController);
        var receivedOrderDetails = new Core.NG.StateNode("ReceivedOrderDetails", "Received/:OrderId", null, null);
        receivedOrderDetails.AddView("Details" + "@" + "OrderHistory", "Templates/ReceiveOrderDetails.html", Order.receiveOrderDetailController);
        main.AddChild(placedOrderDetails, receivedOrderDetails);
        parent.AddChild(main);
        Core.NG.InventoryOrderModule.RegisterStateTree(parent);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
