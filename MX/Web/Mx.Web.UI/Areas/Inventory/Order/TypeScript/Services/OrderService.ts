module Inventory.Order {

    class OrderService implements IOrderService {

        public OrderModified: Core.Events.IEvent<void>;

        constructor(
            private authService: Core.Auth.IAuthService,
            private $orderApiService: Api.IOrderService,
            private $overdueScheduledOrderApiService: Api.IOverdueScheduledOrdersService
        ) {
            this.Initialise();
        }

        Initialise() {
            this.OrderModified = new Core.Events.Event<void>();
        }


        OrderAddItems(orderId: number, itemCodesToAdd: string[]) {
            var user = this.authService.GetUser();
            var promise = <ng.IPromise<Order.Api.Models.IOrderDetail[]>> {};
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                promise = this.$orderApiService.PostAddItems(user.BusinessUser.MobileSettings.EntityId, orderId, itemCodesToAdd).then(result => {
                    return result.data;
                });
            }
            return promise;
        }

        GetOrder(orderId: number): ng.IPromise<Order.Api.Models.IOrder> {
            var user = this.authService.GetUser();
            var promise = <ng.IPromise<Order.Api.Models.IOrder>> {};
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null)
            {
                promise = this.$orderApiService.GetOrder(user.BusinessUser.MobileSettings.EntityId, orderId).then(result => {
                    return result.data;
                });
            }
            return promise;
        }

        GetOrderItemHistory(transactionSalesOrderItemId: number): ng.IPromise<Order.Api.Models.IOrderItemHistoryHeader[]> {
            return this.$orderApiService.GetOrderItemHistory(transactionSalesOrderItemId).then(result => result.data);
        }

        GetOrdersByRange(entityId: number, fromDate: string, toDate: string): ng.IPromise<Order.Api.Models.IOrderHeader[]> {
            return this.$orderApiService.GetOrdersByRange(entityId, fromDate, toDate).then(result => result.data);
        }

        GetScheduledOrders(entityId: number, fromDate: string): ng.IPromise<Order.Api.Models.IScheduledOrderHeader[]> {
            return this.$orderApiService.GetScheduledOrders(entityId, fromDate).then(result => result.data);
        }

        GetOverdueScheduledOrders(entityId: number): ng.IPromise<Order.Api.Models.IScheduledOrderHeader[]> {
            return this.$overdueScheduledOrderApiService.GetOverdueScheduledOrders(entityId).then(result => result.data);
        }

        PutVoidedScheduledOrder(entityId: number, startDate: string, actionItemInstanceId: number, currentUserFullName: string, actionItemId: number): ng.IPromise<void> {
            return this.$orderApiService.PutVoidedScheduledOrder(entityId, startDate, actionItemInstanceId, currentUserFullName, actionItemId).then(() => {
                this.OrderModified.Fire(null);
            });
        }

        PutPurchaseUnitQuantity(salesOrderItemId: number, supplyOrderItemId: number, quantity: number): ng.IHttpPromise<{}> {
            var user = this.authService.GetUser();
            var promise = <ng.IHttpPromise<{}>> {};
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                promise = this.$orderApiService.PutPurchaseUnitQuantity(user.BusinessUser.MobileSettings.EntityId, salesOrderItemId, supplyOrderItemId, quantity);   
            }
            return promise;
        }

        PostCreateAutoSelectTemplate(entityId: number, vendorId: number, deliveryDate: string, daysToCover: number): ng.IPromise<number> {
            return this.$orderApiService.PostCreateAutoSelectTemplate(entityId, vendorId, deliveryDate, daysToCover).then(result => {
                this.OrderModified.Fire(null);
                return result.data;
            });
        }

        PostCreateSupplyOrder(orderId: number, autoReceive: boolean, invoiceNumber: string, receiveTime: string): ng.IPromise<Order.Api.Models.ICreateOrderResult> {
            return this.$orderApiService.PostCreateSupplyOrder(orderId, autoReceive, invoiceNumber, receiveTime).then(result => {
                this.OrderModified.Fire(null);
                return result.data;
            });
        }

        PostGenerateSalesOrderFromScheduledOrder(entityId: number, startDate: string, actionItemId: number, actionItemInstanceId: number): ng.IPromise<number> {
            return this.$orderApiService.PostGenerateSalesOrderFromScheduledOrder(entityId, startDate, actionItemId, actionItemInstanceId).then(result => {
                this.OrderModified.Fire(null);
                return result.data;
            });
        }

        DeleteOrder(orderId: number): ng.IPromise<void> {
            return this.$orderApiService.DeleteOrder(orderId).then(() => {
                this.OrderModified.Fire(null);
            });
        }
        GetStoreLocalDateTimeString(): ng.IHttpPromise<string> {
            return this.$orderApiService.GetStoreLocalDateTimeString(this.authService.GetUser().BusinessUser.MobileSettings.EntityId);
        }
    }

    $orderService = Core.NG.InventoryOrderModule.RegisterService("OrderService", OrderService,
        Core.Auth.$authService,
        Api.$orderService,
        Api.$overdueScheduledOrdersService
    );
}