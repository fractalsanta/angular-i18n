/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../Services/DataService.ts" />
/// <reference path="../../Services/ForcastingObjectService.ts" />
/// <reference path="MirroringServiceMock.ts"/>

/// <reference path="../../Interfaces/IMirrorings.d.ts" />
/// <reference path="../../Controllers/MirroringController.ts" />
/// <reference path="../../Services/MirroringService.ts" />
/// <reference path="../../../../Core/Typescript/Directives/mx-grid-header-directive.ts" />
/// <reference path="../../../../Core/Typescript/Models/IConfirmation.ts" />
/// <reference path="../../Controllers/MirroringSalesItemsController.ts" />
/// <reference path="../../Interfaces/IMirroringChangeEndDateResult.d.ts" />
/// <reference path="../../../../Core/Typescript/Interfaces/IDateRangeOptions.d.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts mirroring sales items Controller", (): void => {
        var q: ng.IQService,
            scope: IMirroringSalesItemsControllerScope,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageServiceMock: Core.Tests.PopupMessageServiceMock,
            modalServiceMock: Core.Tests.ModalServiceMock,
            mirrorServiceMock: Forecasting.Tests.MirroringServiceMock,
            authenticationServiceMock: Core.Tests.AuthServiceMock,
            timeout: ng.ITimeoutService,
            testTranslationsForecasting: Forecasting.Api.Models.ITranslations = <Forecasting.Api.Models.ITranslations>{
                SearchItems: "SearchItems",
                AddItem: "AddItem",
                TargetSalesItemCode: "TargetSalesItemCode",
                MirrorDates: "MirrorDates",
                Zone: "Zone"
            },
            testTranslations: Core.Api.Models.ITranslations = <Core.Api.Models.ITranslations>{
                Forecasting: testTranslationsForecasting
            },
            testItems: IMySalesItemMirroringInterval[];

        var createTestController = (): any => {
            var state = new Forecasting.MirroringController(
                scope,
                null,
                authenticationServiceMock.Object,
                translationServiceMock.Object,
                popupMessageServiceMock,
                modalServiceMock.Object,
                mirrorServiceMock.Object
                );

            var test = new Forecasting.MirroringSalesItemsController(
                scope,
                popupMessageServiceMock,
                mirrorServiceMock.Object,
                timeout
                );

            return {
                state: state,
                test: test
            };
        };

        beforeEach((): void => {
            inject(($rootScope: IMirroringSalesItemsControllerScope, $q: ng.IQService, $timeout: ng.ITimeoutService): void => {
                q = $q;
                scope = $rootScope;
                timeout = $timeout;
                authenticationServiceMock = new Core.Tests.AuthServiceMock();
                translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
                mirrorServiceMock = new MirroringServiceMock(q);
            });

            popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
            testItems = mirrorServiceMock.salesItemMirrorIntervalsServiceMock.GetData("GetSalesItemMirrorIntervals");
        });

        it("defines all scope methods and models upon initialization", (): void => {
            pending();
            createTestController();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.L10N).toBeDefined();
            expect(scope.Vm.Dates).toBeUndefined();
            expect(scope.Vm.FilterText).toBe("");
            expect(scope.Vm.SalesItemIntervals).toBeUndefined();
            expect(scope.Vm.SelectedSalesItemInterval).toBeUndefined();

            expect(scope.NavigateTo).toBeDefined();
            expect(scope.NavigateToParam).toBeDefined();
            expect(scope.Cancel).toBeDefined();
            expect(scope.AddItem).toBeDefined();
            expect(scope.ViewDetails).toBeDefined();

            expect(scope.Model).toBeDefined();
            expect(scope.Model.FilteredIntervals).toBeUndefined();

            expect(scope.Header).toBeDefined();
            expect(scope.FilterIntervals).toBeDefined();
        });

        it("Initialize triggers loads data when not loaded", (): void => {
            var controller = createTestController();

            spyOn(controller.test, "LoadData").and.callFake(function (): void { ; });
            expect(scope.Model.FilteredIntervals).toBeUndefined();
            controller.test.Initialize();
            scope.$digest();
            scope.$digest();
            expect(controller.test.LoadData).toHaveBeenCalled();
        });
        
        it("Initialize does not trigger load data when loaded", (): void => {
            var controller = createTestController();

            spyOn(controller.test, "LoadData").and.callFake(function (): void { ; });
            scope.Model.FilteredIntervals = testItems;
            expect(scope.Model.FilteredIntervals).toBeDefined();
            controller.test.Initialize();
            scope.$digest();
            scope.$digest();
            expect(controller.test.LoadData).toHaveBeenCalled();
        });
        
        it("loads translations correctly and sets correct header", (): void => {
            translationServiceMock.InjectTranslations(testTranslations);

            var controller = createTestController();

            spyOn(controller.test, "GetHeader").and.callThrough();

            scope.$digest();
            scope.$digest();

            expect(scope.Vm.L10N).toBe(testTranslations.Forecasting);

            expect(controller.test.GetHeader).toHaveBeenCalled();
            
            var header = scope.Header();
            expect(header.Columns[0].Title).toBe(testTranslations.Forecasting.TargetSalesItemCode);
            expect(header.Columns[1].Title).toBe(testTranslations.Forecasting.MirrorDates);
            expect(header.Columns[2].Title).toBe(testTranslations.Forecasting.Zone);
            expect(header.Columns[3].Title).toBe("");
        });

        it("loads data correctly after date change", (): void => {
            var controller = createTestController();

            spyOn(controller.test, "LoadData").and.callThrough();

            scope.Vm.Dates = { StartDate: new Date(), EndDate: new Date() };
            scope.$digest();
            scope.$digest();
            scope.Vm.Dates = { StartDate: moment().subtract({ days: 1 }).toDate(), EndDate: new Date()};
            scope.$digest();
            scope.$digest();

            expect(controller.test.LoadData).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals).toBeDefined();
            expect(scope.Model.FilteredIntervals).toBeDefined();

            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(testItems.length);
        });

        it("filters data correctly after filtered text changed", (): void => {
            var controller = createTestController();

            spyOn(controller.test, "ApplySearchFilter").and.callThrough();

            scope.$digest();
            scope.$digest();

            expect(scope.Vm.SalesItemIntervals).toBeDefined();
            expect(scope.Model.FilteredIntervals).toBeDefined();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(testItems.length);

            scope.Vm.FilterText = "asdf";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(0);

            scope.Vm.FilterText = "Kit-Kat";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(1);
            expect(scope.Model.FilteredIntervals[0].Id).toBe(4);

            scope.Vm.FilterText = "";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(testItems.length);

            scope.Vm.FilterText = "Test Market";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(1);
            expect(scope.Model.FilteredIntervals[0].Id).toBe(4);

            scope.Vm.FilterText = "zone";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(2);
            expect(scope.Model.FilteredIntervals[0].Id).toBe(9);
            expect(scope.Model.FilteredIntervals[1].Id).toBe(14);

            scope.Vm.FilterText = "~1234567890-=";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(0);

            scope.Vm.FilterText = "~!@#$%^&*()_+";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(0);

            scope.Vm.FilterText = "[]\\;',./";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(0);

            scope.Vm.FilterText = "{}|:\"<>?";

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Vm.SalesItemIntervals.length).toBe(testItems.length);
            expect(scope.Model.FilteredIntervals.length).toBe(0);
        });
        /*
        it("LoadData calls mirroring service correctly", (): void => {
            var controller = createTestController();

            scope.$digest();
            scope.$digest();

            spyOn(mirrorServiceMock.Object, "GetSalesItemMirrorIntervals");
            controller.test.LoadData(scope.Vm.Dates);
            expect(mirrorServiceMock.Object.GetSalesItemMirrorIntervals).toHaveBeenCalled();
        });
        */
    });
} 