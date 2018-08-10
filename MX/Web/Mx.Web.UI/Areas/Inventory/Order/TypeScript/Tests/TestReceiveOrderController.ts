/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Interfaces/IReceiveOrderService.d.ts" />
/// <reference path="../Interfaces/IReceiveOrderControllerScope.d.ts" />
/// <reference path="../Interfaces/ISearchOrder.d.ts" />
/// <reference path="../Interfaces/ISearchOrderService.d.ts" />
/// <reference path="../../../../Core/Tests/Mocks/AuthServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/StateServiceMock.ts" />
/// <reference path="../Controllers/ReceiveOrderController.ts" />
/// <reference path="../Services/SearchOrderService.ts" />

module Inventory.Order {
    "use strict";

    describe("@ts ReceiveOrderController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: IReceiveOrderControllerScope,
            controller: ReceiveOrderController,
            popupMessageService: Core.IPopupMessageService,
            translationServiceMock: Core.ITranslationService,
            receiveOrderApiServiceMock: Api.IReceiveOrderService,
            receiveOrderServiceMock: Order.IReceiveOrderService,
            modalServiceMock = <ng.ui.bootstrap.IModalService>{},
            translations: Api.Models.IL10N,
            orders: Api.Models.IReceiveOrderHeader[],
            stateServiceMock: ng.ui.IStateService,
            constants: Core.IConstants;

        var createReceiveOrderHeader = (isReceived: boolean = false, id?: number): Api.Models.IReceiveOrderHeader => {
            var orderId: number = id ? id : Math.random();

            return <Api.Models.IReceiveOrderHeader>{
                Id: orderId,
                DisplayId: orderId,
                VendorName: "TestVendor",
                DeliveryDate: moment().toISOString(),
                Status: (isReceived) ? "Received" : "Placed"
            };
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryOrderModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                stateServiceMock = new Core.Tests.StateServiceMock($q);
            });

            scope = <IReceiveOrderControllerScope>rootScope.$new(false);

            translations = <Api.Models.IL10N>{
                Received: "Invoiced",
                Placed: "Ordered"
            };
            orders = [];

            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{ InventoryOrder: translations });
                }
            };

            receiveOrderApiServiceMock = <Api.IReceiveOrderService>{
                GetPlacedAndReceivedOrders: (entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Api.Models.IReceiveOrderHeader[]> => {
                    return promiseHelper.CreateHttpPromise(orders);
                }
            };

            receiveOrderServiceMock = <Order.IReceiveOrderService>{
                OrderModified: new Core.Events.Event<void>(),
                GetReceiveOrder(orderId: number): ng.IHttpPromise<Order.Api.Models.IReceiveOrder> { return null; },
                FinishReceiveOrder(applyDate: Date, order: Api.Models.IReceiveOrder): ng.IPromise<boolean> { return null; },
                AdjustReceiveOrder(order: Api.Models.IReceiveOrder): ng.IPromise<boolean> { return null; },
                ChangeApplyDate(applyDate: Date, order: Api.Models.IReceiveOrder): ng.IPromise<Api.Models.IChangeApplyDateResponse> { return null; },
                PushOrderToTomorrow(order: Api.Models.IReceiveOrder): ng.IPromise<void> { return null; },
                IsOffline(): boolean { return false; },
                OrderAddItems(orderId: number, itemCodesToAdd: string[]): ng.IPromise<Order.Api.Models.IReceiveOrderDetail[]> { return null; },
                GetLocalStoreDateTimeString(): ng.IHttpPromise<string> { return null; }
            };

            constants = <Core.IConstants>{
                NumericalInputBoxPattern: "^[+]?\d*([.]\d+)?$",
                InternalDateFormat: "YYYY-MM-DD",
                InternalDateTimeFormat: "YYYY-MM-DDTHH:mm:ss",
                DateCompactFormat: "DD MMM"
            };


            controller = new ReceiveOrderController(
                scope,
                new Core.Tests.AuthServiceMock().Object,
                receiveOrderApiServiceMock,
                receiveOrderServiceMock,
                modalServiceMock,
                popupMessageService,
                translationServiceMock,
                stateServiceMock,
                constants,
                new SearchOrderService(translationServiceMock)
                );
        });

        it("gets initialized properly", (): void => {
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

            var applySearchFilterAndOrderPrivate = "ApplySearchFilterAndOrder",
                openOrdersExistsDialogPrivate = "OpenOrdersExistDialog",
                loadDataPrivate = "LoadData";

            expect(controller[applySearchFilterAndOrderPrivate]).toBeDefined();
            expect(controller[openOrdersExistsDialogPrivate]).toBeDefined();
            expect(controller[loadDataPrivate]).toBeDefined();
        });

        it("receives Translations", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                Pending: "PendingTest",
                PageSummary: "PageSummaryTest"
            });

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translations).toEqual(translations);
        });

        it("passes correct date range to the server", (): void => {
            rootScope.$digest(); // invoke the callbacks

            var spy = jasmine.createSpy("GetPlacedAndReceivedOrders() spy");
            var days = 14;
            var startTime = moment();
            var endTime = moment();

            receiveOrderApiServiceMock.GetPlacedAndReceivedOrders = spy;
            spy.and.callFake((entityId: number, fromDate: string, toDate: string): ng.IHttpPromise<Api.Models.IReceiveOrderHeader[]> => {
                startTime = moment(fromDate);
                endTime = moment(toDate);

                return promiseHelper.CreateHttpPromise(orders);
            });

            scope.FilterLast(days);

            expect(receiveOrderApiServiceMock.GetPlacedAndReceivedOrders).toHaveBeenCalled();
            expect(startTime.toDate()).toEqual(moment().add('d', -days).startOf('day').toDate());
            expect(endTime.toDate()).toEqual(moment().startOf('day').toDate());
        });

        it("filters by last 14 days", (): void => {
            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader(true);

            angular.extend(translations, <Api.Models.IL10N>{
                Last: "LastTest",
                Days: "DaysTest"
            });
            orders = [];
            orders.push(orderOne, orderTwo);

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Model.DateRange).toEqual(translations.Last + " 14 " + translations.Days);

            expect(scope.Orders.length).toEqual(orders.length);
            expect(scope.Orders.length).toEqual(2);

            expect(scope.Orders[0]).toEqual(orderOne);
            expect(scope.Orders[1]).toEqual(orderTwo);
        });

        it("filters by vendor name", (): void => {
            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader();
            orders = [];
            orders.push(orderOne, orderTwo);

            orderTwo.VendorName = "ExpectedVendor";

            scope.Model.FilterText = orderTwo.VendorName;

            rootScope.$digest(); // invoke the callbacks

            expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
            expect(scope.FilteredOrders.length).toEqual(1);
            expect(scope.FilteredOrders[0]).toEqual(orderTwo);
        });

        it("orders by status and order number", (): void => {
            var orderOne = createReceiveOrderHeader(true, 20),
                orderTwo = createReceiveOrderHeader(false, 30),
                orderThree = createReceiveOrderHeader(true, 10);

            orders = [];
            orders.push(orderOne, orderTwo, orderThree);

            rootScope.$digest(); // invoke the callbacks

            expect(scope.FilteredOrders.length).toEqual(orders.length);
            expect(scope.FilteredOrders[0]).toEqual(orderTwo);
            expect(scope.FilteredOrders[1]).toEqual(orderThree);
            expect(scope.FilteredOrders[2]).toEqual(orderOne);
        });

        it("filters by order number", (): void => {
            var orderOne = createReceiveOrderHeader(false, 111),
                orderTwo = createReceiveOrderHeader(false, 222);

            orders = [];
            orders.push(orderOne, orderTwo);

            scope.Model.FilterText = orderTwo.DisplayId.toString();

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Model.FilterText).toEqual(orderTwo.DisplayId.toString());
            expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
            expect(scope.FilteredOrders.length).toEqual(1);
            expect(scope.FilteredOrders[0]).toEqual(orderTwo);
        });

        it("filters by localized status", (): void => {
            var orderOne = createReceiveOrderHeader(true, 111),
                orderTwo = createReceiveOrderHeader(false, 222);

            orders = [];
            orders.push(orderOne, orderTwo);

            scope.Model.FilterText = "Invoiced";

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Model.FilterText).toEqual("Invoiced");
            expect(scope.FilteredOrders.length).toBeLessThan(orders.length);
            expect(scope.FilteredOrders.length).toEqual(1);
            expect(scope.FilteredOrders[0]).toEqual(orderOne);
        });

        it("paginates correctly", (): void => {
            var totalItems = scope.PagingOptions.itemsPerPage * 1.5,
                i: number;

            for (i = 0; i < totalItems; i += 1) {
                orders.push(createReceiveOrderHeader());
            }

            expect(scope.CurrentPageOrders.length).toEqual(0);

            rootScope.$digest(); // invoke the callbacks

            expect(scope.CurrentPageOrders.length).toEqual(scope.PagingOptions.itemsPerPage);

            scope.ChangePage(2);

            expect(scope.CurrentPageOrders.length).toEqual(scope.PagingOptions.itemsPerPage / 2);
        });

        it("with correct IsOrderReceived", (): void => {
            var orderOne = createReceiveOrderHeader(),
                orderTwo = createReceiveOrderHeader(true);

            expect(scope.IsOrderReceived(orderOne)).toEqual(false);
            expect(scope.IsOrderReceived(orderTwo)).toEqual(true);
        });

        it("correctly navigates to order details", (): void => {
            stateServiceMock.current.name = Core.UiRouterState.ReceiveOrderStates.ReceiveOrder;
            var order = createReceiveOrderHeader();
            scope.ViewOrder(order);
            expect(stateServiceMock.current.name).toEqual(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderDetails);
        });
    });
}