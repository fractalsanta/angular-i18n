/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../Services/DataService.ts" />
/// <reference path="../../Services/ForcastingObjectService.ts" />
/// <reference path="MirroringServiceMock.ts"/>

/// <reference path="../../Interfaces/IMirrorings.d.ts" />
/// <reference path="../../Controllers/MirroringStoreController.ts" />
/// <reference path="../../Services/MirroringService.ts" />
/// <reference path="../../../../Core/Typescript/Directives/mx-grid-header-directive.ts" />
/// <reference path="../../../../Core/Typescript/Models/IConfirmation.ts" />
/// <reference path="../../Controllers/MirroringStoresController.ts" />
/// <reference path="../../Interfaces/IMirroringChangeEndDateResult.d.ts" />
/// <reference path="../../../../Core/Typescript/Interfaces/IDateRangeOptions.d.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts mirroring stores Controller", (): void => {
        var q: ng.IQService,
            scope: IMirroringStoresControllerScope,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageServiceMock: Core.Tests.PopupMessageServiceMock,
            modalServiceMock: Core.Tests.ModalServiceMock,
            mirroringServiceMock: Forecasting.Tests.MirroringServiceMock,
            authenticationServiceMock: Core.Tests.AuthServiceMock,
            timeout: ng.ITimeoutService,
            testTranslationsForecasting: Forecasting.Api.Models.ITranslations = <Forecasting.Api.Models.ITranslations>{
                Status: "Status",
                AddMirror: "AddMirror",
                MirrorDates: "MirrorDates",
                Active: "Active",
                Cancelled: "Cancelled",
                Completed: "Completed",
                All: "All",
                InProgress: "InProgress",
                Scheduled: "Scheduled",
                PendingCancellation: "PendingCancellation",
                PartiallyCompleted: "PartiallyCompleted",
                Error: "Error"
            },
            testTranslations: Core.Api.Models.ITranslations = <Core.Api.Models.ITranslations>{
                Forecasting: testTranslationsForecasting
            },
            testStores: IMyStoreMirrorIntervalGroup[];

        var createTestController = (): any => {
            var state = new Forecasting.MirroringStoreController(
                scope,
                null,
                authenticationServiceMock.Object,
                translationServiceMock.Object,
                popupMessageServiceMock,
                modalServiceMock.Object,
                mirroringServiceMock.Object
                );

            var test = new Forecasting.MirroringStoresController(
                scope,
                popupMessageServiceMock,
                mirroringServiceMock.Object,
                timeout
                );

            return {
                state: state,
                test: test
            };
        };

        beforeEach((): void => {
            inject(($rootScope: IMirroringStoresControllerScope, $q: ng.IQService, $timeout: ng.ITimeoutService): void => {
                q = $q;
                scope = $rootScope;
                timeout = $timeout;
                authenticationServiceMock = new Core.Tests.AuthServiceMock();
                translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
                mirroringServiceMock = new MirroringServiceMock(q);
            });

            popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
            testStores = mirroringServiceMock.storeMirrorIntervalsServiceMock.GetData("GetStoreMirrorIntervals");
        });

        it("defines all scope methods and models upon initialization", (): void => {
            createTestController();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.L10N).toBeDefined();
            expect(scope.Vm.FilterStatus).toBe(1);
            expect(scope.Vm.StoreGroupIntervals).toBeUndefined();
            expect(scope.Vm.SelectedStoreGroupInterval).toBeUndefined();

            expect(scope.NavigateTo).toBeDefined();
            expect(scope.NavigateToParam).toBeDefined();
            expect(scope.Cancel).toBeDefined();
            expect(scope.AddMirror).toBeDefined();
            expect(scope.ViewMirrorDetails).toBeDefined();
            expect(scope.Save).toBeDefined();

            expect(scope.Model).toBeDefined();
            expect(scope.Model.FilteredIntervals).toBeUndefined();

            expect(scope.StatusMap).toBeDefined();
            expect(scope.GroupStatusOptions).toBeDefined();
            expect(scope.ChangeGroupStatus).toBeDefined();
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
            scope.Vm.StoreGroupIntervals = testStores;
            expect(scope.Vm.StoreGroupIntervals).toBeDefined();
            expect(scope.Model.FilteredIntervals).toBeUndefined();
            controller.test.Initialize();
            scope.$digest();
            scope.$digest();
            expect(controller.test.LoadData).not.toHaveBeenCalled();
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
            expect(header.Columns[0].Title).toBe(testTranslations.Forecasting.Status);
            expect(header.Columns[1].Title).toBe(testTranslations.Forecasting.MirrorDates);
            expect(header.Columns[2].Title).toBe("");
        });

        it("loads translations correctly and sets status select options", (): void => {
            translationServiceMock.InjectTranslations(testTranslations);

            var controller = createTestController();

            spyOn(controller.test, "GetGroupStatusOptions").and.callThrough();

            scope.$digest();
            scope.$digest();

            expect(controller.test.GetGroupStatusOptions).toHaveBeenCalled();

            var options = scope.GroupStatusOptions();
            expect(options).toBeDefined();
            expect(options.length).toBe(4);
            expect(options[0].Value).toBeDefined();
            expect(options[0].Title).toBeDefined();

            expect(scope.Vm.FilterStatus).toBe(StoreMirrorStatusGroup.Active);
        });

        it("loads translations correctly and builds status map select options", (): void => {
            translationServiceMock.InjectTranslations(testTranslations);

            var controller = createTestController();

            spyOn(controller.test, "GetStatusMap").and.callThrough();

            scope.$digest();
            scope.$digest();

            expect(controller.test.GetStatusMap).toHaveBeenCalled();
            
            var map = scope.StatusMap();
            expect(map).toBeDefined();
            expect(map[StoreMirrorStatus.Completed]).toBeDefined();
            expect(map[StoreMirrorStatus.InProgress]).toBeDefined();
            expect(map[StoreMirrorStatus.Scheduled]).toBeDefined();
            expect(map[StoreMirrorStatus.Cancelled]).toBeDefined();
            expect(map[StoreMirrorStatus.PendingCancellation]).toBeDefined();
            expect(map[StoreMirrorStatus.PartiallyCompleted]).toBeDefined();
        });

        it("loads data, casts to IMirrorInterval", (): void => {
            var controller = createTestController();

            spyOn(controller.test, "LoadData").and.callThrough();
            spyOn(mirroringServiceMock.Object, "Cast").and.callThrough();
            spyOn(scope, "FilterIntervals").and.callFake(function (): void { ; });

            controller.test.Initialize();
            scope.$digest();
            scope.$digest();

            expect(controller.test.LoadData).toHaveBeenCalled();
            expect(mirroringServiceMock.Object.Cast).toHaveBeenCalled();
            expect(scope.FilterIntervals).toHaveBeenCalled();
            expect(scope.Vm.StoreGroupIntervals).toBeDefined();
            expect(scope.Vm.StoreGroupIntervals[0].SourceDateStartDate).toBeDefined();
            expect(scope.Vm.StoreGroupIntervals[0].TargetDateEndDate).toBeDefined();
            expect(scope.Vm.StoreGroupIntervals[0].TargetDateStartDate).toBeDefined();
            expect(scope.Vm.StoreGroupIntervals[0].SourceDateEndDate).toBeDefined();
            expect(scope.Vm.StoreGroupIntervals[0].Adjustment).toBeDefined();
            expect(scope.Vm.StoreGroupIntervals[0].AdjustmentPercent).toBeDefined();
        });

        it("filters data correctly after filtered status changed", (): void => {
            var controller = createTestController();

            spyOn(controller.test, "ApplySearchFilter").and.callThrough();

            controller.test.Initialize();

            scope.Vm.FilterStatus = StoreMirrorStatusGroup.Active;
            scope.ChangeGroupStatus();

            scope.$digest();
            scope.$digest();

            expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
            expect(scope.Model.FilteredIntervals).toBeDefined();
            expect(scope.Model.FilteredIntervals.length).toBe(1);
            expect((<any>scope.Model.FilteredIntervals[0]).OverallStatusGroup).toBe(StoreMirrorStatusGroup.Active);
            
            scope.Vm.FilterStatus = StoreMirrorStatusGroup.Cancelled;
            scope.ChangeGroupStatus();

            scope.$digest();
            scope.$digest();

            expect(scope.Model.FilteredIntervals).toBeDefined();
            expect(scope.Model.FilteredIntervals.length).toBe(1);
            expect((<any>scope.Model.FilteredIntervals[0]).OverallStatusGroup).toBe(StoreMirrorStatusGroup.Cancelled);

            scope.Vm.FilterStatus = StoreMirrorStatusGroup.Everything;
            scope.ChangeGroupStatus();

            scope.$digest();
            scope.$digest();

            expect(scope.Model.FilteredIntervals).toBeDefined();
            expect(scope.Model.FilteredIntervals.length).toBe(5);
        });
    });
} 