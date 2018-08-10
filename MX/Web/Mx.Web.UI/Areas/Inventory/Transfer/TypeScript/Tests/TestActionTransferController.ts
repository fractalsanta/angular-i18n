/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Controllers/ActionTransferController.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferStoreService.ts" />

module Inventory.Transfer {
    "use strict";

    describe("ActionTransferController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: IActionTransferControllerScope,
            modal: ng.ui.bootstrap.IModalServiceInstance,
            translationServiceMock: Core.ITranslationService,
            transfersServiceMock: Api.ITransferService,
            transfer: Api.Models.ITransfer,
            isApproval: boolean,
            controller: ActionTransferController,
            translations: Api.Models.IL10N,
            entity = <Core.Api.Models.IEntityModel>{
                Id: 1,
                Name: "Entity Name 1234",
                Number: "Entity Number 1234"
            }

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
            });

            scope = <IActionTransferControllerScope>rootScope.$new(false);
            translations = <Api.Models.IL10N>{};
            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{
                        InventoryTransfer: translations
                    });
                }
            };
        });

        it("gets initialized properly", (): void => {
            controller = new ActionTransferController(
                scope,
                modal,
                translationServiceMock,
                transfersServiceMock,
                transfer,
                false,
                null
               );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.ViewModel.DenyMessage).toBe("");
            expect(scope.ViewModel.IsApproval).toBeFalsy();

            controller = new ActionTransferController(
                scope,
                modal,
                translationServiceMock,
                transfersServiceMock,
                transfer,
                true,
                null
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.ViewModel.IsApproval).toBeTruthy();
        });

        it("receives Translations", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                AltUnit1: "Alt Unit 1",
                AltUnit2: "Alt Unit 2",
                AltUnit3: "Alt Unit 3",
                BaseUnit: "Base Unit"
            });

            controller = new ActionTransferController(
                scope,
                modal,
                translationServiceMock,
                transfersServiceMock,
                transfer,
                isApproval,
                null
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translations).toEqual(translations);
        });


    });
}