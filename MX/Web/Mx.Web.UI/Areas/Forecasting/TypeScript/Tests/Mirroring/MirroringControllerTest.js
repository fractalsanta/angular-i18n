var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts mirroring Controller", function () {
            var q, scope, translationServiceMock, popupMessageServiceMock, modalServiceMock, mirrorServiceMock, authenticationServiceMock, testTranslationsForecasting = {
                TargetSalesItem: "TargetSalesItem",
                Status: "Status",
                MirrorDates: "MirrorDates",
                Zone: "Zone"
            }, testTranslations = {
                Forecasting: testTranslationsForecasting
            };
            var createTestController = function () {
                return new Forecasting.MirroringController(scope, null, authenticationServiceMock.Object, translationServiceMock.Object, popupMessageServiceMock, modalServiceMock.Object, mirrorServiceMock.Object);
            };
            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    q = $q;
                    scope = $rootScope;
                    authenticationServiceMock = new Core.Tests.AuthServiceMock();
                    translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                    modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
                    mirrorServiceMock = new Tests.MirroringServiceMock(q);
                });
                popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
            });
            it("defines all scope methods and models upon initialization", function () {
                createTestController();
                expect(scope.Vm).toBeDefined();
                expect(scope.Vm.L10N).toBeDefined();
                expect(scope.Vm.Dates).toBeUndefined();
                expect(scope.Vm.FilterText).toBe("");
                expect(scope.Vm.SalesItemIntervals).toBeUndefined();
                expect(scope.Vm.SelectedSalesItemInterval).toBeUndefined();
                expect(scope.Vm.Zones).toBeUndefined();
                expect(scope.NavigateTo).toBeDefined();
                expect(scope.NavigateToParam).toBeDefined();
                expect(scope.Cancel).toBeDefined();
                expect(scope.OpenDateRangeDialog).toBeDefined();
                expect(scope.AddItem).toBeDefined();
                expect(scope.ViewDetails).toBeDefined();
                expect(scope.GetZoneSelectedCount).toBeDefined();
                expect(scope.Save).toBeDefined();
            });
            it("loads translations correctly and sets correct title", function () {
                var testTranslations = {
                    Forecasting: {
                        TitleMirroring: "TitleMirroring",
                        SalesItems: "SalesItems"
                    }
                };
                translationServiceMock.InjectTranslations(testTranslations);
                spyOn(translationServiceMock.Object, "GetTranslations").and.callThrough();
                spyOn(popupMessageServiceMock, "SetPageTitle").and.callThrough();
                createTestController();
                scope.$digest();
                scope.$digest();
                expect(scope.Vm.L10N).toBe(testTranslations.Forecasting);
                expect(popupMessageServiceMock.SetPageTitle).toHaveBeenCalled();
                scope.$digest();
                expect(popupMessageServiceMock.GetPageTitle()).toBe("");
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
