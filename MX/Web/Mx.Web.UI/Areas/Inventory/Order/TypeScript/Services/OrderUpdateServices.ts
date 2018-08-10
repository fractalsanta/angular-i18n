module Inventory.Order.Services {
    "use strict";

    interface IOrderUpdate {

        SupplyOrderItemId: number;
        SalesOrderItemId: number;
        Quantity: number;
    }

    class OrderUpdateService implements IOrderUpdateService {
        static OfflineDataLocalStorageName: string = "OfflineOrderItems";

        private _isOffline: boolean;
        private _running: boolean;
        private _queue: IOrderUpdate[];

        constructor(
            private signalR: Core.ISignalRService,
            private localStorage: Core.LocalStorage.ILocalStorageService,
            private orderService: Order.IOrderService,
            private popupMessageService: Core.IPopupMessageService            
            ) {

            this.SetOfflineFlag(false);
            this.RegisterSignaRListeners();

            this._queue = localStorage.Get(OrderUpdateService.OfflineDataLocalStorageName) || [];
        }

        public GetOrder(orderId: number) {
            return this.orderService.GetOrder(orderId);
        }

        public GetOrderItemHistory(transactionSalesOrderItemId: number) {
            return this.orderService.GetOrderItemHistory(transactionSalesOrderItemId);
        }

        public OrderAddItems(orderId: number, itemCodesToAdd: string[]) {
            return this.orderService.OrderAddItems(orderId, itemCodesToAdd);
        }

        public PostCreateSupplyOrder(orderId: number, autoReceive: boolean, invoiceNumber: string, receiveTime: string): ng.IPromise<Order.Api.Models.ICreateOrderResult> {
            return this.orderService.PostCreateSupplyOrder(orderId, autoReceive, invoiceNumber, receiveTime);
        }

        public PushUpdate(salesOrderItemId: number, supplyOrderItemId: number, quantity: number): void {
            var length = this._queue.length,
                newEntry: IOrderUpdate = <IOrderUpdate>{
                    SalesOrderItemId: salesOrderItemId,
                    SupplyOrderItemId: supplyOrderItemId,
                    Quantity: quantity
                },
                current: IOrderUpdate,
                i: number;

            for (i = 0; i < length; i += 1) {
                current = this._queue[i];
                if (current.SalesOrderItemId === salesOrderItemId && current.SupplyOrderItemId === supplyOrderItemId) {
                    this._queue.splice(i, 1);
                    break;
                }
            }

            this._queue.push(newEntry);

            if (this._isOffline) {
                this.popupMessageService.SetPendingTasks(this._queue.length);
            }

            this.PersistUpdatesQueue();
            this.ProcessQueue();
        }

        public IsOfflineMode(): boolean {
            return this._isOffline;
        }

        private PersistUpdatesQueue(): void {
            this.localStorage.Set(OrderUpdateService.OfflineDataLocalStorageName, this._queue);
        }

        private SetOfflineFlag(isOffline: boolean): void {
            this._isOffline = isOffline;
            this.popupMessageService.SetOfflineFlag(isOffline);

            if (isOffline) {
                this.popupMessageService.SetPendingTasks(this._queue.length);
            }
        }

        private RegisterSignaRListeners(): void {
            this.signalR.SetReconnectedListener((): void => { this.OrderSignalRHubReconnected(); });
            this.signalR.SetConnectedListener((): void => { this.OrderSignalRHubConnected(); });
            this.signalR.SetDisconnectedListener((): void => { this.OrderSignalRHubDisconnected(); });
        }

        private OrderSignalRHubReconnected(): void {
            this.SetOfflineFlag(false);
            this.ProcessQueue();
        }

        private OrderSignalRHubConnected(): void {
            this.SetOfflineFlag(false);
            this.ProcessQueue();
        }

        private OrderSignalRHubDisconnected(): void {
            this.SetOfflineFlag(true);
        }

        private ProcessQueue(): void {
            var current: IOrderUpdate;

            if (this._running || this._isOffline) {
                return;
            }

            if (this._queue.length) {
                this._running = true;
                current = this._queue[0];

                this.orderService.PutPurchaseUnitQuantity(current.SalesOrderItemId, current.SupplyOrderItemId, current.Quantity).success((): void => {
                    this._queue.shift();
                    this._running = false;
                    this.PersistUpdatesQueue();
                    this.ProcessQueue();
                }).error((data: any, status: number): void => {
                        this._running = false;

                        // If failure due to offline take no action.
                        if (status === Core.HttpStatus.ServiceUnavailable ||
                            status === Core.HttpStatus.Canceled ||
                            status === Core.HttpStatus.BadRequest) {
                            return;
                        } else {
                            // Otherwise remove the item since it was sent but failed due to other issues.
                            this._queue.shift();
                            this.PersistUpdatesQueue();
                            this.ProcessQueue();
                        }
                    });
            }
        }
    }

    $orderUpdateService = Core.NG.InventoryOrderModule.RegisterService("OrderUpdateService", OrderUpdateService,
            Core.$signalR,
            Core.LocalStorage.$localStorageSvc,
            Order.$orderService,
            Core.$popupMessageService);
}