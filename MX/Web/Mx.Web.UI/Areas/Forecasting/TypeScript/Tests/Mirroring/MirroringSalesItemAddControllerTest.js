var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts mirroring sales item add Controller", function () {
            var q, scope, translationServiceMock, popupMessageServiceMock, confirmationServiceMock, modalServiceMock, mirrorServiceMock, authenticationServiceMock, testTranslationsForecasting = {
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
                SaveMirrorTitle: "SaveMirrorTitle",
                SaveMirrorMessage: "SaveMirrorMessage",
                Cancel: "Cancel"
            }, testTranslations = {
                Forecasting: testTranslationsForecasting
            };
            var createTestController = function () {
                new Forecasting.MirroringController(scope, null, authenticationServiceMock.Object, translationServiceMock.Object, popupMessageServiceMock, modalServiceMock.Object, mirrorServiceMock.Object);
                confirmationServiceMock = new Core.Tests.ConfirmationServiceMock(q);
                return new Forecasting.MirroringSalesItemAddController(scope, modalServiceMock.Object, popupMessageServiceMock, confirmationServiceMock, mirrorServiceMock.Object);
            };
            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    q = $q;
                    scope = $rootScope;
                    authenticationServiceMock = new Core.Tests.AuthServiceMock();
                    translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                    mirrorServiceMock = new Tests.MirroringServiceMock(q);
                });
                popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
                modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
            });
            it("defines all scope methods and models upon initialization", function () {
                var controller = createTestController();
                scope.$digest();
                scope.$digest();
                expect(scope.Vm).toBeDefined();
                expect(scope.Vm.L10N).toBeDefined();
                expect(scope.NavigateTo).toBeDefined();
                expect(scope.NavigateToParam).toBeDefined();
                expect(scope.Vm).toBeDefined();
                expect(scope.Vm.L10N).toBeDefined();
                expect(scope.Vm.SelectedSalesItemInterval).toBeDefined();
                expect(scope.Vm.Zones).toBeDefined();
                expect(scope.Cancel).toBeDefined();
                expect(scope.GetZoneSelectedCount).toBeDefined();
                expect(scope.Save).toBeDefined();
                expect(scope.SelectTargetSalesItem).toBeDefined();
                expect(scope.OpenSourceStartDateDialog).toBeDefined();
                expect(scope.OnDateChange).toBeDefined();
                expect(scope.Vm.SelectedSalesItemInterval).toBe(scope.Model.Interval);
                expect(scope.Model).toBeDefined();
                expect(scope.Model.Interval).toBeDefined();
                expect(scope.Model.Interval.Adjustment).toBe(1);
                expect(scope.Model.Interval.AdjustmentPercent).toBe("0%");
                expect(scope.Model.TargetDateOptions).toBeDefined();
                expect(scope.Model.TargetDateOptions.Min).toBeDefined();
                expect(scope.Model.TargetDateOptions.Max).toBeDefined();
                expect(scope.Model.TargetDateOptions.Start).toBeDefined();
                expect(scope.Model.TargetDateOptions.End).toBeDefined();
                expect(scope.Model.SourceDateOptions).toBeDefined();
                expect(scope.Model.SourceDateOptions.Open).toBeDefined();
                expect(scope.Model.SourceDateOptions.Min).toBeDefined();
                expect(scope.Model.SourceDateOptions.Max).toBeDefined();
                spyOn(controller, "GetSalesItems").and.callThrough();
                controller.Initialize();
                expect(controller.GetSalesItems).toHaveBeenCalled();
            });
            it("loads translations correctly ", function () {
                translationServiceMock.InjectTranslations(testTranslations);
                createTestController();
                scope.$digest();
                scope.$digest();
                expect(scope.Vm.L10N).toBe(testTranslations.Forecasting);
            });
            it("OnAdjustmentChange updates adjustment correctly", function () {
                createTestController();
                var interval = scope.Model.Interval;
                scope.Model.Interval.AdjustmentPercent = "100%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(2);
                scope.Model.Interval.AdjustmentPercent = "-100%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(0);
                scope.Model.Interval.AdjustmentPercent = "0%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(1);
                scope.Model.Interval.AdjustmentPercent = "-10%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(.9);
                scope.Model.Interval.AdjustmentPercent = "10%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(1.1);
                scope.Model.Interval.AdjustmentPercent = "50%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(1.5);
                scope.Model.Interval.AdjustmentPercent = "-25%";
                scope.OnAdjustmentChange(interval);
                expect(scope.Model.Interval.Adjustment).toBe(.75);
            });
            it("IsDirty works correctly", function () {
                var controller = createTestController(), interval = scope.Model.Interval;
                expect(scope.IsDirty()).toBe(false);
                scope.Model.Interval.AdjustmentPercent = "-10%";
                scope.OnAdjustmentChange(interval);
                expect(scope.IsDirty()).toBe(true);
                controller.Initialize();
                expect(scope.IsDirty()).toBe(false);
                scope.Model.Interval.TargetSalesItem.Id = 1;
                expect(scope.IsDirty()).toBe(true);
                controller.Initialize();
                expect(scope.IsDirty()).toBe(false);
                scope.Model.Interval.SourceSalesItem.Id = 1;
                expect(scope.IsDirty()).toBe(true);
                controller.Initialize();
                expect(scope.IsDirty()).toBe(false);
                scope.Model.Interval.TargetDateStartDate = new Date();
                expect(scope.IsDirty()).toBe(true);
                controller.Initialize();
                expect(scope.IsDirty()).toBe(false);
                scope.Model.Interval.SourceDateStartDate = new Date();
                expect(scope.IsDirty()).toBe(true);
                controller.Initialize();
                expect(scope.IsDirty()).toBe(false);
                scope.Model.Interval.Zone.Id = 1;
                expect(scope.IsDirty()).toBe(true);
            });
            it("OpenTargetDateRangeDialog calls OpenDateRangeDialog", function () {
                createTestController();
                spyOn(scope, "OpenDateRangeDialog").and.callFake(function () { return { then: function () { } }; });
                scope.OpenTargetDateRangeDialog({});
                expect(scope.OpenDateRangeDialog).toHaveBeenCalled();
            });
            it("OpenSourceStartDateDialog opens source date picker", function () {
                createTestController();
                scope.OpenSourceStartDateDialog({
                    preventDefault: function () { },
                    stopPropagation: function () { }
                });
                expect(scope.Model.SourceDateOptions.Open).toBe(true);
            });
            it("OnDateChange closes source date picker", function () {
                createTestController();
                scope.OnDateChange();
                expect(scope.Model.SourceDateOptions.Open).toBe(false);
            });
            it("Cancel not dirty navs correctly with no cancel changes confirmation", function () {
                createTestController();
                spyOn(scope, "IsDirty").and.callFake(function () { return false; });
                spyOn(scope, "NavigateTo").and.callFake(function () { });
                scope.Cancel();
                expect(scope.IsDirty).toHaveBeenCalled();
                expect(confirmationServiceMock.IsCalled()).toBe(false);
                expect(scope.NavigateTo).toHaveBeenCalled();
            });
            it("Cancel dirty triggers cancel changes confirmation", function () {
                createTestController();
                spyOn(scope, "IsDirty").and.callFake(function () { return true; });
                scope.Cancel();
                expect(scope.IsDirty).toHaveBeenCalled();
                expect(confirmationServiceMock.IsCalled()).toBe(true);
            });
            it("Save triggers save confirmation", function () {
                var controller = createTestController();
                spyOn(controller, "SaveConfirmation").and.callFake(function () { return { then: function () { } }; });
                scope.Save();
                expect(controller.SaveConfirmation).toHaveBeenCalled();
            });
            it("SelectTargetSalesItem triggers sales item search", function () {
                var controller = createTestController();
                spyOn(controller, "OpenSelectSalesItemDialog").and.callFake(function () { return { then: function () { } }; });
                scope.SelectTargetSalesItem();
                expect(controller.OpenSelectSalesItemDialog).toHaveBeenCalled();
            });
            it("SelectSourceSalesItem triggers sales item search", function () {
                var controller = createTestController();
                spyOn(controller, "OpenSelectSalesItemDialog").and.callFake(function () { return { then: function () { } }; });
                scope.SelectSourceSalesItem();
                expect(controller.OpenSelectSalesItemDialog).toHaveBeenCalled();
            });
            it("GetSalesItems calls mirroring service correctly", function () {
                var controller = createTestController(), search = "a search string";
                spyOn(mirrorServiceMock.Object, "GetSalesItems").and.callThrough();
                controller.GetSalesItems(search);
                expect(mirrorServiceMock.Object.GetSalesItems).toHaveBeenCalledWith(search);
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
