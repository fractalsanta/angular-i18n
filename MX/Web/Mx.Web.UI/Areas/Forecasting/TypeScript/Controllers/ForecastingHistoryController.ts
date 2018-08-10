
module Forecasting {
    "use strict";

    

    export interface IForecastingHistoryControllerScope extends IForecastingControllerScope {
        Model: {
            HistoryTitle: string;
            BusinessDate: string;
            SalesItemDescription: string;
            Gridview: string[][];
            Header: string[];
            Filter: Api.Models.IForecastFilterRecord;
            IsGridView: boolean;
        };
        Cancel(): void;
    }

    export class ForecastingHistoryController {
        private forecastingOptions: Services.IForecastingOptions;
        private forecastingObject: Services.IForecastObject;
        private salesItem: Api.Models.ISalesItem;
        private historicalObject: Services.IHistoricalObject[];
        private displayMetric: string;

        constructor(
            private $scope: IForecastingHistoryControllerScope,
            private $stateParams: IForecastingStateParams,
            private dataService: Services.IDataService,
            private historicalObjectService: Services.IHistoricalObjectService,
            private $filter: ng.IFilterService,
            private $timeout: ng.ITimeoutService
            ) {

            this.$scope.$watch("GetForecastObject()", (fo: Services.IForecastObject): void => {
                if (fo) {
                    if (!this.$scope.Model.HistoryTitle) {
                        this.Initialize();
                    }
                }
            }, false);

            this.Initialize();
        }

        Initialize(): void {
            var isGridView = this.$stateParams.gridview === "true";

            this.forecastingOptions = this.$scope.GetForecastingOptions();
            this.$scope.Model = {
                HistoryTitle: null,
                Gridview: null,
                Header: null,
                BusinessDate: null,
                SalesItemDescription: null,
                Filter: (isGridView && this.forecastingOptions.Filter ? this.forecastingOptions.Filter : null),
                IsGridView: isGridView
            };

            this.forecastingObject = this.$scope.GetForecastObject();
            if (this.forecastingObject) {
                this.SetData();
            }
        }

        SetData(): void{

            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales" },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions" },
                salesitems: { Template: "n", TranslationKey: "SalesItems" }
            },
            currentMetric = metricMap[this.forecastingOptions.Metric];

            this.displayMetric = this.$scope.Vm.L10N[currentMetric.TranslationKey];
            this.$scope.Model.HistoryTitle = this.$scope.Vm.L10N.HistoryTitle + (this.$scope.Model.Filter ? " : " + this.$scope.Model.Filter.Name : "");
            this.$scope.Model.BusinessDate = this.forecastingObject.DayString;

            if (this.$scope.Vm.SalesItem) {
                this.salesItem = this.$scope.Vm.SalesItem;
                this.$scope.Model.SalesItemDescription = this.$scope.Vm.SalesItem.Description;
            }

            this.$scope.Cancel = (): void => {
                this.$scope.NavigateTo(this.$scope.Model.IsGridView ? "Edit" : "View");
            };

            this.LoadData();
            
        }

        LoadData(): void {
            var forecastId: number = this.forecastingObject.Forecast.Id;
            var filterId: number = this.$scope.Model.Filter ? this.$scope.Model.Filter.Id : null;

            if (this.salesItem) {
                this.LoadSalesItemHistory(forecastId, filterId);
            } else {
                this.LoadSalesHistory(forecastId, filterId);
            }
        }
        private LoadSalesHistory(forecastId: number, filterId?: number): void {
            this.historicalObject = null;

            this.dataService.GetAllHistoricalData(forecastId, filterId)
                .success((data: Api.Models.IHistoricalBasis[]): void => {
                    this.historicalObject = this.historicalObjectService.LoadSalesData(data);
                    this.GetDaySegments();
            });
        }

        private LoadSalesItemHistory(forecastId: number, filterId?: number): void {
            this.historicalObject = null;

            this.dataService.GetHistoricalSalesItem(forecastId, this.salesItem.Id, filterId)
                .success((data: Api.Models.IHistoricalSalesItem[]): void => {
                    this.historicalObject = this.historicalObjectService.LoadSalesItemData(data);
                    this.GetDaySegments();
                });
        }

        private BuildGridView(segment?: Api.Models.IDaySegment): void {
            this.SetHeaders();

            this.$scope.Model.Gridview =
                this.historicalObjectService.CreateGridView(this.historicalObject, segment, this.forecastingOptions.Metric, this.$scope.Model.IsGridView, this.forecastingObject);
        }

        private GetDaySegments(): void {
            if (this.forecastingOptions.Part !== null) {
                var segment: Api.Models.IDaySegment = this.forecastingObject.Metrics.DaySegments[this.forecastingOptions.Part];
                if (segment) {
                    this.BuildGridView(segment);
                } else {
                    this.$scope.Cancel();
                }

            } else {
                this.BuildGridView();
            }

        }

        private SetHeaders(): void {
            var len = this.historicalObject.length;
            var i: number;

            this.$scope.Model.Header = [];
            if (this.$scope.Model.IsGridView) {
                this.$scope.Model.Header[0] = this.$scope.Vm.L10N.Time;
                this.$scope.Model.Header[1] = this.$scope.Vm.L10N.LastYear + " " + this.displayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Model.Header[i + 2] = this.$filter("date")(this.historicalObject[i].BusinessDate);
                }
            } else {
                this.$scope.Model.Header[0] = this.$scope.Vm.L10N.LastYear + " " + this.displayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Model.Header[i + 1] = this.$filter("date")(this.historicalObject[i].BusinessDate);
                }

            }
            this.$scope.Model.Header[this.$scope.Model.Header.length] = this.$scope.Vm.L10N.Forecasted + " " + this.displayMetric;

          this.$timeout(() => {
              $(window).resize();
          });
        }
    }

    export var forecastingHistoryController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingHistoryController", ForecastingHistoryController,
        Core.NG.$typedScope<IForecastingHistoryControllerScope>(),
        Core.NG.$typedStateParams<IForecastingStateParams>(),
        Forecasting.Services.$dataService,
        Forecasting.Services.$historicalObjectService,
        Core.NG.$filter,
        Core.NG.$timeout
        );
}
