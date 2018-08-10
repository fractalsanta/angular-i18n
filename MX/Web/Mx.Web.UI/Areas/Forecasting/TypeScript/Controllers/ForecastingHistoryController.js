var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastingHistoryController = (function () {
        function ForecastingHistoryController($scope, $stateParams, dataService, historicalObjectService, $filter, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$stateParams = $stateParams;
            this.dataService = dataService;
            this.historicalObjectService = historicalObjectService;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.$scope.$watch("GetForecastObject()", function (fo) {
                if (fo) {
                    if (!_this.$scope.Model.HistoryTitle) {
                        _this.Initialize();
                    }
                }
            }, false);
            this.Initialize();
        }
        ForecastingHistoryController.prototype.Initialize = function () {
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
        };
        ForecastingHistoryController.prototype.SetData = function () {
            var _this = this;
            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales" },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions" },
                salesitems: { Template: "n", TranslationKey: "SalesItems" }
            }, currentMetric = metricMap[this.forecastingOptions.Metric];
            this.displayMetric = this.$scope.Vm.L10N[currentMetric.TranslationKey];
            this.$scope.Model.HistoryTitle = this.$scope.Vm.L10N.HistoryTitle + (this.$scope.Model.Filter ? " : " + this.$scope.Model.Filter.Name : "");
            this.$scope.Model.BusinessDate = this.forecastingObject.DayString;
            if (this.$scope.Vm.SalesItem) {
                this.salesItem = this.$scope.Vm.SalesItem;
                this.$scope.Model.SalesItemDescription = this.$scope.Vm.SalesItem.Description;
            }
            this.$scope.Cancel = function () {
                _this.$scope.NavigateTo(_this.$scope.Model.IsGridView ? "Edit" : "View");
            };
            this.LoadData();
        };
        ForecastingHistoryController.prototype.LoadData = function () {
            var forecastId = this.forecastingObject.Forecast.Id;
            var filterId = this.$scope.Model.Filter ? this.$scope.Model.Filter.Id : null;
            if (this.salesItem) {
                this.LoadSalesItemHistory(forecastId, filterId);
            }
            else {
                this.LoadSalesHistory(forecastId, filterId);
            }
        };
        ForecastingHistoryController.prototype.LoadSalesHistory = function (forecastId, filterId) {
            var _this = this;
            this.historicalObject = null;
            this.dataService.GetAllHistoricalData(forecastId, filterId)
                .success(function (data) {
                _this.historicalObject = _this.historicalObjectService.LoadSalesData(data);
                _this.GetDaySegments();
            });
        };
        ForecastingHistoryController.prototype.LoadSalesItemHistory = function (forecastId, filterId) {
            var _this = this;
            this.historicalObject = null;
            this.dataService.GetHistoricalSalesItem(forecastId, this.salesItem.Id, filterId)
                .success(function (data) {
                _this.historicalObject = _this.historicalObjectService.LoadSalesItemData(data);
                _this.GetDaySegments();
            });
        };
        ForecastingHistoryController.prototype.BuildGridView = function (segment) {
            this.SetHeaders();
            this.$scope.Model.Gridview =
                this.historicalObjectService.CreateGridView(this.historicalObject, segment, this.forecastingOptions.Metric, this.$scope.Model.IsGridView, this.forecastingObject);
        };
        ForecastingHistoryController.prototype.GetDaySegments = function () {
            if (this.forecastingOptions.Part !== null) {
                var segment = this.forecastingObject.Metrics.DaySegments[this.forecastingOptions.Part];
                if (segment) {
                    this.BuildGridView(segment);
                }
                else {
                    this.$scope.Cancel();
                }
            }
            else {
                this.BuildGridView();
            }
        };
        ForecastingHistoryController.prototype.SetHeaders = function () {
            var len = this.historicalObject.length;
            var i;
            this.$scope.Model.Header = [];
            if (this.$scope.Model.IsGridView) {
                this.$scope.Model.Header[0] = this.$scope.Vm.L10N.Time;
                this.$scope.Model.Header[1] = this.$scope.Vm.L10N.LastYear + " " + this.displayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Model.Header[i + 2] = this.$filter("date")(this.historicalObject[i].BusinessDate);
                }
            }
            else {
                this.$scope.Model.Header[0] = this.$scope.Vm.L10N.LastYear + " " + this.displayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Model.Header[i + 1] = this.$filter("date")(this.historicalObject[i].BusinessDate);
                }
            }
            this.$scope.Model.Header[this.$scope.Model.Header.length] = this.$scope.Vm.L10N.Forecasted + " " + this.displayMetric;
            this.$timeout(function () {
                $(window).resize();
            });
        };
        return ForecastingHistoryController;
    }());
    Forecasting.ForecastingHistoryController = ForecastingHistoryController;
    Forecasting.forecastingHistoryController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingHistoryController", ForecastingHistoryController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Forecasting.Services.$dataService, Forecasting.Services.$historicalObjectService, Core.NG.$filter, Core.NG.$timeout);
})(Forecasting || (Forecasting = {}));
