module Forecasting.Services {
    "use strict";

    export interface IFilterOptions {
        Filter: Api.Models.IForecastFilterRecord;
        Visible: boolean;
    }

    export interface IForecastingOptions {
        Metric: string;
        MetricKey: string;
        IsCurrency?: boolean;
        Part?: number;
        PartIndex?: number;
        ForecastIndex?: number;
        ItemId?: number;
        Title?: string;
        DaySegmentNames?: any[];
        IntervalTypes: any;
        EventProfile?: Api.Models.IEventProfile;
        Filter?: Api.Models.IForecastFilterRecord;
        Filters?: Api.Models.IForecastFilterRecord[];
        FiltersMap?: any;
        HasFilters: boolean;
    }

    export interface IForecastingObjectService {
        Cache: any;
        GetCache(name: string): any;
        SetCache(name: string, object: any, persist?: boolean): any;
        ClearCache(name: string[], persisted?: boolean): void;
        ClearEdits(fo: IForecastObject): void;
        IsDirty(fo: IForecastObject, index?: number): boolean;
        EditDailyValue(fo: IForecastObject, index: number, metric: string, oldValue: number, updatedValue: number): void;
        EditDailyValueAlls(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string, oldValue: number, updatedValue: number): void;
        EditEventAdjustments(profile: Api.Models.IEventProfile): ng.IPromise<Api.Models.IEventProfile>;
        EditEventAdjustmentsCompleted(cancelled: boolean, newUrl?: string): void;
        UpdateRanges(alls: Api.Models.IForecastingMetricAlls, values: number[], defaults?: number[]): void;
        GetAdjustments(fo: Services.IForecastObject): number[];
        SetAdjustments(fo: Services.IForecastObject): void;
        CellValue(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string): any;
        GetEditValue(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string): any;
        CellNotEditableByPercentage(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string, isByPercentage: boolean): boolean;
        GetSeriesGraphData(alls: Api.Models.IForecastingMetricAlls, options: Services.IForecastingOptions): ISeriesGraphData[];
        GetSeriesGraphDataLine(dataFilterd: Services.IAllForecastingDataFiltered, options: Services.IForecastingOptions): ISeriesGraphData[];
        ReCalculateFilteredTotal(saved: Services.IForecastObject, current: Services.IForecastObject, Filters: Api.Models.IForecastFilterRecord[], FiltersMap: any): void;
    }

    export interface IForecastObject {
        DayString: string;
        Forecast: Api.Models.IForecast;
        ItemId?: number;
        Metrics: any;
        MetricsFiltered?: IAllForecastingDataFiltered[];
        IsDirty: boolean;
        IsLocked: boolean;
        ViewHistory: boolean;
        CanRevertForecast: boolean;
        HourlyEdit: boolean;
        HasBeenEdited?: boolean;
        Description?: string;
        Filter?: Api.Models.IForecastFilterRecord;
        EditedFilterIndex?: number;
    }

    export interface IForecastSalesItems {
        EntityId: number;
        SalesItems?: Api.Models.ISalesItem[];
        SearchParam?: string;
        SelectedSalesItem?: Api.Models.ISalesItem;
        SelectedDescription?: string;
    }

    export interface IEvaluatorSalesObject {
        DaySegmentId: number;
        DaySegmentDescription: string;
        BusinessDate: string[];
        SystemSales: number[];
        ManagerSales: number[];
        ActualSales: number[];
        SystemAccuracy: number[];
        ManagerAccuracy: number[];
    }

    export interface IEvaluatorTransactionObject {
        DaySegmentId: number;
        DaySegmentDescription: string;
        BusinessDate: string[];
        SystemSales: number[];
        ManagerSales: number[];
        ActualSales: number[];
        SystemAccuracy: number[];
        ManagerAccuracy: number[];
    }

    export interface IEvaluatorObject {
        Sales: IEvaluatorSalesObject[];
        Transactions: IEvaluatorTransactionObject[];
    }

    export interface ISeriesGraphData {
        Categories: string[];
        Series: IChartSeriesItem[];
        SeriesName: string;
    }

    export interface IChartSeriesItem {
        data?: any;
        color?: any;
        markers?: IChartSeriesItemMarkers;
        tooltip?: IChartSeriesItemTooltip;
        visible?: boolean;
        type?: string;
    }

    export interface IChartSeriesItemTooltip {
        background?: string;
        border?: any;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: string;
        visible?: boolean;
    }

    export interface IChartSeriesItemMarkers {
        background?: string;
        border?: IChartSeriesItemMarkersBorder;
        size?: number;
        type?: string;
        visible?: boolean;
        visual?: Function;
        rotation?: number;
    }

    export interface IChartSeriesItemMarkersBorder {
        color?: string;
        width?: number;
    }

    export class MetricType {
        static Sales = "sales";
        static Transactions = "transactions";
        static SalesItems = "salesitems";
        static Events = "events";
    }

    export class CacheName {
        static EV = "EV"; // events
        static EventProfile = "EventProfile";
        static FC = "FC"; // forecast
        static FCS = "FCS"; // forecast sales item
        static FCSI = "FCSI"; // sales items in forecast
        static _CACHE = "_FOS_CACHE_";
    }

    export class ForecastingObjectService implements IForecastingObjectService {
        constructor(
            private $q: ng.IQService,
            private $location: ng.ILocationService,
            private $timeout: ng.ITimeoutService
            ) {}

        Cache: any = {};
        EventProfileDeferred: any = null;

        public ClearEdits(fo: IForecastObject): void {
            if (!fo) {
                return;
            }

            this.ClearEditsAlls(fo.Metrics);
            _.each(fo.MetricsFiltered, (filtered: Services.IAllForecastingDataFiltered): void => {
                this.ClearEditsAlls(filtered.Data);
            });

            fo.HourlyEdit = false;
            fo.IsDirty = this.IsDirty(fo);
        }

        public ClearEditsAlls(alls: Api.Models.IForecastingMetricAlls): void {
            if (alls.NewManagerSales && alls.NewManagerSales.length) {
                alls.NewManagerSales.splice(0, alls.NewManagerSales.length);
            }
            if (alls.NewManagerTransactions && alls.NewManagerTransactions.length) {
                alls.NewManagerTransactions.splice(0, alls.NewManagerTransactions.length);
            }
            if (alls.NewManagerAdjustments && alls.NewManagerAdjustments.length) {
                alls.NewManagerAdjustments.splice(0, alls.NewManagerAdjustments.length);
            }
        }

        public IsDirty(fo: IForecastObject, index?: number): boolean {
            if (!fo) {
                return false;
            }

            var alls: Api.Models.IForecastingMetricAlls = fo.Metrics,
                isDirty: boolean = false;

            if (this.IsDirtyAlls(alls, index)) {
                return true;
            }

            _.each(fo.MetricsFiltered, (filtered: Services.IAllForecastingDataFiltered): void => {
                if (!isDirty && this.IsDirtyAlls(filtered.Data, index)) {
                    isDirty = true;
                }
            });

            return isDirty;
        }

        /*
         * tslint for NewManagerXXX arrays use "!=" to check for null or undefined
         */

        public IsDirtyAlls(alls: Api.Models.IForecastingMetricAlls, index?: number): boolean {
            if (index !== undefined) {
                if (alls.NewManagerSales && index < alls.NewManagerSales.length && alls.NewManagerSales[index] != undefined) {
                    return true;
                } else if (alls.NewManagerTransactions && index < alls.NewManagerTransactions.length && alls.NewManagerTransactions[index] != undefined) {
                    return true;
                } else if (alls.NewManagerAdjustments && index < alls.NewManagerAdjustments.length && alls.NewManagerAdjustments[index] != undefined) {
                    return true;
                }
            } else {
                if (alls.NewManagerSales && alls.NewManagerSales.length) {
                    return true;
                } else if (alls.NewManagerTransactions && alls.NewManagerTransactions.length) {
                    return true;
                } else if (alls.NewManagerAdjustments && alls.NewManagerAdjustments.length) {
                    return true;
                }
            }

            return false;
        }

        private SortArrayKeepOriginalIndexes(alls: Api.Models.IForecastingMetricAlls, indexes: number[], metric: string): any {
            var arrayWithOrigIndexes = [];
            for (var indx in indexes) {
                if (indx) {
                    arrayWithOrigIndexes.push({ index: indx, value: indx });
                }
            }

            arrayWithOrigIndexes.sort(function (a: any, b: any): number {
                var ret: number;

                if (metric === MetricType.Sales) {
                    ret = alls.ManagerSales[indexes[b.value]] - alls.ManagerSales[indexes[a.value]];
                } else {
                    ret = alls.ManagerTransactions[indexes[b.value]] - alls.ManagerTransactions[indexes[a.value]];
                }

                // chrome will sometimes move equal values around
                if (ret === 0) {
                    ret = a.index - b.index;
                }

                return ret;
            });

            return arrayWithOrigIndexes;
        }

        private DisburseChangeDaily(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string, percent: number, salesDaily: number, transactionDaily: any): void {
            var length = alls.IntervalStarts.length,
                indexes = [],
                origIndexes,
                runningSalesTotal = 0,
                runningTransactionTotal = 0,
                cachedSalesTotal = 0,
                cachedTransactionTotal = 0,
                salesRemainder,
                transactionRemainder,
                salesDailyFormatted,
                i, j;

            if (alls.IntervalTypes[index] >= Services.IntervalTypes.DaySegment) {
                i = index + 1;
                while (alls.IntervalTypes[i] !== alls.IntervalTypes[index] && i < length) {
                    if (alls.IntervalTypes[i] === Services.IntervalTypes.Interval) {
                        indexes.push(i);
                    }
                    i++;
                }
            } else {
                indexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
            }

            origIndexes = this.SortArrayKeepOriginalIndexes(alls, indexes, metric);

            salesDailyFormatted = salesDaily;

            length = indexes.length;
            if (length > 0) {
                for (j = 0; j < length; j += 1) {
                    i = indexes[j];
                    if (alls.ManagerSales) {
                        cachedSalesTotal += alls.ManagerSales[i];
                    }
                    cachedTransactionTotal += alls.ManagerTransactions[i];
                }

                if (metric !== MetricType.Sales) {
                    if (cachedTransactionTotal > 0) {
                        percent = transactionDaily / cachedTransactionTotal;
                    }

                    salesDailyFormatted = Math.round(cachedSalesTotal * percent);
                } else {
                    if (cachedSalesTotal > 0) {
                        percent = salesDailyFormatted / cachedSalesTotal;
                    }

                    transactionDaily = Math.round(cachedTransactionTotal * percent);
                }
            }

            /* Apply percent change to each metric detail and round */
            for (j = 0; j < length; j += 1) {
                i = indexes[j];
                if (alls.NewManagerSales) {
                    alls.NewManagerSales[i] = Math.round(alls.ManagerSales[i] * percent);
                    runningSalesTotal += alls.NewManagerSales[i];
                }

                alls.NewManagerTransactions[i] = Math.round(alls.ManagerTransactions[i] * percent);
                runningTransactionTotal += alls.NewManagerTransactions[i];
            }

            if (metric === MetricType.SalesItems) {
                salesRemainder = 0;
            } else {
                salesRemainder = salesDailyFormatted - runningSalesTotal;
            }

            transactionRemainder = transactionDaily - runningTransactionTotal;

            for (j = 0; salesRemainder !== 0 || transactionRemainder !== 0; j += 1) {
                if (salesRemainder === 0 && transactionRemainder === 0) {
                    break;
                }

                if (j === length) {
                    j = 0;
                }

                i = indexes[origIndexes[j].index];

                if (alls.NewManagerSales && (alls.NewManagerSales[i] > 0 || runningSalesTotal === 0)) {
                    if (salesRemainder > 0) {
                        alls.NewManagerSales[i] += 1;
                        salesRemainder -= 1;
                    } else if (salesRemainder < 0) {
                        alls.NewManagerSales[i] -= 1;
                        salesRemainder += 1;
                    }
                }

                if (alls.NewManagerTransactions[i] > 0 || runningTransactionTotal === 0) {
                    if (transactionRemainder > 0) {
                        alls.NewManagerTransactions[i] += 1;
                        transactionRemainder -= 1;
                    } else if (transactionRemainder < 0) {
                        alls.NewManagerTransactions[i] -= 1;
                        transactionRemainder += 1;
                    }
                }
            }
        }

        public EditDailyValue(fo: IForecastObject, index: number, metric: string, oldValue: number, updatedValue: number): void {
            if (!fo) {
                return;
            }

            return this.EditDailyValueAlls(fo.Metrics, index, metric, oldValue, updatedValue);
        }

        public EditDailyValueAlls(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string, oldValue: number, updatedValue: number): void  {
            var percentChange: number = (oldValue) ? (updatedValue / oldValue) : 1;
            
            if (metric !== MetricType.Events) {
                if (metric === MetricType.Sales) {
                    alls.NewManagerSales[index] = updatedValue;
                    alls.NewManagerTransactions[index] = Math.floor(alls.ManagerTransactions[index] * percentChange);
                } else {
                    alls.NewManagerTransactions[index] = updatedValue;
                    if (metric === MetricType.Transactions && alls.NewManagerSales) {
                        alls.NewManagerSales[index] = Math.floor(alls.ManagerSales[index] * percentChange);
                    }
                }

                if (alls.IntervalTypes[index] !== Services.IntervalTypes.Interval) {
                    this.DisburseChangeDaily(alls, index, metric, percentChange, alls.NewManagerSales ? alls.NewManagerSales[index] : 0, alls.NewManagerTransactions[index]);
                }

                if (alls.NewManagerSales) {
                    this.UpdateTotals(alls, alls.NewManagerSales, alls.ManagerSales);
                }

                this.UpdateTotals(alls, alls.NewManagerTransactions, alls.ManagerTransactions);
            } else {
                alls.NewManagerAdjustments[index] = updatedValue;

                if (alls.IntervalTypes[index] !== Services.IntervalTypes.Interval) {
                    var length = alls.IntervalStarts.length, i = index + 1;
                    while (alls.IntervalTypes[i] !== alls.IntervalTypes[index] && i < length) {
                        if (alls.IntervalTypes[i] === Services.IntervalTypes.Interval) {
                            alls.NewManagerAdjustments[i] = updatedValue;
                        } else if (alls.IntervalTypes[i] === Services.IntervalTypes.Hour) {
                            alls.NewManagerAdjustments[i] = updatedValue;
                        }

                        i++;
                    }
                }

                this.UpdateRanges(alls, alls.NewManagerAdjustments, alls.ManagerAdjustments);
            }
        }

        private UpdateTotals(alls: Api.Models.IForecastingMetricAlls, values: number[], defaults?: number[]): void {
            var types = alls.IntervalTypes, i, j, length = types.length, total, dirty;
            for (i = 0; i < length; i += 1) {
                if (types[i] !== Services.IntervalTypes.Interval) { // skip real intervals
                    total = 0;
                    dirty = false;
                    for (j = i + 1; j < length; j += 1) {
                        if (types[i] === types[j]) { // go until hit same type
                            break;
                        }
                        if (types[j] === Services.IntervalTypes.Interval) { // add real intervals
                            dirty = dirty || (values[j] != undefined);
                            total += ((values[j] != undefined) ? values[j] : defaults[j]);
                        }
                    }

                    if (dirty) {
                        values[i] = total;
                    }
                }
            }
        }

        public UpdateRanges(alls: Api.Models.IForecastingMetricAlls, values: number[], defaults?: number[]): void {
            var types = alls.IntervalTypes, i, j, length = types.length, min, max, dirty, value;
            for (i = 0; i < length; i += 1) {
                if (types[i] !== Services.IntervalTypes.Interval) { // skip real intervals
                    min = 1000;
                    max = -100;
                    dirty = false;
                    for (j = i + 1; j < length; j += 1) {
                        if (types[i] === types[j]) { // go until hit same type
                            break;
                        }
                        if (types[j] === Services.IntervalTypes.Interval) { // add real intervals
                            value = ((values[j] != undefined) ? values[j] : defaults[j]);
                            dirty = dirty || (values[j] != undefined);
                            min = Math.min(min, value);
                            max = Math.max(max, value);
                        }
                    }

                    if (dirty) {
                        values[i] = <any>{ min: min, max: max };
                    } else {
                        defaults[i] = <any>{ min: min, max: max };
                    }
                }
            }
        }

        public EditEventAdjustments(profile: Api.Models.IEventProfile): ng.IPromise<Api.Models.IEventProfile> {
            var returnedDeferred = this.$q.defer<Api.Models.IEventProfile>();

            if (profile.Adjustments === undefined) {
                profile.Adjustments = [];
            }

            this.ClearCache([Services.CacheName.FC], true);
            this.SetCache(Services.CacheName.EventProfile, profile, false);

            this.EventProfileDeferred = this.$q.defer<void>();

            this.EventProfileDeferred.promise.then((manualAdjustments: number[]): void => {
                if (manualAdjustments) {
                    profile.Adjustments = manualAdjustments;
                    returnedDeferred.resolve(profile);
                } else {
                    returnedDeferred.resolve(null);
                }
            });

            this.$timeout((): void => {
                this.$location.path("/Forecasting/Editor/Grid/Events");
            });

            return returnedDeferred.promise;
        }

        public EditEventAdjustmentsCompleted(cancelled: boolean, newUrl?: string): void {
            if (this.EventProfileDeferred) {
                var fo: Services.IForecastObject = this.GetCache(Services.CacheName.FC),
                    manualAdjustments = null;

                if (!cancelled) {
                    manualAdjustments = this.GetAdjustments(fo);
                }

                this.EventProfileDeferred.resolve(manualAdjustments);
                this.ClearCache([Services.CacheName.FC, Services.CacheName.EventProfile], true);
                this.EventProfileDeferred = undefined;
            }

            this.$timeout((): void => {
                this.$location.path(newUrl || "/Forecasting/Events");
            });
        }

        public GetAdjustments(fo: Services.IForecastObject): number[] {
            var alls: Api.Models.IForecastingMetricAlls,
                manualAdjustments: number[] = [],
                intervalIndexes,
                i;
            alls = fo.Metrics;
            intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];

            for (i = 0; i < intervalIndexes.length; i++) {
                var index = intervalIndexes[i];
                manualAdjustments.push(alls.NewManagerAdjustments[index] != undefined ?
                    alls.NewManagerAdjustments[index] : alls.ManagerAdjustments[index]);
            }

            return manualAdjustments;
        }

        public SetAdjustments(fo: Services.IForecastObject): void {
            var alls: Api.Models.IForecastingMetricAlls,
                intervalIndexes,
                profile: Api.Models.IEventProfile = this.GetCache(Services.CacheName.EventProfile),
                i;

            if (profile && profile.Adjustments && fo.Metrics) {
                alls = fo.Metrics;
                intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];

                for (i = 0; i < profile.Adjustments.length; i++) {
                    var index = intervalIndexes[i];
                    alls.ManagerAdjustments[index] = profile.Adjustments[i];
                }

                this.UpdateRanges(alls, alls.ManagerAdjustments, alls.ManagerAdjustments);
            }
        }

        public CellNotEditableByPercentage(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string, isByPercentage: boolean): boolean {
            if (isByPercentage) {
                if (metric === Services.MetricType.Sales) {
                    var nmsales = alls.NewManagerSales[index],
                        msales = alls.ManagerSales[index],
                        ssales = alls.SystemSales[index];

                    return nmsales != undefined ? !nmsales : msales !== ssales ? !msales : !ssales;
                } else if (metric === Services.MetricType.Transactions) {
                    var nmtrans = alls.NewManagerTransactions[index],
                        mtrans = alls.ManagerTransactions[index],
                        strans = alls.SystemTransactions[index];

                    return nmtrans != undefined ? !nmtrans : mtrans !== strans ? !mtrans : !strans;
                } else if (metric === Services.MetricType.Events) {
                    return false;
                }
            }

            return false;
        }

        public CellValue(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string): any {
            if (metric === Services.MetricType.Sales) {
                var nmsales = alls.NewManagerSales[index],
                    msales = alls.ManagerSales[index],
                    ssales = alls.SystemSales[index];

                return nmsales != undefined ? nmsales : msales !== ssales ? msales : undefined;
            } else if (metric === Services.MetricType.Transactions) {
                var nmtrans = alls.NewManagerTransactions[index],
                    mtrans = alls.ManagerTransactions[index],
                    strans = alls.SystemTransactions[index];

                return nmtrans != undefined ? nmtrans : mtrans !== strans ? mtrans : undefined;
            } else if (metric === Services.MetricType.Events) {
                var nmadj: any = alls.NewManagerAdjustments[index],
                    madj: any = alls.ManagerAdjustments[index];

                if (nmadj != undefined && nmadj.min !== undefined) {
                    return (nmadj.min !== 0 || nmadj.max !== 0) ? nmadj : undefined;
                } else if (madj !== undefined && madj.min !== undefined) {
                    return (madj.min !== 0 || madj.max !== 0) ? madj : undefined;
                } else {
                    return nmadj != undefined ? nmadj : madj !== 0 ? madj : undefined;
                }
            }

            return undefined;
        }

        public GetEditValue(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string): any {
            var oldValue: any;

            if (metric === Services.MetricType.Sales) {
                oldValue = (alls.NewManagerSales[index] != undefined ?
                    alls.NewManagerSales[index] : alls.ManagerSales[index]);
            } else if (metric === Services.MetricType.Transactions) {
                oldValue = (alls.NewManagerTransactions[index] != undefined ?
                    alls.NewManagerTransactions[index] : alls.ManagerTransactions[index]);
            } else if (metric === Services.MetricType.Events) {
                oldValue = (alls.NewManagerAdjustments[index] != undefined ?
                    alls.NewManagerAdjustments[index] : alls.ManagerAdjustments[index]);
            }

            return oldValue;
        }

        public CellNotEditable(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string, isByPercentage: boolean): boolean {
            if (isByPercentage) {
                if (metric === Services.MetricType.Sales) {
                    var nmsales = alls.NewManagerSales[index],
                        msales = alls.ManagerSales[index],
                        ssales = alls.SystemSales[index];

                    return nmsales != undefined ? !nmsales : msales !== ssales ? !msales : !ssales;
                } else if (metric === Services.MetricType.Transactions) {
                    var nmtrans = alls.NewManagerTransactions[index],
                        mtrans = alls.ManagerTransactions[index],
                        strans = alls.SystemTransactions[index];

                    return nmtrans != undefined ? !nmtrans : mtrans !== strans ? !mtrans : !strans;
                } else if (metric === Services.MetricType.Events) {
                    return false;
                }
            }

            return false;
        }

        public ReCalculateFilteredTotal(saved: Services.IForecastObject, current: Services.IForecastObject, Filters: Api.Models.IForecastFilterRecord[], FiltersMap: any): void {
            if (!Filters || !saved || !current || saved.MetricsFiltered.length === 1) {
                return;
            }

            var savedTotal: Api.Models.IForecastingMetricAlls = saved.MetricsFiltered[0].Data,
                allsTotal: Api.Models.IForecastingMetricAlls = current.MetricsFiltered[0].Data, // 0 always totals
                isSalesItem: boolean = !allsTotal.hasOwnProperty("NewManagerSales");

            // updated interval total with new edit values, current.NewManagerXXX, with diff of saved.ManagerXXX
            // NewManagerXXX is empty array after db load
            // calc total from each editable filtered metric

            // clear out previous calc
            if (!isSalesItem) {
                allsTotal.NewManagerSales.splice(0, allsTotal.NewManagerSales.length);
            }
            allsTotal.NewManagerTransactions.splice(0, allsTotal.NewManagerTransactions.length);

            _.each(current.MetricsFiltered, function (filtered: Services.IAllForecastingDataFiltered, metricsFilteredIndex: number): void {
                if (filtered.FilterId && FiltersMap[filtered.FilterId].Filter.IsForecastEditableViaGroup) {
                    var savedAlls: Api.Models.IForecastingMetricAlls = saved.MetricsFiltered[metricsFilteredIndex].Data,
                        alls: Api.Models.IForecastingMetricAlls = current.MetricsFiltered[metricsFilteredIndex].Data;

                    _.each(allsTotal.TypeIndexes[Services.IntervalTypes.Interval], (index: number): void => {
                        if (!isSalesItem && alls.NewManagerSales[index] !== undefined) {
                            allsTotal.NewManagerSales[index] =
                                (allsTotal.NewManagerSales[index] !== undefined ? allsTotal.NewManagerSales[index] : savedTotal.ManagerSales[index])
                                - savedAlls.ManagerSales[index]
                                + alls.NewManagerSales[index];
                        }

                        if (alls.NewManagerTransactions[index] !== undefined) {
                            allsTotal.NewManagerTransactions[index] =
                                (allsTotal.NewManagerTransactions[index] !== undefined ? allsTotal.NewManagerTransactions[index] : savedTotal.ManagerTransactions[index])
                                - savedAlls.ManagerTransactions[index]
                                + alls.NewManagerTransactions[index];
                        }
                    });
                }
            });

            if (!isSalesItem) {
                this.UpdateTotals(allsTotal, allsTotal.NewManagerSales, allsTotal.ManagerSales);
            }
            this.UpdateTotals(allsTotal, allsTotal.NewManagerTransactions, allsTotal.ManagerTransactions);
        }

        // #region cache

        public GetCache(name: string): any {
            var object: any;

            object = this.Cache[name];
            if (object == undefined) {
                var cache = JSON.parse(localStorage.getItem(CacheName._CACHE)) || {};
                object = cache[name];
            }

            return object;
        }

        public SetCache(name: string, object: any, persist?: boolean): any {
            this.Cache[name] = object;

            if (persist) {
                var cache = JSON.parse(localStorage.getItem(CacheName._CACHE)) || {};
                cache[name] = object;
                localStorage.setItem(CacheName._CACHE, JSON.stringify(cache));
            }

            return object;
        }

        public ClearCache(names: string[], persisted?: boolean): void {
            angular.forEach(names, (name: string): void => {
                this.SetCache(name, null);

                if (persisted) {
                    var cache = JSON.parse(localStorage.getItem(CacheName._CACHE));
                    if (cache && cache[name]) {
                        cache[name] = undefined;
                        localStorage.setItem(CacheName._CACHE, JSON.stringify(cache));
                    }
                }
            });
        }

        // #endregion

        // #region graph data

        public GetSeriesGraphData(alls: Api.Models.IForecastingMetricAlls,
                                  options: Services.IForecastingOptions): ISeriesGraphData[] {
            if (!alls || !options || !alls.IntervalStarts) {
                return [];
            }

            var dayPartColors = ["#f1c40f", "#3498db", "#2ecc71", "#9b59b6", "#1abc9c", "#e74c3c"],
                seriesGraphData: ISeriesGraphData[] = [];

            seriesGraphData.push(<ISeriesGraphData>{
                Categories: this.BuildIntervalStartLabelsForWholeDay(alls),
                Series: this.BuildSeriesDataForWholeDay(alls, dayPartColors),
                SeriesName: "Day"
            });

            var intervalStartLabels: string[],
                series: IChartSeriesItem[];

            for (var part = 0; part < alls.DaySegments.length; part++) {
                intervalStartLabels = this.BuildIntervalStartLabelsForDayPart(alls, part);
                series = this.BuildSeriesDataForDayPart(alls, dayPartColors, part);

                seriesGraphData.push(<ISeriesGraphData>{
                    Categories: intervalStartLabels,
                    Series: series,
                    SeriesName: alls.DaySegments[part].DaySegmentType.Description
                });
            }

            return seriesGraphData;
        }

        private BuildIntervalStartLabelsForWholeDay(alls: Api.Models.IForecastingMetricAlls): string[] {
            var result: string[] = [];
            var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
            for (var i = 0; i < intervalIndexes.length; i++) {
                var currentIntervalIndex = intervalIndexes[i];
                var mf = this.BuildIntervalStartLabel(alls.IntervalStarts[currentIntervalIndex], false);
                result.push(mf);
            }

            return result;
        }

        private BuildIntervalStartLabelsForDayPart(alls: Api.Models.IForecastingMetricAlls, dayPartIndex: number): string[] {
            var result: string[] = [];
            var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
            for (var i = 0; i < intervalIndexes.length; i++) {
                var currentIntervalIndex = intervalIndexes[i];
                if (this.ShouldDayPartIncludeInterval(alls, i, dayPartIndex)) {
                    var mf = this.BuildIntervalStartLabel(alls.IntervalStarts[currentIntervalIndex], true);
                    result.push(mf);
                }
            }

            return result;
        }

        private ShouldDayPartIncludeInterval(alls: Api.Models.IForecastingMetricAlls,
            interval: number,
            dayPartIndex: number) {
            var currentIntervalIndex = alls.TypeIndexes[Services.IntervalTypes.Interval][interval];
            var prevIntervalIndex = alls.TypeIndexes[Services.IntervalTypes.Interval][interval - 1];
            return dayPartIndex === alls.DaySegmentIndexes[currentIntervalIndex] ||
                dayPartIndex === alls.DaySegmentIndexes[prevIntervalIndex];
        }

        private BuildIntervalStartLabel(intervalStart: string, forDayPart: boolean): string {
            var m = moment(intervalStart),
                mf = (forDayPart || m.minutes() === 0) ? m.format("h:mm A") : "";
            return mf;
        }

        private BuildSeriesDataForWholeDay(alls: Api.Models.IForecastingMetricAlls, colors: string[]): IChartSeriesItem[] {
            var result: IChartSeriesItem[] = [];

            var values: any = { sales: alls.NewManagerSales || [], transactions: alls.NewManagerTransactions },
                defaults: any = { sales: alls.ManagerSales || [], transactions: alls.ManagerTransactions },
                unknownSerieData: any = [],
                seriesData: any[] = [],
                i: number,
                j: number;

            for (j = 0; j < alls.DaySegments.length; j++) {
                seriesData.push([]);
            }
            seriesData.push(unknownSerieData);
            var unknownDaySegmentIndex = seriesData.indexOf(unknownSerieData);

            var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];
            for (i = 0; i < intervalIndexes.length; i++) {
                for (j = 0; j < seriesData.length; j++) {
                    seriesData[j].push(null);
                }
            }

            var hasUnknownSegment = false;
            for (i = 0; i < intervalIndexes.length; i++) {
                var currentIntervalIndex = intervalIndexes[i];
                var prevIntervalIndex = intervalIndexes[i - 1];

                if (alls.DaySegmentIndexes[currentIntervalIndex] === -1) {
                    hasUnknownSegment = true;
                }
                var value = this.BuildValueForInterval(values, defaults, currentIntervalIndex);

                var currentDaySegmentIndex = alls.DaySegmentIndexes[currentIntervalIndex];
                this.AssignValueToSeriesData(seriesData, value, i, currentDaySegmentIndex, unknownDaySegmentIndex, true);

                var prevDaySegmentIndex = alls.DaySegmentIndexes[prevIntervalIndex];
                this.AssignValueToSeriesData(seriesData, value, i, prevDaySegmentIndex, unknownDaySegmentIndex, false);
            }

            for (j = 0; j < alls.DaySegments.length; j++) {
                result.push({
                    data: seriesData[j],
                    color: colors[j]
                });
            }

            if (hasUnknownSegment) {
                var colorForUnknownPart = "#b7b7b7";
                result.push({
                    data: seriesData[unknownDaySegmentIndex],
                    color: colorForUnknownPart
                });
            }

            return result;
        }

        private AssignValueToSeriesData(seriesData: any,
            value: any,
            currentInterval: number,
            daySegmentIndex: number,
            unknownDaySegmentIndex: number,
            inSegment: boolean): void {

            if (daySegmentIndex == undefined)
                return;

            var indextoUse: number;
            if (daySegmentIndex === -1) {
                indextoUse = unknownDaySegmentIndex;
            } else {
                indextoUse = daySegmentIndex;
            }

            seriesData[indextoUse][currentInterval] = {
                "value": value,
                "inSegment": inSegment
            };
        }

        private BuildSeriesDataForDayPart(alls: Api.Models.IForecastingMetricAlls, colors: string[], dayPartIndex: number): IChartSeriesItem[] {
            var result: IChartSeriesItem[] = [];
            var values: any = { sales: alls.NewManagerSales || [], transactions: alls.NewManagerTransactions },
                defaults: any = { sales: alls.ManagerSales || [], transactions: alls.ManagerTransactions },
                seriesDataOfDayPart: any = [];

            var intervalIndexes = alls.TypeIndexes[Services.IntervalTypes.Interval];

            for (var i = 0; i < intervalIndexes.length; i++) {
                var currentIntervalIndex = intervalIndexes[i];
                if (!this.ShouldDayPartIncludeInterval(alls, i, dayPartIndex)) {
                    continue;
                }

                var value = this.BuildValueForInterval(values, defaults, currentIntervalIndex);

                var currentDaySegmentIndex = alls.DaySegmentIndexes[currentIntervalIndex];

                seriesDataOfDayPart.push({
                    "value": value,
                    "inSegment": dayPartIndex === currentDaySegmentIndex
                });
            }

            result.push({
                data: seriesDataOfDayPart,
                color: colors[dayPartIndex]
            });

            return result;
        }

        private BuildValueForInterval(values: any, defaults: any, intervalIndex: number): any {
            var value: any = {
                sales: values.sales[intervalIndex] != undefined
                ? values.sales[intervalIndex]
                : defaults.sales[intervalIndex],
                transactions: values.transactions[intervalIndex] != undefined
                ? values.transactions[intervalIndex]
                : defaults.transactions[intervalIndex]
            };

            return value;
        }

        public GetSeriesGraphDataLine(dataFilterd: Services.IAllForecastingDataFiltered, options: Services.IForecastingOptions): ISeriesGraphData[] {
            if (!dataFilterd || !options) {
                return [];
            }

            var alls = dataFilterd.Data,
                intervalStartLabels: string[],
                series,
                seriesData,
                i, part,
                typeIndexes = alls.TypeIndexes,
                intervalIndexes = [],
                values: any = { sales: alls.NewManagerSales || [], transactions: alls.NewManagerTransactions },
                defaults: any = { sales: alls.ManagerSales || [], transactions: alls.ManagerTransactions },
                seriesGraphData: ISeriesGraphData[] = [];

            if (values !== undefined) {
                intervalIndexes = typeIndexes[Services.IntervalTypes.Interval];
                for (part = -1; part < alls.DaySegments.length; part++) {
                    intervalStartLabels = [];
                    series = [];
                    seriesData = [];

                    for (i = 0; i < intervalIndexes.length; i++) {
                        if (alls.IntervalStarts) {
                            var m = moment(alls.IntervalStarts[intervalIndexes[i]]),
                                mf = (m.minutes() === 0) ? m.format("h:mm A") : "";

                            intervalStartLabels.push(mf);
                        }

                        if (part === -1 || part === alls.DaySegmentIndexes[intervalIndexes[i]]
                            || part === alls.DaySegmentIndexes[intervalIndexes[i - 1]]) { // grab the first interval of the next segment for continually
                            var value: any = {
                                sales: values.sales[intervalIndexes[i]] != undefined ? values.sales[intervalIndexes[i]] : defaults.sales[intervalIndexes[i]],
                                transactions: values.transactions[intervalIndexes[i]] != undefined ? values.transactions[intervalIndexes[i]] : defaults.transactions[intervalIndexes[i]]
                            };
                            seriesData.push({
                                "value": value,
                                "filter": options.FiltersMap[dataFilterd.FilterId || 0].Filter.Name
                            });
                        }
                    }

                    for (i = 0; i < seriesData.length; i++) {
                        if (part === -1 || part === i) {
                            series.push({
                                data: seriesData,
                                tooltip: { visible: false },
                                filter: options.FiltersMap[dataFilterd.FilterId || 0],
                                name: options.FiltersMap[dataFilterd.FilterId || 0].Filter.Name
                            });
                        }
                    }

                    seriesGraphData.push({
                        Categories: intervalStartLabels,
                        Series: series,
                        SeriesName: options.FiltersMap[dataFilterd.FilterId || 0].Filter.Name
                    });
                }
            }

            return seriesGraphData;
        }
    
        // #endregion
    }

    export var $forecastingObjectService: Core.NG.INamedService<IForecastingObjectService> =
        Core.NG.ForecastingModule.RegisterService("ForecastingObjectService", ForecastingObjectService,
            Core.NG.$q,
            Core.NG.$location,
            Core.NG.$timeout
            );

    // #region Object Data

    export interface IMetricMap {
        IsCurrency?: boolean;
        Metric: string;
        TranslationKey: string;
        MetricKey: string;
    };

    export var metricMap: any = {
        sales: <IMetricMap>{
            IsCurrency: true, Metric: "ManagerSales", TranslationKey: "Sales",
            MetricKey: MetricType.Sales
        },
        transactions: <IMetricMap>{
            Metric: "ManagerTransactionCount", TranslationKey: "Transactions",
            MetricKey: MetricType.Transactions
        },
        salesitems: <IMetricMap>{
            TranslationKey: "SalesItems",
            MetricKey: MetricType.Transactions
        },
        events: <IMetricMap>{
            Metric: "ManagerAdjustments", TranslationKey: "ManagerAdjustments",
            MetricKey: MetricType.Events
        }
    };

    export interface IForecastingObjectData {
        GetParent(): Services.IForecastingObjectData;
        GetForecastingObject(): Services.IForecastObject;
        GetCache(): Services.IForecastObject;
        LoadData(dayString: string, reload?: boolean, noMetrics?: boolean): ng.IPromise<Services.IForecastObject>;
        SetFilter(filter?: Api.Models.IForecastFilterRecord): void;
        Clear(clearCache: boolean): void;
        ClearChanges(): void;
        SaveChanges(filtered?: boolean): ng.IPromise<Services.IForecastObject>;
        ResetForecasts(): ng.IPromise<Services.IForecastObject>;
    };

    export class ForecastObjectData implements IForecastingObjectData {
        ForecastObject: Services.IForecastObject;
        Parent: ForecastObjectData;
        Filter: Api.Models.IForecastFilterRecord;

        constructor(
            public $q: ng.IQService,
            public dataService: Services.IDataService,
            public forecastingObjectService: Services.IForecastingObjectService) {

            this.ForecastObject = null;
        }

        GetParent(): Services.IForecastingObjectData {
            return this.Parent;
        }

        GetForecastingObject(): Services.IForecastObject {
            return this.ForecastObject;
        }

        SetForecastingObject(fo: Services.IForecastObject, noFilter?: boolean): Services.IForecastObject {
            this.ForecastObject = fo;

            if (fo && this.Filter && !noFilter) {
                this.SetFilter(this.Filter);
            }

            return this.GetForecastingObject();
        }

        GetCache(): Services.IForecastObject {
            return this.forecastingObjectService.GetCache(Services.CacheName.FC);
        }

        LoadData(dayString: string, reload?: boolean, noMetrics?: boolean): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>(),
                fo: Services.IForecastObject = this.GetCache();

            if (!reload) {
                if (
                        !fo ||
                        fo.DayString !== dayString ||
                        fo.Forecast.EntityId !== this.dataService.GetEntityId() ||
                        (!noMetrics && fo.Metrics === null)
                    ) {
                    reload = true;
                }
            }

            if (!reload) {
                fo = this.SetForecastingObject(fo);

                d.resolve(fo);
            } else {
                this.Clear(true);
                this.GetForecast(dayString, noMetrics).then((data: Services.IForecastObject): void => {
                    data = this.SetForecastingObject(data);

                    d.resolve(data);
                }).catch((reason: any): void => {
                    d.reject(reason);
                });
            }

            return d.promise;
        }

        SetFilter(filter?: Api.Models.IForecastFilterRecord): void {
            var fo: Services.IForecastObject = this.GetForecastingObject(),
                filterId = filter ? filter.Id : null,
                data;

            if (!fo) {
                return;
            }

            if (fo && fo.IsDirty) {
                return;
            }

            _.each(fo.MetricsFiltered, (filtered: IAllForecastingDataFiltered): void => {
                if (filtered.FilterId === filterId) {
                    data = filtered.Data;
                }
            });

            if (data) {
                this.Filter = filter;
                fo = <Services.IForecastObject>{
                    DayString: fo.DayString,
                    Forecast: fo.Forecast,
                    Metrics: data,
                    MetricsFiltered: fo.MetricsFiltered,
                    IsDirty: fo.IsDirty,
                    IsLocked: fo.Forecast.IsDayLocked || (filter ? !filter.IsForecastEditableViaGroup : false),
                    ViewHistory: fo.ViewHistory,
                    HourlyEdit: fo.HourlyEdit,
                    CanRevertForecast: fo.CanRevertForecast,
                    Filter: filter
                };

                fo = this.SetForecastingObject(fo, true);
            }
        }

        Clear(clearCache: boolean): void {
            this.SetForecastingObject(null);

            if (clearCache) {
                this.forecastingObjectService.ClearCache([Services.CacheName.FC]);
            }
        }

        ClearChanges(): void {
            this.forecastingObjectService.ClearEdits(this.GetForecastingObject());
        }

        GetForecast(dayString: string, noMetrics?: boolean): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>();
            var fo = null;

            this.dataService.GetAllForecastingDataForDateByFilter(dayString, null, noMetrics).then((data: Services.IAllForecastingData): void => {
                if (data.Forecast) {
                    if (data.Forecast.BusinessDay.substring(0, 10) !== dayString) {
                        d.reject();
                        return;
                    }

                    fo = <Services.IForecastObject>{
                        DayString: dayString,
                        Forecast: data.Forecast,
                        Metrics: data.ForecastMetricAlls,
                        MetricsFiltered: data.ForecastMetricAllsFiltered,
                        IsDirty: false,
                        IsLocked: data.Forecast.IsDayLocked,
                        ViewHistory: this.dataService.CanViewHistory(),
                        HourlyEdit: false,
                        CanRevertForecast: this.dataService.CanRevertForecast()
                    };

                    this.forecastingObjectService.SetCache(Services.CacheName.FC, fo);
                }

                d.resolve(fo);
            }).catch((reason: any): void => {
                d.reject(reason);
            });

            return d.promise;
        }

        SaveChanges(filtered?: boolean): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>(),
                fo = this.GetForecastingObject();

            if (filtered) {
                this.dataService.UpdateMetricsByFilter(fo.Forecast.Id, fo.Forecast.Version, fo.MetricsFiltered)
                    .success((): void => {
                        fo.IsDirty = this.forecastingObjectService.IsDirty(fo);
                        this.LoadData(fo.DayString, true);

                        d.resolve();
                    })
                    .error((message: any, status: any): void => {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
            } else {
                this.dataService.UpdateMetrics(fo.Forecast.Id, fo.Forecast.Version, fo.Metrics, fo.Filter ? fo.Filter.Id : undefined)
                    .success((): void => {
                        fo.IsDirty = this.forecastingObjectService.IsDirty(fo);
                        this.LoadData(fo.DayString, true);

                        d.resolve();
                    })
                    .error((message: any, status: any): void => {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
            }

            return d.promise;
        }

        ResetForecasts(): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>(),
                fo: Services.IForecastObject = this.GetForecastingObject();

            this.dataService.RevertForecast(fo.Forecast.Id, fo.Forecast.Version).then((ver: any): void => {
                d.resolve(ver);
            }).catch((reason: any): void => {
                d.reject(reason);
            });
            
            return d.promise;
        }
    }

    export class ForecastObjectDataSalesItem extends ForecastObjectData {
        Items: Services.IForecastSalesItems;
        private ItemId: number;

        constructor(
            public $q: ng.IQService,
            public dataService: Services.IDataService,
            public forecastingObjectService: Services.IForecastingObjectService,
            public $filter: ng.IFilterService) {

            super($q, dataService, forecastingObjectService);

            this.Parent = new ForecastObjectData($q, dataService, forecastingObjectService);

            this.ForecastObject = <Services.IForecastObject>{};

            this.Items = <Services.IForecastSalesItems>{
                EntityId: 0,
                SalesItems: [],
                SearchParam: ""
            };
        }

        GetItemId(): number {
            return this.ItemId;
        }

        SetItemId(itemId: number): void {
            this.ItemId = itemId;
            if (itemId === null) {
                this.SetForecastingObject(null);
                if (this.Items) {
                    this.Items.SelectedSalesItem = null;
                }
            }
        }

        GetCache(): Services.IForecastObject {
            return this.forecastingObjectService.GetCache(Services.CacheName.FCS);
        }

        LoadData(dayString: string, reload?: boolean, noMetrics?: boolean): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>();
            var fo: Services.IForecastObject = this.GetCache();

            if (!reload) {
                if (!(fo &&
                    fo.DayString === dayString &&
                    fo.ItemId === this.ItemId &&
                    fo.Forecast.EntityId === this.dataService.GetEntityId())) {
                    reload = true;
                }
            }

            if (!reload) {
                this.SetForecastingObject(fo);
                this.LoadSalesItems(fo.Forecast.EntityId, fo.Forecast.Id);

                d.resolve(fo);
            } else {
                var ItemId = this.ItemId;

                this.Clear(true);
                this.GetParent().LoadData(dayString, reload, true).then((parentData: Services.IForecastObject): void => {
                    if (parentData) {
                        this.LoadSalesItems(parentData.Forecast.EntityId, parentData.Forecast.Id);
                        if (ItemId) {
                            this.GetForecastByItemId(dayString, ItemId).then((data: Services.IForecastObject): void => {
                                data.Forecast = parentData.Forecast;
                                data.IsLocked = parentData.Forecast.IsDayLocked;

                                data = this.SetForecastingObject(data);

                                d.resolve(data);
                            }).catch((reason: any): void => {
                                d.reject(reason);
                            });
                        } else {
                            d.reject();
                        }
                    } else {
                        this.Items = <Services.IForecastSalesItems>{
                            EntityId: 0,
                            SalesItems: [],
                            SearchParam: "",
                            SelectedSalesItem: this.Items ? this.Items.SelectedSalesItem : undefined
                        };

                        d.reject();
                    }
                }).catch((reason: any): void => {
                    d.reject(reason);
                });
            }

            return d.promise;
        }

        GetForecast(dayString: string): ng.IPromise<Services.IForecastObject> {
            var ItemId = this.ItemId;

            return this.GetForecastByItemId(dayString, ItemId);
        }

        GetForecastByItemId(dayString: string, ItemId: number): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>();
            var fo = null;

            this.dataService.GetSalesItemMetricsByFilters(this.GetParent().GetForecastingObject().Forecast.Id, ItemId, null)
                .then((data: Services.IAllForecastingData): void => {
                    if (this.ItemId === data.SalesItemId) {
                        var pfo = this.GetParent().GetForecastingObject();

                        fo = <Services.IForecastObject>{
                            DayString: dayString,
                            Forecast: pfo ? pfo.Forecast : null,
                            ItemId: ItemId,
                            Metrics: data.ForecastMetricAlls,
                            MetricsFiltered: data.ForecastMetricAllsFiltered,
                            IsDirty: false,
                            IsLocked: pfo && pfo.Forecast ? pfo.Forecast.IsDayLocked : true,
                            ViewHistory: this.dataService.CanViewHistory(),
                            HourlyEdit: false,
                            CanRevertForecast: this.dataService.CanRevertForecast()
                        };

                        this.forecastingObjectService.SetCache(Services.CacheName.FCS, fo);
                        fo = this.SetForecastingObject(fo);

                        d.resolve(fo);
                    } else {
                        d.reject(); // todo error msg
                    }
                })
                .catch((): void => {
                    d.reject(); // todo error msg
                });

            return d.promise;
        }

        Clear(clearCache: boolean): void {
            this.SetForecastingObject(null);
           
            if (clearCache) {
                this.forecastingObjectService.ClearCache([Services.CacheName.FCS]);
            }
        }

        ClearChanges(): void {
            this.forecastingObjectService.ClearEdits(this.GetForecastingObject());
        }

        SaveChanges(filtered?: boolean): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>(),
                fo = this.GetForecastingObject(),
                forecast = this.GetParent().GetForecastingObject().Forecast;

            if (filtered) {
                this.dataService.UpdateSalesItemMetricsByFilter(forecast.Id, this.ItemId, forecast.Version, fo.MetricsFiltered)
                    .success((): void => {
                        fo.IsDirty = this.forecastingObjectService.IsDirty(fo);
                        this.LoadData(fo.DayString, true);
                        d.resolve();
                    })
                    .error((message: any, status: any): void => {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
            } else {
                this.dataService.UpdateSalesItemMetrics(forecast.Id, this.ItemId, forecast.Version, fo.Metrics, fo.Filter ? fo.Filter.Id : undefined)
                    .success((): void => {
                        fo.IsDirty = this.forecastingObjectService.IsDirty(fo);
                        this.LoadData(fo.DayString, true);
                        d.resolve();
                    })
                    .error((message: any, status: any): void => {
                        d.reject({
                            message: message,
                            status: status
                        });
                    });
            }

            return d.promise;
        }

        ResetForecasts(): ng.IPromise<Services.IForecastObject> {
            var d = this.$q.defer<Services.IForecastObject>(),
                fo: Services.IForecastObject = this.GetForecastingObject();

            this.dataService.RevertForecast(fo.Forecast.Id, fo.Forecast.Version).then((ver: any): void => {
                d.resolve(ver);
            }).catch((reason: any): void => {
                d.reject(reason);
            });

            return d.promise;
        }

        LoadSalesItems(entityId: number, forecastId: number): void {
            var reload = false;

            if (!this.Items || this.Items.EntityId !== entityId) {
                reload = true;
            }

            if (reload) {
                this.dataService.GetSalesItemsForForecastData(forecastId).then((salesItemData: any): void => {
                    this.Items = <any>{
                        EntityId: entityId,
                        SalesItems: this.$filter("orderBy")(salesItemData.data, "Description"),
                        SearchParam: "",
                        SelectedSalesItem: this.Items ? this.Items.SelectedSalesItem : undefined
                    };

                    this.forecastingObjectService.SetCache(Services.CacheName.FCSI, this.Items);

                    this.FindSalesItem();
                });
            } else {
                this.FindSalesItem();
            }
        }

        FindSalesItem(itemId?: number): void {
            var foundItem = null;

            if (!itemId) {
                itemId = this.ItemId;
            }

            if (itemId) {
                foundItem = _.find(this.Items.SalesItems, { Id: itemId });

                if (!foundItem && this.Items.SalesItems && this.Items.SalesItems.length) {
                    this.SetItemId(null);
                }
            }

            this.Items.SelectedSalesItem = foundItem;
        }
    }

    // #endregion
}