var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var ReceiveOrderServiceMock = (function () {
            function ReceiveOrderServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this._offline = false;
                this._pushOrderToTomorrowCalls = 0;
                this.Object = {
                    FinishReceiveOrder: function (applyDate, order) {
                        return _this._helper.CreatePromise(true);
                    },
                    GetReceiveOrder: function (orderId) {
                        return _this._helper.CreateHttpPromise(_this._orderForReceive);
                    },
                    IsOffline: function () {
                        return _this._offline;
                    },
                    PushOrderToTomorrow: function (order) {
                        _this._pushOrderToTomorrowCalls++;
                        return _this._helper.CreatePromise(null);
                    },
                    AdjustReceiveOrder: function (order) {
                        return _this._helper.CreatePromise(true);
                    },
                    ChangeApplyDate: function (newApplyDate, order) {
                        return _this._helper.CreatePromise({ NewOrderId: 765625, IsPeriodClosed: true });
                    },
                    OrderModified: {},
                    OrderAddItems: function (orderId, itemCodesToAdd) { return null; },
                    GetLocalStoreDateTimeString: function () { return _this._helper.CreateHttpPromise(_this.GetDateString()); }
                };
                this._helper = new PromiseHelper($q);
                this._orderForReceive = {
                    Id: 10000,
                    "OrderNumber": 10000,
                    "VendorId": 11,
                    "Supplier": "INGHAMS ENTERPRISES",
                    "DeliveryDate": this.GetDateString(),
                    "ApplyDate": this.GetDateString(),
                    "TotalAmount": 1411.2000,
                    "InvoiceNumber": "",
                    "OrderStatus": 4,
                    "CanBePushedToTomorrow": false,
                    "OrderStatusDisplay": "Placed",
                    "HasBeenCopied": false,
                    CaseQuantity: 10,
                    ReceivedCaseQuantity: 0,
                    TotalReceivedAmount: 0,
                    "ItemsInOrder": 2,
                    "ReceivedShippingNotification": false,
                    "Items": [{ "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                        { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 2.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 1" }],
                    "Categories": [{ "CategoryId": 1, "ItemsInOrder": 1, "Name": "Test Category", "TotalItems": 1 }]
                };
            }
            ReceiveOrderServiceMock.prototype.GetDateString = function () {
                return "2010-10-08T10:27:00";
            };
            ReceiveOrderServiceMock.prototype.SetOrder = function (order) {
                this._orderForReceive = order;
                return this;
            };
            ReceiveOrderServiceMock.prototype.SetOffline = function (offline) {
                this._offline = offline;
                return this;
            };
            ReceiveOrderServiceMock.prototype.PushOrderToTomorrowCalls = function () {
                return this._pushOrderToTomorrowCalls;
            };
            return ReceiveOrderServiceMock;
        }());
        Order.ReceiveOrderServiceMock = ReceiveOrderServiceMock;
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
