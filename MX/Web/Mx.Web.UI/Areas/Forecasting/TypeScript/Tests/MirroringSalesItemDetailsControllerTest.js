var Forecasting;
(function (_Forecasting) {
    (function (Tests) {
        "use strict";

        describe("@ts mirroring sales item details Controller", function () {
            var q, scope, translationServiceMock, popupMessageServiceMock, modalServiceMock, mirrorServiceMock, testTranslations = {
                Forecasting: {
                    TargetSalesItem: "TargetSalesItem",
                    Status: "Status",
                    MirrorDates: "MirrorDates",
                    Zone: "Zone"
                }
            }, now = moment(), testItems = [
                {
                    SourceDateStart: "2/5/15",
                    TargetDateStart: "2/5/15",
                    TargetDateEnd: "3/5/15",
                    SourceSalesItem: {
                        Id: 1,
                        ItemCode: "11025",
                        Description: "Milkshake, Kit-Kat"
                    },
                    TargetSalesItem: {
                        Id: 2,
                        ItemCode: "11025",
                        Description: "Milkshake, Kit-Kat"
                    },
                    Zone: {
                        Id: 3,
                        Name: "Test Market - Alpharetta"
                    },
                    Id: 4,
                    Adjustment: 5
                },
                {
                    SourceDateStart: "8/10/15",
                    TargetDateStart: now.clone().add("months", 2).format("MM/DD/YY"),
                    TargetDateEnd: now.clone().add("months", 3).format("MM/DD/YY"),
                    SourceSalesItem: {
                        Id: 6,
                        ItemCode: "Code",
                        Description: "Desc"
                    },
                    TargetSalesItem: {
                        Id: 7,
                        ItemCode: "Code",
                        Description: "Desc"
                    },
                    Zone: {
                        Id: 8,
                        Name: "Zone"
                    },
                    Id: 9,
                    Adjustment: 10
                },
                {
                    SourceDateStart: "6/10/15",
                    TargetDateStart: now.clone().subtract("months", 2).format("MM/DD/YY"),
                    TargetDateEnd: now.clone().add("months", 2).format("MM/DD/YY"),
                    SourceSalesItem: {
                        Id: 11,
                        ItemCode: "12903",
                        Description: "Lemonade, Frosted"
                    },
                    TargetSalesItem: {
                        Id: 12,
                        ItemCode: "12903",
                        Description: "Lemonade, Frosted"
                    },
                    Zone: {
                        Id: 13,
                        Name: "Zone All Restaurants"
                    },
                    Id: 14,
                    Adjustment: 15
                }
            ];

            var createTestController = function () {
                new Forecasting.MirroringController(scope, null, translationServiceMock.Object, popupMessageServiceMock, modalServiceMock.Object, mirrorServiceMock.Object);

                scope.Vm.SelectedInterval = testItems[0];

                return new Forecasting.MirroringSalesItemDetailsController(scope, modalServiceMock.Object, popupMessageServiceMock, null);
            };

            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    q = $q;
                    scope = $rootScope;
                    translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                    mirrorServiceMock = new Tests.MirroringServiceMock(q);
                });

                popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
                modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
            });

            it("defines all scope methods and models upon initialization", function () {
                createTestController();

                expect(scope.Vm).toBeDefined();
                expect(scope.Vm.L10N).toBeDefined();
                expect(scope.NavigateTo).toBeDefined();
                expect(scope.NavigateToParam).toBeDefined();
            });

            it("loads translations correctly and sets correct header", function () {
                translationServiceMock.InjectTranslations(testTranslations);

                var controller = createTestController();
            });
        });
    })(_Forecasting.Tests || (_Forecasting.Tests = {}));
    var Tests = _Forecasting.Tests;
})(Forecasting || (Forecasting = {}));
//# sourceMappingURL=MirroringSalesItemDetailsControllerTest.js.map
