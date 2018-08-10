var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var ConfirmationServiceMock = Core.Tests.ConfirmationServiceMock;
        "use strict";
        describe("@ts ReturnOrderDetailsController", function () {
            var promiseHelper, rootScope, scope, authServiceMock, returnOrderApiServiceMock, location, confirmationService, popupMessageService, translationServiceMock, translations, order, $routeParams, returnOrderService, $timeoutService;
            $routeParams = { OrderId: "10000" };
            var createReceiveOrder = function () {
                return {
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
            var createReceiveOrderDetailWith5Received = function () {
                return {
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
            var createReceiveOrderDetailWith0Received = function () {
                return {
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
            var createController = function () {
                return new Order.ReturnOrderDetailsController(scope, authServiceMock.Object, location, confirmationService, popupMessageService, translationServiceMock, $routeParams, returnOrderApiServiceMock, returnOrderService, $timeoutService);
            };
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
                inject(function ($q, $rootScope, $location) {
                    promiseHelper = new PromiseHelper($q);
                    rootScope = $rootScope;
                    location = $location;
                    confirmationService = new ConfirmationServiceMock($q);
                });
                scope = rootScope.$new(false);
                translations = {};
                order = null;
                authServiceMock = new Core.Tests.AuthServiceMock();
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                translationServiceMock = {
                    GetTranslations: function () {
                        return promiseHelper.CreatePromise({ InventoryOrder: translations });
                    }
                };
                returnOrderApiServiceMock = {
                    GetReceiveOrder: function (orderId) {
                        return promiseHelper.CreateHttpPromise(order);
                    }
                };
            });
            it("requires proper authorization to access", function () {
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
                _.forEach(privateMethods, function (privateMethod) { return expect(controller[privateMethod]).toBeDefined(); });
            });
            it("gets initialized properly when authorized", function () {
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
                _.forEach(privateMethods, function (privateMethod) { return expect(controller[privateMethod]).toBeDefined(); });
            });
            it("Order Item can be returned", function () {
                order = createReceiveOrder();
                var orderDetail = createReceiveOrderDetailWith5Received();
                order.Items.push(orderDetail);
                createController();
                rootScope.$digest();
                expect(scope.ItemCanBeReturned(scope.Model.ReceiveOrder.Items[0])).toBe(true);
            });
            it("Order Item can not be returned", function () {
                order = createReceiveOrder();
                var orderDetail = createReceiveOrderDetailWith0Received();
                order.Items.push(orderDetail);
                createController();
                rootScope.$digest();
                expect(scope.ItemCanBeReturned(scope.Model.ReceiveOrder.Items[0])).toBe(false);
            });
            it("Order can be returned", function () {
                order = createReceiveOrder();
                var orderDetail = createReceiveOrderDetailWith5Received();
                order.Items.push(orderDetail);
                createController();
                rootScope.$digest();
                expect(scope.CanOrderBeReturned()).toBe(true);
            });
            it("Order can not be returned", function () {
                order = createReceiveOrder();
                var orderDetail = createReceiveOrderDetailWith0Received();
                order.Items.push(orderDetail);
                createController();
                rootScope.$digest();
                expect(scope.CanOrderBeReturned()).toBe(false);
            });
            it("Return amount less than equal to received amount", function () {
                order = createReceiveOrder();
                var orderDetail = createReceiveOrderDetailWith5Received();
                orderDetail.ToBeReturned = 5;
                createController();
                expect(scope.ReturnAmountGreaterThanToReceivedAmount(orderDetail)).toBe(false);
            });
            it("Return amount greater than received amount", function () {
                order = createReceiveOrder();
                var orderDetail = createReceiveOrderDetailWith5Received();
                orderDetail.ToBeReturned = 6;
                createController();
                expect(scope.ReturnAmountGreaterThanToReceivedAmount(orderDetail)).toBe(true);
            });
        });
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
