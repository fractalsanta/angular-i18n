var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        describe("TransferAddItemsController", function () {
            var promiseHelper, rootScope, scope, authServiceMock, controller, log, popupMessageService, translationServiceMock, modalService, translations, transferStoreServiceMock, existingItems, fromStoreId, toStoreId, direction, items = [
                {
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
                {
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
            ], items2 = [
                {
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
                {
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
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryTransferModule.Module().name);
                inject(function ($q, $rootScope, $log) {
                    promiseHelper = new PromiseHelper($q);
                    rootScope = $rootScope;
                    log = $log;
                    popupMessageService = new Core.Tests.PopupMessageServiceMock();
                    modalService = new Transfer.ModalServiceMock($q);
                    transferStoreServiceMock = new Transfer.TransferStoreServiceMock($q);
                });
                scope = rootScope.$new(false);
                authServiceMock = new Core.Tests.AuthServiceMock();
                translations = {};
                translationServiceMock = {
                    GetTranslations: function () {
                        return promiseHelper.CreatePromise({
                            InventoryTransfer: translations
                        });
                    }
                };
                existingItems = items;
                controller = new Transfer.TransferAddItemsController(scope, log, authServiceMock.Object, null, transferStoreServiceMock.Object, translationServiceMock, existingItems, fromStoreId, toStoreId, direction);
            });
            it("gets initialized properly", function () {
                rootScope.$digest();
                expect(scope.AddSelectedItems).toBeDefined();
                expect(scope.AddSelectedItems.length).toBe(0);
            });
            it("receives Translations", function () {
                angular.extend(translations, {
                    AltUnit1: "Alt Unit 1",
                    AltUnit2: "Alt Unit 2",
                    AltUnit3: "Alt Unit 3",
                    BaseUnit: "Base Unit"
                });
                rootScope.$digest();
                expect(scope.Translation).toEqual(translations);
            });
            it("IsPresent", function () {
                expect(scope.IsPresent(items[0])).toBe(true);
                expect(scope.IsPresent(items2[0])).toBe(false);
            });
            it("IsSelected", function () {
                scope.AddSelectedItems = items2;
                expect(scope.IsSelected(items[0])).toBe(false);
                expect(scope.IsSelected(items2[0])).toBe(true);
            });
            it("AddItem add", function () {
                scope.AddItem(items2[0]);
                scope.AddItem(items2[1]);
                scope.AddItem(items2[0]);
                expect(scope.AddSelectedItems.length).toBe(1);
                expect(scope.IsSelected(items2[0])).toBe(false);
                expect(scope.IsSelected(items2[1])).toBe(true);
            });
            it("AddItem remove", function () {
                scope.AddItem(items2[0]);
                scope.AddItem(items2[1]);
                scope.AddItem(items2[0]);
                expect(scope.AddSelectedItems.length).toBe(1);
                expect(scope.IsSelected(items2[0])).toBe(false);
                expect(scope.IsSelected(items2[1])).toBe(true);
            });
            it("AddItem sort", function () {
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
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
