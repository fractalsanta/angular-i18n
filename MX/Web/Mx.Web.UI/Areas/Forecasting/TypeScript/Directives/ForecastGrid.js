var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastGridController = (function () {
        function ForecastGridController($scope, $modal, $filter, $translation, forecastingObjectService, $timeout, systemSettingsService) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.$filter = $filter;
            this.forecastingObjectService = forecastingObjectService;
            this.$timeout = $timeout;
            this.systemSettingsService = systemSettingsService;
            $scope.$filter = $filter;
            $scope.GridView = null;
            $scope.LastExpandedRowIndex = null;
            $scope.Editing = null;
            $scope.EditingIndex = null;
            $scope.IsLocked = true;
            $scope.InlineOptions = {
                IsByPercentage: $scope.Options.MetricKey === Forecasting.Services.MetricType.Events
            };
            $scope.CURRENCY_SYM = systemSettingsService.GetCurrencySymbol();
            $translation.GetTranslations().then(function (results) {
                $scope.Translations = results.Forecasting;
            });
            $scope.Cancel = function () {
                $scope.EditingIndex = null;
                $scope.Editing = null;
            };
            $scope.NavigateToParam = function (key, value) {
                $scope.$parent.NavigateToParam(key, value);
            };
            $scope.OnClick = function (e) {
                var $target = $(e.target), $edit = $(e.target).closest(".form-control"), $row = $target.closest("[row-index]"), $expand = $target.closest(".mx-fg-expand"), index;
                if ($target.is("input")) {
                    return;
                }
                if ($row.length) {
                    index = Number($row.attr("row-index"));
                    if ($edit.length && !$scope.IsLocked && !$scope.CellNotEditable(index) && index !== $scope.EditingIndex) {
                        _this.SetEditCell($edit, index);
                    }
                    else if ($expand.length !== 0) {
                        $scope.LastExpandedRowIndex = $scope.LastExpandedRowIndex === index ? null : index;
                    }
                }
            };
            $scope.OnClickSetByPercentage = function (value, e) {
                var $target = $(e.target);
                $scope.InlineOptions.IsByPercentage = value;
            };
            $scope.CellNotEditable = function (index) {
                var alls = $scope.GridView;
                return _this.forecastingObjectService.CellNotEditableByPercentage(alls, index, $scope.Options.MetricKey, $scope.InlineOptions.IsByPercentage);
            };
            $scope.CellValue = function (index) {
                var alls = $scope.GridView;
                return _this.forecastingObjectService.CellValue(alls, index, $scope.Options.MetricKey);
            };
            $scope.ShouldRowBeRendered = function (index) {
                var hasDayPart = ($scope.Options.Part || $scope.Options.Part === 0), intervalType = $scope.GridView.IntervalTypes[index], isIntervalForecast = (intervalType === $scope.Options.IntervalTypes.Forecast), isIntervalDaySegment = (intervalType === $scope.Options.IntervalTypes.DaySegment);
                if (!hasDayPart && !isIntervalForecast) {
                    return true;
                }
                if (hasDayPart && isIntervalForecast) {
                    return true;
                }
                var dayPart = $scope.GridView.DaySegmentIndexes[index];
                if ($scope.Options.Part === dayPart && !isIntervalDaySegment) {
                    return true;
                }
                return false;
            };
            $scope.$watch("ForecastObject", function (newValue) {
                $scope.GridView = null;
                $scope.IsLocked = true;
                if (newValue) {
                    if (Core.BrowserDetection.BrowserIs(Core.BrowserDetection.Browsers.iOS) &&
                        Core.BrowserDetection.VersionNumberIs(6)) {
                        $timeout(function () {
                            $scope.GridView = newValue.Metrics;
                            $scope.IsLocked = newValue.IsLocked;
                        }, 0, true);
                    }
                    else {
                        $scope.GridView = newValue.Metrics;
                        $scope.IsLocked = newValue.IsLocked;
                    }
                }
                _this.LoadFilteredGridData();
                $scope.LastExpandedRowIndex = null;
                $scope.Cancel();
            }, false);
            $scope.$watch("Options.GridData.Data.IsDirty", function (newValue) {
                if (newValue && !newValue.length) {
                    $scope.LastExpandedRowIndex = null;
                }
            }, true);
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
            $scope.$on("$destroy", function () {
                $scope.GridView = null;
                $scope.Cancel();
            });
        }
        ForecastGridController.prototype.LoadFilteredGridData = function () {
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
        ForecastGridController.prototype.SetEditCell = function ($el, index) {
            var metricKey = this.$scope.Options.MetricKey, value = this.GetEditValue(this.$scope.ForecastObject.Metrics, index, metricKey);
            if (value && typeof value === "object") {
                value = value.min;
            }
            this.$scope.EditingIndex = index;
            this.$scope.Editing = {
                OriginalValue: value,
                PercentChange: this.$scope.Options.MetricKey === Forecasting.Services.MetricType.Events ? value : 0,
                IsCurrency: metricKey === Forecasting.Services.MetricType.Sales,
                HideValue: metricKey === Forecasting.Services.MetricType.Events,
                $el: $el
            };
        };
        ForecastGridController.prototype.SubmitNewValue = function (edit) {
            var metric = this.$scope.Options.MetricKey, cleanReg = /[^0-9,.,-]/g, newValueString = String(edit.NewValue).replace(cleanReg, ""), newPercentString = String(edit.PercentChange).replace(cleanReg, ""), value = Number(newValueString), percent = Number(newPercentString);
            if (isNaN(value)) {
                value = Number(newValueString.replace(/[\,]/g, ""));
            }
            if (this.$scope.Options.MetricKey === Forecasting.Services.MetricType.Events) {
                value = percent;
            }
            if (value !== edit.OriginalValue) {
                this.EditValue(this.$scope.EditingIndex, metric, value);
            }
            this.$scope.Cancel();
        };
        ForecastGridController.prototype.EditValue = function (index, metric, updatedValue) {
            var forecastObject = this.$scope.ForecastObject, partIndex = this.$scope.Options.PartIndex || 0, filterId = this.$scope.Options.Filter ? this.$scope.Options.Filter.Id : null, gridRow, oldValue;
            _.each(this.$scope.GridData, function (filtered) {
                if (filtered.FilterId === filterId) {
                    gridRow = filtered;
                }
            });
            oldValue = this.GetEditValue(gridRow.Filtered.Data, index, metric);
            this.forecastingObjectService.EditDailyValue(forecastObject, index, metric, oldValue, updatedValue);
            gridRow.Filtered.IsDirty = true;
            forecastObject.IsDirty = this.forecastingObjectService.IsDirty(forecastObject);
            forecastObject.HourlyEdit = true;
        };
        ForecastGridController.prototype.GetEditValue = function (alls, index, metric) {
            return this.forecastingObjectService.GetEditValue(alls, index, metric);
        };
        ForecastGridController.prototype.NavigateVertical = function (isUp) {
            var edit = this.$scope.Editing, $sel;
            if (edit && edit.$el) {
                if (isUp) {
                    $sel = edit.$el.parents("tr").prevAll(":visible").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                }
                else {
                    $sel = edit.$el.parents("tr").nextAll(":visible").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                }
                if (!$sel.length) {
                    if (isUp && edit.$el.parent("td").length) {
                        $sel = $(".forecastGrid .table-header .form-control");
                    }
                    else if (!isUp && !edit.$el.parent("td").length) {
                        $sel = $(".forecastGrid tr:visible").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                    }
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
        return ForecastGridController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("ForecastGridController", ForecastGridController, Core.NG.$typedScope(), Core.NG.$modal, Core.NG.$filter, Core.$translation, Forecasting.Services.$forecastingObjectService, Core.NG.$timeout, Core.$systemSettingsService);
    var ForecastGrid = (function () {
        function ForecastGrid() {
            return {
                restrict: "E",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                },
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastGridDirective.html",
                controller: "Forecasting.ForecastGridController",
                link: function ($scope, element) {
                    element.on("keydown", function (e) {
                        switch (e.which) {
                            case Core.KeyCodes.Esc: {
                                $scope.Cancel();
                                $scope.$digest();
                                return;
                            }
                        }
                    });
                }
            };
        }
        return ForecastGrid;
    }());
    Core.NG.ForecastingModule.RegisterDirective("forecastGrid", ForecastGrid);
})(Forecasting || (Forecasting = {}));
