declare module Inventory.Order.Services {

    export interface IOrderUpdateService {
        PushUpdate(salesOrderItemId: number, supplyOrderItemId: number, quantity: number): void;
        GetOrder(orderId: number): ng.IPromise<Order.Api.Models.IOrder>;
        GetOrderItemHistory(transactionSalesOrderItemId: number): ng.IPromise<Order.Api.Models.IOrderItemHistoryHeader[]>;
        PostCreateSupplyOrder(orderId: number, autoReceive: boolean, invoiceNumber: string, receiveTime: string): ng.IPromise<Order.Api.Models.ICreateOrderResult>;
        OrderAddItems(orderId: number, itemCodesToAdd: string[]): ng.IPromise<Order.Api.Models.IOrderDetail[]>;
        IsOfflineMode(): boolean;
    }

    export var $orderUpdateService: Core.NG.INamedService<IOrderUpdateService>;
}