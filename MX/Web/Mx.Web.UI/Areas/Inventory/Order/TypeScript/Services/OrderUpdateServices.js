var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Services;
        (function (Services) {
            "use strict";
            var OrderUpdateService = (function () {
                function OrderUpdateService(signalR, localStorage, orderService, popupMessageService) {
                    this.signalR = signalR;
                    this.localStorage = localStorage;
                    this.orderService = orderService;
                    this.popupMessageService = popupMessageService;
                    this.SetOfflineFlag(false);
                    this.RegisterSignaRListeners();
                    this._queue = localStorage.Get(OrderUpdateService.OfflineDataLocalStorageName) || [];
                }
                OrderUpdateService.prototype.GetOrder = function (orderId) {
                    return this.orderService.GetOrder(orderId);
                };
                OrderUpdateService.prototype.GetOrderItemHistory = function (transactionSalesOrderItemId) {
                    return this.orderService.GetOrderItemHistory(transactionSalesOrderItemId);
                };
                OrderUpdateService.prototype.OrderAddItems = function (orderId, itemCodesToAdd) {
                    return this.orderService.OrderAddItems(orderId, itemCodesToAdd);
                };
                OrderUpdateService.prototype.PostCreateSupplyOrder = function (orderId, autoReceive, invoiceNumber, receiveTime) {
                    return this.orderService.PostCreateSupplyOrder(orderId, autoReceive, invoiceNumber, receiveTime);
                };
                OrderUpdateService.prototype.PushUpdate = function (salesOrderItemId, supplyOrderItemId, quantity) {
                    var length = this._queue.length, newEntry = {
                        SalesOrderItemId: salesOrderItemId,
                        SupplyOrderItemId: supplyOrderItemId,
                        Quantity: quantity
                    }, current, i;
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
                };
                OrderUpdateService.prototype.IsOfflineMode = function () {
                    return this._isOffline;
                };
                OrderUpdateService.prototype.PersistUpdatesQueue = function () {
                    this.localStorage.Set(OrderUpdateService.OfflineDataLocalStorageName, this._queue);
                };
                OrderUpdateService.prototype.SetOfflineFlag = function (isOffline) {
                    this._isOffline = isOffline;
                    this.popupMessageService.SetOfflineFlag(isOffline);
                    if (isOffline) {
                        this.popupMessageService.SetPendingTasks(this._queue.length);
                    }
                };
                OrderUpdateService.prototype.RegisterSignaRListeners = function () {
                    var _this = this;
                    this.signalR.SetReconnectedListener(function () { _this.OrderSignalRHubReconnected(); });
                    this.signalR.SetConnectedListener(function () { _this.OrderSignalRHubConnected(); });
                    this.signalR.SetDisconnectedListener(function () { _this.OrderSignalRHubDisconnected(); });
                };
                OrderUpdateService.prototype.OrderSignalRHubReconnected = function () {
                    this.SetOfflineFlag(false);
                    this.ProcessQueue();
                };
                OrderUpdateService.prototype.OrderSignalRHubConnected = function () {
                    this.SetOfflineFlag(false);
                    this.ProcessQueue();
                };
                OrderUpdateService.prototype.OrderSignalRHubDisconnected = function () {
                    this.SetOfflineFlag(true);
                };
                OrderUpdateService.prototype.ProcessQueue = function () {
                    var _this = this;
                    var current;
                    if (this._running || this._isOffline) {
                        return;
                    }
                    if (this._queue.length) {
                        this._running = true;
                        current = this._queue[0];
                        this.orderService.PutPurchaseUnitQuantity(current.SalesOrderItemId, current.SupplyOrderItemId, current.Quantity).success(function () {
                            _this._queue.shift();
                            _this._running = false;
                            _this.PersistUpdatesQueue();
                            _this.ProcessQueue();
                        }).error(function (data, status) {
                            _this._running = false;
                            if (status === Core.HttpStatus.ServiceUnavailable ||
                                status === Core.HttpStatus.Canceled ||
                                status === Core.HttpStatus.BadRequest) {
                                return;
                            }
                            else {
                                _this._queue.shift();
                                _this.PersistUpdatesQueue();
                                _this.ProcessQueue();
                            }
                        });
                    }
                };
                OrderUpdateService.OfflineDataLocalStorageName = "OfflineOrderItems";
                return OrderUpdateService;
            }());
            Services.$orderUpdateService = Core.NG.InventoryOrderModule.RegisterService("OrderUpdateService", OrderUpdateService, Core.$signalR, Core.LocalStorage.$localStorageSvc, Order.$orderService, Core.$popupMessageService);
        })(Services = Order.Services || (Order.Services = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
