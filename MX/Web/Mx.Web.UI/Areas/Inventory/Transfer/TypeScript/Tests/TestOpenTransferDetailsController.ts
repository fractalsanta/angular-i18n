/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../../../TypeScript/Interfaces/IUpdateNoCostItemService.d.ts" />
/// <reference path="../../../Order/TypeScript/Tests/Mocks.ts" />

/// <reference path="../Interfaces/ITransfersService.d.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransfersService.ts" />
/// <reference path="../Interfaces/IOpenTransferDetailsControllerScope.d.ts" />
/// <reference path="../Controllers/OpenTransferDetailsController.ts" />

module Inventory.Transfer.Tests {
    "use strict";

    describe("OpenTransferDetailsController", (): void => {
        var periodCloseMock: Workforce.PeriodClose.Api.IPeriodCloseService;
        var promiseHelper: PromiseHelper,
            controllerScope: IOpenTransferDetailsControllerScope,
            locationService: ng.ILocationService,
            popupMessageService: Core.IPopupMessageService,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            authServiceMock: Core.Tests.AuthServiceMock,
            routeParams: IOpenTransferDetailsParams,
            modalServiceMock: IModalServiceMock,
            translations: Api.Models.IL10N,
            transfersServiceMock: TransfersServiceMock,
            entityServiceMock: Core.Api.IEntityService,
            formatter: Core.IFormatterService;

        var createTestController = (): OpenTransferDetailsController => {
            return new OpenTransferDetailsController(
                controllerScope,
                routeParams,
                authServiceMock.Object,
                translationServiceMock.Object,
                modalServiceMock,
                locationService,
                transfersServiceMock.Object,
                popupMessageService,
                entityServiceMock,
                formatter,
                authServiceMock.Object,
                periodCloseMock,
                new ConstantsMock().Object
                );
        };

        var getTransferDetail = (): Api.Models.ITransferDetail => {
            return <Api.Models.ITransferDetail>{
                Id: 1,
                ItemId: 1,
                Quantity: 20,
                UnitCost: 22,
                OnHand: 23,
                TransferQty1: 25,
                TransferQty2: 26,
                TransferQty3: 27,
                TransferQty4: 28,
                TransferCost: 29
            };
        };
        
        var entityId = 1234;
        var entityName = "Entity Name " + entityId.toString();

        var entity = <Core.Api.Models.IEntityModel>{
            Id: entityId,
            Name: entityName,
            Number: "Entity Number"
        };

        var transfer = <Api.Models.ITransfer>{
            Id: 101,
            RequestingEntityId: entityId,
            SendingEntityId: 1,
            Details: []
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService): void => {
                promiseHelper = new PromiseHelper($q);
                controllerScope = <IOpenTransferDetailsControllerScope>$rootScope.$new(false);
                locationService = $location;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                modalServiceMock = new ModalServiceMock($q);
                transfersServiceMock = new TransfersServiceMock($q);
                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                authServiceMock = new Core.Tests.AuthServiceMock();
                periodCloseMock = (new ChangeApplyDateMocks($q)).PeriodCloseService;
            });
            
            translations = <Api.Models.IL10N>{};
            formatter = new Core.FormatterService();
            routeParams = <IOpenTransferDetailsParams>{
                TransferRequestId: "2"
            };
            
            entityServiceMock = <Core.Api.IEntityService>{
                Get: (id: number): ng.IHttpPromise<Core.Api.Models.IEntityModel> => {
                    return promiseHelper.CreateHttpPromise(entity);
                },

                GetEntitiesByIds: (entityIds: number[]): ng.IHttpPromise<Core.Api.Models.IEntityModel[]> => {
                    return promiseHelper.CreateHttpPromise([entity]);
                }
            };

            transfersServiceMock.Object.SetCurrentTransfer(transfer);
        });

        it("defines all scope methods and non-promise models upon initialization", (): void => {

            createTestController();
            expect(controllerScope.Approve).toBeDefined();
            expect(controllerScope.Deny).toBeDefined();
            expect(controllerScope.GetRequestTotal).toBeDefined();
            expect(controllerScope.OnRowSelect).toBeDefined();
            expect(controllerScope.Return).toBeDefined();
            expect(controllerScope.UpdateDetails).toBeDefined();

            expect(controllerScope.IsReadOnly).toBeDefined();
        });

        it("sets the path when Return() is called", (): void => {
            createTestController();
            controllerScope.Return();
            expect(locationService.path()).toBe("/Inventory/Transfer/OpenTransfers");
        });

        it("leaves page if the transferId is not a number", (): void => {
            routeParams.TransferRequestId = "NaN";
            createTestController();
            expect(locationService.path()).toBe("/Inventory/Transfer/OpenTransfers");
        });

        it("receives Translations", (): void => {
            var testTranslations = <Core.Api.Models.ITranslations>{
                InventoryTransfer: {
                    AltUnit1: "Alt Unit 1",
                    AltUnit2: "Alt Unit 2",
                    AltUnit3: "Alt Unit 3",
                    BaseUnit: "Base Unit"
                }
            };

            translationServiceMock.InjectTranslations(testTranslations);

            createTestController();
            controllerScope.$digest();
            expect(controllerScope.Translations).toEqual(testTranslations.InventoryTransfer);
        });

        it("sets the value of Transfer to the return value of transfer service method GetByTransferId", (): void => {

            transfersServiceMock.Object.SetCurrentTransfer(transfer);
            createTestController();
            controllerScope.$digest();
            expect(controllerScope.Transfer).toBeDefined();
            expect(controllerScope.Transfer).toBe(transfer);
        });

        it("sets the value of RequestingLocationDisplayName to the name of the requesting entity", (): void => {
            createTestController();
            controllerScope.$digest();
            expect(controllerScope.RequestingLocationDisplayName).toEqual("Entity Number - Entity Name 1234");
        });

        it("returns the total cost of all transfer items when GetRequestTotal is called", (): void => {

            transfer.Details = [
                <Api.Models.ITransferDetail>{
                    TransferCost: 9
                }, <Api.Models.ITransferDetail>{
                    TransferCost: 29
                }
            ];

            var totalTransferCost = transfer.Details[0].TransferCost + transfer.Details[1].TransferCost;

            transfersServiceMock.Object.SetCurrentTransfer(transfer);
            
            createTestController();
            controllerScope.$digest();
            expect(controllerScope.Transfer).toBeDefined();
            expect(controllerScope.GetRequestTotal()).toBe(totalTransferCost);
        });

        it("returns true when HasQtyValuesChangedCompareToPreviousValues is called and quantities changed", (): void => {
            var currentTransferDetail = getTransferDetail();

            var previousTransferDetail = getTransferDetail();

            controllerScope.PreviousTransfer = < Api.Models.ITransfer >{
                Details: [previousTransferDetail]
            };

            var controller = createTestController();

            currentTransferDetail.TransferQty1 = previousTransferDetail.TransferQty1 + 1;
            var resultWhenQty1Changes = controller.HasQtyValuesChangedCompareToPreviousValues( currentTransferDetail);
            currentTransferDetail.TransferQty1 = previousTransferDetail.TransferQty1;

            currentTransferDetail.TransferQty2 = previousTransferDetail.TransferQty2 + 1;
            var resultWhenQty2Changes = controller.HasQtyValuesChangedCompareToPreviousValues(currentTransferDetail);
            currentTransferDetail.TransferQty2 = previousTransferDetail.TransferQty2;

            currentTransferDetail.TransferQty3 = previousTransferDetail.TransferQty3 + 1;
            var resultWhenQty3Changes = controller.HasQtyValuesChangedCompareToPreviousValues(currentTransferDetail);
            currentTransferDetail.TransferQty3 = previousTransferDetail.TransferQty3;

            currentTransferDetail.TransferQty4 = previousTransferDetail.TransferQty4 + 1;
            var resultWhenQty4Changes = controller.HasQtyValuesChangedCompareToPreviousValues(currentTransferDetail);
            currentTransferDetail.TransferQty4 = previousTransferDetail.TransferQty4;
            
            expect(resultWhenQty1Changes).toBeTruthy();
            expect(resultWhenQty2Changes).toBeTruthy();
            expect(resultWhenQty3Changes).toBeTruthy();
            expect(resultWhenQty4Changes).toBeTruthy();
        });

        it("returns false when HasQtyValuesChangedCompareToPreviousValues is called and quantities have not changed", (): void => {
            var previousTransferDetail = getTransferDetail();

            controllerScope.PreviousTransfer = < Api.Models.ITransfer >{
                Details: [previousTransferDetail]
            };

            var controller = createTestController();

            var result = controller.HasQtyValuesChangedCompareToPreviousValues(previousTransferDetail);

            expect(result).toBeFalsy();
        });

        it("only calls PutTransferDetailWithUpdatedCostAndQuantity from UpdateDetails when quantities have changed", (): void => {
            var transferDetail = getTransferDetail();

            var transferDetailNew = getTransferDetail();
            transferDetailNew.TransferQty1 = transferDetailNew.TransferQty1 + 1;
            transfer.Details = [transferDetail];
            transfersServiceMock.Object.SetCurrentTransfer(transfer);

            var serviceMethodSpy = spyOn(transfersServiceMock.Object, "PutTransferDetailWithUpdatedCostAndQuantity");

            serviceMethodSpy.and.callFake((transferIn: Api.Models.ITransfer, transferDetailIn: Api.Models.ITransferDetail): ng.IHttpPromise<Api.Models.ITransferDetail> => {
                return promiseHelper.CreateHttpPromise<Api.Models.ITransferDetail>(transferDetail);
            });

            createTestController();

            controllerScope.PreviousTransfer = < Api.Models.ITransfer >{
                Id: 2,
                Details: [transferDetail]
            };

            controllerScope.UpdateDetails(transferDetail);
            controllerScope.$digest();
            expect(serviceMethodSpy).not.toHaveBeenCalled();
            controllerScope.UpdateDetails(transferDetailNew);
            controllerScope.$digest();
            expect(serviceMethodSpy).toHaveBeenCalled();
        });

        it("updates the quantity when UpdateDetails gets called and quantities have changed", (): void => {
            var previousTransferDetail = getTransferDetail();

            var requestTransferDetail = getTransferDetail();

            requestTransferDetail.TransferQty3 = previousTransferDetail.TransferQty3 + 1;
            requestTransferDetail.Quantity = previousTransferDetail.Quantity + 1;
            requestTransferDetail.OnHand = previousTransferDetail.OnHand;

            transfersServiceMock.SetPutTransferDetailWithUpdatedCostAndQuantity(requestTransferDetail);
            createTestController();
            controllerScope.$digest();

            controllerScope.UpdateDetails(requestTransferDetail);
            controllerScope.PreviousTransfer = < Api.Models.ITransfer >{
                Id: 2,
                Details: [previousTransferDetail]
            };

            controllerScope.$digest();

            expect(requestTransferDetail.OnHand).toEqual(previousTransferDetail.OnHand - 1);
        });

        it("updates PreviousTransfer after calling UpdateDetails() with new quantities", (): void => {
            var requestTransferDetail = getTransferDetail();
            
            var resultTransferDetail = getTransferDetail();
            resultTransferDetail.TransferQty1 = resultTransferDetail.TransferQty1 + 1;
            transfer.Details = [requestTransferDetail];
            transfersServiceMock.Object.SetCurrentTransfer(transfer);
            transfersServiceMock.SetPutTransferDetailWithUpdatedCostAndQuantity(resultTransferDetail);

            createTestController();

            controllerScope.PreviousTransfer = < Api.Models.ITransfer >{
                Id: 2,
                Details: [resultTransferDetail]
            };

            expect(controllerScope.PreviousTransfer.Details[0]).not.toEqual(requestTransferDetail);

            controllerScope.UpdateDetails(requestTransferDetail);
            controllerScope.$digest();

            expect(controllerScope.PreviousTransfer.Details[0]).toEqual(requestTransferDetail);
        });
    });
}