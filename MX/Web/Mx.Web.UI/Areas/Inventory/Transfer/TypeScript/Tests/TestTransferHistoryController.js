var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Tests;
        (function (Tests) {
            "use strict";
            describe("TransferHistoryController", function () {
                var controllerScope, promiseHelper, authorizationServiceMock, locationService, translationServiceMock, popupMessageService, transferHistoryServiceMock, translations, stateServiceMock, constants;
                var createTestController = function () {
                    return new Transfer.TransferHistoryController(controllerScope, authorizationServiceMock.Object, translationServiceMock.Object, popupMessageService, locationService, stateServiceMock, transferHistoryServiceMock.Object, constants);
                };
                var getTransferHeaderList = function () {
                    var thisEntityId = 1, otherEntityId = 4321, transferFromThisStore = {
                        TransferFromEntityId: thisEntityId,
                        TransferToEntityId: otherEntityId
                    }, transferToThisStore = {
                        TransferFromEntityId: otherEntityId,
                        TransferToEntityId: thisEntityId
                    }, transfers = [
                        transferFromThisStore,
                        transferToThisStore
                    ];
                    return transfers;
                };
                beforeEach(function () {
                    angular.mock.module(Core.NG.InventoryTransferModule.Module().name);
                    inject(function ($q, $rootScope, $location) {
                        controllerScope = $rootScope.$new(false);
                        promiseHelper = new PromiseHelper($q);
                        popupMessageService = new Core.Tests.PopupMessageServiceMock();
                        transferHistoryServiceMock = new Tests.TransferHistoryServiceMock($q);
                        locationService = $location;
                        stateServiceMock = new Core.Tests.StateServiceMock($q);
                        translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                    });
                    authorizationServiceMock = new Core.Tests.AuthServiceMock();
                    translations = {};
                    constants = {};
                });
                it("requires proper authorization to access", function () {
                    authorizationServiceMock.GrantAllPermissions(false);
                    createTestController();
                    expect(locationService.path()).toBe("/Core/Forbidden");
                    expect(controllerScope.TransferHeaders).toBeUndefined();
                    expect(controllerScope.FilteredTransferHeaders).toBeUndefined();
                    expect(controllerScope.CurrentPageTransferHeaders).toBeUndefined();
                    expect(controllerScope.RequiresPaging).toBeUndefined();
                    expect(controllerScope.ViewHistoryDetails).toBeUndefined();
                    expect(controllerScope.ChangeDates).toBeUndefined();
                });
                it("defines all scope methods and non-promise models upon initialization", function () {
                    createTestController();
                    expect(controllerScope.TransferHeaders).toBeDefined();
                    expect(controllerScope.TransferHeaders.length).toBe(0);
                    expect(controllerScope.FilteredTransferHeaders).toBeDefined();
                    expect(controllerScope.FilteredTransferHeaders.length).toBe(0);
                    expect(controllerScope.CurrentPageTransferHeaders).toBeDefined();
                    expect(controllerScope.CurrentPageTransferHeaders.length).toBe(0);
                    expect(controllerScope.RequiresPaging).toBeDefined();
                    expect(controllerScope.ViewHistoryDetails).toBeDefined();
                    expect(controllerScope.ChangeDates).toBeDefined();
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
                it("sets the paging options upon initialization", function () {
                    createTestController();
                    expect(controllerScope.PagingOptions).toBeDefined();
                    expect(controllerScope.CurrentPage).toBe(1);
                    expect(controllerScope.PagingOptions.itemsPerPage).toBe(20);
                    expect(controllerScope.PagingOptions.numPages).toBe(5);
                    expect(controllerScope.ChangePage).toBeDefined();
                });
                it("can determine if paging is required", function () {
                    createTestController();
                    expect(controllerScope.RequiresPaging()).toBeFalsy();
                    controllerScope.FilteredTransferHeaders = getTransferHeaderList();
                    controllerScope.PagingOptions.itemsPerPage = 1;
                    expect(controllerScope.RequiresPaging()).toBeTruthy();
                });
                it("sets initial date range to the last 14 days", function () {
                    var currentTime = moment.utc("2015-01-01 23:59:59");
                    var methodSpy = spyOn(window, 'moment');
                    methodSpy.and.callFake(function () { return currentTime; });
                    createTestController();
                    expect(controllerScope.Dates).toBeDefined();
                    var today = currentTime, fourteenDaysAgo = currentTime.add("d", -14), scopeStartDate = controllerScope.Dates.StartDate, scopeEndDate = controllerScope.Dates.EndDate;
                    expect(scopeStartDate.getDate()).toBe(fourteenDaysAgo.toDate().getDate());
                    expect(scopeEndDate.getDate()).toBe(today.toDate().getDate());
                });
                it("loads TransferHeaders correctly", function () {
                    var transfers = getTransferHeaderList();
                    transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(transfers);
                    constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.TransferHeaders).toBeDefined();
                    expect(controllerScope.TransferHeaders.length).toBe(transfers.length);
                });
                it("formats the date to the constant internal date format when requesting data", function () {
                    var passedStartDateString;
                    var passedEndDateString;
                    var startMoment = moment("2015-12-05");
                    var endMoment = moment("2015-12-10");
                    constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
                    var serviceMethodSpy = spyOn(transferHistoryServiceMock.Object, "GetTransfersWithEntitiesByStoreAndDateRange");
                    serviceMethodSpy.and.callFake(function (entityId, startDate, endDate) {
                        passedStartDateString = startDate;
                        passedEndDateString = endDate;
                        return promiseHelper.CreateHttpPromise([]);
                    });
                    var controller = createTestController();
                    controller.LoadData(startMoment, endMoment);
                    expect(passedStartDateString).toBe(startMoment.format(constants.InternalDateTimeFormat));
                    expect(passedEndDateString).toBe(endMoment.format(constants.InternalDateTimeFormat));
                });
                it("sorts TransferHeaders by request date", function () {
                    var transfers = getTransferHeaderList();
                    transfers[0].CreateDate = "1-1-2015";
                    transfers[1].CreateDate = "2-1-2015";
                    transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(transfers);
                    constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.TransferHeaders).toBeDefined();
                    expect(controllerScope.TransferHeaders.length).toBe(2);
                    expect(controllerScope.TransferHeaders[0].CreateDate > controllerScope.TransferHeaders[1].CreateDate);
                });
                it("filters transfer headers by Transfer From store name", function () {
                    var transfers = getTransferHeaderList();
                    transfers[0].FromEntityName = "Passes Filter";
                    transfers[1].FromEntityName = "X Does Not Pass Filter";
                    transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(transfers);
                    createTestController();
                    controllerScope.Model.FilterText = "Passes Filter";
                    controllerScope.$digest();
                    expect(controllerScope.FilteredTransferHeaders).toBeDefined();
                    expect(controllerScope.FilteredTransferHeaders.length).toBe(1);
                    expect(controllerScope.FilteredTransferHeaders[0]).toBe(transfers[0]);
                });
                it("filters transfer headers by Transfer To store name", function () {
                    var transfers = getTransferHeaderList();
                    transfers[0].ToEntityName = "X Does Not Pass Filter";
                    transfers[1].ToEntityName = "Passes Filter";
                    transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(transfers);
                    createTestController();
                    controllerScope.Model.FilterText = "Passes Filter";
                    controllerScope.$digest();
                    expect(controllerScope.FilteredTransferHeaders).toBeDefined();
                    expect(controllerScope.FilteredTransferHeaders.length).toBe(1);
                    expect(controllerScope.FilteredTransferHeaders[0]).toBe(transfers[1]);
                });
                it("sets transfer direction text", function () {
                    transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(getTransferHeaderList());
                    constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
                    var translations = {
                        InventoryTransfer: {
                            To: "To",
                            From: "From"
                        }
                    };
                    translationServiceMock.InjectTranslations(translations);
                    createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.TransferHeaders[0].DirectionName).toEqual("To");
                    expect(controllerScope.TransferHeaders[1].DirectionName).toEqual("From");
                });
            });
        })(Tests = Transfer.Tests || (Transfer.Tests = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
