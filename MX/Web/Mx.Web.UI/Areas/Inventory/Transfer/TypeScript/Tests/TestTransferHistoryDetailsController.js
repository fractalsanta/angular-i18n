var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Tests;
        (function (Tests) {
            "use strict";
            describe("TransferHistoryDetailsController", function () {
                var promiseHelper, controllerScope, controller, locationService, popupMessageService, translationServiceMock, routeParamsMock, modalService, translations, transferHistoryServiceMock, entityServiceMock, authorizationServiceMock, formatter, timeout, stateServiceMock;
                var createTestController = function () {
                    return new Transfer.TransferHistoryDetailsController(controllerScope, routeParamsMock, authorizationServiceMock.Object, locationService, translationServiceMock.Object, popupMessageService, transferHistoryServiceMock.Object, entityServiceMock, formatter, stateServiceMock, timeout);
                };
                var getEntity = function () {
                    return {
                        Name: "Entity Name 1234",
                        Number: "Entity Number 1234"
                    };
                };
                var GetTransfer = function () {
                    var transferItemWithReportingUnits = {
                        Id: 33331,
                        TransferCost: 9,
                        ReportingOnHand: 10,
                        ReportingRequested: 20,
                        ReportingTransferred: 30,
                        ReportingUnitCost: 40,
                        ReportingUom: "Reporting UOM"
                    };
                    var transferItemWithoutReportingUnits = {
                        Id: 33332,
                        Quantity: 30,
                        UnitCost: 40,
                        OnHand: 10,
                        OriginalTransferQty: 20,
                        TransferUnit3: "Reporting UOM",
                        TransferCost: 29
                    };
                    return {
                        Id: 1111,
                        CreateDate: "CreateDate",
                        InitiatedBy: "InitiatedBy",
                        RequestingEntityId: 2222,
                        Details: [transferItemWithReportingUnits, transferItemWithoutReportingUnits]
                    };
                };
                beforeEach(function () {
                    angular.mock.module(Core.NG.InventoryTransferModule.Module().name);
                    inject(function ($q, $rootScope, $location, $timeout) {
                        promiseHelper = new PromiseHelper($q);
                        controllerScope = $rootScope.$new(false);
                        locationService = $location;
                        popupMessageService = new Core.Tests.PopupMessageServiceMock();
                        modalService = new Transfer.ModalServiceMock($q);
                        transferHistoryServiceMock = new Tests.TransferHistoryServiceMock($q);
                        translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                        stateServiceMock = new Core.Tests.StateServiceMock($q);
                        timeout = $timeout;
                    });
                    translations = {};
                    formatter = new Core.FormatterService();
                    entityServiceMock = {
                        Get: function (id) {
                            return promiseHelper.CreateHttpPromise(getEntity());
                        }
                    };
                    authorizationServiceMock = new Core.Tests.AuthServiceMock();
                    routeParamsMock = {
                        TransferRequestId: "2"
                    };
                });
                it("requires proper authorization to access", function () {
                    authorizationServiceMock.GrantAllPermissions(false);
                    createTestController();
                    expect(locationService.path()).toBe("/Core/Forbidden");
                    expect(controllerScope.GetRequestTotal).toBeUndefined();
                    expect(controllerScope.GetToOrFromText).toBeUndefined();
                    expect(controllerScope.Return).toBeUndefined();
                });
                it("defines all scope methods and non-promise models upon initialization", function () {
                    createTestController();
                    expect(controllerScope.GetRequestTotal).toBeDefined();
                    expect(controllerScope.GetToOrFromText).toBeDefined();
                    expect(controllerScope.Return).toBeDefined();
                });
                it("receives Translations", function () {
                    createTestController();
                    expect(controllerScope.Translations).toBeUndefined();
                    controllerScope.$digest();
                    expect(controllerScope.Translations).toBeDefined();
                });
                it("sets the page title upon initialization", function () {
                    var pageTitle = popupMessageService.GetPageTitle(), testTranslations = {
                        InventoryTransfer: { TransferHistory: "Test Title" }
                    };
                    translationServiceMock.InjectTranslations(testTranslations);
                    createTestController();
                    expect(pageTitle).toBe("");
                    controllerScope.$digest();
                    pageTitle = popupMessageService.GetPageTitle();
                    expect(pageTitle).toMatch(testTranslations.InventoryTransfer.TransferHistory);
                });
                it("gets a transfer", function () {
                    var transfer = GetTransfer();
                    transferHistoryServiceMock.SetGetByTransferIdWithReportingUnits(transfer);
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.Transfer).toBeDefined();
                    expect(controllerScope.Transfer.Id).toEqual(transfer.Id);
                });
                it("sets EntityDisplayName", function () {
                    transferHistoryServiceMock.SetGetByTransferIdWithReportingUnits(GetTransfer());
                    var entity = getEntity();
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.EntityDisplayName).toEqual(formatter.CreateLocationDisplayName(entity));
                });
                it("sets the GridDefinitions upon initialization", function () {
                    var gridDefinitions = controllerScope.GridDefinitions, testTranslations = {
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
                    expect(controllerScope.GridDefinitions[0].Title).toBe(testTranslations.InventoryTransfer.Description + " (" + testTranslations.InventoryTransfer.ItemCode + ")");
                    expect(controllerScope.GridDefinitions[1].Title).toBe(testTranslations.InventoryTransfer.Unit);
                    expect(controllerScope.GridDefinitions[2].Title).toBe(testTranslations.InventoryTransfer.QtyRequested);
                    expect(controllerScope.GridDefinitions[3].Title).toBe(testTranslations.InventoryTransfer.QtyTransferred);
                    expect(controllerScope.GridDefinitions[4].Title).toBe(testTranslations.InventoryTransfer.ResultingOnHand);
                    expect(controllerScope.GridDefinitions[5].Title).toBe(testTranslations.InventoryTransfer.UnitCost);
                    expect(controllerScope.GridDefinitions[6].Title).toBe(testTranslations.InventoryTransfer.ExtendedCost);
                });
                it("make sure reporting units are not modified for item with reporting units", function () {
                    var reportingOnHand = 10, reportingRequested = 20, reportingTransferred = 30, reportingUnitCost = 40, reportingUom = "Reporting UOM";
                    var transfer = {
                        Details: [
                            {
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
                    _.each(controllerScope.Transfer.Details, function (item) {
                        expect(item.ReportingOnHand).toBe(reportingOnHand);
                        expect(item.ReportingRequested).toBe(reportingRequested);
                        expect(item.ReportingTransferred).toBe(reportingTransferred);
                        expect(item.ReportingUnitCost).toBe(reportingUnitCost);
                        expect(item.ReportingUom).toEqual(reportingUom);
                    });
                });
                it("set default reporting units for item without reporting units", function () {
                    var onHand = 10, originalTransferQty = 20, quantity = 30, unitCost = 40, transferUnit3 = "Transfer Unit 3";
                    var transfer = {
                        Details: [
                            {
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
                    _.each(controllerScope.Transfer.Details, function (item) {
                        expect(item.ReportingOnHand).toBe(onHand);
                        expect(item.ReportingRequested).toBe(originalTransferQty);
                        expect(item.ReportingTransferred).toBe(quantity);
                        expect(item.ReportingUnitCost).toBe(unitCost);
                        expect(item.ReportingUom).toEqual(transferUnit3);
                    });
                });
                it("implements GetRequestTotal correctly", function () {
                    createTestController();
                    var transfer = {
                        Details: [
                            { TransferCost: 1 },
                            { TransferCost: 2 },
                            { TransferCost: 3 },
                            { TransferCost: 4 }
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
                it("implements GetsToOrFromText correctly", function () {
                    createTestController();
                    controllerScope.Transfer = {};
                    controllerScope.Translations = {
                        TransferFrom: "From",
                        TransferTo: "To"
                    };
                    expect(controllerScope.GetToOrFromText).toBeDefined();
                    expect(controllerScope.GetToOrFromText()).toBe("To");
                });
                it("checks IsTransferDenied if it returns false for an approved transfer", function () {
                    createTestController();
                    var transfer = {
                        Status: "Approved"
                    };
                    controllerScope.Transfer = transfer;
                    expect(controllerScope.IsTransferDenied).toBeDefined();
                    expect(controllerScope.IsTransferDenied()).toBeFalsy();
                });
                it("checks IsTransferDenied if it returns true for a denied transfer", function () {
                    createTestController();
                    var transfer = {
                        Status: "Denied"
                    };
                    controllerScope.Transfer = transfer;
                    expect(controllerScope.IsTransferDenied).toBeDefined();
                    expect(controllerScope.IsTransferDenied()).toBeTruthy();
                });
            });
        })(Tests = Transfer.Tests || (Transfer.Tests = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
