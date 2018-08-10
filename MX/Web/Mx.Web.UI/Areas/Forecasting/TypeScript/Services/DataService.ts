module Forecasting.Services {
    "use strict";

    export interface IDataService {
        CanViewHistory(): boolean;
        CanRevertForecast(): boolean;
        GetEntityId(): number;
        GetAllForecastingDataForDate(targetDate: string): ng.IPromise<IAllForecastingData>;
        GetAllForecastingDataForDateByFilter(targetDate: string, filterIds?: number[], noMetrics?: boolean): ng.IPromise<IAllForecastingData>;
        GetBlankForecastingData(): ng.IHttpPromise<Api.Models.IForecastingMetricAlls>;
        GetSalesItemsForForecastData(forecastId: number): ng.IHttpPromise<Api.Models.ISalesItem[]>;
        GetSalesItemMetrics(forecastId: number, salesItemId: number): ng.IHttpPromise<Api.Models.IForecastingSalesItemMetricAlls>;
        GetSalesItemMetricsByFilter(forecastId: number, salesItemId: number, filterId: number): ng.IHttpPromise<Api.Models.IForecastingSalesItemMetricAlls>;
        GetSalesItemMetricsByFilters(forecastId: number, salesItemId: number, filterIds?: number[]): ng.IPromise<IAllForecastingData>;

        UpdateMetrics(forecastId: number, version: number, metricDetails: Api.Models.IForecastingMetricAlls, filterId?: number): ng.IHttpPromise<Api.Models.IForecastUpdateHeader>;
        UpdateMetricsByFilter(forecastId: number, version: number, forecastMetricAllsFiltered: IAllForecastingDataFiltered[]): ng.IHttpPromise<Api.Models.IForecastUpdateHeader>;
        UpdateSalesItemMetrics(forecastId: number, salesItemId: number, version: number, salesItemMetricDetails: Api.Models.IForecastingMetricAlls,
            filterId?: number): ng.IHttpPromise<Api.Models.IForecastUpdateHeader>;
        UpdateSalesItemMetricsByFilter(forecastId: number, salesItemId: number, version: number,
            forecastMetricAllsFiltered: IAllForecastingDataFiltered[]): ng.IHttpPromise<Api.Models.IForecastUpdateHeader>;

        GetAllHistoricalData(forecastId: number, filterId?: number): ng.IHttpPromise<Api.Models.IHistoricalBasis[]>;
        GetDaySegments(forecastId: number): ng.IHttpPromise<Api.Models.IDaySegment[]>;
        GetHistoricalSalesItem(forecastId: number, salesItem: number, filterId?: number): ng.IHttpPromise<Api.Models.IHistoricalSalesItem[]>;
        RevertForecast(forecastId: number, version: number): ng.IPromise<number>;
        GetForecastEvaluationDataForDate(targetDate: string, filterId?: number): ng.IPromise<any>;
    }

    export interface IAllForecastingDataFiltered {
        Data: any;
        FilterId?: number;
        IsDirty?: boolean;
    }

    export interface IAllForecastingData {
        FilterIds: number[];
        ForecastId: number;
        SalesItemId?: number;
        TargetDate?: string;
        Forecast?: Api.Models.IForecast;
        ForecastMetricAlls?: any;
        ForecastMetricAllsFiltered?: IAllForecastingDataFiltered[];
    }

    export class IntervalTypes {
        static All = 1;
        static Year = 2;
        static Month = 3;
        static Week = 4;
        static Day = 5;
        static Forecast = 6;
        static DaySegment = 7;
        static Hour = 8;
        static Interval = 9;
        static Types: string[] = ["", "All", "Year", "Month", "Week", "Day", "Forecast", "DaySegment", "Hour", "Interval"];
    }

    export class DataService implements IDataService {
        constructor(
            private $q: ng.IQService,
            private $authService: Core.Auth.IAuthService,
            private historicalService: Api.IHistoricalService,
            private salesItemHistoricalService: Api.ISalesItemHistoricalService,
            private salesItemMetricAllService: Api.ISalesItemMetricAllService,
            private forecastService: Api.IForecastService,
            private salesItemMetricService: Api.ISalesItemMetricService,
            private metricService: Api.IMetricService,
            private daySegmentService: Api.IDaySegmentService,
            private salesItemService: Api.ISalesItemService,
            private metricAllService: Api.IMetricAllService,
            private forecastSalesEvaluationService: Api.IForecastSalesEvaluationService,
            private forecastSalesItemEvaluationService: Api.IForecastSalesItemEvaluationService,
            private forecastTransactionEvaluationService: Api.IForecastTransactionEvaluationService,
            private filterMetricAllService: Api.IMultiFilterMetricAllService,
            private filterSalesItemsMetricAllService: Api.IMultiFilterSalesItemMetricAllService
            ) { }

        public GetForecastEvaluationDataForDate(targetDate: string, filterId?: number): ng.IPromise<any[]> {

            var d = this.$q.defer(),
                combined = [],
                forecastSalesEvaluationData,
                forecastTransactionEvaluationData;

            forecastSalesEvaluationData = this.GetForecastSalesEvaluationData(targetDate, filterId)
                .then((forecastSalesEvalData: Api.Models.IDenormalizedSalesEvaluationResponse[]): void => {
                    combined[0] = forecastSalesEvalData;
                });

            forecastTransactionEvaluationData = this.GetForecastTransactionEvaluationData(targetDate, filterId)
                .then((forecastTransEvalData: Api.Models.IDenormalizedTransactionEvaluationResponse[]): void => {
                    combined[1] = forecastTransEvalData;
                });

            this.$q.all([forecastSalesEvaluationData, forecastTransactionEvaluationData]).then((): void => {
                d.resolve(combined);
            });

            return d.promise;
        }

        public CanViewHistory(): boolean {
            return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_History);
        }

        public CanRevertForecast(): boolean {
            return this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Forecasting_Reset);
        }

        public GetEntityId(): number {
            var user = this.$authService.GetUser();
            return user.BusinessUser.MobileSettings.EntityId;
        }

        public GetAllForecastingDataForDate(targetDate: string): ng.IPromise<IAllForecastingData> {
            return this.GetAllForecastingDataForDateByFilter(targetDate);
        }

        public GetAllForecastingDataForDateByFilter(targetDate: string, filterIds?: number[], noMetrics?: boolean): ng.IPromise<IAllForecastingData> {
            var d = this.$q.defer<IAllForecastingData>();

            this.GetForecastForDate(targetDate).success((forecastForDate: Api.Models.IForecast): void => {
                var forecastId: number = null,
                    forecast: Api.Models.IForecast = forecastForDate;

                if (forecast && (forecast.ForecastStatus === 0 || forecast.ForecastStatus === 3)) { //Forecast status is completed or sales item completed
                    forecastId = forecast.Id;
                } else {
                    d.reject();
                    return;
                }

                var afd: IAllForecastingData = {
                        TargetDate: targetDate,
                        FilterIds: filterIds,
                        ForecastId: forecastId,
                        Forecast: forecast,
                        ForecastMetricAlls: null,
                        ForecastMetricAllsFiltered: null
                    };

                if (!noMetrics) {
                    var metricAll;

                    if (filterIds === undefined) {
                        metricAll = this.GetForecastMetricAllsData(forecastId).success((metricsData: Api.Models.IForecastingMetricAlls): void => {
                            afd.ForecastMetricAlls = metricsData;
                            afd.Forecast = metricsData.Forecast;
                        });
                    } else {
                        metricAll = this.GetForecastMetricAllsByFilters(forecast.EntityId, forecastId, filterIds, false).success((metricsData: Services.IAllForecastingDataFiltered[]): void => {
                            afd.ForecastMetricAlls = metricsData[0].Data;
                            afd.Forecast = afd.ForecastMetricAlls.Forecast;
                            afd.ForecastMetricAllsFiltered = metricsData;

                            // copy invariant data to filtered metrics
                            _.each(metricsData, (metrics: Services.IAllForecastingDataFiltered): void => {
                                metrics.Data.DaySegmentIndexes = metricsData[0].Data.DaySegmentIndexes;
                                metrics.Data.DaySegments = metricsData[0].Data.DaySegments;
                                metrics.Data.Forecast = metricsData[0].Data.Forecast;
                                metrics.Data.IntervalStarts = metricsData[0].Data.IntervalStarts;
                                metrics.Data.IntervalTypes = metricsData[0].Data.IntervalTypes;
                                metrics.Data.TypeIndexes = metricsData[0].Data.TypeIndexes;
                            });
                        });
                    }

                    this.$q.all([metricAll, null]).then((): void => {
                        d.resolve(afd);
                    });
                } else {
                    d.resolve(afd);
                }
            });

            return d.promise;
        }

        public GetBlankForecastingData(): ng.IHttpPromise<Api.Models.IForecastingMetricAlls> {
            return this.metricAllService.GetForecastMetricAlls1(this.GetEntityId());
        }

        public GetDaySegments(forecastId: number): ng.IHttpPromise<Api.Models.IDaySegment[]> {
            return this.daySegmentService.GetDaysegments(this.GetEntityId());
        }

        public GetAllHistoricalData(forecastid: number, filterId?: number): ng.IHttpPromise<Api.Models.IHistoricalBasis[]> {
            return this.historicalService.GetForecastSalesHistory(this.GetEntityId(), forecastid, filterId);
        }

        public GetHistoricalSalesItem(forecastId: number, salesItem: number, filterId?: number): ng.IHttpPromise<Api.Models.IHistoricalSalesItem[]> {
            return this.salesItemHistoricalService.GetForecastSalesItemHistory(this.GetEntityId(), forecastId, salesItem, filterId);
        }

        public GetSalesItemMetrics(forecastId: number, salesItemId: number): ng.IHttpPromise<Api.Models.IForecastingSalesItemMetricAlls> {
            return this.salesItemMetricAllService.GetSalesItemMetrics(this.GetEntityId(), forecastId, salesItemId, null, false, false);
        }

        public GetSalesItemMetricsByFilter(forecastId: number, salesItemId: number, filterId: number): ng.IHttpPromise<Api.Models.IForecastingSalesItemMetricAlls> {
            return this.salesItemMetricAllService.GetSalesItemMetrics(this.GetEntityId(), forecastId, salesItemId, filterId, false, false);
        }

        public GetSalesItemMetricsByFilters(forecastId: number, salesItemId: number, filterIds?: number[]): ng.IPromise<IAllForecastingData> {
            var d = this.$q.defer<IAllForecastingData>(),
                afd: IAllForecastingData,
                metricAll;

            afd = {
                ForecastId: forecastId,
                FilterIds: filterIds,
                SalesItemId: salesItemId,
                ForecastMetricAlls: null,
                ForecastMetricAllsFiltered: null
            };

            if (filterIds === undefined) {
                metricAll = this.GetSalesItemMetrics(forecastId, salesItemId).success((metricsData: Api.Models.IForecastingSalesItemMetricAlls): void => {
                    afd.ForecastMetricAlls = metricsData;
                });
            } else {
                metricAll = this.filterSalesItemsMetricAllService.GetSalesItemMetrics(this.GetEntityId(), forecastId, salesItemId, filterIds, false, false)
                    .success((metricsData: Services.IAllForecastingDataFiltered[]): void => {
                        afd.ForecastMetricAlls = metricsData[0].Data;
                        afd.ForecastMetricAllsFiltered = metricsData;

                        // copy invariant data to filtered metrics
                        _.each(metricsData, (metrics: Services.IAllForecastingDataFiltered): void => {
                            metrics.Data.DaySegmentIndexes = metricsData[0].Data.DaySegmentIndexes;
                            metrics.Data.DaySegments = metricsData[0].Data.DaySegments;
                            metrics.Data.IntervalStarts = metricsData[0].Data.IntervalStarts;
                            metrics.Data.IntervalTypes = metricsData[0].Data.IntervalTypes;
                            metrics.Data.TypeIndexes = metricsData[0].Data.TypeIndexes;
                        });
                    });
            }

            this.$q.all([metricAll, null]).then((): void => {
                d.resolve(afd);
            });

            return d.promise;
        }

        private GetUpatedMetricDetails(alls: Api.Models.IForecastingMetricAlls): any[] {
            var indexes = alls.TypeIndexes[Services.IntervalTypes.Interval],
                metricDetails = [],
                i: number,
                currentSalesValueString: string,
                currentSalesValueNumber: number;

            for (i = 0; i < indexes.length; i += 1) {
                if (alls.NewManagerSales[indexes[i]] != undefined || alls.NewManagerTransactions[indexes[i]] != undefined) {
                    metricDetails.push({
                        IntervalStart: alls.IntervalStarts[indexes[i]],
                        ManagerSales: alls.NewManagerSales[indexes[i]],
                        ManagerTransactionCount: alls.NewManagerTransactions[indexes[i]]
                    });
                }
            }

            for (i = 0; i < metricDetails.length; i += 1) {
                currentSalesValueString = String(metricDetails[i].ManagerSales);
                currentSalesValueNumber = Number(currentSalesValueString.replace(/[^0-9,.]/g, ""));

                metricDetails[i].ManagerSales = currentSalesValueNumber;
            }

            return metricDetails;
        }

        public UpdateMetrics(forecastId: number, version: number, alls: Api.Models.IForecastingMetricAlls, filterId?: number): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> {
            var metrics: ng.IHttpPromise<Api.Models.IForecastUpdateHeader>,
                forecastMetricDetails: Api.Models.IForecastMetricDetailsHeader;

            forecastMetricDetails = <Api.Models.IForecastMetricDetailsHeader>{
                MetricDetails: this.GetUpatedMetricDetails(alls),
                FilterId: filterId
            };

            metrics = this.metricService.PatchForecastMetricDetails(this.GetEntityId(), forecastId, version, [forecastMetricDetails])
                .success((): void => {
                    alls.ManagerSales = $.extend(alls.ManagerSales, alls.NewManagerSales);
                    alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                    alls.NewManagerSales.splice(0, alls.NewManagerSales.length);
                    alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                });

            return metrics;
        }

        public UpdateMetricsByFilter(forecastId: number, version: number, forecastMetricAllsFiltered: IAllForecastingDataFiltered[]): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> {
            var metrics: ng.IHttpPromise<Api.Models.IForecastUpdateHeader>,
                forecastMetricDetails: Api.Models.IForecastMetricDetailsHeader[] = [],
                updated: IAllForecastingDataFiltered[] = [];

            _.each(forecastMetricAllsFiltered, (filtered: Services.IAllForecastingDataFiltered): void => {
                if (filtered.IsDirty) {
                    var alls = filtered.Data;

                    updated.push(filtered);

                    forecastMetricDetails.push(<Api.Models.IForecastMetricDetailsHeader>{
                        MetricDetails: this.GetUpatedMetricDetails(alls),
                        FilterId: filtered.FilterId
                    });
                }
            });

            metrics = this.metricService.PatchForecastMetricDetails(this.GetEntityId(), forecastId, version, forecastMetricDetails)
                .success((): void => {
                    _.each(updated, (filtered: Services.IAllForecastingDataFiltered): void => {
                        var alls = filtered.Data;

                        alls.ManagerSales = $.extend(alls.ManagerSales, alls.NewManagerSales);
                        alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                        alls.NewManagerSales.splice(0, alls.NewManagerSales.length);
                        alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);

                        filtered.IsDirty = false;
                    });
                });

            return metrics;
        }

        private GetUpatedSalesItemMetricDetails(alls: Api.Models.IForecastingMetricAlls, salesItemId: number): any[] {
            var indexes = alls.TypeIndexes[Services.IntervalTypes.Interval],
                metricDetails = [],
                i: number;

            for (i = 0; i < indexes.length; i += 1) {
                if (alls.NewManagerTransactions[indexes[i]] != undefined) {
                    metricDetails.push({
                        IntervalStart: alls.IntervalStarts[indexes[i]],
                        SalesItemId: salesItemId,
                        ManagerTransactionCount: alls.NewManagerTransactions[indexes[i]]
                    });
                }
            }

            return metricDetails;
        }

        public UpdateSalesItemMetrics(forecastId: number, salesItemId: number, version: number, alls: Api.Models.IForecastingMetricAlls,
                filterId?: number): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> {
            var metrics: ng.IHttpPromise<Api.Models.IForecastUpdateHeader>,
                forecastSalesItemMetricDetails: Api.Models.IForecastSalesItemMetricDetailsHeader;

            forecastSalesItemMetricDetails = <Api.Models.IForecastSalesItemMetricDetailsHeader>{
                SalesItemMetricDetails: this.GetUpatedSalesItemMetricDetails(alls, salesItemId),
                FilterId: filterId
            };

            metrics = this.salesItemMetricService.PatchSalesItemMetricDetails(this.GetEntityId(), forecastId, version, [forecastSalesItemMetricDetails])
                .success((): void => {
                    alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                    alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
                });

            return metrics;
        }

        public UpdateSalesItemMetricsByFilter(forecastId: number, salesItemId: number, version: number,
                forecastMetricAllsFiltered: IAllForecastingDataFiltered[]): ng.IHttpPromise<Api.Models.IForecastUpdateHeader> {

            var metrics: ng.IHttpPromise<Api.Models.IForecastUpdateHeader>,
                forecastSalesItemMetricDetails: Api.Models.IForecastSalesItemMetricDetailsHeader[] = [],
                updated: IAllForecastingDataFiltered[] = [];

            _.each(forecastMetricAllsFiltered, (filtered: Services.IAllForecastingDataFiltered): void => {
                if (filtered.IsDirty) {
                    var alls = filtered.Data;

                    updated.push(filtered);

                    forecastSalesItemMetricDetails.push(<Api.Models.IForecastSalesItemMetricDetailsHeader>{
                        SalesItemMetricDetails: this.GetUpatedSalesItemMetricDetails(alls, salesItemId),
                        FilterId: filtered.FilterId
                    });
                }
            });

            metrics = this.salesItemMetricService.PatchSalesItemMetricDetails(this.GetEntityId(), forecastId, version, forecastSalesItemMetricDetails)
                .success((): void => {
                    _.each(updated, (filtered: Services.IAllForecastingDataFiltered): void => {
                        var alls = filtered.Data;

                        alls.ManagerTransactions = $.extend(alls.ManagerTransactions, alls.NewManagerTransactions);
                        alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);

                        filtered.IsDirty = false;
                    });
                });

            return metrics;
        }

        public RevertForecast(forecastId: number, version: number): ng.IPromise<number> {
            var code = "revert",
                operations: Api.Models.IForecastOperationCollection;

            operations = <Api.Models.IForecastOperationCollection>{
                Operations: [{ OpCode: code }],
                Version: version
            };

            return this.forecastService.PatchRevertForecast(this.GetEntityId(), forecastId, operations);
        }

        private GetForecastSalesEvaluationData(targetDate: string, filterId? : number): ng.IPromise<Api.Models.IDenormalizedSalesEvaluationResponse[]> {
            return this.forecastSalesEvaluationService.GetEvaluateSales(this.GetEntityId(), targetDate, filterId);
        }

        private GetForecastTransactionEvaluationData(targetDate: string, filterId? : number): ng.IPromise<Api.Models.IDenormalizedTransactionEvaluationResponse[]> {
            return this.forecastTransactionEvaluationService.GetEvaluateTransactions(this.GetEntityId(), targetDate, filterId);
        }

        public GetSalesItemsForForecastData(forecastId: number): ng.IHttpPromise<Api.Models.ISalesItem[]> {
            return this.salesItemService.GetSalesItemsForForecast(this.GetEntityId(), forecastId);
        }

        private GetForecastMetricAllsData(forecastId: number): ng.IHttpPromise<Api.Models.IForecastingMetricAlls> {
            return this.metricAllService.GetForecastMetricAlls(this.GetEntityId(), forecastId, null, false);
        }

        private GetForecastForDate(targetDate: string): ng.IHttpPromise<Api.Models.IForecast> {
            return this.forecastService.GetForecastForBusinessDay(this.GetEntityId(), targetDate);
        }

        private GetForecastMetricAllsByFilters(entityId: number, forecastId: number, filterIds: number[], includeActuals: boolean): ng.IHttpPromise<any[]> {
            return this.filterMetricAllService.GetForecastMetricAlls(entityId, forecastId, filterIds, includeActuals);
        }
    }

    export var $dataService: Core.NG.INamedService<IDataService> = Core.NG.ForecastingModule.RegisterService("DataService", DataService,
        Core.NG.$q,
        Core.Auth.$authService,
        Api.$historicalService,
        Api.$salesItemHistoricalService,
        Api.$salesItemMetricAllService,
        Api.$forecastService,
        Api.$salesItemMetricService,
        Api.$metricService,
        Api.$daySegmentService,
        Api.$salesItemService,
        Api.$metricAllService,
        Api.$forecastSalesEvaluationService,
        Api.$forecastSalesItemEvaluationService,
        Api.$forecastTransactionEvaluationService,
        Api.$multiFilterMetricAllService,
        Api.$multiFilterSalesItemMetricAllService
        );
}
