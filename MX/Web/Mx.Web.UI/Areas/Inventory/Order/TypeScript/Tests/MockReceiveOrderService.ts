/// <reference path="../../../../core/tests/interfaces/imock.d.ts" />

module Inventory.Order {

    export interface IReceiveOrderServiceMock extends Core.Tests.IMock<Inventory.Order.IReceiveOrderService> {
        SetOrder(order: Inventory.Order.Api.Models.IReceiveOrder): IReceiveOrderServiceMock;
        SetOffline(offline: boolean): IReceiveOrderServiceMock;
        PushOrderToTomorrowCalls(): number;
    }

    export class ReceiveOrderServiceMock implements IReceiveOrderServiceMock{

        private _helper: PromiseHelper;
        private _orderForReceive: Inventory.Order.Api.Models.IReceiveOrder;
        private _offline: boolean = false;
        private _pushOrderToTomorrowCalls = 0;

        public GetDateString(): string {
            return "2010-10-08T10:27:00";
        }

        constructor(private $q: ng.IQService) {
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

        Object: Inventory.Order.IReceiveOrderService = {
            FinishReceiveOrder: (applyDate: Date, order: Inventory.Order.Api.Models.IReceiveOrder) => {
                return this._helper.CreatePromise<boolean>(true);
            },

            GetReceiveOrder: (orderId: number) => {
                return this._helper.CreateHttpPromise(this._orderForReceive);
            },

            IsOffline: () => {
                return this._offline;
            },

            PushOrderToTomorrow: (order: Api.Models.IReceiveOrder) => {
                this._pushOrderToTomorrowCalls++;
                return this._helper.CreatePromise<void>(null);
            },

            AdjustReceiveOrder: (order: Api.Models.IReceiveOrder) => {
                return this._helper.CreatePromise<boolean>(true);
            },

            ChangeApplyDate: (newApplyDate: Date, order: Api.Models.IReceiveOrder) => {
                return this._helper.CreatePromise<Api.Models.IChangeApplyDateResponse>({ NewOrderId: 765625, IsPeriodClosed: true });
            },

            OrderModified: <Core.Events.IEvent<void>>{},

            OrderAddItems(orderId: number, itemCodesToAdd: string[]): ng.IPromise<Order.Api.Models.IReceiveOrderDetail[]> { return null; },

            GetLocalStoreDateTimeString: (): ng.IHttpPromise<string> => { return this._helper.CreateHttpPromise(this.GetDateString()); }
        }

        SetOrder(order: Inventory.Order.Api.Models.IReceiveOrder) {
            this._orderForReceive = order;
            return this;
        }

        SetOffline(offline: boolean) {
            this._offline = offline;
            return this;
        }

        PushOrderToTomorrowCalls() {
            return this._pushOrderToTomorrowCalls;
        }

    }
}
