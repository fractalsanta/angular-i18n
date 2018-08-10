/// <reference path="../../../../Core/Tests/TestFramework.ts" />

/// <reference path="../../Services/DataService.ts" />

/// <reference path="../DataMock.ts" />
/// <reference path="./SalesItemMetricAllServiceMock.ts" />
/// <reference path="./ForecastServiceMock.ts" />
/// <reference path="./SalesItemMetricServiceMock.ts" />
/// <reference path="./MetricServiceMock.ts" />

/// <reference path="./SalesItemServiceMock.ts" />
/// <reference path="./MetricAllServiceMock.ts" />

/// <reference path="./MultiFilterMetricAllServiceMock.ts" />
/// <reference path="./MultiFilterSalesItemMetricAllServiceMock.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts forecasting data service", (): void => {
        var q: ng.IQService,
            rootScope: ng.IScope,
            authorizationServiceMock: Core.Tests.AuthServiceMock,
            historicalService: Api.IHistoricalService,
            salesItemHistoricalService: Api.ISalesItemHistoricalService,
            salesItemMetricAllServiceMock: Forecasting.Tests.SalesItemMetricAllServiceMock,
            forecastServiceMock: Forecasting.Tests.ForecastServiceMock,
            salesItemMetricServiceMock: Forecasting.Tests.SalesItemMetricServiceMock,
            metricServiceMock: Forecasting.Tests.MetricServiceMock,
            daySegmentService: Api.IDaySegmentService,
            salesItemServiceMock: Forecasting.Tests.SalesItemServiceMock,
            metricAllServiceMock: Forecasting.Tests.MetricAllServiceMock,
            forecastSalesEvaluationService: Api.IForecastSalesEvaluationService,
            forecastSalesItemEvaluationService: Api.IForecastSalesItemEvaluationService,
            forecastTransactionEvaluationService: Api.IForecastTransactionEvaluationService,
            multiFilterMetricAllServiceMock: Forecasting.Tests.MultiFilterMetricAllServiceMock,
            multiFilterSalesItemMetricAllServiceMock: Forecasting.Tests.MultiFilterSalesItemMetricAllServiceMock;

        var createTestController = (): Forecasting.Services.DataService => {
            return new Forecasting.Services.DataService(
                q,
                authorizationServiceMock.Object,
                null, // historicalService,
                null, // salesItemHistoricalService,
                salesItemMetricAllServiceMock.Object,
                forecastServiceMock.Object,
                salesItemMetricServiceMock.Object,
                metricServiceMock.Object,
                null, // daySegmentService,
                salesItemServiceMock.Object,
                metricAllServiceMock.Object,
                null, // forecastSalesEvaluationService,
                null, // forecastSalesItemEvaluationService,
                null, // forecastTransactionEvaluationService,
                multiFilterMetricAllServiceMock.Object,
                multiFilterSalesItemMetricAllServiceMock.Object
            );
        };

        beforeEach((): void => {
            inject((
                $rootScope: ng.IScope, $q: ng.IQService
            ): void => {

                q = $q;
                rootScope = $rootScope;

                authorizationServiceMock = new Core.Tests.AuthServiceMock();

                salesItemMetricAllServiceMock = new SalesItemMetricAllServiceMock(q);
                forecastServiceMock = new ForecastServiceMock(q);
                salesItemMetricServiceMock = new SalesItemMetricServiceMock(q);
                metricServiceMock = new MetricServiceMock(q);

                salesItemServiceMock = new SalesItemServiceMock(q);
                metricAllServiceMock = new MetricAllServiceMock(q);

                multiFilterMetricAllServiceMock = new MultiFilterMetricAllServiceMock(q);
                multiFilterSalesItemMetricAllServiceMock = new MultiFilterSalesItemMetricAllServiceMock(q);
            });
        });

        it("GetAllForecastingDataForDateByFilter no filters and no metrics", (): void => {
            var ds = createTestController(), dayString = "", noMetrics = true;

            ds.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then((data: Services.IAllForecastingData): void => {
                //console.log(JSON.stringify(data));

                expect(data.FilterIds).toBe(null);
                expect(data.ForecastId).toBeDefined();
                expect(data.SalesItemId).toBeUndefined();
                expect(data.TargetDate).toBeDefined();
                expect(data.Forecast).toBeDefined();
                expect(data.ForecastMetricAlls).toBe(null);
                expect(data.ForecastMetricAllsFiltered).toBe(null);

            }).catch((reason: any): void => {
                console.log("GetAllForecastingDataForDateByFilter Service returned an error - no filters or metrics");
                expect(true).toBe(false);
            });

            rootScope.$digest();
        });

        it("GetAllForecastingDataForDateByFilter no filters and metrics", (): void => {
            var ds = createTestController(), dayString = "", noMetrics = false;

            ds.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then((data: Services.IAllForecastingData): void => {
                //console.log(JSON.stringify(data));
                expect(data).toBeDefined();
            }).catch((reason: any): void => {
                console.log("GetAllForecastingDataForDateByFilter Service returned an error - with metrics");
                expect(true).toBe(false);
            });

            rootScope.$digest();
        });

        it("GetAllForecastingDataForDateByFilter", (): void => {
            var ds = createTestController(), dayString = "", noMetrics = false;

            ds.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then((data: Services.IAllForecastingData): void => {
                //console.log(JSON.stringify(data));
                expect(data).toBeDefined();
            }).catch((reason: any): void => {
                console.log("GetAllForecastingDataForDateByFilter Service returned an error");
                expect(true).toBe(false);
            });

            rootScope.$digest();
        });
    });
} 