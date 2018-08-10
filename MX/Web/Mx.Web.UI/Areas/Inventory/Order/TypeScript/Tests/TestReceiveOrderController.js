var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        describe("@ts ReceiveOrderController", function () {
            var promiseHelper, rootScope, scope, controller, popupMessageService, translationServiceMock, receiveOrderApiServiceMock, receiveOrderServiceMock, modalServiceMock = {}, translations, orders, stateServiceMock, constants;
            var createReceiveOrderHeader = function (isReceived, id) {
                if (isReceived === void 0) { isReceived = false; }
                var orderId = id ? id : Math.random();
                return {
                    Id: orderId,
                    DisplayId: orderId,
                    VendorName: "TestVendor",
                    DeliveryDate: moment().toISOString(),
                    Status: (isReceived) ? "Received" : "Placed"
                };
            };
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
                inject(function ($q, $rootScope) {
                    promiseHelper = new PromiseHelper($q);
                    rootScope = $rootScope;
                    popupMessageService = new Core.Tests.PopupMessageServiceMock();
                    stateServiceMock = new Core.Tests.StateServiceMock($q);
                });
                scope = rootScope.$new(false);
                translations = {
                    Received: "Invoiced",
                    Placed: "Ordered"
                };
                orders = [];
                translationServiceMock = {
                    GetTranslations: function () {
                        return promiseHelper.CreatePromise({ InventoryOrder: translations });
                    }
                };
                receiveOrderApiServiceMock = {
                    GetPlacedAndReceivedOrders: function (entityId, fromDate, toDate) {
                        return promiseHelper.CreateHttpPromise(orders);
                    }
                };
                receiveOrderServiceMock = {
                    OrderModified: new Core.Events.Event(),
                    GetReceiveOrder: function (orderId) { return null; },
                    FinishReceiveOrder: function (applyDate, order) { return null; },
                    AdjustReceiveOrder: function (order) { return null; },
                    ChangeApplyDate: function (applyDate, order) { return null; },
                    PushOrderToTomorrow: function (order) { return null; },
                    IsOffline: function () { return false; },
                    OrderAddItems: function (orderId, itemCodesToAdd) { return null; },
                    GetLocalStoreDateTimeString: function () { return null; }
                };
                constants = {
                    NumericalInputBoxPattern: "^[+]?\d*([.]\d+)?$",
                    InternalDateFormat: "YYYY-MM-DD",
                    InternalDateTimeFormat: "YYYY-MM-DDTHH:mm:ss",
                    DateCompactFormat: "DD MMM"
                };
                controller = new Order.ReceiveOrderController(scope, new Core.Tests.AuthServiceMock().Object, receiveOrderApiServiceMock, receiveOrderServiceMock, modalServiceMock, popupMessageService, translationServiceMock, stateServiceMock, constants, new Order.SearchOrderService(translationServiceMock));
            });
            it("gets initialized properly", function () {
                expect(scope.Orders).toEqual([]);
                expect(scope.FilteredOrders).toEqual([]);
                expect(scope.CurrentPageOrders).toEqual([]);
                expect(scope.Model).toBeDefined();
                expect(scope.Model.DateRange).toEqual("");
                expect(scope.Model.FilterText).toEqual("");
                expect(scope.PagingOptions).toBeDefined();
                expect(scope.PagingOptions.itemsPerPage).toBeDefined();
                expect(scope.PagingOptions.numPages).toBeDefined();
                expect(scope.ChangePage).toBeDefined();
                expect(scope.Translations).toBeDefined();
                expect(scope.FilterLast).toBeDefined();
                expect(scope.OpenCustomRangeDialog).toBeDefined();
                expect(scope.IsOrderReceived).toBeDefined();
                expect(scope.RequiresPaging).toBeDefined();
                expect(scope.ViewOrder).toBeDefined();
                var applySearchFilterAndOrderPrivate = "ApplySearchFilterAndOrder", openOrdersExistsDialogPrivate = "OpenOrdersExistDialog", loadDataPrivate = "LoadData";
                expect(controller[applySearchFilterAndOrderPrivate]).toBeDefined();
                expect(controller[openOrdersExistsDialogPrivate]).toBeDefined();
                expect(controller[loadDataPrivate]).toBeDefined();
            });
            it("receives Translations", function () {
                angular.extend(translations, {
                    Pending: "PendingTest",
                    PageSummary: "PageSummaryTest"
                });
                rootScope.$digest();
                expect(scope.Translations).toEqual(translations);
            });
            it("passes correct date range to the server", function () {
                rootScope.$digest();
                var spy = jasmine.createSpy("GetPlacedAndReceivedOrders() spy");
                var days = 14;
                var startTime = moment();
                var endTime = moment();
                receiveOrderApiServiceMock.GetPlacedAndReceivedOrders = spy;
                spy.and.callFake(function (entityId, fromDate, toDate) {
                    startTime = moment(fromDate);
                    endTime = moment(toDate);
                    return promiseHelper.CreateHttpPromise(orders);
                });
                scope.FilterLast(days);
                expect(receiveOrderApiServiceMock.GetPlacedAndReceivedOrders).toHaveBeenCalled();
                expect(startTime.toDate()).toEqual(moment().add('d', -days).startOf('day').toDate());
                expect(endTime.toDate()).toEqual(moment().startOf('day').toDate());
            });
            it("filters by last 14 days", function () {
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader(true);
                angular.extend(translations, {
                    Last: "LastTest",
                    Days: "DaysTest"
                });
                orders = [];
                orders.push(orderOne, orderTwo);
                rootScope.$digest();
                expect(scope.Model.DateRange).toEqual(translations.Last + " 14 " + translations.Days);
                expect(scope.Orders.length).toEqual(orders.length);
                expect(scope.Orders.length).toEqual(2);
                expect(scope.Orders[0]).toEqual(orderOne);
                expect(scope.Orders[1]).toEqual(orderTwo);
            });
            it("filters by vendor name", function () {
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader();
                orders = [];
                orders.push(orderOne, orderTwo);
                orderTwo.VendorName = "ExpectedVendor";
                scope.Model.FilterText = orderTwo.VendorName;
                rootScope.$digest();
                expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
                expect(scope.FilteredOrders.length).toEqual(1);
                expect(scope.FilteredOrders[0]).toEqual(orderTwo);
            });
            it("orders by status and order number", function () {
                var orderOne = createReceiveOrderHeader(true, 20), orderTwo = createReceiveOrderHeader(false, 30), orderThree = createReceiveOrderHeader(true, 10);
                orders = [];
                orders.push(orderOne, orderTwo, orderThree);
                rootScope.$digest();
                expect(scope.FilteredOrders.length).toEqual(orders.length);
                expect(scope.FilteredOrders[0]).toEqual(orderTwo);
                expect(scope.FilteredOrders[1]).toEqual(orderThree);
                expect(scope.FilteredOrders[2]).toEqual(orderOne);
            });
            it("filters by order number", function () {
                var orderOne = createReceiveOrderHeader(false, 111), orderTwo = createReceiveOrderHeader(false, 222);
                orders = [];
                orders.push(orderOne, orderTwo);
                scope.Model.FilterText = orderTwo.DisplayId.toString();
                rootScope.$digest();
                expect(scope.Model.FilterText).toEqual(orderTwo.DisplayId.toString());
                expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
                expect(scope.FilteredOrders.length).toEqual(1);
                expect(scope.FilteredOrders[0]).toEqual(orderTwo);
            });
            it("filters by localized status", function () {
                var orderOne = createReceiveOrderHeader(true, 111), orderTwo = createReceiveOrderHeader(false, 222);
                orders = [];
                orders.push(orderOne, orderTwo);
                scope.Model.FilterText = "Invoiced";
                rootScope.$digest();
                expect(scope.Model.FilterText).toEqual("Invoiced");
                expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
                expect(scope.FilteredOrders.length).toEqual(1);
                expect(scope.FilteredOrders[0]).toEqual(orderOne);
            });
            it("paginates correctly", function () {
                var totalItems = scope.PagingOptions.itemsPerPage * 1.5, i;
                for (i = 0; i < totalItems; i += 1) {
                    orders.push(createReceiveOrderHeader());
                }
                expect(scope.CurrentPageOrders.length).toEqual(0);
                rootScope.$digest();
                expect(scope.CurrentPageOrders.length).toEqual(scope.PagingOptions.itemsPerPage);
                scope.ChangePage(2);
                expect(scope.CurrentPageOrders.length).toEqual(scope.PagingOptions.itemsPerPage / 2);
            });
            it("with correct IsOrderReceived", function () {
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader(true);
                expect(scope.IsOrderReceived(orderOne)).toEqual(false);
                expect(scope.IsOrderReceived(orderTwo)).toEqual(true);
            });
            it("correctly navigates to order details", function () {
                stateServiceMock.current.name = Core.UiRouterState.ReceiveOrderStates.ReceiveOrder;
                var order = createReceiveOrderHeader();
                scope.ViewOrder(order);
                expect(stateServiceMock.current.name).toEqual(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderDetails);
            });
        });
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
