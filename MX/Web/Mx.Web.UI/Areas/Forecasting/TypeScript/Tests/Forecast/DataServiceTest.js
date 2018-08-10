var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts forecasting data service", function () {
            var q, rootScope, authorizationServiceMock, historicalService, salesItemHistoricalService, salesItemMetricAllServiceMock, forecastServiceMock, salesItemMetricServiceMock, metricServiceMock, daySegmentService, salesItemServiceMock, metricAllServiceMock, forecastSalesEvaluationService, forecastSalesItemEvaluationService, forecastTransactionEvaluationService, multiFilterMetricAllServiceMock, multiFilterSalesItemMetricAllServiceMock;
            var createTestController = function () {
                return new Forecasting.Services.DataService(q, authorizationServiceMock.Object, null, null, salesItemMetricAllServiceMock.Object, forecastServiceMock.Object, salesItemMetricServiceMock.Object, metricServiceMock.Object, null, salesItemServiceMock.Object, metricAllServiceMock.Object, null, null, null, multiFilterMetricAllServiceMock.Object, multiFilterSalesItemMetricAllServiceMock.Object);
            };
            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    q = $q;
                    rootScope = $rootScope;
                    authorizationServiceMock = new Core.Tests.AuthServiceMock();
                    salesItemMetricAllServiceMock = new Tests.SalesItemMetricAllServiceMock(q);
                    forecastServiceMock = new Tests.ForecastServiceMock(q);
                    salesItemMetricServiceMock = new Tests.SalesItemMetricServiceMock(q);
                    metricServiceMock = new Tests.MetricServiceMock(q);
                    salesItemServiceMock = new Tests.SalesItemServiceMock(q);
                    metricAllServiceMock = new Tests.MetricAllServiceMock(q);
                    multiFilterMetricAllServiceMock = new Tests.MultiFilterMetricAllServiceMock(q);
                    multiFilterSalesItemMetricAllServiceMock = new Tests.MultiFilterSalesItemMetricAllServiceMock(q);
                });
            });
            it("GetAllForecastingDataForDateByFilter no filters and no metrics", function () {
                var ds = createTestController(), dayString = "", noMetrics = true;
                ds.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then(function (data) {
                    expect(data.FilterIds).toBe(null);
                    expect(data.ForecastId).toBeDefined();
                    expect(data.SalesItemId).toBeUndefined();
                    expect(data.TargetDate).toBeDefined();
                    expect(data.Forecast).toBeDefined();
                    expect(data.ForecastMetricAlls).toBe(null);
                    expect(data.ForecastMetricAllsFiltered).toBe(null);
                }).catch(function (reason) {
                    console.log("GetAllForecastingDataForDateByFilter Service returned an error - no filters or metrics");
                    expect(true).toBe(false);
                });
                rootScope.$digest();
            });
            it("GetAllForecastingDataForDateByFilter no filters and metrics", function () {
                var ds = createTestController(), dayString = "", noMetrics = false;
                ds.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then(function (data) {
                    expect(data).toBeDefined();
                }).catch(function (reason) {
                    console.log("GetAllForecastingDataForDateByFilter Service returned an error - with metrics");
                    expect(true).toBe(false);
                });
                rootScope.$digest();
            });
            it("GetAllForecastingDataForDateByFilter", function () {
                var ds = createTestController(), dayString = "", noMetrics = false;
                ds.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then(function (data) {
                    expect(data).toBeDefined();
                }).catch(function (reason) {
                    console.log("GetAllForecastingDataForDateByFilter Service returned an error");
                    expect(true).toBe(false);
                });
                rootScope.$digest();
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
