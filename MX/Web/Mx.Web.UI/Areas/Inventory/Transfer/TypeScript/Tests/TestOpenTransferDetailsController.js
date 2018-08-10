var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Tests;
        (function (Tests) {
            "use strict";
            describe("OpenTransferDetailsController", function () {
                var periodCloseMock;
                var promiseHelper, controllerScope, locationService, popupMessageService, translationServiceMock, authServiceMock, routeParams, modalServiceMock, translations, transfersServiceMock, entityServiceMock, formatter;
                var createTestController = function () {
                    return new Transfer.OpenTransferDetailsController(controllerScope, routeParams, authServiceMock.Object, translationServiceMock.Object, modalServiceMock, locationService, transfersServiceMock.Object, popupMessageService, entityServiceMock, formatter, authServiceMock.Object, periodCloseMock, new ConstantsMock().Object);
                };
                var getTransferDetail = function () {
                    return {
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
                var entity = {
                    Id: entityId,
                    Name: entityName,
                    Number: "Entity Number"
                };
                var transfer = {
                    Id: 101,
                    RequestingEntityId: entityId,
                    SendingEntityId: 1,
                    Details: []
                };
                beforeEach(function () {
                    angular.mock.module(Core.NG.InventoryTransferModule.Module().name);
                    inject(function ($q, $rootScope, $location) {
                        promiseHelper = new PromiseHelper($q);
                        controllerScope = $rootScope.$new(false);
                        locationService = $location;
                        popupMessageService = new Core.Tests.PopupMessageServiceMock();
                        modalServiceMock = new Transfer.ModalServiceMock($q);
                        transfersServiceMock = new Tests.TransfersServiceMock($q);
                        translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                        authServiceMock = new Core.Tests.AuthServiceMock();
                        periodCloseMock = (new ChangeApplyDateMocks($q)).PeriodCloseService;
                    });
                    translations = {};
                    formatter = new Core.FormatterService();
                    routeParams = {
                        TransferRequestId: "2"
                    };
                    entityServiceMock = {
                        Get: function (id) {
                            return promiseHelper.CreateHttpPromise(entity);
                        },
                        GetEntitiesByIds: function (entityIds) {
                            return promiseHelper.CreateHttpPromise([entity]);
                        }
                    };
                    transfersServiceMock.Object.SetCurrentTransfer(transfer);
                });
                it("defines all scope methods and non-promise models upon initialization", function () {
                    createTestController();
                    expect(controllerScope.Approve).toBeDefined();
                    expect(controllerScope.Deny).toBeDefined();
                    expect(controllerScope.GetRequestTotal).toBeDefined();
                    expect(controllerScope.OnRowSelect).toBeDefined();
                    expect(controllerScope.Return).toBeDefined();
                    expect(controllerScope.UpdateDetails).toBeDefined();
                    expect(controllerScope.IsReadOnly).toBeDefined();
                });
                it("sets the path when Return() is called", function () {
                    createTestController();
                    controllerScope.Return();
                    expect(locationService.path()).toBe("/Inventory/Transfer/OpenTransfers");
                });
                it("leaves page if the transferId is not a number", function () {
                    routeParams.TransferRequestId = "NaN";
                    createTestController();
                    expect(locationService.path()).toBe("/Inventory/Transfer/OpenTransfers");
                });
                it("receives Translations", function () {
                    var testTranslations = {
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
                it("sets the value of Transfer to the return value of transfer service method GetByTransferId", function () {
                    transfersServiceMock.Object.SetCurrentTransfer(transfer);
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.Transfer).toBeDefined();
                    expect(controllerScope.Transfer).toBe(transfer);
                });
                it("sets the value of RequestingLocationDisplayName to the name of the requesting entity", function () {
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.RequestingLocationDisplayName).toEqual("Entity Number - Entity Name 1234");
                });
                it("returns the total cost of all transfer items when GetRequestTotal is called", function () {
                    transfer.Details = [
                        {
                            TransferCost: 9
                        }, {
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
                it("returns true when HasQtyValuesChangedCompareToPreviousValues is called and quantities changed", function () {
                    var currentTransferDetail = getTransferDetail();
                    var previousTransferDetail = getTransferDetail();
                    controllerScope.PreviousTransfer = {
                        Details: [previousTransferDetail]
                    };
                    var controller = createTestController();
                    currentTransferDetail.TransferQty1 = previousTransferDetail.TransferQty1 + 1;
                    var resultWhenQty1Changes = controller.HasQtyValuesChangedCompareToPreviousValues(currentTransferDetail);
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
                it("returns false when HasQtyValuesChangedCompareToPreviousValues is called and quantities have not changed", function () {
                    var previousTransferDetail = getTransferDetail();
                    controllerScope.PreviousTransfer = {
                        Details: [previousTransferDetail]
                    };
                    var controller = createTestController();
                    var result = controller.HasQtyValuesChangedCompareToPreviousValues(previousTransferDetail);
                    expect(result).toBeFalsy();
                });
                it("only calls PutTransferDetailWithUpdatedCostAndQuantity from UpdateDetails when quantities have changed", function () {
                    var transferDetail = getTransferDetail();
                    var transferDetailNew = getTransferDetail();
                    transferDetailNew.TransferQty1 = transferDetailNew.TransferQty1 + 1;
                    transfer.Details = [transferDetail];
                    transfersServiceMock.Object.SetCurrentTransfer(transfer);
                    var serviceMethodSpy = spyOn(transfersServiceMock.Object, "PutTransferDetailWithUpdatedCostAndQuantity");
                    serviceMethodSpy.and.callFake(function (transferIn, transferDetailIn) {
                        return promiseHelper.CreateHttpPromise(transferDetail);
                    });
                    createTestController();
                    controllerScope.PreviousTransfer = {
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
                it("updates the quantity when UpdateDetails gets called and quantities have changed", function () {
                    var previousTransferDetail = getTransferDetail();
                    var requestTransferDetail = getTransferDetail();
                    requestTransferDetail.TransferQty3 = previousTransferDetail.TransferQty3 + 1;
                    requestTransferDetail.Quantity = previousTransferDetail.Quantity + 1;
                    requestTransferDetail.OnHand = previousTransferDetail.OnHand;
                    transfersServiceMock.SetPutTransferDetailWithUpdatedCostAndQuantity(requestTransferDetail);
                    createTestController();
                    controllerScope.$digest();
                    controllerScope.UpdateDetails(requestTransferDetail);
                    controllerScope.PreviousTransfer = {
                        Id: 2,
                        Details: [previousTransferDetail]
                    };
                    controllerScope.$digest();
                    expect(requestTransferDetail.OnHand).toEqual(previousTransferDetail.OnHand - 1);
                });
                it("updates PreviousTransfer after calling UpdateDetails() with new quantities", function () {
                    var requestTransferDetail = getTransferDetail();
                    var resultTransferDetail = getTransferDetail();
                    resultTransferDetail.TransferQty1 = resultTransferDetail.TransferQty1 + 1;
                    transfer.Details = [requestTransferDetail];
                    transfersServiceMock.Object.SetCurrentTransfer(transfer);
                    transfersServiceMock.SetPutTransferDetailWithUpdatedCostAndQuantity(resultTransferDetail);
                    createTestController();
                    controllerScope.PreviousTransfer = {
                        Id: 2,
                        Details: [resultTransferDetail]
                    };
                    expect(controllerScope.PreviousTransfer.Details[0]).not.toEqual(requestTransferDetail);
                    controllerScope.UpdateDetails(requestTransferDetail);
                    controllerScope.$digest();
                    expect(controllerScope.PreviousTransfer.Details[0]).toEqual(requestTransferDetail);
                });
            });
        })(Tests = Transfer.Tests || (Transfer.Tests = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
