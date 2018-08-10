var Forecasting;
(function (_Forecasting) {
    (function (Tests) {
        "use strict";

        describe("@ts mirroring sales items Controller", function () {
            var q, scope, translationServiceMock, popupMessageServiceMock, modalServiceMock, mirrorServiceMock, testTranslations = {
                Forecasting: {
                    TargetSalesItem: "TargetSalesItem",
                    TargetSalesItemCode: "TargetSalesItemCode",
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
                },
                {
                    SourceDateStart: "2/10/15",
                    TargetDateStart: now.clone().add("hours", 2).format("MM/DD/YY HH:mm"),
                    TargetDateEnd: now.clone().add("months", 3).format("MM/DD/YY"),
                    SourceSalesItem: {
                        Id: 16,
                        ItemCode: "Code",
                        Description: "test same day diff hour"
                    },
                    TargetSalesItem: {
                        Id: 17,
                        ItemCode: "Code",
                        Description: "test same day diff hour"
                    },
                    Zone: {
                        Id: 18,
                        Name: "z test same day diff hour"
                    },
                    Id: 19,
                    Adjustment: 20
                }
            ];

            var createTestController = function () {
                var state = new Forecasting.MirroringController(scope, null, translationServiceMock.Object, popupMessageServiceMock, modalServiceMock.Object, mirrorServiceMock.Object);

                var test = new Forecasting.MirroringSalesItemsController(scope, null, popupMessageServiceMock, mirrorServiceMock.Object);

                return {
                    state: state,
                    test: test
                };
            };

            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    q = $q;
                    scope = $rootScope;
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
                expect(scope.Vm.Intervals).toBeUndefined();
                expect(scope.Vm.SelectedInterval).toBeUndefined();

                expect(scope.NavigateTo).toBeDefined();
                expect(scope.NavigateToParam).toBeDefined();
                expect(scope.Cancel).toBeDefined();
                expect(scope.AddItem).toBeDefined();
                expect(scope.ViewDetails).toBeDefined();
                expect(scope.DeleteMirror).toBeDefined();
                expect(scope.ChangeEndDate).toBeDefined();
                expect(scope.Cast).toBeDefined();

                expect(scope.Model).toBeDefined();
                expect(scope.Model.FilteredIntervals).toBeUndefined();

                expect(scope.Header).toBeDefined();
                expect(scope.FilterIntervals).toBeDefined();
            });

            it("loads translations correctly and sets correct header", function () {
                translationServiceMock.InjectTranslations(testTranslations);

                var controller = createTestController();

                spyOn(controller.test, "GetHeader").and.callThrough();

                scope.$digest();
                scope.$digest();

                expect(controller.test.GetHeader).toHaveBeenCalled();

                var header = scope.Header();
                expect(header.Columns[0].Title).toBe(testTranslations.Forecasting.TargetSalesItemCode);
                expect(header.Columns[1].Title).toBe(testTranslations.Forecasting.MirrorDates);
                expect(header.Columns[2].Title).toBe(testTranslations.Forecasting.Zone);
                expect(header.Columns[3].Title).toBe("");
            });

            it("loads data correctly after date change", function () {
                mirrorServiceMock.SetData("GetSalesItemMirrorIntervals", testItems);

                var controller = createTestController();

                spyOn(controller.test, "LoadData").and.callThrough();

                scope.Vm.Dates = { StartDate: new Date(), EndDate: new Date() };
                scope.$digest();
                scope.$digest();
                scope.Vm.Dates = { StartDate: moment().subtract({ days: 1 }).toDate(), EndDate: new Date() };
                scope.$digest();
                scope.$digest();

                expect(controller.test.LoadData).toHaveBeenCalled();
                expect(scope.Vm.Intervals).toBeDefined();
                expect(scope.Model.FilteredIntervals).toBeDefined();

                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(testItems.length);
            });

            it("filters data correctly after filtered text changed", function () {
                translationServiceMock.InjectTranslations(testTranslations);
                mirrorServiceMock.SetData("GetSalesItemMirrorIntervals", testItems);

                var controller = createTestController();

                spyOn(controller.test, "ApplySearchFilter").and.callThrough();

                scope.$digest();
                scope.$digest();

                expect(scope.Vm.Intervals).toBeDefined();
                expect(scope.Model.FilteredIntervals).toBeDefined();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(testItems.length);

                scope.Vm.FilterText = "asdf";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(0);

                scope.Vm.FilterText = "Kit-Kat";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(1);
                expect(scope.Model.FilteredIntervals[0].Id).toBe(4);

                scope.Vm.FilterText = "";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(testItems.length);

                scope.Vm.FilterText = "Test Market";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(1);
                expect(scope.Model.FilteredIntervals[0].Id).toBe(4);

                scope.Vm.FilterText = "zone";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(2);
                expect(scope.Model.FilteredIntervals[0].Id).toBe(9);
                expect(scope.Model.FilteredIntervals[1].Id).toBe(14);

                scope.Vm.FilterText = "~1234567890-=";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(0);

                scope.Vm.FilterText = "~!@#$%^&*()_+";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(0);

                scope.Vm.FilterText = "[]\\;',./";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(0);

                scope.Vm.FilterText = "{}|:\"<>?";

                scope.$digest();
                scope.$digest();

                expect(controller.test.ApplySearchFilter).toHaveBeenCalled();
                expect(scope.Vm.Intervals.length).toBe(testItems.length);
                expect(scope.Model.FilteredIntervals.length).toBe(0);
            });
        });
    })(_Forecasting.Tests || (_Forecasting.Tests = {}));
    var Tests = _Forecasting.Tests;
})(Forecasting || (Forecasting = {}));
//# sourceMappingURL=MirroringSalesItemsControllerTest.js.map
