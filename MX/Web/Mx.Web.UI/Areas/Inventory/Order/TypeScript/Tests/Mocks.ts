/// <reference path="../Interfaces/IReceiveOrderService.d.ts" />
class ReceiveOrderMocks {

    private _helper: PromiseHelper;

    constructor(private $q: ng.IQService) {
        this._helper = new PromiseHelper($q);
    }

    public MakeSampleOrder(id: number, status: number = 5, statusDisplay: string = "Received", asnReceived: boolean = false): Inventory.Order.Api.Models.IReceiveOrder {
        return {
            Id: 10000,
            "OrderNumber": id,
            "VendorId": 11,
            "Supplier": "INGHAMS ENTERPRISES",
            "DeliveryDate": "2010-10-08T10:27:00",
            "ApplyDate": "2010-10-08T10:27:00",
            "TotalAmount": 1411.2000,
            "InvoiceNumber": "",
            "OrderStatus": status,
            "OrderStatusDisplay": statusDisplay,
            "CanBePushedToTomorrow": false,
            "HasBeenCopied": false,
            CaseQuantity: 10,
            ReceivedCaseQuantity: 0,
            TotalReceivedAmount: 0,
            ItemsInOrder: 2,
            "ReceivedShippingNotification": asnReceived,
            "Items": [
                {
                    "Id": 1482148,
                    "ItemId": 500, 
                    "ItemCode": "3116700",
                    "Description": "CHICKENS",
                    "Unit": "CRATE-10",
                    "Price": 44.3000,
                    "OrderedQuantity": 30.0,
                    "VendorShippedQuantity": 30.0,
                    "ReceivedQuantity": 30.0,
                    "ReturnedQuantity": 0.0,
                    "BackOrderedQuantity": 30.0,
                    "Received": true,
                    "IsReadyToBeReceived": true,
                    "CategoryId": 1,
                    "CategoryName": "Test 1"
                },
                {
                    "Id": 1482149,
                    "ItemId": 501, 
                    "ItemCode": "3118400",
                    "Description": "9CUT CHICKEN",
                    "Unit": "CRATE-10",
                    "Price": 41.1000,
                    "OrderedQuantity": 2.0,
                    "VendorShippedQuantity": 2.0,
                    "ReceivedQuantity": 2.0,
                    "ReturnedQuantity": 0.0,
                    "BackOrderedQuantity": 2.0,
                    "Received": true,
                    "IsReadyToBeReceived": true,
                    "CategoryId": 2,
                    "CategoryName": "Test 2"
                }
            ],
            "Categories" : [{ "CategoryId": 1, "ItemsInOrder": 1, "Name": "Test Category", "TotalItems": 1 }]
        };
    }

    public TranslationService: Core.ITranslationService = <Core.ITranslationService> {
        GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
            var model = <Core.Api.Models.ITranslations>{
                InventoryOrder: {
                    Pending: "TestPendingTranslation",
                    PageSummary: "TestPageSummaryTranslation",
                    Last: "TestLastTranslation",
                    Days: "TestDaysTranslation",
                    TheOrderHasBeenPushedToTomorrow: "TheOrderHasBeenPushedToTomorrow",
                    ChangeApplyDateSuccessful: "Apply date and time updated. New order id: {0}"
                },
                InventoryCount: {
                    Receive: "TestReceiveTranslation",
                    Order: "TestOrderTranslation"
                }
            };

            return this._helper.CreatePromise(model);
        }
    };
};

class FinishReceiveOrderMocks {

    private _helper: PromiseHelper;

    constructor(private $q: ng.IQService) {
        this._helper = new PromiseHelper($q);
    }

    public ModalService: ng.ui.bootstrap.IModalServiceInstance = <ng.ui.bootstrap.IModalServiceInstance> {
        dismiss: angular.noop,
        close: angular.noop
    };

    public TranslationService: Core.ITranslationService = <Core.ITranslationService> {
        GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
            var model = <Core.Api.Models.ITranslations>{
                InventoryOrder: {
                    ReceiveOrderSubmitInProgress: "TestReceiveOrderSubmitInProgressTranslation"
                }
            };

            return this._helper.CreatePromise(model);
        }
    };

    public PeriodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService = <Workforce.PeriodClose.Api.IPeriodCloseService> {
        GetPeriodLockStatus: (entityId: number, calendarDay: string): ng.IHttpPromise<Workforce.PeriodClose.Api.Models.IPeriodClose> => {
            var model = <Workforce.PeriodClose.Api.Models.IPeriodClose>{
                IsClosed: true                                                
            };

            return this._helper.CreateHttpPromise(model);
        }
    };
}

class ChangeApplyDateMocks {

    private _helper: PromiseHelper;

    constructor(private $q: ng.IQService) {
        this._helper = new PromiseHelper($q);
    }

    public ModalService: ng.ui.bootstrap.IModalServiceInstance = <ng.ui.bootstrap.IModalServiceInstance> {
        dismiss: angular.noop,
        close: angular.noop
    };

    public TranslationService: Core.ITranslationService = <Core.ITranslationService> {
        GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
            var model = <Core.Api.Models.ITranslations>{
                InventoryOrder: {
                    ChangeApplyDateMessage: "<APPLY DATE MESSAGE>",
                    ChangeApplyDateSuccessful: "Apply date and time updated."
                }
            };

            return this._helper.CreatePromise(model);
        }
    };

    public PeriodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService = <Workforce.PeriodClose.Api.IPeriodCloseService> {
        GetPeriodLockStatus: (entityId: number, calendarDay: string): ng.IHttpPromise<Workforce.PeriodClose.Api.Models.IPeriodClose> => {
            var model = <Workforce.PeriodClose.Api.Models.IPeriodClose>{
                IsClosed: true
            };

            return this._helper.CreateHttpPromise(model);
        }
    };
}