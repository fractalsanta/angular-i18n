var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastHistoryController = (function () {
        function ForecastHistoryController($scope, routeparams, dataService, historicalObjectService, forecastingObjectService, $filter, translation, messageService) {
            this.$scope = $scope;
            this.routeparams = routeparams;
            this.dataService = dataService;
            this.historicalObjectService = historicalObjectService;
            this.forecastingObjectService = forecastingObjectService;
            this.$filter = $filter;
            this.messageService = messageService;
            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales" },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions" },
                salesitems: { Template: "n", TranslationKey: "SalesItems" }
            }, currentMetric = metricMap[routeparams.metric];
            translation.GetTranslations().then(function (result) {
                $scope.Translations = result.Forecasting;
                $scope.DisplayMetric = result.Forecasting[currentMetric.TranslationKey];
                $scope.$broadcast("mxTableSync-refresh");
            });
            $scope.Cancel = function () {
                $scope.ClearCache();
                window.history.back();
            };
            $scope.ClearCache = function () {
                localStorage.removeItem("date");
                localStorage.removeItem("description");
                localStorage.removeItem("headers");
                localStorage.removeItem("data");
            };
            this.LoadData();
        }
        ForecastHistoryController.prototype.LoadData = function () {
            this.IsSalesItem = (this.routeparams.metric === Forecasting.Services.MetricType.SalesItems) ? true : false;
            this.routeparams.gridview = this.routeparams.gridview.valueOf() === "false" ? false : true;
            if (!this.IsSalesItem) {
                if (this.routeparams.salesid) {
                    this.routeparams.part = this.routeparams.salesid;
                    this.routeparams.salesid = null;
                }
            }
            else {
                if (this.routeparams.part && !this.routeparams.salesid) {
                    this.routeparams.salesid = this.routeparams.part;
                    this.routeparams.part = null;
                }
            }
            var fo = this.forecastingObjectService.Cache["FC"], fos = this.forecastingObjectService.Cache["FCS"];
            if (!fo) {
                this.LoadFromCache();
                return;
            }
            this.$scope.BusinessDate = fo.DayString;
            if (this.routeparams.metric !== Forecasting.Services.MetricType.SalesItems) {
                this.LoadSalesData(fo);
            }
            else {
                this.LoadSalesItems(fos);
                this.$scope.SalesItemDescription = fos.Description;
            }
            this.$scope.$broadcast("mxTableSync-refresh");
        };
        ForecastHistoryController.prototype.LoadFromCache = function () {
            var salesDescription = localStorage.getItem("description");
            if (salesDescription !== "undefined") {
                this.$scope.SalesItemDescription = salesDescription;
            }
            this.$scope.BusinessDate = localStorage.getItem("date");
            this.GetCachedHeader();
            this.GetCachedGridView();
        };
        ForecastHistoryController.prototype.SetCache = function () {
            localStorage.setItem("date", this.$scope.BusinessDate);
            localStorage.setItem("description", this.$scope.SalesItemDescription);
            localStorage.setItem("headers", this.$scope.Header.join("|"));
            this.SetCachedGridView();
        };
        ForecastHistoryController.prototype.GetCachedHeader = function () {
            var str = localStorage.getItem("headers");
            this.$scope.Header = str.split("|");
        };
        ForecastHistoryController.prototype.GetCachedGridView = function () {
            var data = localStorage.getItem("data"), tmparray, x = [];
            tmparray = data.split("^");
            for (var i = 0; i <= tmparray.length - 1; i += 1) {
                x[i] = [];
                x[i] = tmparray[i].split("|");
            }
            this.$scope.Gridview = x;
        };
        ForecastHistoryController.prototype.SetCachedGridView = function () {
            var len = this.$scope.Gridview.length, data = "";
            if (len > 1) {
                for (var i = 0; i <= len - 1; i += 1) {
                    if (i < len - 1) {
                        data += this.$scope.Gridview[i].join("|") + "^";
                    }
                    else {
                        data += this.$scope.Gridview[i].join("|");
                    }
                }
            }
            else {
                data = this.$scope.Gridview[0].join("|");
            }
            localStorage.setItem("data", data);
        };
        ForecastHistoryController.prototype.BuildGridView = function (fo, segment) {
            this.SetHeaders();
            this.$scope.Gridview = this.historicalObjectService.CreateGridView(this.HistoricalObject, segment, this.routeparams.metric, this.routeparams.gridview, fo);
            this.SetCache();
        };
        ForecastHistoryController.prototype.GetDaySegments = function (fo) {
            var _this = this;
            if (this.routeparams.part) {
                this.dataService.GetDaySegments(this.routeparams.id).success(function (daysegments) {
                    var i, segment;
                    if (!daysegments || !daysegments.length) {
                        _this.$scope.Cancel();
                        return;
                    }
                    for (i = 0; i < daysegments.length; i += 1) {
                        if (daysegments[i].Id === parseInt(_this.routeparams.part.toString(), 10)) {
                            segment = daysegments[i];
                            break;
                        }
                    }
                    if (segment) {
                        _this.BuildGridView(fo, segment);
                    }
                    else {
                        _this.$scope.Cancel();
                    }
                })
                    .error(function () {
                    _this.messageService.ShowError(_this.$scope.Translations.GenericErrorMessage);
                });
            }
            else {
                this.BuildGridView(fo);
            }
        };
        ForecastHistoryController.prototype.LoadSalesItems = function (fos) {
            var _this = this;
            this.HistoricalObject = null;
            this.dataService.GetHistoricalSalesItem(this.routeparams.id, this.routeparams.salesid).success(function (data) {
                if (data === null) {
                    _this.$scope.Cancel();
                    return;
                }
                _this.HistoricalObject = _this.historicalObjectService.LoadSalesItemData(data);
                _this.GetDaySegments(fos);
            })
                .error(function () {
                _this.messageService.ShowError(_this.$scope.Translations.GenericErrorMessage);
            });
        };
        ForecastHistoryController.prototype.LoadSalesData = function (fo) {
            var _this = this;
            this.HistoricalObject = null;
            this.dataService.GetAllHistoricalData(this.routeparams.id).success(function (data) {
                if (data === null) {
                    _this.$scope.Cancel();
                    return;
                }
                _this.HistoricalObject = _this.historicalObjectService.LoadSalesData(data);
                _this.GetDaySegments(fo);
            })
                .error(function () {
                _this.messageService.ShowError(_this.$scope.Translations.GenericErrorMessage);
            });
        };
        ForecastHistoryController.prototype.SetHeaders = function () {
            var len = this.HistoricalObject.length;
            var i;
            this.$scope.Header = [];
            if (this.routeparams.gridview) {
                this.$scope.Header[0] = "Time";
                this.$scope.Header[1] = this.$scope.Translations.LastYear + " " + this.$scope.DisplayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Header[i + 2] = this.$filter("date")(this.HistoricalObject[i].BusinessDate);
                }
            }
            else {
                this.$scope.Header[0] = this.$scope.Translations.LastYear + " " + this.$scope.DisplayMetric;
                for (i = 0; i < len; i += 1) {
                    this.$scope.Header[i + 1] = this.$filter("date")(this.HistoricalObject[i].BusinessDate);
                }
            }
            this.$scope.Header[this.$scope.Header.length] = this.$scope.Translations.Forecasted + " " + this.$scope.DisplayMetric;
        };
        return ForecastHistoryController;
    }());
    Core.NG.ForecastingModule.RegisterRouteController("History/:metric/:id/:gridview{IgnoreSlash:/?}{part:[^/]*}{IgnoreNextSlash:/?}{salesid:.*}", "Templates/ForecastActualsDialog.html", ForecastHistoryController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Forecasting.Services.$dataService, Forecasting.Services.$historicalObjectService, Forecasting.Services.$forecastingObjectService, Core.NG.$filter, Core.$translation, Core.$popupMessageService);
})(Forecasting || (Forecasting = {}));
