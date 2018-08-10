/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/Typescript/Directives/mx-grid-header-directive.ts" />
/// <reference path="../../../../Core/TypeScript/IDateRange.d.ts" />
/// <reference path="../../../../Core/TypeScript/Services/FormatterService.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Controllers/TransferHistoryController.ts" />
/// <reference path="MockModalService.ts" />
/// <reference path="MockTransferHistoryService.ts" />
/// <reference path="MockTransferStoreService.ts" />

module Inventory.Transfer.Tests {
    "use strict";

    describe("TransferHistoryController", (): void => {
        var controllerScope: ITransferHistoryControllerScope,
            promiseHelper: PromiseHelper,
            authorizationServiceMock: Core.Tests.AuthServiceMock,
            locationService: ng.ILocationService,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageService: Core.IPopupMessageService,
            transferHistoryServiceMock: TransferHistoryServiceMock,
            translations: Api.Models.IL10N,
            stateServiceMock: ng.ui.IStateService,
            constants: Core.IConstants;

        var createTestController = (): TransferHistoryController => {
            return new TransferHistoryController(
                controllerScope,
                authorizationServiceMock.Object,
                translationServiceMock.Object,
                popupMessageService,
                locationService,
                stateServiceMock,
                transferHistoryServiceMock.Object,
                constants);
        };

        var getTransferHeaderList = (): ITransferHeaderForHistory[]=> {
            var thisEntityId = 1,
                otherEntityId = 4321,
                transferFromThisStore = <ITransferHeaderForHistory>{
                    TransferFromEntityId: thisEntityId,
                    TransferToEntityId: otherEntityId
                },
                transferToThisStore = <ITransferHeaderForHistory>{
                    TransferFromEntityId: otherEntityId,
                    TransferToEntityId: thisEntityId
                },

                transfers: ITransferHeaderForHistory[] = [
                    transferFromThisStore,
                    transferToThisStore
                ];

            return transfers;
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.InventoryTransferModule.Module().name);

            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService, $location: ng.ILocationService): void => {
                controllerScope = <ITransferHistoryControllerScope>$rootScope.$new(false);
                promiseHelper = new PromiseHelper($q);
                popupMessageService = new Core.Tests.PopupMessageServiceMock();
                transferHistoryServiceMock = new TransferHistoryServiceMock($q);
                locationService = $location;
                stateServiceMock = new Core.Tests.StateServiceMock($q);
                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
            });

            authorizationServiceMock = new Core.Tests.AuthServiceMock();
            translations = <Api.Models.IL10N>{};

            constants = <Core.IConstants>{};
        });

        it("requires proper authorization to access", (): void => {
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

        it("defines all scope methods and non-promise models upon initialization", (): void => {
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

        it("sets the paging options upon initialization", (): void => {
            createTestController();

            expect(controllerScope.PagingOptions).toBeDefined();
            expect(controllerScope.CurrentPage).toBe(1);
            expect(controllerScope.PagingOptions.itemsPerPage).toBe(20);
            expect(controllerScope.PagingOptions.numPages).toBe(5);
            expect(controllerScope.ChangePage).toBeDefined();
        });

        it("can determine if paging is required", (): void => {
            createTestController();

            expect(controllerScope.RequiresPaging()).toBeFalsy();

            controllerScope.FilteredTransferHeaders = getTransferHeaderList();
            controllerScope.PagingOptions.itemsPerPage = 1;

            expect(controllerScope.RequiresPaging()).toBeTruthy();
        });

        it("sets initial date range to the last 14 days", (): void => {
            var currentTime = moment.utc("2015-01-01 23:59:59");

            var methodSpy = spyOn(window, 'moment');

            methodSpy.and.callFake((): Moment => { return currentTime; });
            createTestController();
            
            expect(controllerScope.Dates).toBeDefined();

            var today = currentTime,
                fourteenDaysAgo = currentTime.add("d", -14),
                scopeStartDate = controllerScope.Dates.StartDate,
                scopeEndDate = controllerScope.Dates.EndDate;

            expect(scopeStartDate.getDate()).toBe(fourteenDaysAgo.toDate().getDate());
            expect(scopeEndDate.getDate()).toBe(today.toDate().getDate());
        });

        it("loads TransferHeaders correctly", (): void => {
            var transfers = getTransferHeaderList();
            transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(transfers);
            constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";

            createTestController();

            controllerScope.$digest();

            expect(controllerScope.TransferHeaders).toBeDefined();
            expect(controllerScope.TransferHeaders.length).toBe(transfers.length);
        });

        it("formats the date to the constant internal date format when requesting data", (): void => {
            var passedStartDateString: string;
            var passedEndDateString: string;

            var startMoment = moment("2015-12-05");
            var endMoment = moment("2015-12-10");

            constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";

            var serviceMethodSpy = spyOn(transferHistoryServiceMock.Object, "GetTransfersWithEntitiesByStoreAndDateRange");

            serviceMethodSpy.and.callFake((entityId: number, startDate: string, endDate: string): ng.IHttpPromise<Api.Models.ITransferHeader[]> => {
                passedStartDateString = startDate;
                passedEndDateString = endDate;
                return promiseHelper.CreateHttpPromise<Api.Models.ITransferHeader[]>([]);
            });

            var controller = createTestController();

            controller.LoadData(startMoment, endMoment);

            expect(passedStartDateString).toBe(startMoment.format(constants.InternalDateTimeFormat));
            expect(passedEndDateString).toBe(endMoment.format(constants.InternalDateTimeFormat));
        });

        it("sorts TransferHeaders by request date", (): void => {
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

        it("filters transfer headers by Transfer From store name", (): void => {
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

        it("filters transfer headers by Transfer To store name", (): void => {
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

        it("sets transfer direction text", (): void => {
            transferHistoryServiceMock.SetGetTransfersWithEntitiesByStoreAndDateRange(getTransferHeaderList());
            constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";

            var translations = <Core.Api.Models.ITranslations>{
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
}