module Forecasting {
    "use strict";

    interface IForecastHistoryControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        BusinessDate: string;
        Gridview: string[][];
        Header: string[];
        ForecastObject: Services.IForecastObject;
        Cancel(): void;
        DisplayMetric: string;
        SalesItemDescription: string;
        ClearCache(): void;
        Sync(): void;
    }

    interface IForecastHistoryControllerRouteParams {
        metric: string;
        id?: number;
        part?: number;
        gridview: boolean;
        salesid?: number;
    }

    class ForecastHistoryController {
        private HistoricalObject: Services.IHistoricalObject[];
        private IsSalesItem: boolean;

        constructor(
            private $scope: IForecastHistoryControllerScope,
            private routeparams: IForecastHistoryControllerRouteParams,
            private dataService: Services.IDataService,
            private historicalObjectService: Services.IHistoricalObjectService,
            private forecastingObjectService: Services.IForecastingObjectService,
            private $filter: ng.IFilterService,
            translation: Core.ITranslationService,
            private messageService: Core.IPopupMessageService) {

            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales" },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions" },
                salesitems: { Template: "n", TranslationKey: "SalesItems" }
            },
                currentMetric = metricMap[routeparams.metric];

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Forecasting;
                $scope.DisplayMetric = result.Forecasting[currentMetric.TranslationKey];

                $scope.$broadcast("mxTableSync-refresh");
            });

            $scope.Cancel = (): void => {
                $scope.ClearCache();
                window.history.back();
            };

            $scope.ClearCache = (): void => {
                localStorage.removeItem("date");
                localStorage.removeItem("description");
                localStorage.removeItem("headers");
                localStorage.removeItem("data");
            };

            this.LoadData();

        }

        private LoadData(): void {
            this.IsSalesItem = (this.routeparams.metric === Services.MetricType.SalesItems) ? true : false;
            // TODO
            // Review logic 
            this.routeparams.gridview = (<any>this.routeparams.gridview.valueOf()) === "false" ? false : true;
            if (!this.IsSalesItem) {
                if (this.routeparams.salesid) {
                    this.routeparams.part = this.routeparams.salesid;
                    this.routeparams.salesid = null;
                }
            } else {
                if (this.routeparams.part && !this.routeparams.salesid) {
                    this.routeparams.salesid = this.routeparams.part;
                    this.routeparams.part = null;
                }
            }

            var fo: Services.IForecastObject = this.forecastingObjectService.Cache["FC"],
                fos: Services.IForecastObject = this.forecastingObjectService.Cache["FCS"];

            if (!fo) {
                this.LoadFromCache();
                return;
            }

            this.$scope.BusinessDate = fo.DayString;

            if (this.routeparams.metric !== Services.MetricType.SalesItems) {
                this.LoadSalesData(fo);
            } else {
                this.LoadSalesItems(fos);
                this.$scope.SalesItemDescription = fos.Description;
            }

            this.$scope.$broadcast("mxTableSync-refresh");
        }

        private LoadFromCache(): void {
            var salesDescription: string = localStorage.getItem("description");
            if (salesDescription !== "undefined") {
                this.$scope.SalesItemDescription = salesDescription;
            }
            this.$scope.BusinessDate = localStorage.getItem("date");
            this.GetCachedHeader();
            this.GetCachedGridView();
        }

        private SetCache(): void {
            localStorage.setItem("date", this.$scope.BusinessDate);
            localStorage.setItem("description", this.$scope.SalesItemDescription);
            localStorage.setItem("headers", this.$scope.Header.join("|"));
            this.SetCachedGridView();
        }

        private GetCachedHeader(): void {
            var str: string = localStorage.getItem("headers");
            this.$scope.Header = str.split("|");
        }

        private GetCachedGridView(): void {
            var data: string = localStorage.getItem("data"),
                tmparray: string[], x = [];

            tmparray = data.split("^");
            for (var i = 0; i <= tmparray.length - 1; i += 1) {
                x[i] = [];
                x[i] = tmparray[i].split("|");
            }
            this.$scope.Gridview = x;

        }

        private SetCachedGridView(): void {
            var len: number = this.$scope.Gridview.length,
                data: string = "";

            if (len > 1) {
                for (var i = 0; i <= len - 1; i += 1) {
                    if (i < len - 1) {
                        data += this.$scope.Gridview[i].join("|") + "^";
                    } else {
                        data += this.$scope.Gridview[i].join("|");
                    }
                }
            } else {
                data = this.$scope.Gridview[0].join("|");
            }

            localStorage.setItem("data", data);
        }

        private BuildGridView(fo: Services.IForecastObject, segment?: Api.Models.IDaySegment): void {
            this.SetHeaders();

            this.$scope.Gridview = this.historicalObjectService.CreateGridView(this.HistoricalObject, segment, this.routeparams.metric, this.routeparams.gridview, fo);
            this.SetCache();
        }

        private GetDaySegments(fo: Services.IForecastObject): void {
            if (this.routeparams.part) {
                this.dataService.GetDaySegments(this.routeparams.id).success((daysegments: Api.Models.IDaySegment[]): void => {
                    var i: number,
                        segment: Api.Models.IDaySegment;

                    if (!daysegments || !daysegments.length) {
                        this.$scope.Cancel();
                        return;
                    }

                    for (i = 0; i < daysegments.length; i += 1) {
                        if (daysegments[i].Id === parseInt(this.routeparams.part.toString(), 10)) {
                            segment = daysegments[i];
                            break;
                        }
                    }

                    if (segment) {
                        this.BuildGridView(fo, segment);
                    } else {
                        this.$scope.Cancel();
                    }
                })
                    .error((): void => {
                        this.messageService.ShowError(this.$scope.Translations.GenericErrorMessage);
                    });
            } else {
                this.BuildGridView(fo);
            }

        }

        private LoadSalesItems(fos: Services.IForecastObject): void {
            this.HistoricalObject = null;

            this.dataService.GetHistoricalSalesItem(this.routeparams.id, this.routeparams.salesid).success((data: Api.Models.IHistoricalSalesItem[]): void => {
                if (data === null) {
                    this.$scope.Cancel();
                    return;
                }
                this.HistoricalObject = this.historicalObjectService.LoadSalesItemData(data);

                this.GetDaySegments(fos);
            })
                .error((): void => {
                    this.messageService.ShowError(this.$scope.Translations.GenericErrorMessage);
                });
        }

        private LoadSalesData(fo: Services.IForecastObject): void {
            this.HistoricalObject = null;

            this.dataService.GetAllHistoricalData(this.routeparams.id).success((data: Api.Models.IHistoricalBasis[]): void => {
                if (data === null) {
                    this.$scope.Cancel();
                    return;
                }
                this.HistoricalObject = this.historicalObjectService.LoadSalesData(data);
                this.GetDaySegments(fo);
            })
                .error((): void => {
                    this.messageService.ShowError(this.$scope.Translations.GenericErrorMessage);
                });
        }

        private SetHeaders(): void {
            var len = this.HistoricalObject.length;
            var i: number;

            this.$scope.Header = [];
            if (this.routeparams.gridview) {
                this.$scope.Header[0] = "Time";
                this.$scope.Header[1] = this.$scope.Translations.LastYear + " " + this.$scope.DisplayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Header[i + 2] = this.$filter("date")(this.HistoricalObject[i].BusinessDate);
                }
            } else {
                this.$scope.Header[0] = this.$scope.Translations.LastYear + " " + this.$scope.DisplayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Header[i + 1] = this.$filter("date")(this.HistoricalObject[i].BusinessDate);
                }

            }
            this.$scope.Header[this.$scope.Header.length] = this.$scope.Translations.Forecasted + " " + this.$scope.DisplayMetric;
        }

    }

    Core.NG.ForecastingModule.RegisterRouteController("History/:metric/:id/:gridview{IgnoreSlash:/?}{part:[^/]*}{IgnoreNextSlash:/?}{salesid:.*}", "Templates/ForecastActualsDialog.html", ForecastHistoryController,
        Core.NG.$typedScope<IForecastHistoryControllerScope>(),
        Core.NG.$typedStateParams<IForecastHistoryControllerRouteParams>(),
        Forecasting.Services.$dataService,
        Forecasting.Services.$historicalObjectService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$filter,
        Core.$translation,
        Core.$popupMessageService);
}