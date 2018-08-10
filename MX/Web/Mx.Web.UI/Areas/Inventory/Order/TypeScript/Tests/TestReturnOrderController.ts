/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Interfaces/IReturnOrderControllerScope.d.ts" />
/// <reference path="../../../../Core/Tests/Mocks/AuthServiceMock.ts" />
/// <reference path="../Controllers/ReturnOrderController.ts" />

module Inventory.Order {
    "use strict";

    describe("@ts ReturnOrderController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: IReturnOrderControllerScope,
            authServiceMock: Core.Tests.AuthServiceMock,
            returnOrderApiServiceMock: Api.IReturnOrderService,
            location: ng.ILocationService,
            popupMessageService: Core.IPopupMessageService,
            modalServiceMock = <ng.ui.bootstrap.IModalService>{},
            translationServiceMock: Core.ITranslationService,
            translations: Api.Models.IL10N,
            orders: Api.Models.IReceiveOrderHeader[];

        var createReceiveOrderHeader = (): Api.Models.IReceiveOrderHeader => {
            return <Api.Models.IReceiveOrderHeader>{
                Id: Math.random(),
                DisplayId: Math.random(),
                VendorName: "TestVendor",
                DeliveryDate: moment().toISOString(),
                Status: "Received"
            };
        };

        var createController = (): ReturnOrderController => {
            return new ReturnOrderController(
                scope,
                authServiceMock.Object,
                returnOrderApiServiceMock,
                location,
                popupMessageService,
                modalServiceMock,
                translationServiceMock,
                new ConstantsMock().Object);
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryOrderModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                location = $location;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
            });

            scope = <IReturnOrderControllerScope>rootScope.$new(false);

            translations = <Api.Models.IL10N>{};
            orders = [];

            authServiceMock = new Core.Tests.AuthServiceMock();

            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{ InventoryOrder: translations });
                }
            };

            returnOrderApiServiceMock = <Api.IReturnOrderService>{
                GetReceivedOrders: (entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Api.Models.IReceiveOrderHeader[]> => {
                    return promiseHelper.CreateHttpPromise(orders);
                }
            };
        });

        it("requires proper authorization to access", (): void => {
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

            var applySearchFilterAndOrderPrivate = "ApplySearchFilterAndOrder",
                loadDataPrivate = "LoadData";

            expect(controller[applySearchFilterAndOrderPrivate]).toBeDefined();
            expect(controller[loadDataPrivate]).toBeDefined();
        });

        it("gets initialized properly when authorized", (): void => {
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

            var applySearchFilterAndOrderPrivate = "ApplySearchFilterAndOrder",
                loadDataPrivate = "LoadData";

            expect(controller[applySearchFilterAndOrderPrivate]).toBeDefined();
            expect(controller[loadDataPrivate]).toBeDefined();
        });

        it("receives Translations", (): void => {
            createController();

            angular.extend(translations, <Api.Models.IL10N>{
                Pending: "PendingTest",
                PageSummary: "PageSummaryTest"
            });

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translations).toEqual(translations);
        });

        it("passes correct date range to the server", (): void => {
            createController();

            rootScope.$digest(); // invoke the callbacks

            var spy = jasmine.createSpy("GetReceivedOrders() spy"),
                days = 14,
                startTime = moment(),
                endTime = moment();

            returnOrderApiServiceMock.GetReceivedOrders = spy;
            spy.and.callFake((entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Api.Models.IReceiveOrderHeader[]> => {
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

        it("filters by last 14 days", (): void => {
            createController();

            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader();

            angular.extend(translations, <Api.Models.IL10N>{
                Last: "LastTest",
                Days: "DaysTest"
            });

            orders.push(orderOne, orderTwo);

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Model.DateRange).toEqual(translations.Last + " 14 " + translations.Days);

            expect(scope.Orders.length).toEqual(orders.length);
            expect(scope.Orders.length).toEqual(2);

            expect(scope.Orders[0]).toEqual(orderOne);
            expect(scope.Orders[1]).toEqual(orderTwo);
        });

        it("filters by vendor name", (): void => {
            createController();

            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader();

            orders.push(orderOne, orderTwo);

            orderTwo.VendorName = "ExpectedVendor";

            scope.Model.FilterText = orderTwo.VendorName;

            rootScope.$digest(); // invoke the callbacks

            expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
            expect(scope.FilteredOrders.length).toEqual(1);
            expect(scope.FilteredOrders[0]).toEqual(orderTwo);
        });

        it("orders by order number", (): void => {
            createController();
            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader(),
                orderThree = createReceiveOrderHeader();

            orderOne.Id = 20;
            orderTwo.Id = 30;
            orderThree.Id = 10;

            orders.push(orderOne, orderTwo, orderThree);

            rootScope.$digest(); // invoke the callbacks

            expect(scope.FilteredOrders.length).toEqual(orders.length);
            expect(scope.FilteredOrders[0]).toEqual(orderThree);
            expect(scope.FilteredOrders[1]).toEqual(orderOne);
            expect(scope.FilteredOrders[2]).toEqual(orderTwo);
        });

        it("filters by order number", (): void => {
            createController();
            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader();

            orderOne.DisplayId = 111;
            orderTwo.DisplayId = 222;

            orders.push(orderOne, orderTwo);

            scope.Model.FilterText = orderTwo.DisplayId.toString();

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Model.FilterText).toEqual(orderTwo.DisplayId.toString());
            expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
            expect(scope.FilteredOrders.length).toEqual(1);
            expect(scope.FilteredOrders[0]).toEqual(orderTwo);
        });

        it("paginates correctly", (): void => {
            createController();
            var totalItems = Math.floor(scope.PagingOptions.itemsPerPage * 1.5);
            var i: number;

            for (i = 0; i < totalItems; i += 1) {
                orders.push(createReceiveOrderHeader());
            }

            expect(scope.CurrentPageOrders.length).toEqual(0);

            rootScope.$digest(); // invoke the callbacks

            expect(scope.CurrentPageOrders.length).toEqual(scope.PagingOptions.itemsPerPage);

            scope.ChangePage(2);

            expect(scope.CurrentPageOrders.length).toEqual(totalItems - scope.PagingOptions.itemsPerPage);
        });

        it("correctly navigates to return order details", (): void => {
            createController();
            var order = createReceiveOrderHeader();

            scope.ViewOrder(order);

            expect(location.path()).toEqual("/Inventory/Order/Return/Details/" + order.DisplayId);
        });
    });
}