var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        describe("TransferPickStoreController", function () {
            var promiseHelper, rootScope, scope, authServiceMock, location, transferStoreServiceMock, translationServiceMock, popupMessageService, routeParamsMock, controller, translations, entity = {
                Name: "Entity Name 1234",
                Number: "Entity Number 1234"
            }, stores = [], stores2 = [
                {},
                {},
                {},
                {}
            ];
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryTransferModule.Module().name);
                inject(function ($q, $rootScope, $location) {
                    promiseHelper = new PromiseHelper($q);
                    location = $location;
                    rootScope = $rootScope;
                    popupMessageService = new Core.Tests.PopupMessageServiceMock();
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
                transferStoreServiceMock = {
                    GetNeighboringStores: function (currentStoreId, direction) {
                        return promiseHelper.CreateHttpPromise(stores);
                    }
                };
                routeParamsMock = { Type: "request" };
            });
            it("gets initialized properly", function () {
                controller = new Transfer.TransferPickStoreController(scope, authServiceMock.Object, location, transferStoreServiceMock, translationServiceMock, popupMessageService, routeParamsMock);
                rootScope.$digest();
                expect(scope.GetStores()).toBeDefined();
                expect(scope.GetStores().length).toBe(0);
                expect(scope.IsOutbound).toBe(false);
            });
            it("receives Translations", function () {
                angular.extend(translations, {
                    AltUnit1: "Alt Unit 1",
                    AltUnit2: "Alt Unit 2",
                    AltUnit3: "Alt Unit 3",
                    BaseUnit: "Base Unit"
                });
                controller = new Transfer.TransferPickStoreController(scope, authServiceMock.Object, location, transferStoreServiceMock, translationServiceMock, popupMessageService, routeParamsMock);
                rootScope.$digest();
                expect(scope.Translations).toEqual(translations);
            });
            it("GetStores() _transferStores transferStoreService.GetNeighboringStores()", function () {
                stores = stores2;
                controller = new Transfer.TransferPickStoreController(scope, authServiceMock.Object, location, transferStoreServiceMock, translationServiceMock, popupMessageService, routeParamsMock);
                rootScope.$digest();
                expect(scope.GetStores()).toBeDefined();
                expect(scope.GetStores().length).toBe(4);
            });
            it("sets IsOutbound and the right title for request", function () {
                angular.extend(translations, {
                    CreateTransfer: "Create Transfer",
                    RequestTransfer: "Request Transfer"
                });
                routeParamsMock = { Type: "request" };
                spyOn(popupMessageService, "SetPageTitle").and.callThrough();
                controller = new Transfer.TransferPickStoreController(scope, authServiceMock.Object, location, transferStoreServiceMock, translationServiceMock, popupMessageService, routeParamsMock);
                rootScope.$digest();
                expect(scope.IsOutbound).toBe(false);
                expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.RequestTransfer);
            });
            it("sets IsOutbound and the right title for create", function () {
                angular.extend(translations, {
                    CreateTransfer: "Create Transfer",
                    RequestTransfer: "Request Transfer"
                });
                routeParamsMock = { Type: "create" };
                spyOn(popupMessageService, "SetPageTitle").and.callThrough();
                controller = new Transfer.TransferPickStoreController(scope, authServiceMock.Object, location, transferStoreServiceMock, translationServiceMock, popupMessageService, routeParamsMock);
                rootScope.$digest();
                expect(scope.IsOutbound).toBe(true);
                expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.CreateTransfer);
            });
        });
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
