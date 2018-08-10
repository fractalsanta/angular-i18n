var Inventory;
(function (Inventory) {
    (function (Transfer) {
        (function (Tests) {
            "use strict";

            describe("TransferOutController", function () {
                var promiseHelper, rootScope, scope, authServiceMock, location, translationServiceMock, popupMessageService, q, transfersServiceMock, entityServiceMock, formatter, controller, translations, entity = {
                    Id: 1234,
                    Name: "Entity Name 1234",
                    Number: "Entity Number 1234"
                }, transfers = [], transfers2 = [
                    {
                        TransferFromEntityId: 1234
                    },
                    {
                        TransferFromEntityId: 1234
                    }
                ];

                beforeEach(function () {
                    module(Core.NG.InventoryTransferModule.Module().name);

                    inject(function ($q, $rootScope, $location) {
                        q = $q;
                        promiseHelper = new PromiseHelper($q);
                        rootScope = $rootScope;
                        popupMessageService = new Core.Tests.PopupMessageServiceMock();
                        transfersServiceMock = new Tests.TransferApiServiceMock($q);
                        location = $location;
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
                    formatter = new Core.FormatterService();

                    entityServiceMock = {
                        Get: function (id) {
                            return promiseHelper.CreateHttpPromise(entity);
                        },
                        GetEntitiesByIds: function (entityIds) {
                            return promiseHelper.CreateHttpPromise([entity]);
                        }
                    };
                });

                it("gets initialized properly", function () {
                    transfersServiceMock.SetGetPendingTransfersFromStoreByEntityId(transfers);

                    controller = new Transfer.TransferOutController(scope, authServiceMock.Object, location, translationServiceMock, popupMessageService, q, transfersServiceMock.Object, entityServiceMock, formatter);

                    rootScope.$digest();

                    expect(scope.GridDefinitions).toBeDefined();
                    expect(scope.PendingTransfers).toBeDefined();
                    expect(scope.PendingTransfers.length).toBe(0);
                    expect(scope.StoreDisplayNames).toBeDefined();
                    expect(scope.StoreDisplayNames.length).toBe(0);
                });

                it("receives Translations", function () {
                    transfersServiceMock.SetGetPendingTransfersFromStoreByEntityId(transfers);

                    angular.extend(translations, {
                        AltUnit1: "Alt Unit 1",
                        AltUnit2: "Alt Unit 2",
                        AltUnit3: "Alt Unit 3",
                        BaseUnit: "Base Unit"
                    });

                    controller = new Transfer.TransferOutController(scope, authServiceMock.Object, location, translationServiceMock, popupMessageService, q, transfersServiceMock.Object, entityServiceMock, formatter);

                    rootScope.$digest();

                    expect(scope.Translations).toEqual(translations);
                });

                it("pendingTransfers.GetPendingTransfersFromStoreByEntityId() PopulateLocationDisplayNames()", function () {
                    transfersServiceMock.SetGetPendingTransfersFromStoreByEntityId(transfers2);

                    controller = new Transfer.TransferOutController(scope, authServiceMock.Object, location, translationServiceMock, popupMessageService, q, transfersServiceMock.Object, entityServiceMock, formatter);

                    rootScope.$digest();

                    expect(scope.PendingTransfers).toBeDefined();
                    expect(scope.PendingTransfers.length).toBe(2);
                    expect(scope.StoreDisplayNames).toBeDefined();
                    expect(scope.StoreDisplayNames[entity.Id]).toBeDefined();
                });
            });
        })(Transfer.Tests || (Transfer.Tests = {}));
        var Tests = Transfer.Tests;
    })(Inventory.Transfer || (Inventory.Transfer = {}));
    var Transfer = Inventory.Transfer;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=TestTransferOutController.js.map
