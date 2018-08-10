declare module Inventory.Order {

    export interface IReturnOrderService {
        ReturnItemsInOrder(order: Api.Models.IReceiveOrder): ng.IHttpPromise<boolean>;
        ReturnEntireOrder(order: Api.Models.IReceiveOrder): ng.IHttpPromise<boolean>;
    }

    export var $returnOrderService: Core.NG.INamedService<IReturnOrderService>;
}  