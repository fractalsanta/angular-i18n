var Inventory;
(function (Inventory) {
    (function (Transfer) {
        (function (Tests) {
            "use strict";

            describe("@ts RequestTransferController", function () {
                var promiseHelper, rootScope, scope, authServiceMock, controller, location, popupMessageService, translationServiceMock, routeParamsMock = {
                    FromLocationId: "2",
                    Type: "request"
                }, modalService, translations, transferStoreServiceMock, transfersApiServiceMock, transfersServiceMock, entityServiceMock, formatter, user = {
                    BusinessUser: {
                        MobileSettings: {
                            EntityId: 1
                        }
                    }
                }, entity = {
                    1: {
                        Name: "Entity Name 1234",
                        Number: "Entity Number 1234"
                    },
                    2: {
                        Name: "Entity Name 2",
                        Number: "Entity Number 2"
                    }
                }, displayNames = {
                    1: "Entity Number 1234 - Entity Name 1234",
                    2: "Entity Number 2 - Entity Name 2"
                }, items = [
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
                ], itemsNoCost = [
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

                beforeEach(function () {
                    module(Core.NG.InventoryTransferModule.Module().name);

                    inject(function ($q, $rootScope, $location) {
                        promiseHelper = new PromiseHelper($q);
                        rootScope = $rootScope;
                        location = $location;
                        popupMessageService = new Core.Tests.PopupMessageServiceMock();
                        modalService = new Transfer.ModalServiceMock($q);
                        transfersApiServiceMock = new Tests.TransferApiServiceMock($q).Object;
                        transfersServiceMock = new Tests.TransfersServiceMock($q);
                    });

                    scope = rootScope.$new(false);
                    authServiceMock = new Core.Tests.AuthServiceMock();
                    authServiceMock.SetGetUser(user);
                    translations = {};
                    translationServiceMock = {
                        GetTranslations: function () {
                            return promiseHelper.CreatePromise({
                                InventoryTransfer: translations
                            });
                        }
                    };
                    formatter = new Core.FormatterService();

                    entityServiceMock = {
                        Get: function (id) {
                            return promiseHelper.CreateHttpPromise(entity[id]);
                        }
                    };
                    transferStoreServiceMock = {};

                    controller = new Transfer.RequestTransferController(scope, authServiceMock.Object, routeParamsMock, translationServiceMock, modalService, location, popupMessageService, transferStoreServiceMock, transfersApiServiceMock, entityServiceMock, formatter, null, transfersServiceMock.Object);
                });

                it("gets initialized properly", function () {
                    rootScope.$digest();

                    expect(scope.Items).toEqual([]);
                    expect(scope.RequestingLocationDisplayName).toEqual(displayNames[2]);
                    expect(scope.HasTransferItem).toBe(false);
                    expect(scope.IsOutbound).toBe(false);
                });

                it("receives Translations", function () {
                    angular.extend(translations, {
                        AltUnit1: "Alt Unit 1",
                        AltUnit2: "Alt Unit 2",
                        AltUnit3: "Alt Unit 3",
                        BaseUnit: "Base Unit"
                    });

                    rootScope.$digest();

                    expect(scope.Translations).toEqual(translations);
                });

                it("AddNewItems, watch items, checkHasTransferItem", function () {
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

                it("RemoveItemAtIndex", function () {
                    scope.Items = items;

                    rootScope.$digest();

                    scope.RemoveItemAtIndex(0);

                    expect(scope.Items.length).toBe(1);
                    expect(scope.Items[0].Code).toBe('2');
                });

                it("sets IsOutbound and the right title for request", function () {
                    angular.extend(translations, {
                        CreateTransfer: "Create Transfer",
                        RequestTransfer: "Request Transfer"
                    });

                    routeParamsMock = { FromLocationId: "2", Type: "request" };

                    spyOn(popupMessageService, "SetPageTitle").and.callThrough();

                    controller = new Transfer.RequestTransferController(scope, authServiceMock.Object, routeParamsMock, translationServiceMock, modalService, location, popupMessageService, transferStoreServiceMock, transfersApiServiceMock, entityServiceMock, formatter, null, null);

                    rootScope.$digest();

                    expect(scope.IsOutbound).toBe(false);
                    expect(scope.RequestingLocationDisplayName).toBe(displayNames[2]);
                    expect(scope.SendingLocationDisplayName).toBe(displayNames[1]);
                    expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.RequestTransfer);
                });

                it("sets IsOutbound and the right title for create", function () {
                    angular.extend(translations, {
                        CreateTransfer: "Create Transfer",
                        RequestTransfer: "Request Transfer"
                    });

                    routeParamsMock = { FromLocationId: "2", Type: "create" };

                    spyOn(popupMessageService, "SetPageTitle").and.callThrough();

                    controller = new Transfer.RequestTransferController(scope, authServiceMock.Object, routeParamsMock, translationServiceMock, modalService, location, popupMessageService, transferStoreServiceMock, transfersApiServiceMock, entityServiceMock, formatter, null, null);

                    rootScope.$digest();

                    expect(scope.IsOutbound).toBe(true);
                    expect(scope.RequestingLocationDisplayName).toBe(displayNames[1]);
                    expect(scope.SendingLocationDisplayName).toBe(displayNames[2]);
                    expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.CreateTransfer);
                });

                it("outbound submit does not have or try to get no cost items", function () {
                    modalService.SetAddNewItems(items);
                    scope.AddNewItems();

                    routeParamsMock = { FromLocationId: "2", Type: "create" };

                    controller = new Transfer.RequestTransferController(scope, authServiceMock.Object, routeParamsMock, translationServiceMock, modalService, location, popupMessageService, transferStoreServiceMock, transfersApiServiceMock, entityServiceMock, formatter, null, null);

                    rootScope.$digest();

                    expect(scope.IsOutbound).toBe(true);
                    rootScope.$digest();

                    expect(scope.Items.length).toBe(items.length);
                    expect(scope.HasTransferItem).toBe(true);

                    spyOn(controller, "Submit").and.callThrough();
                    spyOn(controller, "PostTransfer").and.callFake(function () {
                        ;
                    });
                    spyOn(controller, "PostTransferAndUpdateNoCostItems").and.callFake(function () {
                        ;
                    });

                    scope.SubmitRequest();

                    expect(controller.Submit).toHaveBeenCalled();
                    expect(controller.PostTransfer).toHaveBeenCalled();
                    expect(controller.PostTransferAndUpdateNoCostItems).not.toHaveBeenCalled();
                });
                it("outbound submit gets no cost items", function () {
                    modalService.SetAddNewItems(itemsNoCost);
                    scope.AddNewItems();

                    routeParamsMock = { FromLocationId: "2", Type: "create" };

                    controller = new Transfer.RequestTransferController(scope, authServiceMock.Object, routeParamsMock, translationServiceMock, modalService, location, popupMessageService, transferStoreServiceMock, transfersApiServiceMock, entityServiceMock, formatter, null, null);

                    rootScope.$digest();

                    expect(scope.IsOutbound).toBe(true);
                    rootScope.$digest();

                    expect(scope.Items.length).toBe(itemsNoCost.length);
                    expect(scope.HasTransferItem).toBe(true);

                    spyOn(controller, "Submit").and.callThrough();
                    spyOn(controller, "PostTransfer").and.callFake(function () {
                        ;
                    });
                    spyOn(controller, "PostTransferAndUpdateNoCostItems").and.callFake(function () {
                        ;
                    });

                    scope.SubmitRequest();

                    expect(controller.Submit).toHaveBeenCalled();
                    expect(controller.PostTransfer).not.toHaveBeenCalled();
                    expect(controller.PostTransferAndUpdateNoCostItems).toHaveBeenCalled();
                });
            });
        })(Transfer.Tests || (Transfer.Tests = {}));
        var Tests = Transfer.Tests;
    })(Inventory.Transfer || (Inventory.Transfer = {}));
    var Transfer = Inventory.Transfer;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=TestRequestTransferController.js.map
