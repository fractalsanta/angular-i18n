module Inventory.Order {
    "use strict";

    class ReturnOrderService implements IReturnOrderService {
        constructor(
            private returnOrderApiService: Api.IReturnOrderService,
            private returnEntireOrderApiService: Api.IReturnEntireOrderService
            ) { }

        public ReturnItemsInOrder(order: Api.Models.IReceiveOrder): ng.IHttpPromise<boolean> {
            var items = _.where(order.Items, (item: Api.Models.IReceiveOrderDetail): boolean => {
                return item.Received && item.ReturnedQuantity > 0;
            });

            return this.returnOrderApiService.PostReturnItemsInOrder(order.OrderNumber, items);
        }

        public ReturnEntireOrder(order: Api.Models.IReceiveOrder): ng.IHttpPromise<boolean> {

            return this.returnEntireOrderApiService.PostReturnEntireOrder(order.OrderNumber);
        }
    }

    $returnOrderService = Core.NG.InventoryOrderModule.RegisterService("ReturnOrderSrv", ReturnOrderService
        , Api.$returnOrderService
        , Api.$returnEntireOrderService
        );
}