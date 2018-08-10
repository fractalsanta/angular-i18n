/// <reference path="../DataMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/AuthServiceMock.ts" />
/// <reference path="./HistoricalServiceMock.ts" />
/// <reference path="./SalesItemHistoricalServiceMock.ts" />
/// <reference path="./SalesItemMetricAllServiceMock.ts" />
/// <reference path="./ForecastServiceMock.ts" />
/// <reference path="./SalesItemMetricServiceMock.ts" />
/// <reference path="./MetricServiceMock.ts" />
/// <reference path="./DaySegmentServiceMock.ts" />
/// <reference path="./SalesItemServiceMock.ts" />
/// <reference path="./MetricAllServiceMock.ts" />
/// <reference path="./ForecastSalesEvaluationServiceMock.ts" />
/// <reference path="./ForecastSalesItemEvaluationServiceMock.ts" />
/// <reference path="./ForecastTransactionEvaluationServiceMock.ts" />
/// <reference path="./MultiFilterMetricAllServiceMock.ts" />
/// <reference path="./MultiFilterSalesItemMetricAllServiceMock.ts" />

module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
    };

    export class DataServiceMock extends DataMock implements Core.Tests.IMock<Services.IDataService> {
        public dataService: Services.IDataService;
        public $authServiceMock: Core.Tests.AuthServiceMock;
        public historicalServiceMock: HistoricalServiceMock;
        public salesItemHistoricalServiceMock: SalesItemHistoricalServiceMock;
        public salesItemMetricAllServiceMock: SalesItemMetricAllServiceMock;
        public forecastServiceMock: ForecastServiceMock;
        public salesItemMetricServiceMock: SalesItemMetricServiceMock;
        public metricServiceMock: MetricServiceMock;
        public daySegmentServiceMock: DaySegmentServiceMock;
        public salesItemServiceMock: SalesItemServiceMock;
        public metricAllServiceMock: MetricAllServiceMock;
        public forecastSalesEvaluationServiceMock: ForecastSalesEvaluationServiceMock;
        public forecastSalesItemEvaluationServiceMock: ForecastSalesItemEvaluationServiceMock;
        public forecastTransactionEvaluationServiceMock: ForecastTransactionEvaluationServiceMock;
        public multiFilterMetricAllServiceMock: MultiFilterMetricAllServiceMock;
        public multiFilterSalesItemMetricAllServiceMock: MultiFilterSalesItemMetricAllServiceMock;

        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);

            this.$authServiceMock = new Core.Tests.AuthServiceMock();
            this.historicalServiceMock = new HistoricalServiceMock($q);
            this.salesItemHistoricalServiceMock = new SalesItemHistoricalServiceMock($q);
            this.salesItemMetricAllServiceMock = new SalesItemMetricAllServiceMock($q);
            this.forecastServiceMock = new ForecastServiceMock($q);
            this.salesItemMetricServiceMock = new SalesItemMetricServiceMock($q);
            this.metricServiceMock = new MetricServiceMock($q);
            this.daySegmentServiceMock = new DaySegmentServiceMock($q);
            this.salesItemServiceMock = new SalesItemServiceMock($q);
            this.metricAllServiceMock = new MetricAllServiceMock($q);
            this.forecastSalesEvaluationServiceMock = new ForecastSalesEvaluationServiceMock($q);
            this.forecastSalesItemEvaluationServiceMock = new ForecastSalesItemEvaluationServiceMock($q);
            this.forecastTransactionEvaluationServiceMock = new ForecastTransactionEvaluationServiceMock($q);
            this.multiFilterMetricAllServiceMock = new MultiFilterMetricAllServiceMock($q);
            this.multiFilterSalesItemMetricAllServiceMock = new MultiFilterSalesItemMetricAllServiceMock($q);
            this.dataService = new Services.DataService(
                $q,
                this.$authServiceMock.Object,
                this.historicalServiceMock.Object,
                this.salesItemHistoricalServiceMock.Object,
                this.salesItemMetricAllServiceMock.Object,
                this.forecastServiceMock.Object,
                this.salesItemMetricServiceMock.Object,
                this.metricServiceMock.Object,
                this.daySegmentServiceMock.Object,
                this.salesItemServiceMock.Object,
                this.metricAllServiceMock.Object,
                this.forecastSalesEvaluationServiceMock.Object,
                this.forecastSalesItemEvaluationServiceMock.Object,
                this.forecastTransactionEvaluationServiceMock.Object,
                this.multiFilterMetricAllServiceMock.Object,
                this.multiFilterSalesItemMetricAllServiceMock.Object
            );
        }

        public Object: Services.IDataService = {
            CanViewHistory: (): boolean => {
                return this.GetData("CanViewHistory") ||
                    this.dataService.CanViewHistory();
            },
        
            CanRevertForecast: (): boolean => {
                return this.GetData("CanRevertForecast") ||
                    this.dataService.CanRevertForecast();
            },

            GetEntityId: (): number => {
                return this.GetData("GetEntityId") ||
                    this.dataService.GetEntityId();
            },

            GetAllForecastingDataForDate: (targetDate: string): ng.IPromise<Services.IAllForecastingData > => {
                return this.GetDataPromise("GetAllForecastingDataForDate") ||
                    this.dataService.GetAllForecastingDataForDate(targetDate);
            },

            GetAllForecastingDataForDateByFilter: (targetDate: string, filterIds?: number[], noMetrics?: boolean): ng.IPromise<Services.IAllForecastingData > => {
                return this.GetDataPromise("GetAllForecastingDataForDateByFilter") ||
                    this.dataService.GetAllForecastingDataForDateByFilter(targetDate, filterIds, noMetrics);
            },

            GetBlankForecastingData: (): ng.IHttpPromise<Api.Models.IForecastingMetricAlls> => {
                return this.GetDataHttpPromise("GetBlankForecastingData") ||
                    this.dataService.GetBlankForecastingData();
            },

            GetSalesItemsForForecastData: (forecastId: number): ng.IHttpPromise<Api.Models.ISalesItem[]> => {
                return this.GetDataHttpPromise("GetSalesItemsForForecastData") ||
                    this.dataService.GetSalesItemsForForecastData(forecastId);
            },

            GetSalesItemMetrics: (forecastId: number, salesItemId: number): ng.IHttpPromise<Api.Models.IForecastingSalesItemMetricAlls> => {
                return this.GetDataHttpPromise("GetSalesItemMetrics") ||
                    this.dataService.GetSalesItemMetrics(forecastId, salesItemId);
            },

            GetSalesItemMetricsByFilter: (forecastId: number, salesItemId: number, filterId: number): ng.IHttpPromise<Api.Models.IForecastingSalesItemMetricAlls> => {
                return this.GetDataHttpPromise("GetSalesItemMetricsByFilter") ||
                    this.dataService.GetSalesItemMetricsByFilter(forecastId, salesItemId, filterId);
            },

            GetSalesItemMetricsByFilters: (forecastId: number, salesItemId: number, filterIds?: number[]): ng.IPromise<Services.IAllForecastingData> => {
                return this.GetDataPromise("GetSalesItemMetricsByFilters") ||
                    this.dataService.GetSalesItemMetricsByFilters(forecastId, salesItemId, filterIds);
            },

            UpdateMetrics: (forecastId: number, version: number, metricDetails: Api.Models.IForecastingMetricAlls, filterId?: number): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> => {
                return this.GetDataHttpPromise("UpdateMetrics") ||
                    this.dataService.UpdateMetrics(forecastId, version, metricDetails, filterId);
            },

            UpdateMetricsByFilter: (forecastId: number, version: number, forecastMetricAllsFiltered: Services.IAllForecastingDataFiltered[]): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> => {
                return this.GetDataHttpPromise("UpdateMetricsByFilter") ||
                    this.dataService.UpdateMetricsByFilter(forecastId, version, forecastMetricAllsFiltered);
            },

            UpdateSalesItemMetrics: (forecastId: number, salesItemId: number, version: number, salesItemMetricDetails: Api.Models.IForecastingMetricAlls,
                    filterId?: number): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> => {
                return this.GetDataHttpPromise("UpdateSalesItemMetrics") ||
                    this.dataService.UpdateSalesItemMetrics(forecastId, salesItemId, version, salesItemMetricDetails, filterId);
            },

            UpdateSalesItemMetricsByFilter: (forecastId: number, salesItemId: number, version: number,
                    forecastMetricAllsFiltered: Services.IAllForecastingDataFiltered[]): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> => {
                return this.GetDataHttpPromise("UpdateSalesItemMetricsByFilter") ||
                    this.dataService.UpdateSalesItemMetricsByFilter(forecastId, salesItemId, version, forecastMetricAllsFiltered);
            },

            GetAllHistoricalData: (forecastId: number, filterId?: number): ng.IHttpPromise<Api.Models.IHistoricalBasis[]> => {
                return this.GetDataHttpPromise("GetAllHistoricalData") ||
                    this.dataService.GetAllHistoricalData(forecastId, filterId);
            },

            GetDaySegments: (forecastId: number): ng.IHttpPromise<Api.Models.IDaySegment[]> => {
                return this.GetDataHttpPromise("GetDaySegments") ||
                    this.dataService.GetDaySegments(forecastId);
            },

            GetHistoricalSalesItem: (forecastId: number, salesItem: number, filterId?: number): ng.IHttpPromise<Api.Models.IHistoricalSalesItem[]> => {
                return this.GetDataHttpPromise("GetHistoricalSalesItem") ||
                    this.dataService.GetHistoricalSalesItem(forecastId, salesItem, filterId);
            },

            RevertForecast: (forecastId: number, version: number): ng.IPromise<number> => {
                return this.GetDataPromise("RevertForecast") ||
                    this.dataService.RevertForecast(forecastId, version);
            },

            GetForecastEvaluationDataForDate: (targetDate: string, filterId?: number): ng.IPromise<any> => {
                return this.GetDataPromise("GetForecastEvaluationDataForDate") ||
                    this.dataService.GetForecastEvaluationDataForDate(targetDate, filterId);
            }
        };
    };
}