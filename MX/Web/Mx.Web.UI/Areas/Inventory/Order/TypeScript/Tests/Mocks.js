var ReceiveOrderMocks = (function () {
    function ReceiveOrderMocks($q) {
        var _this = this;
        this.$q = $q;
        this.TranslationService = {
            GetTranslations: function () {
                var model = {
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
                return _this._helper.CreatePromise(model);
            }
        };
        this._helper = new PromiseHelper($q);
    }
    ReceiveOrderMocks.prototype.MakeSampleOrder = function (id, status, statusDisplay, asnReceived) {
        if (status === void 0) { status = 5; }
        if (statusDisplay === void 0) { statusDisplay = "Received"; }
        if (asnReceived === void 0) { asnReceived = false; }
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
            "Categories": [{ "CategoryId": 1, "ItemsInOrder": 1, "Name": "Test Category", "TotalItems": 1 }]
        };
    };
    return ReceiveOrderMocks;
}());
;
var FinishReceiveOrderMocks = (function () {
    function FinishReceiveOrderMocks($q) {
        var _this = this;
        this.$q = $q;
        this.ModalService = {
            dismiss: angular.noop,
            close: angular.noop
        };
        this.TranslationService = {
            GetTranslations: function () {
                var model = {
                    InventoryOrder: {
                        ReceiveOrderSubmitInProgress: "TestReceiveOrderSubmitInProgressTranslation"
                    }
                };
                return _this._helper.CreatePromise(model);
            }
        };
        this.PeriodCloseService = {
            GetPeriodLockStatus: function (entityId, calendarDay) {
                var model = {
                    IsClosed: true
                };
                return _this._helper.CreateHttpPromise(model);
            }
        };
        this._helper = new PromiseHelper($q);
    }
    return FinishReceiveOrderMocks;
}());
var ChangeApplyDateMocks = (function () {
    function ChangeApplyDateMocks($q) {
        var _this = this;
        this.$q = $q;
        this.ModalService = {
            dismiss: angular.noop,
            close: angular.noop
        };
        this.TranslationService = {
            GetTranslations: function () {
                var model = {
                    InventoryOrder: {
                        ChangeApplyDateMessage: "<APPLY DATE MESSAGE>",
                        ChangeApplyDateSuccessful: "Apply date and time updated."
                    }
                };
                return _this._helper.CreatePromise(model);
            }
        };
        this.PeriodCloseService = {
            GetPeriodLockStatus: function (entityId, calendarDay) {
                var model = {
                    IsClosed: true
                };
                return _this._helper.CreateHttpPromise(model);
            }
        };
        this._helper = new PromiseHelper($q);
    }
    return ChangeApplyDateMocks;
}());
