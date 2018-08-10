var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts mirroring sales item details Controller", function () {
            var q, salesItemMirrorIntervalsServiceMock, forecastZoneServiceMock, salesItemServiceMock, storeMirrorIntervalsServiceMock, constantsMock;
            var createTestController = function () {
                return new Forecasting.Services.MirroringService(q, salesItemMirrorIntervalsServiceMock.Object, forecastZoneServiceMock.Object, salesItemServiceMock.Object, storeMirrorIntervalsServiceMock.Object, constantsMock.Object);
            };
            beforeEach(function () {
                inject(function ($q) {
                    q = $q;
                    salesItemMirrorIntervalsServiceMock = new Tests.SalesItemMirrorIntervalsServiceMock($q);
                    forecastZoneServiceMock = new Tests.ForecastZoneServiceMock($q);
                    salesItemServiceMock = new Tests.SalesItemServiceMock($q);
                    storeMirrorIntervalsServiceMock = new Tests.StoreMirrorIntervalsServiceMock($q);
                });
                constantsMock = new ConstantsMock();
            });
            it("calculates max source start date correctly", function () {
                var controller = createTestController(), testItems = _.cloneDeep(salesItemMirrorIntervalsServiceMock.GetData("GetSalesItemMirrorIntervals")), interval = testItems[0];
                controller.Cast(interval);
                expect(controller.CalculateMaxSourceStart(interval).toDateString()).
                    toBe(moment(interval.TargetDateStartDate).subtract({ days: 14 }).toDate().toDateString());
                interval = testItems[1];
                controller.Cast(interval);
                expect(controller.CalculateMaxSourceStart(interval).toDateString()).
                    toBe(moment(interval.TargetDateStartDate).subtract({ days: 14 }).toDate().toDateString());
                interval = testItems[2];
                controller.Cast(interval);
                expect(controller.CalculateMaxSourceStart(interval).toDateString()).
                    toBe(moment(interval.TargetDateStartDate).subtract({ days: 14 }).toDate().toDateString());
            });
            it("calculates dates correctly", function () {
                var controller = createTestController(), testItems = _.cloneDeep(salesItemMirrorIntervalsServiceMock.GetData("GetSalesItemMirrorIntervals")), interval, intervalB4;
                interval = testItems[0];
                controller.Cast(interval);
                intervalB4 = _.clone(interval);
                interval.TargetDateStartDate = moment(interval.TargetDateStartDate).add({ days: 7 }).toDate();
                interval.TargetDateEndDate = moment(interval.TargetDateEndDate).subtract({ days: 6 }).toDate();
                interval.SourceDateStartDate = moment(interval.SourceDateStartDate).subtract({ days: 14 }).toDate();
                controller.CalculateDates(interval);
                expect(interval.TargetDateStartDate.toDateString()).
                    toBe(moment(interval.TargetDateStart).toDate().toDateString());
                expect(interval.TargetDateEndDate.toDateString()).
                    toBe(moment(interval.TargetDateEnd).subtract({ days: 1 }).toDate().toDateString());
                expect(interval.SourceDateStartDate.toDateString()).
                    toBe(moment(interval.SourceDateStart).toDate().toDateString());
                expect(interval.SourceDateEndDate.toDateString()).
                    toBe(moment(intervalB4.SourceDateEndDate).subtract({ days: (7 + 6 + 14) }).toDate().toDateString());
                interval = testItems[1];
                controller.Cast(interval);
                intervalB4 = _.clone(interval);
                interval.TargetDateStartDate = moment(interval.TargetDateStartDate).add({ days: 3 }).toDate();
                interval.TargetDateEndDate = moment(interval.TargetDateEndDate).add({ days: 6 }).toDate();
                interval.SourceDateStartDate = moment(interval.SourceDateStartDate).subtract({ days: 11 }).toDate();
                controller.CalculateDates(interval);
                expect(interval.TargetDateStartDate.toDateString()).
                    toBe(moment(interval.TargetDateStart).toDate().toDateString());
                expect(interval.TargetDateEndDate.toDateString()).
                    toBe(moment(interval.TargetDateEnd).subtract({ days: 1 }).toDate().toDateString());
                expect(interval.SourceDateStartDate.toDateString()).
                    toBe(moment(interval.SourceDateStart).toDate().toDateString());
                expect(interval.SourceDateEndDate.toDateString()).
                    toBe(moment(intervalB4.SourceDateEndDate).subtract({ days: (3 - 6 + 11) }).toDate().toDateString());
                interval = testItems[2];
                controller.Cast(interval);
                intervalB4 = _.clone(interval);
                interval.TargetDateStartDate = moment(interval.TargetDateStartDate).add({ days: 7 }).toDate();
                interval.TargetDateEndDate = moment(interval.TargetDateEndDate).subtract({ days: 6 }).toDate();
                interval.SourceDateStartDate = moment(interval.SourceDateStartDate).subtract({ days: 14 }).toDate();
                controller.CalculateDates(interval);
                expect(interval.TargetDateStartDate.toDateString()).
                    toBe(moment(interval.TargetDateStart).toDate().toDateString());
                expect(interval.TargetDateEndDate.toDateString()).
                    toBe(moment(interval.TargetDateEnd).subtract({ days: 1 }).toDate().toDateString());
                expect(interval.SourceDateStartDate.toDateString()).
                    toBe(moment(interval.SourceDateStart).toDate().toDateString());
                expect(interval.SourceDateEndDate.toDateString()).
                    toBe(moment(intervalB4.SourceDateEndDate).subtract({ days: (7 + 6 + 14) }).toDate().toDateString());
            });
            it("casts ISalesItemMirrorInterval to IMySalesItemMirroringInterval correctly", function () {
                var controller = createTestController(), testItems = _.cloneDeep(salesItemMirrorIntervalsServiceMock.GetData("GetSalesItemMirrorIntervals")), interval = testItems[0];
                controller.Cast(interval);
                expect(interval.TargetDateStartDate).toBeDefined();
                expect(interval.TargetDateEndDate).toBeDefined();
                expect(interval.SourceDateStartDate).toBeDefined();
                expect(interval.SourceDateEndDate).toBeDefined();
                expect(interval.AdjustmentPercent).toBeDefined();
                expect(moment(interval.SourceDateEndDate).diff(moment(interval.SourceDateStartDate), "days")).
                    toBe(moment(interval.TargetDateEndDate).diff(moment(interval.TargetDateStart), "days"));
                expect(interval.AdjustmentPercent).toBe("" + (interval.Adjustment - 1) * 100);
                interval = testItems[1];
                controller.Cast(interval);
                expect(interval.TargetDateStartDate).toBeDefined();
                expect(interval.TargetDateEndDate).toBeDefined();
                expect(interval.SourceDateStartDate).toBeDefined();
                expect(interval.SourceDateEndDate).toBeDefined();
                expect(interval.AdjustmentPercent).toBeDefined();
                expect(moment(interval.SourceDateEndDate).diff(moment(interval.SourceDateStartDate), "days")).
                    toBe(moment(interval.TargetDateEndDate).diff(moment(interval.TargetDateStart), "days"));
                expect(interval.AdjustmentPercent).toBe("" + (interval.Adjustment - 1) * 100);
                interval = testItems[2];
                controller.Cast(interval);
                expect(interval.TargetDateStartDate).toBeDefined();
                expect(interval.TargetDateEndDate).toBeDefined();
                expect(interval.SourceDateStartDate).toBeDefined();
                expect(interval.SourceDateEndDate).toBeDefined();
                expect(interval.AdjustmentPercent).toBeDefined();
                expect(moment(interval.SourceDateEndDate).diff(moment(interval.SourceDateStartDate), "days")).
                    toBe(moment(interval.TargetDateEndDate).diff(moment(interval.TargetDateStart), "days"));
                expect(interval.AdjustmentPercent).toBe("" + (interval.Adjustment - 1) * 100);
            });
            it("calculates adjustment correctly", function () {
                var controller = createTestController();
                expect(controller.CalculateAdjustment(100)).toBe(2);
                expect(controller.CalculateAdjustment(0)).toBe(1);
                expect(controller.CalculateAdjustment(-100)).toBe(0);
                expect(controller.CalculateAdjustment(50)).toBe(1.5);
                expect(controller.CalculateAdjustment(-25)).toBe(.75);
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
