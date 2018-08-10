declare module Inventory.Order {

    export interface IOrderService {

        OrderModified: Core.Events.IEvent<void>;

        GetOrder(orderId: number): ng.IPromise<Order.Api.Models.IOrder>;
        GetOrderItemHistory(transactionSalesOrderItemId: number): ng.IPromise<Order.Api.Models.IOrderItemHistoryHeader[]>;
        GetOrdersByRange(entityId: number, fromDate: string, toDate: string): ng.IPromise<Order.Api.Models.IOrderHeader[]>;
        GetScheduledOrders(entityId: number, fromDate: string): ng.IPromise<Order.Api.Models.IScheduledOrderHeader[]>;
        GetOverdueScheduledOrders(entityId: number): ng.IPromise<Order.Api.Models.IScheduledOrderHeader[]>;
        PutPurchaseUnitQuantity(salesOrderItemId: number, supplyOrderItemId: number, quantity: number): ng.IHttpPromise<{}>;
        PutVoidedScheduledOrder(entityId: number, startDate: string, actionItemInstanceId: number, currentUserFullName: string, actionItemId: number): ng.IPromise<void>;
        OrderAddItems(orderId: number, itemCodesToAdd: string[]): ng.IPromise<Order.Api.Models.IOrderDetail[]>;
        PostCreateAutoSelectTemplate(entityId: number, vendorId: number, deliveryDate: string, daysToCover: number): ng.IPromise<number>;
        PostCreateSupplyOrder(orderId: number, autoReceive: boolean, invoiceNumber: string, receiveTime: string): ng.IPromise<Order.Api.Models.ICreateOrderResult>;
        PostGenerateSalesOrderFromScheduledOrder(entityId: number, startDate: string, actionItemId: number, actionItemInstanceId: number): ng.IPromise<number>;
        DeleteOrder(orderId: number): ng.IPromise<void>;
        GetStoreLocalDateTimeString(): ng.IHttpPromise<string>;
    }

    export var $orderService: Core.NG.INamedService<IOrderService>;
}  