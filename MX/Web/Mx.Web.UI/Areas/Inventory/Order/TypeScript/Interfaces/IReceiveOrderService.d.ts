declare module Inventory.Order {

    export interface IReceiveOrderService {
        OrderModified: Core.Events.IEvent<void>;
        GetReceiveOrder(orderId: number): ng.IHttpPromise<Order.Api.Models.IReceiveOrder>;
        FinishReceiveOrder(applyDate: Date, order: Api.Models.IReceiveOrder): ng.IPromise<boolean>;
        AdjustReceiveOrder(order: Api.Models.IReceiveOrder): ng.IPromise<boolean>;
        ChangeApplyDate(applyDate: Date, order: Api.Models.IReceiveOrder): ng.IPromise<Api.Models.IChangeApplyDateResponse>;
        PushOrderToTomorrow(order: Api.Models.IReceiveOrder): ng.IPromise<void>;
        IsOffline(): boolean;
        OrderAddItems(orderId: number, itemCodesToAdd: string[]): ng.IPromise<Api.Models.IReceiveOrderDetail[]>;
        GetLocalStoreDateTimeString(): ng.IHttpPromise<string>;
    }

    export var $receiveOrderService: Core.NG.INamedService<IReceiveOrderService>;
} 