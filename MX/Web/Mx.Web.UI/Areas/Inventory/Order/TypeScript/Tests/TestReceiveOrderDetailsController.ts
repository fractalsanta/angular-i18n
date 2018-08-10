/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/Constants.ts" />
/// <reference path="../Controllers/ReceiveOrderDetailsController.ts" />
/// <reference path="../Interfaces/IReceiveOrderService.d.ts" />
/// <reference path="../Interfaces/IReceiveOrderDetailsControllerScope.d.ts" />
/// <reference path="../Interfaces/IReceiveOrderDetailsControllerRouteParams.d.ts" />
/// <reference path="../Interfaces/IFinishReceiveOrder.d.ts" />
/// <reference path="../../../TypeScript/Models/IAddItemModel.d.ts" />
/// <reference path="../../../TypeScript/Models/IAddItem.d.ts" />
/// <reference path="../../TypeScript/Models/IAddItemOrdering.d.ts" />
/// <reference path="Mocks.ts" />
/// <reference path="MockReceiveOrderService.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="../../../../Core/Tests/Mocks/StateServiceMock.ts" />

module Inventory.Order {

    describe("@ts ReceiveOrderDetailsController", () => {
        var orderMocks: ReceiveOrderMocks;
        var q: ng.IQService;
        var rootScope: ng.IRootScopeService;
        var scope: IReceiveOrderDetailsControllerScope;
        var confirm: Core.IConfirmationService;
        var receiveOrderServiceMock: IReceiveOrderServiceMock;
        var modalService: IModalServiceMock;
        var popupMessageService: Core.IPopupMessageService;
        var stateServiceMock: ng.ui.IStateService;
        var rootParameter: IReceiveOrderDetailsControllerRouteParams;
        var constants;
        var periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService;

        beforeEach(() => {
            angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
                q = $q;
                orderMocks = new ReceiveOrderMocks($q);
                rootScope = $rootScope;
                receiveOrderServiceMock = new ReceiveOrderServiceMock($q);
                modalService = new ModalServiceMock($q);
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                stateServiceMock = new Core.Tests.StateServiceMock($q);
                confirm = new Core.Tests.ConfirmationServiceMock($q);
            });

            scope = <IReceiveOrderDetailsControllerScope>rootScope.$new(false);
            rootParameter = { OrderId: "10000" };
            constants = <Core.IConstants>{
                NumericalInputBoxPattern: "^[+]?\d*([.]\d+)?$",
                InternalDateFormat: "YYYY-MM-DD",
                InternalDateTimeFormat: "YYYY-MM-DDTHH:mm:ss",
                DateCompactFormat: "DD MMM"
            };
        });

        var createController = (): ReceiveOrderDetailsController => {
            return new ReceiveOrderDetailsController(
                scope,
                new Core.Tests.AuthServiceMock().Object,
                rootParameter,
                orderMocks.TranslationService,
                receiveOrderServiceMock.Object,
                modalService,
                confirm,
                popupMessageService,
                stateServiceMock,
                constants,
                periodCloseService
            );
        };

        it("gets initialized properly", () => {

            var order = orderMocks.MakeSampleOrder(500);

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();
            expect(scope.Model).toBeDefined();

            rootScope.$digest();
        
            expect(scope.Model.ReceiveOrder).toBeDefined();
            expect(scope.Model.ReceiveOrder.Items.length).toBeGreaterThan(0);
            expect(scope.Translation).toBeDefined();
            expect(scope.Model.ReceiveOrder.Items.length).toBe(2);
        });

        it("Order #500 (ReadOnly) readonly detection works properly", () => {

            var order = orderMocks.MakeSampleOrder(500);

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();

            rootScope.$digest();

            expect(scope.Model.ReceiveOrder.OrderNumber).toBe(500);
            expect(scope.Model.IsReadOnly).toBe(true);
        });

        it("Order #600 (ReadOnly but there are items to be received) readonly detection works properly", () => {

            var order = orderMocks.MakeSampleOrder(600);
            order.Items[1].Received = false;

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();

            rootScope.$digest();

            expect(scope.Model.ReceiveOrder.OrderNumber).toBe(600);
            expect(scope.Model.IsReadOnly).toBe(false);

        });

        it("Order #700 (order / items to be received) readonly detection works properly", () => {

            var order = orderMocks.MakeSampleOrder(700);
            order.Items[0].Received = false;
            order.Items[1].Received = false;

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();

            rootScope.$digest();

            expect(scope.Model.ReceiveOrder.OrderNumber).toBe(700);
            expect(scope.Model.IsReadOnly).toBe(false);

        });

        it("AreThereAnyItemsToReceive flag functionality - triggers disable / enable on Action button", () => {

            var order = orderMocks.MakeSampleOrder(700, 4, "Placed");
            order.Items[0].Received = false;
            order.Items[1].Received = false;

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();

            rootScope.$digest();
            expect(scope.AreThereAnyItemsToReceive()).toBe(true);
        });

        it("Select All Items - for receiving items - works as expected", () => {

            var order = orderMocks.MakeSampleOrder(700, 4, "Placed");
            order.Items = [
                { "Id": 1482148, "ItemId": 501, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 502, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 2.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" },
                { "Id": 1422148, "ItemId": 503, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 3, "CategoryName": "Test 3" }
            ];

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();

            rootScope.$digest();

            expect(scope.Model.ReceiveOrder.OrderNumber).toBe(700);
            expect(scope.Model.ReceiveOrder.Items.length).toBe(3);

            expect(scope.Model.IsSelectAllItems).toBe(false);
            scope.SelectAllItems();
            expect(scope.Model.IsSelectAllItems).toBe(true);

            var itemsToBeReceived = _.where(scope.Model.ReceiveOrder.Items, item => item.IsReadyToBeReceived);
            expect(itemsToBeReceived.length).toBeGreaterThan(0);
            expect(itemsToBeReceived.length).toBe(2);

            scope.SelectAllItems();
            expect(scope.Model.IsSelectAllItems).toBe(false);
            itemsToBeReceived = _.where(scope.Model.ReceiveOrder.Items, item => item.IsReadyToBeReceived);
            expect(itemsToBeReceived.length).toBe(0);
        });

        it("finishes correctly", () => {

            var order = orderMocks.MakeSampleOrder(700, 4, "Placed");
            order.Items = [
                { "Id": 1482148, "ItemId": 501, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 502, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 2.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" },
                { "Id": 1422148, "ItemId": 503, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": true, "IsReadyToBeReceived": false , "CategoryId": 3, "CategoryName": "Test 3" }
            ];

            receiveOrderServiceMock.SetOrder(order);

            var controller = createController();

            rootScope.$digest();
            scope.SelectAllItems();
            stateServiceMock.current.name = Core.UiRouterState.ReceiveOrderStates.ReceiveOrderDetails;

            var applyDate = new Date("2014-06-10");
            
            var finishOrderData: IFinishReceiveOrder = {
                InvoiceNumber: "111-222",
                ApplyDate: applyDate
            };
            modalService.SetFinishReceiveOrder(finishOrderData);
            scope.FinishNow();
            rootScope.$digest();

            expect(scope.Model.ReceiveOrder.InvoiceNumber).toBe(finishOrderData.InvoiceNumber);
        });

        it("should disable action button when offline", () => {
            var order = orderMocks.MakeSampleOrder(700);
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116701", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": true, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 2.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" },
                { "Id": 1422148, "ItemId": 502, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 3, "CategoryName": "Test 3" }
            ];
            receiveOrderServiceMock
                .SetOrder(order)
                .SetOffline(true);

            var controller = createController();

            rootScope.$digest();
            expect(scope.Model.ReceiveOrder).toBeDefined();
            expect(scope.AreThereAnyItemsToReceive()).toBeTruthy();
            expect(scope.ActionsEnabled()).toBeFalsy();
        });

        it("should not have the Push option when order does not have it", () => {
            var order = orderMocks.MakeSampleOrder(700);
            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();
            expect(scope.Model.CanBePushedToTomorrow).toBeFalsy();
        });

        it("should have the Push option when order does have it", () => {
            var order = orderMocks.MakeSampleOrder(700);
            order.CanBePushedToTomorrow = true;
            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();
            expect(scope.Model.CanBePushedToTomorrow).toBeTruthy();
        });

        it("pushes the order to tomorrow when invoked", () => {
            var order = orderMocks.MakeSampleOrder(700);
            order.CanBePushedToTomorrow = true;
            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();
            expect(scope.Model.ReceiveOrder).toBeDefined();

            expect(receiveOrderServiceMock.PushOrderToTomorrowCalls()).toBe(0);
            scope.PushToTomorrow();
            rootScope.$digest();
            expect(receiveOrderServiceMock.PushOrderToTomorrowCalls()).toBe(1);
        });

        it("changes the apply date correctly", () => {

            var order = orderMocks.MakeSampleOrder(700, 4, "Received");
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" },
                { "Id": 1422148, "ItemId": 502, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 3, "CategoryName": "Test 3" }
            ];

            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();
            scope.SelectAllItems();

            var applyDate = new Date("2014-10");

            modalService.SetChangeApplyDate(applyDate);
            scope.ChangeApplyDate();
            rootScope.$digest();

            expect(scope.IsItemReadOnly(order.Items[0])).toBeTruthy();
            expect(scope.IsItemReadOnly(order.Items[2])).toBeFalsy();

            expect(scope.ItemCheckBoxDisable(order.Items[0])).toBeTruthy();
            expect(scope.ItemCheckBoxDisable(order.Items[1])).toBeTruthy();
            expect(scope.ItemCheckBoxDisable(order.Items[2])).toBeFalsy();

            expect(scope.ShowReceiveTextBox(order.Items[2])).toBeTruthy();

        });

        it("ensure that HasASN returns True when ASN is received", () => {
            var order = orderMocks.MakeSampleOrder(800, 8, "Shipped", true);
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" },
                { "Id": 1422148, "ItemId": 502, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 3, "CategoryName": "Test 3" }
            ];

            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();
            scope.SelectAllItems();

            expect(scope.HasASN()).toBeTruthy();

        });

        it("ensure that HasASN returns False when ASN is not received", () => {
            var order = orderMocks.MakeSampleOrder(800, 4, "Placed", false);
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 2.0, "ReceivedQuantity": 2.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" },
                { "Id": 1422148, "ItemId": 502, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 30.0, "ReceivedQuantity": 30.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 3, "CategoryName": "Test 3" }
            ];

            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();
            scope.SelectAllItems();

            expect(scope.HasASN()).toBeFalsy();

        });

        it("ensure that ReceivedQuantity reflects Shipped Quantity when ASN is received", () => {
            var order = orderMocks.MakeSampleOrder(800, 8, "Shipped", true);
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 40.0, "ReceivedQuantity": 0.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 5.0, "ReceivedQuantity": 3.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" }
            ];

            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();


            expect(order.Items[0].ReceivedQuantity).toEqual(order.Items[0].VendorShippedQuantity);
            expect(order.Items[0].ReceivedQuantity).not.toEqual(order.Items[0].OrderedQuantity);


            expect(order.Items[1].ReceivedQuantity).not.toEqual(order.Items[1].VendorShippedQuantity);
            expect(order.Items[1].ReceivedQuantity).not.toEqual(order.Items[1].OrderedQuantity);


        });

        it("ensure that ReceivedQuantity reflects Ordered Quantity when ASN is not received", () => {
            var order = orderMocks.MakeSampleOrder(800, 4, "Placed", false);
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 40.0, "ReceivedQuantity": 0.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 5.0, "ReceivedQuantity": 3.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" }
            ];

            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();


            expect(order.Items[0].ReceivedQuantity).not.toEqual(order.Items[0].VendorShippedQuantity);
            expect(order.Items[0].ReceivedQuantity).toEqual(order.Items[0].OrderedQuantity);


            expect(order.Items[1].ReceivedQuantity).not.toEqual(order.Items[1].VendorShippedQuantity);
            expect(order.Items[1].ReceivedQuantity).not.toEqual(order.Items[1].OrderedQuantity);


        });

        it("ensure that Category Id and Category Name are received", () => {
            var order = orderMocks.MakeSampleOrder(900, 4, "Placed", false);
            order.Items = [
                { "Id": 1482148, "ItemId": 500, "ItemCode": "3116700", "Description": "CHICKENS", "Unit": "CRATE-10", "Price": 44.3000, "OrderedQuantity": 30.0, "VendorShippedQuantity": 40.0, "ReceivedQuantity": 0.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 30.0, "Received": false, "IsReadyToBeReceived": false, "CategoryId": 1, "CategoryName": "Test 1" },
                { "Id": 1482149, "ItemId": 501, "ItemCode": "3118400", "Description": "9CUT CHICKEN", "Unit": "CRATE-10", "Price": 41.1000, "OrderedQuantity": 2.0, "VendorShippedQuantity": 5.0, "ReceivedQuantity": 3.0, "ReturnedQuantity": 0.0, "BackOrderedQuantity": 0.0, "Received": true, "IsReadyToBeReceived": false, "CategoryId": 2, "CategoryName": "Test 2" }
            ];

            receiveOrderServiceMock.SetOrder(order);
            var controller = createController();
            rootScope.$digest();


            expect(order.Items[0].CategoryId).toEqual(1);
            expect(order.Items[0].CategoryName).toEqual("Test 1");


            expect(order.Items[1].CategoryId).toEqual(2);
            expect(order.Items[1].CategoryName).toEqual("Test 2");


        });

    });
}