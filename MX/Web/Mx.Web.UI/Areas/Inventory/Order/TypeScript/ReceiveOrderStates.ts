module Inventory.Order {

    Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("ReceiveOrder", "Receive", "/Details/:OrderId"
        , { controller: receiveOrderContainerController, templateUrl: "Templates/ReceiveContainer.html" }
        , { controller: receiveOrderController, templateUrl: "Templates/Receive.html" }
        , { controller: receiveOrderDetailController, templateUrl: "Templates/ReceiveOrderDetails.html" }
        , "Receive", "Details"
        );

    Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("ReceiveOrderExist", "Receive/OrdersExist", "/Details/:OrderId"
        , { controller: receiveOrderContainerController, templateUrl: "Templates/ReceiveContainer.html" }
        , { controller: receiveOrderController, templateUrl: "Templates/Receive.html" }
        , { controller: receiveOrderDetailController, templateUrl: "Templates/ReceiveOrderDetails.html" }
        , "Receive", "Details"
        );
}  