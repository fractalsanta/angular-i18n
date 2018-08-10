var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts mirroring sales item details Controller", function () {
            var q, scope, translationServiceMock, popupMessageServiceMock, modalServiceMock, mirrorServiceMock, authenticationServiceMock, testTranslationsForecasting = {
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
            }, testTranslations = {
                Forecasting: testTranslationsForecasting
            }, testItems;
            var createTestController = function () {
                new Forecasting.MirroringController(scope, null, authenticationServiceMock.Object, translationServiceMock.Object, popupMessageServiceMock, modalServiceMock.Object, mirrorServiceMock.Object);
                scope.Vm.SelectedSalesItemInterval = testItems[0];
                return new Forecasting.MirroringSalesItemDetailsController(scope, modalServiceMock.Object, popupMessageServiceMock, null);
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
                testItems = mirrorServiceMock.salesItemMirrorIntervalsServiceMock.GetData("GetSalesItemMirrorIntervals");
            });
            it("defines all scope methods and models upon initialization", function () {
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
            it("loads translations correctly and sets correct header", function () {
                translationServiceMock.InjectTranslations(testTranslations);
                createTestController();
                scope.$digest();
                scope.$digest();
                expect(scope.Vm.L10N).toBe(testTranslations.Forecasting);
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
