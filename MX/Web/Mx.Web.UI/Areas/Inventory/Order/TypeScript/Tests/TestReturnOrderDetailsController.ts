/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../Interfaces/IReturnOrderDetailsControllerScope.d.ts" />
/// <reference path="../Interfaces/IReturnOrderDetailsControllerRouteParams.d.ts" />
/// <reference path="../Interfaces/IReceiveOrderService.d.ts" />
/// <reference path="../Interfaces/IReturnOrderService.d.ts" />
/// <reference path="../Controllers/ReturnOrderDetailsController.ts" />

module Inventory.Order {
    import ConfirmationServiceMock = Core.Tests.ConfirmationServiceMock;
    "use strict";

    describe("@ts ReturnOrderDetailsController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: IReturnOrderDetailsControllerScope,
            authServiceMock: Core.Tests.AuthServiceMock,
            returnOrderApiServiceMock: IReceiveOrderService,
            location: ng.ILocationService,
            confirmationService: Core.IConfirmationService,
            popupMessageService: Core.IPopupMessageService,
            translationServiceMock: Core.ITranslationService,
            translations: Api.Models.IL10N,
            order: Api.Models.IReceiveOrder,
            $routeParams: IReturnOrderDetailsControllerRouteParams,
            returnOrderService: IReturnOrderService,
            $timeoutService: ng.ITimeoutService;

        $routeParams = { OrderId: "10000" };

        var createReceiveOrder = (): Api.Models.IReceiveOrder => {
            return <Api.Models.IReceiveOrder>{
                OrderNumber: Math.random(),
                VendorId: Math.random(),
                Supplier: "Test Supplier",
                DeliveryDate: "10/15/2014",
                TotalAmount: Math.random(),
                InvoiceNumber: "123456789",
                OrderStatus: Math.random(),
                OrderStatusDisplay: "Received",
                Items: [],
                CanBePushedToTomorrow: false
            };
        };
        
        var createReceiveOrderDetailWith5Received = (): IReturnOrderDetail => {
            return <IReturnOrderDetail>{
                Id: Math.random(),
                ItemCode: "Test Item Code",
                Description: "Test Description",
                Unit: "Test Unit",
                Price: Math.random(),
                OrderedQuantity: Math.random(),
                ReceivedQuantity: 5,
                ReturnedQuantity: Math.random(),
                BackOrderedQuantity: Math.random(),
                Received: false,
                IsReadyToBeReceived: false,
                ToBeReturned: 0
            };
        };

        var createReceiveOrderDetailWith0Received = (): IReturnOrderDetail => {
            return <IReturnOrderDetail>{
                Id: Math.random(),
                ItemCode: "Test Item Code",
                Description: "Test Description",
                Unit: "Test Unit",
                Price: Math.random(),
                OrderedQuantity: Math.random(),
                ReceivedQuantity: 0,
                ReturnedQuantity: Math.random(),
                BackOrderedQuantity: Math.random(),
                Received: false,
                IsReadyToBeReceived: false
            };
        };

        var createController = (): ReturnOrderDetailsController => {
            return new ReturnOrderDetailsController(
                scope,
                authServiceMock.Object,
                location,
                confirmationService,
                popupMessageService,
                translationServiceMock,
                $routeParams,
                returnOrderApiServiceMock,
                returnOrderService,
                $timeoutService);
        };

        beforeEach(() => {
            angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                location = $location;
                confirmationService = new ConfirmationServiceMock($q);
            });


            scope = <IReturnOrderDetailsControllerScope>rootScope.$new(false);

            translations = <Api.Models.IL10N>{};
            order = null;

            authServiceMock = new Core.Tests.AuthServiceMock();
            popupMessageService = new Core.Tests.PopupMessageServiceMock();

            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{ InventoryOrder: translations });
                }
            };

            returnOrderApiServiceMock = <IReceiveOrderService>{
                GetReceiveOrder: (orderId: number): ng.IHttpPromise<Api.Models.IReceiveOrder> => {
                    return promiseHelper.CreateHttpPromise(order);
                }
            };
        });

        it("requires proper authorization to access", (): void => {
            authServiceMock.GrantAllPermissions(false);

            var controller = createController();

            expect(location.path()).toEqual('/Core/Forbidden');

            expect(scope.Translation).toBeUndefined();
            expect(scope.Model).toBeUndefined();
            expect(scope.ActionsEnabled).toBeUndefined();
            expect(scope.CanOrderBeReturned).toBeUndefined();
            expect(scope.ItemCanBeReturned).toBeUndefined();
            expect(scope.GoBack).toBeUndefined();
            expect(scope.ReturnSelected).toBeUndefined();
            expect(scope.ReturnAmountGreaterThanToReceivedAmount).toBeUndefined();

            var privateMethods = [
                "ConfirmReturnAll",
                "UpdateReturnOnPage",
                "ConfirmBack",
                "ConfirmSubmit"
            ];

            _.forEach(privateMethods, (privateMethod: string) => expect(controller[privateMethod]).toBeDefined());

        });


        it("gets initialized properly when authorized", (): void => {
            var controller = createController();

            expect(scope.Model).toBeDefined();
            expect(scope.Model.ReceiveOrder).toBeNull();
            expect(scope.Model.IsReadOnly).toEqual(true);
            expect(scope.Model.SearchFilter).toEqual("");
            expect(scope.Model.CanReturnOrder).toEqual(false);
            expect(scope.ActionsEnabled).toBeDefined();
            expect(scope.CanOrderBeReturned).toBeDefined();
            expect(scope.ItemCanBeReturned).toBeDefined();
            expect(scope.GoBack).toBeDefined();
            expect(scope.ReturnSelected).toBeDefined();
            expect(scope.ReturnAmountGreaterThanToReceivedAmount).toBeDefined();

            var privateMethods = [
                "ConfirmReturnAll",
                "UpdateReturnOnPage",
                "ConfirmBack",
                "ConfirmSubmit"
            ];

            _.forEach(privateMethods, (privateMethod: string) => expect(controller[privateMethod]).toBeDefined());
        });
        

        it("Order Item can be returned", () => {

            order = createReceiveOrder();
            var orderDetail = createReceiveOrderDetailWith5Received();
            order.Items.push(orderDetail);
            createController();
            rootScope.$digest();

            expect(scope.ItemCanBeReturned(scope.Model.ReceiveOrder.Items[0])).toBe(true);
        });


        it("Order Item can not be returned", () => {

            order = createReceiveOrder();
            var orderDetail = createReceiveOrderDetailWith0Received();
            order.Items.push(orderDetail);
            createController();
            rootScope.$digest();

            expect(scope.ItemCanBeReturned(scope.Model.ReceiveOrder.Items[0])).toBe(false);
        });


        it("Order can be returned", () => {

            order = createReceiveOrder();
            var orderDetail = createReceiveOrderDetailWith5Received();
            order.Items.push(orderDetail);
            createController();
            rootScope.$digest();

            expect(scope.CanOrderBeReturned()).toBe(true);
        });


        it("Order can not be returned", () => {

            order = createReceiveOrder();
            var orderDetail = createReceiveOrderDetailWith0Received();
            order.Items.push(orderDetail);
            createController();
            rootScope.$digest();

            expect(scope.CanOrderBeReturned()).toBe(false);
        });


        it("Return amount less than equal to received amount", () => {

            order = createReceiveOrder();
            var orderDetail = createReceiveOrderDetailWith5Received();
            orderDetail.ToBeReturned = 5;
            createController();

            expect(scope.ReturnAmountGreaterThanToReceivedAmount(orderDetail)).toBe(false);
        });


        it("Return amount greater than received amount", () => {

            order = createReceiveOrder();
            var orderDetail = createReceiveOrderDetailWith5Received();
            orderDetail.ToBeReturned = 6;
            createController();

            expect(scope.ReturnAmountGreaterThanToReceivedAmount(orderDetail)).toBe(true);
        });
        
    });
}