/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Controllers/TransferHistoryDetailsController.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferHistoryService.ts" />

module Inventory.Transfer.Tests {
    "use strict";

    describe("TransferHistoryDetailsController", (): void => {
        var promiseHelper: PromiseHelper,
            controllerScope: ITransferHistoryDetailsControllerScope,
            controller: TransferHistoryDetailsController,
            locationService: ng.ILocationService,
            popupMessageService: Core.IPopupMessageService,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            routeParamsMock: ITransferHistoryDetailsParams,
            modalService: IModalServiceMock,
            translations: Api.Models.IL10N,
            transferHistoryServiceMock: TransferHistoryServiceMock,
            entityServiceMock: Core.Api.IEntityService,
            authorizationServiceMock: Core.Tests.AuthServiceMock,
            formatter: Core.IFormatterService,
            timeout: ng.ITimeoutService,
            stateServiceMock: ng.ui.IStateService;


        var createTestController = (): TransferHistoryDetailsController => {
            return new TransferHistoryDetailsController(
                controllerScope,
                routeParamsMock,
                authorizationServiceMock.Object,
                locationService,
                translationServiceMock.Object,
                popupMessageService,
                transferHistoryServiceMock.Object,
                entityServiceMock,
                formatter,
                stateServiceMock,
                timeout
                );
        };

        var getEntity = (): Core.Api.Models.IEntityModel => {
            return <Core.Api.Models.IEntityModel> {
                Name: "Entity Name 1234",
                Number: "Entity Number 1234"
            };
        };

        var GetTransfer = (): Api.Models.ITransferReporting => {
            var transferItemWithReportingUnits = <Api.Models.ITransferDetailReporting>{
                Id: 33331,
                TransferCost: 9,
                ReportingOnHand: 10,
                ReportingRequested: 20,
                ReportingTransferred: 30,
                ReportingUnitCost: 40,
                ReportingUom: "Reporting UOM"
            };

            var transferItemWithoutReportingUnits = <Api.Models.ITransferDetailReporting>{
                Id: 33332,
                Quantity: 30,
                UnitCost: 40,
                OnHand: 10,
                OriginalTransferQty: 20,
                TransferUnit3: "Reporting UOM",
                TransferCost: 29,
            };

            return <Api.Models.ITransferReporting>{
                Id: 1111,
                CreateDate: "CreateDate",
                InitiatedBy: "InitiatedBy",
                RequestingEntityId: 2222,
                Details: [transferItemWithReportingUnits, transferItemWithoutReportingUnits]
            };
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService, $timeout: ng.ITimeoutService): void => {
                promiseHelper = new PromiseHelper($q);
                controllerScope = <ITransferHistoryDetailsControllerScope>$rootScope.$new(false);
                locationService = $location;
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                modalService = new ModalServiceMock($q);
                transferHistoryServiceMock = new TransferHistoryServiceMock($q);
                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                stateServiceMock = new Core.Tests.StateServiceMock($q);
                timeout = $timeout;
            });

            translations = <Api.Models.IL10N>{};

            formatter = new Core.FormatterService();

            entityServiceMock = <Core.Api.IEntityService>{
                Get: (id: number): ng.IHttpPromise<Core.Api.Models.IEntityModel> => {
                    return promiseHelper.CreateHttpPromise(getEntity());
                }
            };

            authorizationServiceMock = new Core.Tests.AuthServiceMock();

            routeParamsMock = <ITransferHistoryDetailsParams>{
                TransferRequestId: "2"
            };
        });

        it("requires proper authorization to access", (): void => {
            authorizationServiceMock.GrantAllPermissions(false);

            createTestController();

            expect(locationService.path()).toBe("/Core/Forbidden");

            expect(controllerScope.GetRequestTotal).toBeUndefined();
            expect(controllerScope.GetToOrFromText).toBeUndefined();
            expect(controllerScope.Return).toBeUndefined();
        });

        it("defines all scope methods and non-promise models upon initialization", (): void => {
            createTestController();

            expect(controllerScope.GetRequestTotal).toBeDefined();
            expect(controllerScope.GetToOrFromText).toBeDefined();
            expect(controllerScope.Return).toBeDefined();
        });

        it("receives Translations", (): void => {
            createTestController();

            expect(controllerScope.Translations).toBeUndefined();

            controllerScope.$digest();

            expect(controllerScope.Translations).toBeDefined();
        });

        it("sets the page title upon initialization", (): void => {
            var pageTitle = popupMessageService.GetPageTitle(),
                testTranslations = <Core.Api.Models.ITranslations>{
                    InventoryTransfer: { TransferHistory: "Test Title" }
                };

            translationServiceMock.InjectTranslations(testTranslations);

            createTestController();

            expect(pageTitle).toBe("");

            controllerScope.$digest();

            pageTitle = popupMessageService.GetPageTitle();

            expect(pageTitle).toMatch(testTranslations.InventoryTransfer.TransferHistory);
        });

        it("gets a transfer", (): void => {
            var transfer = GetTransfer();
            transferHistoryServiceMock.SetGetByTransferIdWithReportingUnits(transfer);

            createTestController();
            controllerScope.$digest();

            expect(controllerScope.Transfer).toBeDefined();
            expect(controllerScope.Transfer.Id).toEqual(transfer.Id);
        });

        it("sets EntityDisplayName", (): void => {
            transferHistoryServiceMock.SetGetByTransferIdWithReportingUnits(GetTransfer());
            var entity = getEntity();

            createTestController();

            controllerScope.$digest();

            expect(controllerScope.EntityDisplayName).toEqual(formatter.CreateLocationDisplayName(entity));
        });

        it("sets the GridDefinitions upon initialization", (): void => {
            var gridDefinitions = controllerScope.GridDefinitions,
                testTranslations = <Core.Api.Models.ITranslations>{
                    InventoryTransfer: {
                        Description: "Description",
                        ItemCode: "Item Code",
                        Unit: "Unit",
                        QtyRequested: "QtyRequested",
                        QtyTransferred: "QtyTransferred",
                        ResultingOnHand: "ResultingOnHand",
                        UnitCost: "UnitCost",
                        ExtendedCost: "ExtendedCost"
                    }
                };

            translationServiceMock.InjectTranslations(testTranslations);

            createTestController();

            expect(gridDefinitions).toBeUndefined();

            controllerScope.$digest();

            expect(controllerScope.GridDefinitions.length).toBe(7);
            expect(controllerScope.GridDefinitions[0].Title).toBe(
                testTranslations.InventoryTransfer.Description + " (" + testTranslations.InventoryTransfer.ItemCode + ")");
            expect(controllerScope.GridDefinitions[1].Title).toBe(testTranslations.InventoryTransfer.Unit);
            expect(controllerScope.GridDefinitions[2].Title).toBe(testTranslations.InventoryTransfer.QtyRequested);
            expect(controllerScope.GridDefinitions[3].Title).toBe(testTranslations.InventoryTransfer.QtyTransferred);
            expect(controllerScope.GridDefinitions[4].Title).toBe(testTranslations.InventoryTransfer.ResultingOnHand);
            expect(controllerScope.GridDefinitions[5].Title).toBe(testTranslations.InventoryTransfer.UnitCost);
            expect(controllerScope.GridDefinitions[6].Title).toBe(testTranslations.InventoryTransfer.ExtendedCost);
        });

        it("make sure reporting units are not modified for item with reporting units", (): void => {
            var reportingOnHand = 10,
                reportingRequested = 20,
                reportingTransferred = 30,
                reportingUnitCost = 40,
                reportingUom = "Reporting UOM";

            var transfer = <Api.Models.ITransferReporting> {
                Details: [
                    <Api.Models.ITransferDetailReporting> {
                        ReportingOnHand: reportingOnHand,
                        ReportingRequested: reportingRequested,
                        ReportingTransferred: reportingTransferred,
                        ReportingUnitCost: reportingUnitCost,
                        ReportingUom: reportingUom
                    }
                ]
            };

            var controller = createTestController();

            controllerScope.Transfer = transfer;

            controller.EnsureReportingUomIsSet();

            _.each(controllerScope.Transfer.Details, (item: Api.Models.ITransferDetailReporting): void => {
                expect(item.ReportingOnHand).toBe(reportingOnHand);
                expect(item.ReportingRequested).toBe(reportingRequested);
                expect(item.ReportingTransferred).toBe(reportingTransferred);
                expect(item.ReportingUnitCost).toBe(reportingUnitCost);
                expect(item.ReportingUom).toEqual(reportingUom);
            });
        });

        it("set default reporting units for item without reporting units", (): void => {
            var onHand = 10,
                originalTransferQty = 20,
                quantity = 30,
                unitCost = 40,
                transferUnit3 = "Transfer Unit 3";

            var transfer = <Api.Models.ITransferReporting> {
                Details: [
                    <Api.Models.ITransferDetailReporting> {
                        Quantity: quantity,
                        UnitCost: unitCost,
                        OnHand: onHand,
                        OriginalTransferQty: originalTransferQty,
                        TransferUnit3: transferUnit3
                    }
                ]
            };

            var controller = createTestController();

            controllerScope.Transfer = transfer;

            controller.EnsureReportingUomIsSet();

            _.each(controllerScope.Transfer.Details, (item: Api.Models.ITransferDetailReporting): void => {
                expect(item.ReportingOnHand).toBe(onHand);
                expect(item.ReportingRequested).toBe(originalTransferQty);
                expect(item.ReportingTransferred).toBe(quantity);
                expect(item.ReportingUnitCost).toBe(unitCost);
                expect(item.ReportingUom).toEqual(transferUnit3);
            });
        });

        it("implements GetRequestTotal correctly", (): void => {
            createTestController();

            var transfer = <Api.Models.ITransferReporting> {
                Details: [
                    <Api.Models.ITransferDetailReporting> { TransferCost: 1 },
                    <Api.Models.ITransferDetailReporting> { TransferCost: 2 },
                    <Api.Models.ITransferDetailReporting> { TransferCost: 3 },
                    <Api.Models.ITransferDetailReporting> { TransferCost: 4 }
                ]
            };

            controllerScope.Transfer = transfer;

            var total = transfer.Details[0].TransferCost +
                transfer.Details[1].TransferCost +
                transfer.Details[2].TransferCost +
                transfer.Details[3].TransferCost;

            expect(controllerScope.Transfer).toBeDefined();

            expect(controllerScope.GetRequestTotal()).toBe(total);
        });

        it("implements GetsToOrFromText correctly", (): void => {
            createTestController();

            controllerScope.Transfer = <Api.Models.ITransferReporting>{};
            controllerScope.Translations = <Inventory.Transfer.Api.Models.IL10N>{
                TransferFrom: "From",
                TransferTo: "To"
            };

            expect(controllerScope.GetToOrFromText).toBeDefined();

            expect(controllerScope.GetToOrFromText()).toBe("To");
        });

        it("checks IsTransferDenied if it returns false for an approved transfer", (): void => {
            createTestController();

            var transfer = <Api.Models.ITransferReporting> {
                Status: "Approved"
            };

            controllerScope.Transfer = transfer;
            expect(controllerScope.IsTransferDenied).toBeDefined();
            expect(controllerScope.IsTransferDenied()).toBeFalsy();
        });

        it("checks IsTransferDenied if it returns true for a denied transfer", (): void => {
            createTestController();

            var transfer = <Api.Models.ITransferReporting> {
                Status: "Denied"
            };

            controllerScope.Transfer = transfer;
            expect(controllerScope.IsTransferDenied).toBeDefined();
            expect(controllerScope.IsTransferDenied()).toBeTruthy();
        });
    });
}