var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastFilterGridController = (function () {
        function ForecastFilterGridController($scope, translationService, $filter, systemSettingsService, forecastingObjectService, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.translationService = translationService;
            this.$filter = $filter;
            this.systemSettingsService = systemSettingsService;
            this.forecastingObjectService = forecastingObjectService;
            this.$timeout = $timeout;
            $scope.$watch("Options", function (newValue, oldValue) {
                _this.LoadData();
            }, true);
            $scope.$watch("ForecastObject", function (fo) {
                _this.$scope.ForecastObject = fo;
                _this.LoadData();
                if (fo && (!_this.savedFO || _this.savedFO.Forecast.Version !== fo.Forecast.Version)) {
                    _this.savedFO = _.cloneDeep(fo);
                }
                if (fo && !fo.IsDirty) {
                    fo.EditedFilterIndex = undefined;
                }
            }, true);
            $scope.InlineOptions = {
                IsByPercentage: false
            };
            $scope.CURRENCY_SYM = systemSettingsService.GetCurrencySymbol();
            $scope.OnClickSetByPercentage = function (value, e) {
                var target = $(e.target);
                $scope.InlineOptions.IsByPercentage = value;
            };
            $scope.CellValue = function (alls, index) {
                var fo = _this.$scope.ForecastObject;
                return fo ? _this.forecastingObjectService.CellValue(alls, index, $scope.Options.MetricKey) : 0;
            };
            $scope.CellNotEditable = function (alls) {
                return _this.forecastingObjectService.CellNotEditableByPercentage(alls, _this.$scope.Options.PartIndex || 0, $scope.Options.MetricKey, $scope.InlineOptions.IsByPercentage) || $scope.ForecastObject.IsLocked;
            };
            $scope.OnClick = function (e) {
                var target = $(e.target), edit = $(e.target).closest(".form-control");
                if (target.is("input")) {
                    return;
                }
                if (edit.length) {
                    _this.CellClicked(edit);
                }
            };
            $scope.$watch("Editing.EditedValue", function (newValue) {
                if (newValue != undefined) {
                    if ($scope.Editing.NavigationKey) {
                        _this.NavigateVertical($scope.Editing.NavigationKey === Core.KeyCodes.Up);
                    }
                    else {
                        _this.SubmitNewValue($scope.Editing);
                    }
                }
            }, false);
            $scope.Cancel = function () {
                $scope.EditingIndex = null;
                $scope.Editing = null;
            };
            $scope.RowNotEditable = function (row, index) {
                if (!_this.$scope.ForecastObject) {
                    return true;
                }
                var EditedIndex = _this.$scope.ForecastObject.EditedFilterIndex;
                if (EditedIndex !== undefined) {
                    if ((EditedIndex === 0 && index !== 0) || (EditedIndex !== 0 && index === 0)) {
                        return true;
                    }
                }
                return !row.IsEditable || $scope.CellNotEditable(row.Filtered.Data);
            };
            this.Initialize();
        }
        ForecastFilterGridController.prototype.Initialize = function () {
            var _this = this;
            this.translationService.GetTranslations().then(function (results) {
                _this.$scope.L10N = results.Forecasting;
            });
        };
        ForecastFilterGridController.prototype.LoadData = function () {
            var grid = [], $filter = this.$filter, fo = this.$scope.ForecastObject, options = this.$scope.Options, metric = this.$scope.Options.MetricKey, partIndex = this.$scope.Options.PartIndex || 0, self = this;
            if (fo !== null) {
                if (fo.MetricsFiltered && options.HasFilters) {
                    _.each(fo.MetricsFiltered, function (filtered, i) {
                        if (i === 0 || (options.Filters && options.Filters.length)) {
                            var filter = options.FiltersMap[filtered.FilterId || 0].Filter;
                            if (metric === Forecasting.Services.MetricType.Sales) {
                                grid.push({
                                    FilterId: filtered.FilterId,
                                    LastYear: $filter("currencyNoDecimalOrComma")(filtered.Data.LastYearSales[partIndex] || 0),
                                    SystemForecast: $filter("currencyNoDecimalOrComma")(filtered.Data.SystemSales[partIndex] || 0),
                                    ManagerForecast: $filter("currencyNoDecimalOrComma")(self.GetEditValue(filtered.Data, partIndex, metric) || 0),
                                    IsEditable: filter.IsForecastEditableViaGroup,
                                    Filtered: filtered
                                });
                            }
                            else {
                                grid.push({
                                    FilterId: filtered.FilterId,
                                    LastYear: "" + (filtered.Data.LastYearTransactions[partIndex] || "0"),
                                    SystemForecast: "" + (filtered.Data.SystemTransactions[partIndex] || "0"),
                                    ManagerForecast: "" + (self.GetEditValue(filtered.Data, partIndex, metric) || "0"),
                                    IsEditable: filter.IsForecastEditableViaGroup,
                                    Filtered: filtered
                                });
                            }
                        }
                    });
                }
                else if (fo.Metrics) {
                    var filtered = {
                        Data: fo.Metrics,
                        FilterId: null
                    };
                    if (metric === Forecasting.Services.MetricType.Sales) {
                        grid.push({
                            FilterId: null,
                            LastYear: $filter("currencyNoDecimalOrComma")(fo.Metrics.LastYearSales[partIndex] || 0),
                            SystemForecast: $filter("currencyNoDecimalOrComma")(fo.Metrics.SystemSales[partIndex] || 0),
                            ManagerForecast: $filter("currencyNoDecimalOrComma")(self.GetEditValue(fo.Metrics, partIndex, metric) || 0),
                            IsEditable: true,
                            Filtered: filtered
                        });
                    }
                    else {
                        grid.push({
                            FilterId: null,
                            LastYear: "" + (fo.Metrics.LastYearTransactions[partIndex] || "0"),
                            SystemForecast: "" + (fo.Metrics.SystemTransactions[partIndex] || "0"),
                            ManagerForecast: "" + (self.GetEditValue(fo.Metrics, partIndex, metric) || "0"),
                            IsEditable: true,
                            Filtered: filtered
                        });
                    }
                }
            }
            else {
                _.each(this.$scope.GridData, function (row) {
                    grid.push({
                        FilterId: row.FilterId,
                        LastYear: "-",
                        SystemForecast: "-",
                        ManagerForecast: "-",
                        IsEditable: false,
                        Filtered: filtered
                    });
                });
            }
            this.$scope.GridData = grid;
        };
        ForecastFilterGridController.prototype.ReCalculateTotal = function (saved, current) {
            var options = this.$scope.Options;
            if (!options.HasFilters) {
                return;
            }
            current.EditedFilterIndex = this.$scope.EditingIndex;
            if (current.EditedFilterIndex) {
                this.forecastingObjectService.ReCalculateFilteredTotal(this.savedFO, this.$scope.ForecastObject, options.Filters, options.FiltersMap);
            }
        };
        ForecastFilterGridController.prototype.CellClicked = function (edit) {
            var row = edit.closest("[row-index]");
            if (row.length && edit.length) {
                var partIndex = this.$scope.Options.PartIndex || 0, gridDataIndex = Number(row.attr("row-index")), gridRow = this.$scope.GridData[gridDataIndex];
                if (!this.$scope.RowNotEditable(gridRow, gridDataIndex) && gridDataIndex !== this.$scope.EditingIndex) {
                    this.SetEditCell(edit, gridRow.Filtered.Data, partIndex, gridDataIndex);
                }
            }
        };
        ForecastFilterGridController.prototype.SetEditCell = function ($el, alls, index, gridDataIndex) {
            var metricKey = this.$scope.Options.MetricKey, value = this.GetEditValue(alls, index, metricKey);
            this.$scope.EditingIndex = gridDataIndex;
            this.$scope.Editing = {
                OriginalValue: value,
                PercentChange: 0,
                IsCurrency: metricKey === Forecasting.Services.MetricType.Sales,
                HideValue: false,
                $el: $el
            };
        };
        ForecastFilterGridController.prototype.GetEditValue = function (alls, index, metric) {
            return this.forecastingObjectService.GetEditValue(alls, index, metric);
        };
        ForecastFilterGridController.prototype.EditValue = function (gridDataIndex, metric, updatedValue) {
            var fo = this.$scope.ForecastObject, gridRow = this.$scope.GridData[gridDataIndex], partIndex = this.$scope.Options.PartIndex || 0, oldValue = this.GetEditValue(gridRow.Filtered.Data, partIndex, metric);
            this.forecastingObjectService.EditDailyValueAlls(gridRow.Filtered.Data, partIndex, metric, oldValue, updatedValue);
            gridRow.Filtered.IsDirty = true;
            fo.IsDirty = true;
        };
        ForecastFilterGridController.prototype.SubmitNewValue = function (edit) {
            var metric = this.$scope.Options.MetricKey, cleanReg = /[^0-9,.,-]/g, newValueString = String(edit.NewValue).replace(cleanReg, ""), value = Number(newValueString);
            if (isNaN(value)) {
                value = Number(newValueString.replace(/[\,]/g, ""));
            }
            if (value !== edit.OriginalValue) {
                this.EditValue(this.$scope.EditingIndex, metric, value);
                this.ReCalculateTotal(this.savedFO, this.$scope.ForecastObject);
            }
            this.$scope.Cancel();
        };
        ForecastFilterGridController.prototype.NavigateVertical = function (isUp) {
            var edit = this.$scope.Editing, $sel;
            if (edit && edit.$el) {
                if (isUp) {
                    $sel = edit.$el.parents("tr").prevAll("tr").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                }
                else {
                    $sel = edit.$el.parents("tr").nextAll("tr").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                }
                if (!$sel.length) {
                    $sel = edit.$el;
                }
                this.SubmitNewValue(edit);
                if ($sel.length) {
                    this.$timeout(function () {
                        $sel.click();
                    });
                }
            }
        };
        return ForecastFilterGridController;
    }());
    Forecasting.ForecastFilterGridController = ForecastFilterGridController;
    Core.NG.ForecastingModule.RegisterNamedController("ForecastFilterGridController", ForecastFilterGridController, Core.NG.$typedScope(), Core.$translation, Core.NG.$filter, Core.$systemSettingsService, Forecasting.Services.$forecastingObjectService, Core.NG.$timeout);
    var ForecastFilterGrid = (function () {
        function ForecastFilterGrid() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastFilterGridDirective.html",
                controller: "Forecasting.ForecastFilterGridController",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                }
            };
        }
        return ForecastFilterGrid;
    }());
    Core.NG.ForecastingModule.RegisterDirective("forecastFilterGrid", ForecastFilterGrid);
})(Forecasting || (Forecasting = {}));
