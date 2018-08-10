module Inventory.Order {

    Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("OrderPlace", "Place", "/:OrderId"
        , { controller: orderContainerController, templateUrl: "Templates/OrderContainer.html" }
        , { controller: orderController, templateUrl: "Templates/Place.html" }
        , { controller: orderDetailController, templateUrl: "Templates/OrderDetails.html" }
        , "Place", "Details"
    );

    Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("OrderScheduled", "Scheduled", "/:OrderId"
        , { controller: orderContainerController, templateUrl: "Templates/OrderContainer.html" }
        , { controller: orderController, templateUrl: "Templates/Place.html" }
        , { controller: orderDetailController, templateUrl: "Templates/OrderDetails.html" }
        , "Scheduled", "Details"
    );

    Core.NG.InventoryOrderModule.RegisterMasterPublicDetailPage("OrderScheduledOverdue", "ScheduledOverdue", "/:OrderId"
        , { controller: orderContainerController, templateUrl: "Templates/OrderContainer.html" }
        , { controller: orderController, templateUrl: "Templates/Place.html" }
        , { controller: orderDetailController, templateUrl: "Templates/OrderDetails.html" }
        , "ScheduledOverdue", "Details"
    );
}