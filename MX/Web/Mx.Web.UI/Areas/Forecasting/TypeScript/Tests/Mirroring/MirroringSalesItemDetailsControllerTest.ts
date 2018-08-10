/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../Services/MirroringService.ts" />
/// <reference path="../../Services/DataService.ts" />
/// <reference path="../../Services/ForcastingObjectService.ts" />
/// <reference path="MirroringServiceMock.ts"/>

/// <reference path="../../Interfaces/IMirrorings.d.ts" />
/// <reference path="../../Controllers/MirroringController.ts" />
/// <reference path="../../../../Core/Typescript/Directives/mx-grid-header-directive.ts" />
/// <reference path="../../Controllers/MirroringSalesItemDetailsController.ts" />
/// <reference path="../../Interfaces/IMirroringChangeEndDateResult.d.ts" />
/// <reference path="../../../../Core/Typescript/Interfaces/IDateRangeOptions.d.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts mirroring sales item details Controller", (): void => {
        var q: ng.IQService,
            scope: IMirroringSalesItemDetailsControllerScope,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageServiceMock: Core.Tests.PopupMessageServiceMock,
            modalServiceMock: Core.Tests.ModalServiceMock,
            mirrorServiceMock: Forecasting.Tests.MirroringServiceMock,
            authenticationServiceMock: Core.Tests.AuthServiceMock,
            testTranslationsForecasting: Forecasting.Api.Models.ITranslations = <Forecasting.Api.Models.ITranslations>{
                Back: "Back",
                Save: "Save",
                TargetSalesItem: "TargetSalesItem",
                SearchForItems: "SearchForItems",
                TargetDateRange: "TargetDateRange",
                SelectDates: "SelectDates",
                SourceStartDate: "SourceStartDate",
                SourceEndDate: "SourceEndDate",
                RestaurantZone: "RestaurantZone",
                SelectZone: "SelectZone",
                Restaurants: "Restaurants",
                AdditionalAdjustment: "AdditionalAdjustment",
                SourceDateRangeError: "SourceDateRangeError",
                MustStartSameDay: "MustStartSameDay",
                ChangeEndDate: "ChangeEndDate",
                DeleteMirror: "DeleteMirror",
                SavedSuccessfully: "SavedSuccessfully",
                DeleteMirrorSuccess: "DeleteMirrorSuccess",
                DeleteMirrorMessage: "DeleteMirrorMessage",
                Delete: "Delete"
            },
            testTranslations: Core.Api.Models.ITranslations = <Core.Api.Models.ITranslations>{
                Forecasting: testTranslationsForecasting
            },
            testItems: IMySalesItemMirroringInterval[];

        var createTestController = (): Forecasting.MirroringSalesItemDetailsController => {
            new Forecasting.MirroringController(
                scope,
                null,
                authenticationServiceMock.Object,
                translationServiceMock.Object,
                popupMessageServiceMock,
                modalServiceMock.Object,
                mirrorServiceMock.Object
                );


            scope.Vm.SelectedSalesItemInterval = testItems[0];

            return new Forecasting.MirroringSalesItemDetailsController(
                scope, modalServiceMock.Object,
                popupMessageServiceMock,
                null
                );
        };

        beforeEach((): void => {
            inject(($rootScope: IMirroringSalesItemDetailsControllerScope, $q: ng.IQService): void => {
                q = $q;
                scope = $rootScope;
                authenticationServiceMock = new Core.Tests.AuthServiceMock();
                translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                mirrorServiceMock = new MirroringServiceMock(q);
            });

            popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
            modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
            testItems = mirrorServiceMock.salesItemMirrorIntervalsServiceMock.GetData("GetSalesItemMirrorIntervals");
        });

        it("defines all scope methods and models upon initialization", (): void => {
            createTestController();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.L10N).toBeDefined();
            expect(scope.NavigateTo).toBeDefined();
            expect(scope.NavigateToParam).toBeDefined();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.L10N).toBeDefined();
            expect(scope.Vm.Dates).toBeUndefined();
            expect(scope.Vm.FilterText).toBe("");
            expect(scope.Vm.SalesItemIntervals).toBeUndefined();
            expect(scope.Vm.SelectedSalesItemInterval).toBeDefined();
            expect(scope.Vm.Zones).toBeUndefined();

            expect(scope.NavigateTo).toBeDefined();
            expect(scope.NavigateToParam).toBeDefined();
            expect(scope.Cancel).toBeDefined();
            expect(scope.OpenDateRangeDialog).toBeDefined();
            expect(scope.AddItem).toBeDefined();
            expect(scope.ViewDetails).toBeDefined();
            expect(scope.DeleteMirror).toBeDefined();
            expect(scope.ChangeEndDate).toBeDefined();
            expect(scope.GetZoneSelectedCount).toBeDefined();
            expect(scope.Save).toBeDefined();
        });

        it("loads translations correctly and sets correct header", (): void => {
            translationServiceMock.InjectTranslations(testTranslations);

            createTestController();

            scope.$digest();
            scope.$digest();

            expect(scope.Vm.L10N).toBe(testTranslations.Forecasting);
        });
    });
} 