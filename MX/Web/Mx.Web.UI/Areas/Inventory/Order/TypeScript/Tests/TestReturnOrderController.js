var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        describe("@ts ReturnOrderController", function () {
            var promiseHelper, rootScope, scope, authServiceMock, returnOrderApiServiceMock, location, popupMessageService, modalServiceMock = {}, translationServiceMock, translations, orders;
            var createReceiveOrderHeader = function () {
                return {
                    Id: Math.random(),
                    DisplayId: Math.random(),
                    VendorName: "TestVendor",
                    DeliveryDate: moment().toISOString(),
                    Status: "Received"
                };
            };
            var createController = function () {
                return new Order.ReturnOrderController(scope, authServiceMock.Object, returnOrderApiServiceMock, location, popupMessageService, modalServiceMock, translationServiceMock, new ConstantsMock().Object);
            };
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
                inject(function ($q, $rootScope, $location) {
                    promiseHelper = new PromiseHelper($q);
                    rootScope = $rootScope;
                    location = $location;
                    popupMessageService = new Core.Tests.PopupMessageServiceMock();
                });
                scope = rootScope.$new(false);
                translations = {};
                orders = [];
                authServiceMock = new Core.Tests.AuthServiceMock();
                translationServiceMock = {
                    GetTranslations: function () {
                        return promiseHelper.CreatePromise({ InventoryOrder: translations });
                    }
                };
                returnOrderApiServiceMock = {
                    GetReceivedOrders: function (entityId, fromDate, toDate) {
                        return promiseHelper.CreateHttpPromise(orders);
                    }
                };
            });
            it("requires proper authorization to access", function () {
                authServiceMock.GrantAllPermissions(false);
                var controller = createController();
                expect(location.path()).toEqual('/Core/Forbidden');
                expect(scope.Orders).toBeUndefined();
                expect(scope.FilteredOrders).toBeUndefined();
                expect(scope.CurrentPageOrders).toBeUndefined();
                expect(scope.Model).toBeUndefined();
                expect(scope.PagingOptions).toBeUndefined();
                expect(scope.Translations).toBeUndefined();
                expect(scope.FilterLast).toBeUndefined();
                expect(scope.OpenCustomRangeDialog).toBeUndefined();
                expect(scope.RequiresPaging).toBeUndefined();
                expect(scope.ViewOrder).toBeUndefined();
                var applySearchFilterAndOrderPrivate = "ApplySearchFilterAndOrder", loadDataPrivate = "LoadData";
                expect(controller[applySearchFilterAndOrderPrivate]).toBeDefined();
                expect(controller[loadDataPrivate]).toBeDefined();
            });
            it("gets initialized properly when authorized", function () {
                var controller = createController();
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
                expect(scope.RequiresPaging).toBeDefined();
                expect(scope.ViewOrder).toBeDefined();
                var applySearchFilterAndOrderPrivate = "ApplySearchFilterAndOrder", loadDataPrivate = "LoadData";
                expect(controller[applySearchFilterAndOrderPrivate]).toBeDefined();
                expect(controller[loadDataPrivate]).toBeDefined();
            });
            it("receives Translations", function () {
                createController();
                angular.extend(translations, {
                    Pending: "PendingTest",
                    PageSummary: "PageSummaryTest"
                });
                rootScope.$digest();
                expect(scope.Translations).toEqual(translations);
            });
            it("passes correct date range to the server", function () {
                createController();
                rootScope.$digest();
                var spy = jasmine.createSpy("GetReceivedOrders() spy"), days = 14, startTime = moment(), endTime = moment();
                returnOrderApiServiceMock.GetReceivedOrders = spy;
                spy.and.callFake(function (entityId, fromDate, toDate) {
                    startTime = moment(fromDate);
                    endTime = moment(toDate);
                    return promiseHelper.CreateHttpPromise(orders);
                });
                scope.FilterLast(days);
                expect(returnOrderApiServiceMock.GetReceivedOrders).toHaveBeenCalled();
                expect(startTime.toDate() <= moment().add("d", -days).toDate()).toBeTruthy();
                expect(startTime.toDate() >= moment().add("d", -days).add("m", -1).toDate()).toBeTruthy();
                expect(endTime.toDate() <= moment().toDate()).toBeTruthy();
                expect(endTime.toDate() >= moment().add("m", -1).toDate()).toBeTruthy();
            });
            it("filters by last 14 days", function () {
                createController();
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader();
                angular.extend(translations, {
                    Last: "LastTest",
                    Days: "DaysTest"
                });
                orders.push(orderOne, orderTwo);
                rootScope.$digest();
                expect(scope.Model.DateRange).toEqual(translations.Last + " 14 " + translations.Days);
                expect(scope.Orders.length).toEqual(orders.length);
                expect(scope.Orders.length).toEqual(2);
                expect(scope.Orders[0]).toEqual(orderOne);
                expect(scope.Orders[1]).toEqual(orderTwo);
            });
            it("filters by vendor name", function () {
                createController();
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader();
                orders.push(orderOne, orderTwo);
                orderTwo.VendorName = "ExpectedVendor";
                scope.Model.FilterText = orderTwo.VendorName;
                rootScope.$digest();
                expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
                expect(scope.FilteredOrders.length).toEqual(1);
                expect(scope.FilteredOrders[0]).toEqual(orderTwo);
            });
            it("orders by order number", function () {
                createController();
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader(), orderThree = createReceiveOrderHeader();
                orderOne.Id = 20;
                orderTwo.Id = 30;
                orderThree.Id = 10;
                orders.push(orderOne, orderTwo, orderThree);
                rootScope.$digest();
                expect(scope.FilteredOrders.length).toEqual(orders.length);
                expect(scope.FilteredOrders[0]).toEqual(orderThree);
                expect(scope.FilteredOrders[1]).toEqual(orderOne);
                expect(scope.FilteredOrders[2]).toEqual(orderTwo);
            });
            it("filters by order number", function () {
                createController();
                var orderOne = createReceiveOrderHeader(), orderTwo = createReceiveOrderHeader();
                orderOne.DisplayId = 111;
                orderTwo.DisplayId = 222;
                orders.push(orderOne, orderTwo);
                scope.Model.FilterText = orderTwo.DisplayId.toString();
                rootScope.$digest();
                expect(scope.Model.FilterText).toEqual(orderTwo.DisplayId.toString());
                expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
                expect(scope.FilteredOrders.length).toEqual(1);
                expect(scope.FilteredOrders[0]).toEqual(orderTwo);
            });
            it("paginates correctly", function () {
                createController();
                var totalItems = Math.floor(scope.PagingOptions.itemsPerPage * 1.5);
                var i;
                for (i = 0; i < totalItems; i += 1) {
                    orders.push(createReceiveOrderHeader());
                }
                expect(scope.CurrentPageOrders.length).toEqual(0);
                rootScope.$digest();
                expect(scope.CurrentPageOrders.length).toEqual(scope.PagingOptions.itemsPerPage);
                scope.ChangePage(2);
                expect(scope.CurrentPageOrders.length).toEqual(totalItems - scope.PagingOptions.itemsPerPage);
            });
            it("correctly navigates to return order details", function () {
                createController();
                var order = createReceiveOrderHeader();
                scope.ViewOrder(order);
                expect(location.path()).toEqual("/Inventory/Order/Return/Details/" + order.DisplayId);
            });
        });
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
