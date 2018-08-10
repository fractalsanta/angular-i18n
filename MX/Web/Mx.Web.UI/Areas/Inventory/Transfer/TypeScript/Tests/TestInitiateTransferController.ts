/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../../../../Core/TypeScript/Controllers/ConfirmationController.ts" />
/// <reference path="../../../../Core/TypeScript/Services/ConfirmationService.ts" />
/// <reference path="../../../Order/TypeScript/Tests/Mocks.ts" />
/// <reference path="../../../TypeScript/Interfaces/IUpdateNoCostItemService.d.ts" />

/// <reference path="../Controllers/InitiateTransferController.ts" />
/// <reference path="../Interfaces/ITransfersService.d.ts" />
/// <reference path="../Services/TransfersService.ts" />

/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferApiService.ts" />
/// <reference path="MockTransfersService.ts" />


module Inventory.Transfer.Tests {
    "use strict";

    describe("@ts InitiateTransferController", (): void => {
        var periodCloseMock: Workforce.PeriodClose.Api.IPeriodCloseService;
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: IInitiateTransferControllerScope,
            authServiceMock: Core.Tests.AuthServiceMock,
            controller: InitiateTransferController,
            location: ng.ILocationService,
            popupMessageService: Core.IPopupMessageService,
            translationServiceMock: Core.ITranslationService,
            routeParamsMock = <IInitiateTransferRouteParams>{
                FromLocationId: "2",
                Type: "request"
            },
            modalService: IModalServiceMock,
            translations: Api.Models.IL10N,
            transferStoreServiceMock: Api.ITransferStoreService,
            transfersApiServiceMock: Api.ITransferService,
            transfersServiceMock: TransfersServiceMock,
            entityServiceMock: Core.Api.IEntityService,
            formatter: Core.IFormatterService,
            user = <Core.Auth.IUser>{
                BusinessUser: {
                    MobileSettings: {
                        EntityId: 1
                    }
                }
            },
            entity: any = {
                1: <Core.Api.Models.IEntityModel>{
                    Name: "Entity Name 1234",
                    Number: "Entity Number 1234"
                },
                2: <Core.Api.Models.IEntityModel>{
                    Name: "Entity Name 2",
                    Number: "Entity Number 2"
                }
            },
            displayNames: any = {
                1: "Entity Number 1234 - Entity Name 1234",
                2: "Entity Number 2 - Entity Name 2"
            },
            items = [
                <Api.Models.ITransferableItem>{
                    Code: "4567",
                    Conversion: 1,
                    Description: "Description",
                    Id: 1,
                    InventoryIndicator: "InventoryIndicator",
                    TransferUnit1: "Unit1",
                    TransferUnit2: "Unit2",
                    TransferUnit3: "Unit3",
                    TransferUnit4: "Unit4",
                    InventoryUnitCost: 3,
                    PurchaseUnit: "PurchaseUnit",
                    Suggested: false,
                    OnHandQuantity: 4,
                    TransferQty1: 5,
                    TransferQty2: 6,
                    TransferQty3: 7,
                    TransferQty4: 8,
                    VendorItemId: 9
                },
                <Api.Models.ITransferableItem > {
                    Code: "2",
                    Conversion: 2,
                    Description: "Description.2",
                    Id: 2,
                    InventoryIndicator: "InventoryIndicator.2",
                    TransferUnit1: "Unit1.2",
                    TransferUnit2: "Unit2.2",
                    TransferUnit3: "Unit3.2",
                    TransferUnit4: "Unit4.2",
                    InventoryUnitCost: 10,
                    PurchaseUnit: "PurchaseUnit.2",
                    Suggested: false,
                    OnHandQuantity: 11,
                    TransferQty1: 12,
                    TransferQty2: 13,
                    TransferQty3: 14,
                    TransferQty4: 15,
                    VendorItemId: 16
                }
            ],
            items2 = [
                <Api.Models.ITransferableItem>{
                    Code: "3",
                    Conversion: 1,
                    Description: "Description.3",
                    Id: 1,
                    InventoryIndicator: "InventoryIndicator.3",
                    TransferUnit1: "Unit1.3",
                    TransferUnit2: "Unit2.3",
                    TransferUnit3: "Unit3.3",
                    TransferUnit4: "Unit4.3",
                    InventoryUnitCost: 3,
                    PurchaseUnit: "PurchaseUnit.3",
                    Suggested: false,
                    OnHandQuantity: 4,
                    TransferQty1: 5,
                    TransferQty2: 6,
                    TransferQty3: 7,
                    TransferQty4: 8,
                    VendorItemId: 9
                },
                <Api.Models.ITransferableItem > {
                    Code: "4",
                    Conversion: 2,
                    Description: "Description.4",
                    Id: 2,
                    InventoryIndicator: "InventoryIndicator.4",
                    TransferUnit1: "Unit1.4",
                    TransferUnit2: "Unit2.4",
                    TransferUnit3: "Unit3.4",
                    TransferUnit4: "Unit4.4",
                    InventoryUnitCost: 10,
                    PurchaseUnit: "PurchaseUnit.4",
                    Suggested: false,
                    OnHandQuantity: 11,
                    TransferQty1: 12,
                    TransferQty2: 13,
                    TransferQty3: 14,
                    TransferQty4: 15,
                    VendorItemId: 16
                }
            ],
            itemsNoCost = [
                <Api.Models.ITransferableItem>{
                    Code: "3",
                    Conversion: 1,
                    Description: "Description.3",
                    Id: 1,
                    InventoryIndicator: "InventoryIndicator.3",
                    TransferUnit1: "Unit1.3",
                    TransferUnit2: "Unit2.3",
                    TransferUnit3: "Unit3.3",
                    TransferUnit4: "Unit4.3",
                    InventoryUnitCost: 0,
                    PurchaseUnit: "PurchaseUnit.3",
                    Suggested: false,
                    OnHandQuantity: 4,
                    TransferQty1: 5,
                    TransferQty2: 6,
                    TransferQty3: 7,
                    TransferQty4: 8,
                    VendorItemId: 9
                },
                <Api.Models.ITransferableItem > {
                    Code: "4",
                    Conversion: 2,
                    Description: "Description.4",
                    Id: 2,
                    InventoryIndicator: "InventoryIndicator.4",
                    TransferUnit1: "Unit1.4",
                    TransferUnit2: "Unit2.4",
                    TransferUnit3: "Unit3.4",
                    TransferUnit4: "Unit4.4",
                    InventoryUnitCost: 0,
                    PurchaseUnit: "PurchaseUnit.4",
                    Suggested: false,
                    OnHandQuantity: 11,
                    TransferQty1: 12,
                    TransferQty2: 13,
                    TransferQty3: 14,
                    TransferQty4: 15,
                    VendorItemId: 16
                }
            ];

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                location = $location;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                modalService = new ModalServiceMock($q);
                transfersApiServiceMock = new TransferApiServiceMock($q).Object;
                transfersServiceMock = new TransfersServiceMock($q);
                periodCloseMock = (new ChangeApplyDateMocks($q)).PeriodCloseService;
            });

            scope = <IInitiateTransferControllerScope>rootScope.$new(false);
            authServiceMock = new Core.Tests.AuthServiceMock();
            authServiceMock.SetGetUser(user);
            translations = <Api.Models.IL10N>{};
            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{
                        InventoryTransfer: translations
                    });
                }
            };
            formatter = new Core.FormatterService();

            entityServiceMock = <Core.Api.IEntityService>{
                Get: (id: number): ng.IHttpPromise<Core.Api.Models.IEntityModel> => {
                    return promiseHelper.CreateHttpPromise(entity[id]);
                }
            };
            transferStoreServiceMock = <Api.ITransferStoreService>{
            };

            controller = new InitiateTransferController(
                scope,
                authServiceMock.Object,
                routeParamsMock,
                translationServiceMock,
                modalService,
                location,
                popupMessageService,
                transferStoreServiceMock,
                transfersApiServiceMock,
                entityServiceMock,
                formatter,
                null,
                transfersServiceMock.Object,
                null,
                null,
                periodCloseMock,
                new ConstantsMock().Object
                );
        });

        it("gets initialized properly", (): void => {
            rootScope.$digest(); // invoke the callbacks

            expect(scope.Items).toEqual([]);
            expect(scope.RequestingLocationDisplayName).toEqual(displayNames[2]);
            expect(scope.HasTransferItem).toBe(false);
            expect(scope.IsOutbound).toBe(false);
        });

        it("receives Translations", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                AltUnit1: "Alt Unit 1",
                AltUnit2: "Alt Unit 2",
                AltUnit3: "Alt Unit 3",
                BaseUnit: "Base Unit"
            });

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translations).toEqual(translations);
        });

        it("AddNewItems, watch items, checkHasTransferItem", (): void => {
            modalService.SetAddNewItems(items);
            scope.AddNewItems();
            rootScope.$digest();

            expect(scope.Items.length).toBe(items.length);
            expect(scope.HasTransferItem).toBe(true);

            modalService.SetAddNewItems(items2);
            scope.AddNewItems();
            rootScope.$digest();

            expect(scope.Items.length).toBe(items.length + items2.length);
            expect(scope.HasTransferItem).toBe(true);
        });

        it("RemoveItemAtIndex", (): void => {
            scope.Items = items;

            rootScope.$digest();

            scope.RemoveItemAtIndex(0);

            expect(scope.Items.length).toBe(1);
            expect(scope.Items[0].Code).toBe('2');
        });


        it("sets IsOutbound and the right title for request", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                CreateTransfer: "Create Transfer",
                RequestTransfer: "Request Transfer"
            });

            routeParamsMock = <IInitiateTransferRouteParams>{ FromLocationId: "2", Type: "request" };

            spyOn(popupMessageService, "SetPageTitle").and.callThrough();

            controller = new InitiateTransferController(
                scope,
                authServiceMock.Object,
                routeParamsMock,
                translationServiceMock,
                modalService,
                location,
                popupMessageService,
                transferStoreServiceMock,
                transfersApiServiceMock,
                entityServiceMock,
                formatter,
                null,
                null,
                null,
                null,
                periodCloseMock,
                new ConstantsMock().Object
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.IsOutbound).toBe(false);
            expect(scope.RequestingLocationDisplayName).toBe(displayNames[2]);
            expect(scope.SendingLocationDisplayName).toBe(displayNames[1]);
            expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.RequestTransfer);
        });

        it("sets IsOutbound and the right title for create", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                CreateTransfer: "Create Transfer",
                RequestTransfer: "Request Transfer"
            });

            routeParamsMock = <IInitiateTransferRouteParams>{ FromLocationId: "2", Type: "create" };

            spyOn(popupMessageService, "SetPageTitle").and.callThrough();

            controller = new InitiateTransferController(
                scope,
                authServiceMock.Object,
                routeParamsMock,
                translationServiceMock,
                modalService,
                location,
                popupMessageService,
                transferStoreServiceMock,
                transfersApiServiceMock,
                entityServiceMock,
                formatter,
                null,
                null,
                null,
                null,
                periodCloseMock,
                new ConstantsMock().Object
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.IsOutbound).toBe(true);
            expect(scope.RequestingLocationDisplayName).toBe(displayNames[1]);
            expect(scope.SendingLocationDisplayName).toBe(displayNames[2]);
            expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.CreateTransfer);
        });

        it("outbound submit does not have or try to get no cost items", (): void => {
            modalService.SetAddNewItems(items);
            scope.AddNewItems();

            routeParamsMock = <IInitiateTransferRouteParams>{ FromLocationId: "2", Type: "create" };

            controller = new InitiateTransferController(
                scope,
                authServiceMock.Object,
                routeParamsMock,
                translationServiceMock,
                modalService,
                location,
                popupMessageService,
                transferStoreServiceMock,
                transfersApiServiceMock,
                entityServiceMock,
                formatter,
                null,
                null,
                null,
                null,
                periodCloseMock,
                new ConstantsMock().Object
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.IsOutbound).toBe(true);
            rootScope.$digest();

            expect(scope.Items.length).toBe(items.length);
            expect(scope.HasTransferItem).toBe(true);

            spyOn(controller, "Submit").and.callThrough();
            spyOn(controller, "PostTransfer").and.callFake(() => promiseHelper.CreateHttpPromise({}));
            spyOn(controller, "PostTransferAndUpdateNoCostItems").and.callFake(() => promiseHelper.CreateHttpPromise({}));

            scope.SubmitRequest().finally(() => {
                expect(controller.Submit).toHaveBeenCalled();
                expect(controller.PostTransfer).toHaveBeenCalled();
                expect(controller.PostTransferAndUpdateNoCostItems).not.toHaveBeenCalled();                
            });
        });
        it("outbound submit gets no cost items", (): void => {
            modalService.SetAddNewItems(itemsNoCost);
            scope.AddNewItems();

            routeParamsMock = <IInitiateTransferRouteParams>{ FromLocationId: "2", Type: "create" };

            controller = new InitiateTransferController(
                scope,
                authServiceMock.Object,
                routeParamsMock,
                translationServiceMock,
                modalService,
                location,
                popupMessageService,
                transferStoreServiceMock,
                transfersApiServiceMock,
                entityServiceMock,
                formatter,
                null,
                null,
                null,
                null,
                periodCloseMock,
                new ConstantsMock().Object
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.IsOutbound).toBe(true);
            rootScope.$digest();

            expect(scope.Items.length).toBe(itemsNoCost.length);
            expect(scope.HasTransferItem).toBe(true);

            spyOn(controller, "Submit").and.callThrough();
            spyOn(controller, "PostTransfer").and.callFake(() => promiseHelper.CreateHttpPromise({}));
            spyOn(controller, "PostTransferAndUpdateNoCostItems").and.callFake(() => promiseHelper.CreateHttpPromise({}));

            scope.SubmitRequest().finally(() => {
                expect(controller.Submit).toHaveBeenCalled();
                expect(controller.PostTransfer).not.toHaveBeenCalled();
                expect(controller.PostTransferAndUpdateNoCostItems).toHaveBeenCalled();
            });
        });

    });
}
