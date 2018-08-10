/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../Core/TypeScript/Directives/mx-grid-header-directive.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Controllers/OpenTransfersController.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferApiService.ts" />
/// <reference path="MockTransferStoreService.ts" />

module Inventory.Transfer.Tests {
    "use strict";

    describe("OpenTransfersController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: IOpenTransfersControllerScope,
            authServiceMock: Core.Tests.AuthServiceMock,
            location: ng.ILocationService,
            translationServiceMock: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            q: ng.IQService,
            transfersServiceMock: TransferApiServiceMock,
            entityServiceMock: Core.Api.IEntityService,
            formatter: Core.IFormatterService,
            controller: OpenTransfersController,
            translations: Api.Models.IL10N,
            entity = <Core.Api.Models.IEntityModel>{
                Id: 1234,
                Name: "Entity Name 1234",
                Number: "Entity Number 1234"
            },
            transfers: Api.Models.ITransferHeader[] = [],
            transfers2: Api.Models.ITransferHeader[] = [
                <Api.Models.ITransferHeader>{
                    Id: null,
                    TransferToEntityId: null,
                    TransferFromEntityId: 1234,
                    CreateDate: null,
                    InitiatedBy: null,
                    TransferQty: null,
                    Status: null,
                    Direction: 0
                },
                <Api.Models.ITransferHeader>{
                    Id: null,
                    TransferToEntityId: null,
                    TransferFromEntityId: 1234,
                    CreateDate: null,
                    InitiatedBy: null,
                    TransferQty: null,
                    Status: null,
                    Direction: 1
                }
            ]
        ;

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService): void => {
                q = $q;
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                transfersServiceMock = new TransferApiServiceMock($q);
                location = $location;

            });

            scope = <IOpenTransfersControllerScope>rootScope.$new(false);
            authServiceMock = new Core.Tests.AuthServiceMock();
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
                    return promiseHelper.CreateHttpPromise(entity);
                },

                GetEntitiesByIds: (entityIds: number[]): ng.IHttpPromise<Core.Api.Models.IEntityModel[]> => {
                    return promiseHelper.CreateHttpPromise([entity]);
                }
            };
        });

        it("gets initialized properly", (): void => {
            transfersServiceMock.SetGetPendingTransfersFromStoreByEntityId(transfers);

            controller = new OpenTransfersController(
                scope,
                authServiceMock.Object,
                location,
                translationServiceMock,
                popupMessageService,
                q,
                transfersServiceMock.Object,
                entityServiceMock,
                formatter
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.OpenTransfers).toBeDefined();
            expect(scope.OpenTransfers.length).toBe(0);
            expect(scope.StoreDisplayNames).toBeDefined();
            expect(scope.StoreDisplayNames.length).toBe(0);
        });

        it("receives Translations", (): void => {
            transfersServiceMock.SetGetPendingTransfersFromStoreByEntityId(transfers);

            angular.extend(translations, <Api.Models.IL10N>{
                AltUnit1: "Alt Unit 1",
                AltUnit2: "Alt Unit 2",
                AltUnit3: "Alt Unit 3",
                BaseUnit: "Base Unit"
            });

            controller = new OpenTransfersController(
                scope,
                authServiceMock.Object,
                location,
                translationServiceMock,
                popupMessageService,
                q,
                transfersServiceMock.Object,
                entityServiceMock,
                formatter
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translations).toEqual(translations);
        });

        it("openTransfers.GetPendingTransfersFromStoreByEntityId() PopulateLocationDisplayNames()", (): void => {
            transfersServiceMock.SetGetPendingTransfersFromStoreByEntityId(transfers2);

            controller = new OpenTransfersController(
                scope,
                authServiceMock.Object,
                location,
                translationServiceMock,
                popupMessageService,
                q,
                transfersServiceMock.Object,
                entityServiceMock,
                formatter
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.OpenTransfers).toBeDefined();
            expect(scope.OpenTransfers.length).toBe(2);
            expect(scope.StoreDisplayNames).toBeDefined();
            expect(scope.StoreDisplayNames[entity.Id]).toBeDefined();
        });
    });
}