/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Controllers/TransferAddItemsController.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferApiService.ts" />
/// <reference path="MockTransferStoreService.ts" />

module Inventory.Transfer {
    "use strict";

    describe("TransferAddItemsController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: ITransferAddItemsControllerScope,
            authServiceMock: Core.Tests.AuthServiceMock,
            controller: TransferAddItemsController,
            log: ng.ILogService,
            popupMessageService: Core.IPopupMessageService,
            translationServiceMock: Core.ITranslationService,
            modalService: IModalServiceMock,
            translations: Api.Models.IL10N,
            transferStoreServiceMock: ITransferStoreServiceMock,
            existingItems: Inventory.Transfer.Api.Models.ITransferableItem[],
            fromStoreId: string,
            toStoreId: string,
            direction: Inventory.Transfer.Api.Enums.TransferDirection,
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
            ];

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $log: ng.ILogService): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                log = $log;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                modalService = new ModalServiceMock($q);
                transferStoreServiceMock = new TransferStoreServiceMock($q);
            });

            scope = <ITransferAddItemsControllerScope>rootScope.$new(false);
            authServiceMock = new Core.Tests.AuthServiceMock();
            translations = <Api.Models.IL10N>{};
            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{
                        InventoryTransfer: translations
                    });
                }
            };
            existingItems = items;

            controller = new TransferAddItemsController(
                scope,
                log,
                authServiceMock.Object,
                null,
                transferStoreServiceMock.Object,
                translationServiceMock,
                existingItems,
                fromStoreId,
                toStoreId,
                direction
                );
        });

        it("gets initialized properly", (): void => {
            rootScope.$digest(); // invoke the callbacks

            expect(scope.AddSelectedItems).toBeDefined();
            expect(scope.AddSelectedItems.length).toBe(0);
        });

        it("receives Translations", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                AltUnit1: "Alt Unit 1",
                AltUnit2: "Alt Unit 2",
                AltUnit3: "Alt Unit 3",
                BaseUnit: "Base Unit"
            });

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translation).toEqual(translations);
        });

        it("IsPresent", (): void => {
            expect(scope.IsPresent(items[0])).toBe(true);
            expect(scope.IsPresent(items2[0])).toBe(false);
        });

        it("IsSelected", (): void => {
            scope.AddSelectedItems = items2;

            expect(scope.IsSelected(items[0])).toBe(false);
            expect(scope.IsSelected(items2[0])).toBe(true);
        });

        it("AddItem add", (): void => {
            scope.AddItem(items2[0]);
            scope.AddItem(items2[1]);

            scope.AddItem(items2[0]);
            expect(scope.AddSelectedItems.length).toBe(1);
            expect(scope.IsSelected(items2[0])).toBe(false);
            expect(scope.IsSelected(items2[1])).toBe(true);
        });

        it("AddItem remove", (): void => {
            scope.AddItem(items2[0]);
            scope.AddItem(items2[1]);

            scope.AddItem(items2[0]);
            expect(scope.AddSelectedItems.length).toBe(1);
            expect(scope.IsSelected(items2[0])).toBe(false);
            expect(scope.IsSelected(items2[1])).toBe(true);
        });

        it("AddItem sort", (): void => {
            scope.AddItem(items2[0]);
            scope.AddItem(items2[1]);

            scope.AddItem(items2[0]);
            scope.AddItem(items2[0]);

            expect(scope.AddSelectedItems.length).toBe(2);
            expect(scope.IsSelected(items2[0])).toBe(true);
            expect(scope.IsSelected(items2[1])).toBe(true);
            expect(scope.AddSelectedItems[0].Code).toBe('3');
        });
    });
}