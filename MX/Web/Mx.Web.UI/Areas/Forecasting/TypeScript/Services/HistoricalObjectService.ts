module Forecasting.Services {
    "use strict";
    export interface IHistoricalObjectService {
        LoadSalesData(historicaldata: Api.Models.IHistoricalBasis[]): IHistoricalObject[];
        LoadSalesItemData(data: Api.Models.IHistoricalSalesItem[]): IHistoricalObject[];
        CreateGridView(data: IHistoricalObject[], daysegments: Api.Models.IDaySegment, metric: string, includeHours: boolean, fo: Services.IForecastObject): string[][];
    }

    export interface IHistoricalDetail {
        IntervalStart: string;
        Sales: number;
        Transactions: number;
    }

    export interface IHistoricalObject {
        BusinessDate: string;
        Details: IHistoricalDetail[];
    }

    class HistoricalObjectService implements IHistoricalObjectService {
        constructor(private authService: Core.Auth.IAuthService,
            private $filter: ng.IFilterService) { }

        public LoadSalesData(historicalData: Api.Models.IHistoricalBasis[]): IHistoricalObject[] {

            var found = false;
            var historicalObject = <IHistoricalObject[]>[];
            var i: number,
                j: number,
                len: number,
                history: IHistoricalObject,
                currentObj: Api.Models.IHistoricalBasis;

            for (i = 0; i < historicalData.length; i += 1) {
                len = historicalObject.length;
                for (j = 0; j < len; j += 1) {
                    currentObj = historicalData[i];
                    if (currentObj.BusinessDate === historicalObject[j].BusinessDate) {
                        found = true;
                        historicalObject[j].Details.push(<IHistoricalDetail>{
                            IntervalStart: currentObj.IntervalStart,
                            Sales: currentObj.Sales,
                            Transactions: currentObj.Transactions
                        });
                        break;
                    }
                }
                if (!found) {
                    currentObj = historicalData[i];
                    history = <IHistoricalObject>{
                        BusinessDate: currentObj.BusinessDate,
                        Details: [
                            <IHistoricalDetail>{
                                IntervalStart: currentObj.IntervalStart,
                                Sales: currentObj.Sales,
                                Transactions: currentObj.Transactions
                            }
                        ]
                    };
                    historicalObject.push(history);
                }
                found = false;
            }
            return this.OrderObjectData(historicalObject);
        }

        public LoadSalesItemData(data: Api.Models.IHistoricalSalesItem[]): IHistoricalObject[] {
            var found = false;
            var historicalObject = <IHistoricalObject[]>[];
            var i: number,
                j: number,
                len: number,
                history: IHistoricalObject,
                currentObj: Api.Models.IHistoricalSalesItem;

            for (i = 0; i < data.length; i += 1) {
                len = historicalObject.length;
                for (j = 0; j < len; j += 1) {
                    currentObj = data[i];
                    if (currentObj.BusinessDate === historicalObject[j].BusinessDate) {
                        found = true;
                        historicalObject[j].Details.push(<IHistoricalDetail>{
                            IntervalStart: currentObj.IntervalStart,
                            Sales: 0,
                            Transactions: currentObj.Transactions
                        });
                        break;
                    }
                }
                if (!found) {
                    currentObj = data[i];
                    history = <IHistoricalObject>{
                        BusinessDate: currentObj.BusinessDate,
                        Details: [
                            <IHistoricalDetail>{
                                IntervalStart: currentObj.IntervalStart,
                                Sales: 0,
                                Transactions: currentObj.Transactions
                            }
                        ]
                    };
                    historicalObject.push(history);
                }
                found = false;
            }
            return this.OrderObjectData(historicalObject);
        }

        private OrderObjectData(data: any[]): any[] {
            return data.sort((a: any, b: any): number => {
                return Date.parse(a.BusinessDate) - Date.parse(b.BusinessDate);
            });
        }

        // Row : Hourly Interval (if includeHours) or One row for whole day
        // Column : Time (if includeHours), Last Year, historical business days, Forecast
        public CreateGridView(data: IHistoricalObject[], segment: Api.Models.IDaySegment, metric: string, includeHours: boolean, fo: Services.IForecastObject): string[][] {
            var historicalDaysCount = data.length;

            var formatAsDollar = !(MetricType.Transactions === metric || MetricType.SalesItems === metric);
            var initialValue = formatAsDollar ? this.$filter("currency")(0) : "0";

            var view = includeHours ? this.CreateArray(1, historicalDaysCount + 3) // 3: plus Hourly Interval Name, Last Year, Forecast columns
                : this.CreateArray(1, historicalDaysCount + 2); // 2: plus Last Year, Forecast columns

            if (segment === undefined) {
                view = this.GenerateAllData(data, view, metric, fo, includeHours);
            } else {
                view = this.GenerateSegmentData(data, view, segment, metric, fo, includeHours);
            }

            //Fix undefined value in view
            for (var i:number = 0; i < view.length; i++) {
                for (var j: number = 0; j < view[i].length; j++) {
                    if (!view[i][j]) {
                        view[i][j] = initialValue;
                    }
                }
            }

            return view;
        }

        private GenerateSegmentData(data: IHistoricalObject[], view: string[][], segment: Api.Models.IDaySegment, metric: string, fo: Services.IForecastObject, includeHours: boolean): string[][] {
            var isSales = MetricType.Sales === metric;

            view = this.GenerateForecastSegmentData(view, segment, isSales, fo, includeHours);
            view = this.GenerateActualHistoricalData(data, view, segment, isSales, fo, includeHours, Math.floor(segment.StartHour));

            return view;
        }

        private GenerateAllData(data: IHistoricalObject[], view: string[][], metric: string, fo: Services.IForecastObject, includeHours: boolean): string[][] {
            var isSales = MetricType.Sales === metric;

            var forecastDayStart = moment(fo.Metrics.IntervalStarts[0]);
            var forecastBusinessDay = moment(fo.Forecast.BusinessDay);
            var minHour = (forecastDayStart >= forecastBusinessDay)
                ? forecastDayStart.hours()
                : forecastDayStart.hours() - 24;

            view = this.GenerateForecastData(view, metric, fo, forecastDayStart, includeHours);
            view = this.GenerateActualHistoricalData(data, view, null, isSales, fo, includeHours, minHour);

            return view;
        }

        private GenerateForecastSegmentData(view: string[][], segment: Api.Models.IDaySegment, isSales: boolean, fo: Services.IForecastObject, includeHours: boolean): string[][] {
            var lastYearIntervals: number[] = ((isSales) ? fo.Metrics.LastYearSales : fo.Metrics.LastYearTransactions),
                forecastIntervals: number[] = ((isSales) ? fo.Metrics.ManagerSales : fo.Metrics.ManagerTransactions),
                intervalStarts: string[] = fo.Metrics.IntervalStarts,
                intervalTypes: number[] = fo.Metrics.IntervalTypes,
                segments: number[] = fo.Metrics.DaySegmentIndexes,
                forecastColumnIndex: number = view[0].length - 1,
                timeColumnIndex: number = 0,
                lastYearColumnIndex: number;
            var i: number,
                hour: number;

            var selectedSegmentIndex = _.findIndex(fo.Metrics.DaySegments,
                (x: Api.Models.IDaySegment) => x.DaySegmentType.Id === segment.DaySegmentType.Id);

            if (!includeHours) {
                lastYearColumnIndex = 0;
                for (i = 0; i < forecastIntervals.length; i += 1) {
                    if (segments[i] === selectedSegmentIndex && intervalTypes[i] === Services.IntervalTypes.DaySegment) {
                        view[0][lastYearColumnIndex] = <any>((isSales) ? this.$filter('currency')(lastYearIntervals[i]) : lastYearIntervals[i]);
                        view[0][forecastColumnIndex] = <any>((isSales) ? this.$filter('currency')(forecastIntervals[i]) : forecastIntervals[i]);
                        return view;
                    }
                }
            } else {
                lastYearColumnIndex = 1;
                hour = 0;
                for (i = 0; i < forecastIntervals.length; i += 1) {
                    if (segments[i] === selectedSegmentIndex) {
                        if (intervalTypes[i] === Services.IntervalTypes.Hour) {
                            // Add hour row if not existed
                            view[hour] = (view[hour]) ? view[hour] : [];
                            view[hour][timeColumnIndex] = moment(intervalStarts[i]).format("h:mm A");

                            this.AddValueToView(view, hour, lastYearColumnIndex, lastYearIntervals[i], isSales);
                            this.AddValueToView(view, hour, forecastColumnIndex, forecastIntervals[i], isSales);
                            hour += 1;
                        }
                    }
                }
            }

            return view;
        }

        private GenerateActualHistoricalData(data: IHistoricalObject[],
            view: string[][],
            segment: Api.Models.IDaySegment,
            isSales: boolean,
            fo: Services.IForecastObject,
            includeHours: boolean,
            viewStartHour: number): string[][] {

            var historicalDaysCount = data.length;

            var currentDay: number,
                currentDayColumnIndex: number,
                j: number,
                numberOfIntervals: number,
                currentDetail: IHistoricalDetail,
                hour: number,
                hourWithMinutePortion: number,
                hourIndex: number,
                value: number;

            for (currentDay = 0; currentDay < historicalDaysCount; currentDay += 1) {
                numberOfIntervals = data[currentDay].Details.length;
                if (numberOfIntervals === 0) {
                    continue;
                }

                //Hourly forecast : 1st column = Interval name, 2nd column : Last Year data so current day is from 3rd column
                //Wholeday forecast : 1st column = Last Year data
                currentDayColumnIndex = (includeHours) ? currentDay + 2 : currentDay + 1;

                var currentbusiDay = moment(data[currentDay].BusinessDate);
                var actualIntervalStart = moment(data[currentDay].Details[0].IntervalStart);
                var minActualHour = (actualIntervalStart >= currentbusiDay)
                    ? actualIntervalStart.hours()
                    : actualIntervalStart.hours() - 24;

                for (j = 0; j < numberOfIntervals; j += 1) {
                    currentDetail = data[currentDay].Details[j];
                    if (segment) {
                        hourWithMinutePortion = minActualHour + j / 4;
                        if (hourWithMinutePortion < segment.StartHour || hourWithMinutePortion >= segment.EndHour) {
                            continue; //ignore interval not in segment range
                        }
                    }

                    var indexToUse;
                    if (includeHours) {
                        hour = minActualHour + Math.floor(j / 4);
                        hourIndex = hour - viewStartHour;
                        if (hourIndex < 0 || hourIndex >= view.length) {
                            continue; //ignore historical interval not in forecast range
                        }
                        indexToUse = hourIndex;
                    } else {
                        indexToUse = 0;
                    }

                    value = (isSales) ? currentDetail.Sales : currentDetail.Transactions;

                    this.AddValueToView(view, indexToUse, currentDayColumnIndex, value, isSales);
                }
            }

            return view;
        }

        private GenerateForecastData(view: string[][], metric: string, fo: Services.IForecastObject, forecastDayStart: Moment, includeHours: boolean): string[][] {
            var isSales = MetricType.Sales === metric,
                isSalesItem = MetricType.SalesItems === metric,
                timeColumnIndex: number = 0,
                lastYearColumnIndex: number,
                forecastColumnIndex: number = view[0].length - 1;
            var i: number,
                lastYearIntervals: number[],
                forecastIntervals: number[],
                intervalTypes: number[],
                hour: number,
                intervalCount: number = 0;

            if (!includeHours) {
                lastYearColumnIndex = 0;
                view[0][lastYearColumnIndex] = ((isSales)
                    ? this.$filter("currency")(fo.Forecast.LastYearSales)
                    : ((isSalesItem) ? fo.Metrics.LastYearTransactions[0] : fo.Forecast.LastYearTransactionCount));

                view[0][forecastColumnIndex] = ((isSales)
                    ? this.$filter("currency")(fo.Forecast.ManagerSales)
                    : ((isSalesItem) ? fo.Metrics.ManagerTransactions[0] : fo.Forecast.ManagerTransactionCount));
            } else {
                lastYearColumnIndex = 1;
                lastYearIntervals = ((isSales) ? fo.Metrics.LastYearSales : fo.Metrics.LastYearTransactions);
                forecastIntervals = ((isSales) ? fo.Metrics.ManagerSales : fo.Metrics.ManagerTransactions);
                intervalTypes = fo.Metrics.IntervalTypes;
                hour = 0;
                var minHour = forecastDayStart.hours();

                for (i = 0; i < forecastIntervals.length; i += 1) {
                    if (intervalTypes[i] === Services.IntervalTypes.Hour) {
                        //Add time column if not existed
                        view[hour] = (view[hour]) ? view[hour] : [];
                        view[hour][timeColumnIndex] = this.GetFormatedHour(minHour + hour);

                        this.AddValueToView(view, hour, lastYearColumnIndex, lastYearIntervals[i], isSales);

                        this.AddValueToView(view, hour, forecastColumnIndex, forecastIntervals[i], isSales);
                    } else {
                        if (intervalTypes[i] === Services.IntervalTypes.Interval) {
                            intervalCount += 1;
                            if (intervalCount === 4) {
                                hour += 1;
                                intervalCount = 0;
                            }
                        }
                    }
                }
            }
            return view;
        }

        private CreateArray(rows: number, cols: number): string[][] {
            var viewBoard = [];
            var i: number,
                j: number;

            for (i = 0; i < rows; i += 1) {
                viewBoard[i] = [];
                for (j = 0; j < cols; j += 1) {
                    viewBoard[i][j] = null;
                }
            }

            return viewBoard;
        }

        private GetFormatedHour(hour: number): string {
            hour = hour % 24;

            var modifiedHour = hour > 12 ? hour - 12 : hour;

            return (modifiedHour || 12) + ":00 " + (hour < 12 ? "AM" : "PM");
        }

        private AddValueToView(view: string[][], rowIndex: number, columnIndex: number,
            valueToAdd: number, isSales: boolean): void {

            var currentValue = view[rowIndex][columnIndex];
            if (!currentValue) {
                currentValue = "0";
            }

            var numberValue = (isSales)
                ? parseFloat(currentValue.replace(/[^0-9-.]/g, ""))
                : parseInt(currentValue, 10);
            if (!numberValue) {
                numberValue = 0;
            }

            var numberResult = numberValue + valueToAdd;

            view[rowIndex][columnIndex] = (isSales) ? this.$filter("currency")(numberResult) : numberResult.toString();
        }
    }
    export var $historicalObjectService: Core.NG.INamedService<IHistoricalObjectService> =
        Core.NG.ForecastingModule.RegisterService("HistoricalObjectService", HistoricalObjectService,
            Core.Auth.$authService,
            Core.NG.$filter);
}