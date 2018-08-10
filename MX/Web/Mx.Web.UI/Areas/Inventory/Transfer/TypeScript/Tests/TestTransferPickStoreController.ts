/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Controllers/TransferPickStoreController.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferStoreService.ts" />

module Inventory.Transfer {
    "use strict";

    describe("TransferPickStoreController", (): void => {
        var promiseHelper: PromiseHelper,
            rootScope: ng.IRootScopeService,
            scope: ITransferPickStoreControllerScope,
            authServiceMock: Core.Tests.AuthServiceMock,
            location: ng.ILocationService,
            transferStoreServiceMock: Api.ITransferStoreService,
            translationServiceMock: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            routeParamsMock: ITransferPickStoreControllerRouteParams,
            controller: TransferPickStoreController,
            translations: Api.Models.IL10N,
            entity = <Core.Api.Models.IEntityModel>{
                Name: "Entity Name 1234",
                Number: "Entity Number 1234"
            },
            stores: Api.Models.IStoreItem[] = [],
            stores2: Api.Models.IStoreItem[] = [
                <Api.Models.IStoreItem>{},
                <Api.Models.IStoreItem>{},
                <Api.Models.IStoreItem>{},
                <Api.Models.IStoreItem>{}
            ]
        ;

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService): void => {
                promiseHelper = new PromiseHelper($q);
                location = $location;
                rootScope = $rootScope;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
            });

            scope = <ITransferPickStoreControllerScope>rootScope.$new(false);
            authServiceMock = new Core.Tests.AuthServiceMock();
            translations = <Api.Models.IL10N>{};
            translationServiceMock = <Core.ITranslationService>{
                GetTranslations: (): ng.IPromise<Core.Api.Models.ITranslations> => {
                    return promiseHelper.CreatePromise(<Core.Api.Models.ITranslations>{
                        InventoryTransfer: translations
                    });
                }
            };
            transferStoreServiceMock = <Api.ITransferStoreService>{
                GetNeighboringStores: (currentStoreId: number, direction: Api.Enums.TransferDirection): ng.IHttpPromise<Api.Models.IStoreItem[]> => {
                    return promiseHelper.CreateHttpPromise(<Api.Models.IStoreItem[]>stores);
                }
            };

            routeParamsMock = <ITransferPickStoreControllerRouteParams>{ Type: "request" };
        });

        it("gets initialized properly", (): void => {
            controller = new TransferPickStoreController(
                scope,
                authServiceMock.Object,
                location,
                transferStoreServiceMock,
                translationServiceMock,
                popupMessageService,
                routeParamsMock
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.GetStores()).toBeDefined();
            expect(scope.GetStores().length).toBe(0);
            expect(scope.IsOutbound).toBe(false);
        });

        it("receives Translations", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                AltUnit1: "Alt Unit 1",
                AltUnit2: "Alt Unit 2",
                AltUnit3: "Alt Unit 3",
                BaseUnit: "Base Unit"
            });

            controller = new TransferPickStoreController(
                scope,
                authServiceMock.Object,
                location,
                transferStoreServiceMock,
                translationServiceMock,
                popupMessageService,
                routeParamsMock
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.Translations).toEqual(translations);
        });

        it("GetStores() _transferStores transferStoreService.GetNeighboringStores()", (): void => {
            stores = stores2;

            controller = new TransferPickStoreController(
                scope,
                authServiceMock.Object,
                location,
                transferStoreServiceMock,
                translationServiceMock,
                popupMessageService,
                routeParamsMock
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.GetStores()).toBeDefined();
            expect(scope.GetStores().length).toBe(4);
        });

        it("sets IsOutbound and the right title for request", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                CreateTransfer: "Create Transfer",
                RequestTransfer: "Request Transfer"
            });

            routeParamsMock = <ITransferPickStoreControllerRouteParams>{ Type: "request" };

            spyOn(popupMessageService, "SetPageTitle").and.callThrough();

            controller = new TransferPickStoreController(
                scope,
                authServiceMock.Object,
                location,
                transferStoreServiceMock,
                translationServiceMock,
                popupMessageService,
                routeParamsMock
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.IsOutbound).toBe(false);
            expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.RequestTransfer);
        });

        it("sets IsOutbound and the right title for create", (): void => {
            angular.extend(translations, <Api.Models.IL10N>{
                CreateTransfer: "Create Transfer",
                RequestTransfer: "Request Transfer"
            });

            routeParamsMock = <ITransferPickStoreControllerRouteParams>{ Type: "create" };

            spyOn(popupMessageService, "SetPageTitle").and.callThrough();

            controller = new TransferPickStoreController(
                scope,
                authServiceMock.Object,
                location,
                transferStoreServiceMock,
                translationServiceMock,
                popupMessageService,
                routeParamsMock
                );

            rootScope.$digest(); // invoke the callbacks

            expect(scope.IsOutbound).toBe(true);
            expect(popupMessageService.SetPageTitle).toHaveBeenCalledWith(translations.CreateTransfer);
        });

    });
}