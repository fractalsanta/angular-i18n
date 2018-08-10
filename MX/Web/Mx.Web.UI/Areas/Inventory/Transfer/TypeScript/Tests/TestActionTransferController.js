var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        describe("ActionTransferController", function () {
            var promiseHelper, rootScope, scope, modal, translationServiceMock, transfersServiceMock, transfer, isApproval, controller, translations, entity = {
                Id: 1,
                Name: "Entity Name 1234",
                Number: "Entity Number 1234"
            };
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryTransferModule.Module().name);
                inject(function ($q, $rootScope) {
                    promiseHelper = new PromiseHelper($q);
                    rootScope = $rootScope;
                });
                scope = rootScope.$new(false);
                translations = {};
                translationServiceMock = {
                    GetTranslations: function () {
                        return promiseHelper.CreatePromise({
                            InventoryTransfer: translations
                        });
                    }
                };
            });
            it("gets initialized properly", function () {
                controller = new Transfer.ActionTransferController(scope, modal, translationServiceMock, transfersServiceMock, transfer, false, null);
                rootScope.$digest();
                expect(scope.ViewModel.DenyMessage).toBe("");
                expect(scope.ViewModel.IsApproval).toBeFalsy();
                controller = new Transfer.ActionTransferController(scope, modal, translationServiceMock, transfersServiceMock, transfer, true, null);
                rootScope.$digest();
                expect(scope.ViewModel.IsApproval).toBeTruthy();
            });
            it("receives Translations", function () {
                angular.extend(translations, {
                    AltUnit1: "Alt Unit 1",
                    AltUnit2: "Alt Unit 2",
                    AltUnit3: "Alt Unit 3",
                    BaseUnit: "Base Unit"
                });
                controller = new Transfer.ActionTransferController(scope, modal, translationServiceMock, transfersServiceMock, transfer, isApproval, null);
                rootScope.$digest();
                expect(scope.Translations).toEqual(translations);
            });
        });
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
