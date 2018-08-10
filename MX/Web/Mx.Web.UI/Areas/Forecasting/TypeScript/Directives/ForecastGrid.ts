module Forecasting {
    "use strict";

    interface IForecastGridScope extends ng.IScope {
        Options: Services.IForecastingOptions;
        ForecastObject: Services.IForecastObject;
        Translations: Api.Models.ITranslations;
        NavigateToParam(key: string, value: string): void;
        GridData: IForecastFilterGridRow[];

        $filter: ng.IFilterService;

        IsLocked: boolean;
        InlineOptions: IEditInlineOptions;
        CURRENCY_SYM: string;

        GridView: any;
        LastExpandedRowIndex: number;

        Cancel(): void;

        CellNotEditable(index: number): boolean;
        CellValue(index: number): any;
        GetGridData(fo: Services.IForecastObject): any;
        OnClick(e: JQueryEventObject): void;
        OnClickSetByPercentage(value: boolean, e: JQueryEventObject): void;

        ShouldRowBeRendered(index: number): boolean;

        Editing: IEditInline;
        EditingIndex?: number;
    }

    class ForecastGridController {
        constructor(
            private $scope: IForecastGridScope,
            private $modal: ng.ui.bootstrap.IModalService,
            private $filter: ng.IFilterService,
            $translation: Core.ITranslationService,
            private forecastingObjectService: Services.IForecastingObjectService,
            private $timeout: ng.ITimeoutService,
            private systemSettingsService: Core.ISystemSettingsService
            ) {
            $scope.$filter = $filter;
            $scope.GridView = null;
            $scope.LastExpandedRowIndex = null;
            $scope.Editing = null;
            $scope.EditingIndex = null;
            $scope.IsLocked = true;
            $scope.InlineOptions = <IEditInlineOptions>{
                IsByPercentage: $scope.Options.MetricKey === Services.MetricType.Events
            };
            $scope.CURRENCY_SYM = systemSettingsService.GetCurrencySymbol();

            $translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.Forecasting;
            });

            $scope.Cancel = (): void => {
                $scope.EditingIndex = null;
                $scope.Editing = null;
            };

            $scope.NavigateToParam = (key: string, value: string): void => {
                (<any>$scope.$parent).NavigateToParam(key, value);
            };

            $scope.OnClick = (e: JQueryEventObject): void => {
                var $target = $(e.target),
                    $edit = $(e.target).closest(".form-control"),
                    $row = $target.closest("[row-index]"),
                    $expand = $target.closest(".mx-fg-expand"),
                    index;

                if ($target.is("input")) {
                    return;
                }

                if ($row.length) {
                    index = Number($row.attr("row-index"));

                    if ($edit.length && !$scope.IsLocked && !$scope.CellNotEditable(index) && index !== $scope.EditingIndex) {
                        this.SetEditCell($edit, index);
                    } else if ($expand.length !== 0) {
                        $scope.LastExpandedRowIndex = $scope.LastExpandedRowIndex === index ? null : index;
                    }
                }
            };

            $scope.OnClickSetByPercentage = (value: boolean, e: JQueryEventObject): void => {
                var $target = $(e.target);

                $scope.InlineOptions.IsByPercentage = value;
            };

            $scope.CellNotEditable = (index: number): boolean => {
                var alls = $scope.GridView;
                return this.forecastingObjectService.CellNotEditableByPercentage(alls, index, $scope.Options.MetricKey, $scope.InlineOptions.IsByPercentage);
            };

            $scope.CellValue = (index: number): any => {
                var alls = $scope.GridView;
                return this.forecastingObjectService.CellValue(alls, index, $scope.Options.MetricKey);
            };

            $scope.ShouldRowBeRendered = (index: number): boolean => {
                var hasDayPart = ($scope.Options.Part || $scope.Options.Part === 0),
                    intervalType = $scope.GridView.IntervalTypes[index],
                    isIntervalForecast = (intervalType === $scope.Options.IntervalTypes.Forecast),
                    isIntervalDaySegment = (intervalType === $scope.Options.IntervalTypes.DaySegment);

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

            $scope.$watch("ForecastObject", (newValue: Services.IForecastObject): void => {
                $scope.GridView = null;
                $scope.IsLocked = true;

                if (newValue) {
                    if (Core.BrowserDetection.BrowserIs(Core.BrowserDetection.Browsers.iOS) &&
                        Core.BrowserDetection.VersionNumberIs(6)) {
                        // For iOS 6.1.3, which has inconsistent rendering issues for the grid.
                        // Delaying via a timeout gives consistent, correct rendering.
                        $timeout((): void => {
                            $scope.GridView = newValue.Metrics;
                            $scope.IsLocked = newValue.IsLocked;
                        }, 0, true);
                    } else {
                        $scope.GridView = newValue.Metrics;
                        $scope.IsLocked = newValue.IsLocked;
                    }
                }

                this.LoadFilteredGridData();

                $scope.LastExpandedRowIndex = null;
                $scope.Cancel();
            }, false);

            $scope.$watch("Options.GridData.Data.IsDirty", (newValue: Boolean[]): void => {
                if (newValue && !newValue.length) {
                    $scope.LastExpandedRowIndex = null;
                }
            }, true);

            $scope.$watch("Editing.EditedValue", (newValue: number): void => {
                if (newValue != undefined) {
                    if ($scope.Editing.NavigationKey) {
                        this.NavigateVertical($scope.Editing.NavigationKey === Core.KeyCodes.Up);
                    } else {
                        this.SubmitNewValue($scope.Editing);
                    }
                }
            }, false);

            $scope.$on("$destroy", (): void => {
                $scope.GridView = null;
                $scope.Cancel();
            });
        }

        private LoadFilteredGridData(): void {
            var grid = [],
                $filter = this.$filter,
                fo: Services.IForecastObject = this.$scope.ForecastObject,
                options: Services.IForecastingOptions = this.$scope.Options,
                metric = this.$scope.Options.MetricKey,
                partIndex = this.$scope.Options.PartIndex || 0,
                self = this;

            if (fo !== null) {
                if (fo.MetricsFiltered && options.HasFilters) {
                    _.each(fo.MetricsFiltered, function (filtered: Services.IAllForecastingDataFiltered, i: number): void {
                        if (i === 0 || (options.Filters && options.Filters.length)) {
                            var filter = options.FiltersMap[filtered.FilterId || 0].Filter;

                            if (metric === Services.MetricType.Sales) {
                                grid.push(<IForecastFilterGridRow>{
                                    FilterId: filtered.FilterId,
                                    LastYear: (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(filtered.Data.LastYearSales[partIndex] || 0),
                                    SystemForecast: (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(filtered.Data.SystemSales[partIndex] || 0),
                                    ManagerForecast: (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(self.GetEditValue(filtered.Data, partIndex, metric) || 0),
                                    IsEditable: filter.IsForecastEditableViaGroup,
                                    Filtered: filtered
                                });
                            } else {
                                grid.push(<IForecastFilterGridRow>{
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
                } else if (fo.Metrics) {
                    var filtered = <Services.IAllForecastingDataFiltered>{
                        Data: fo.Metrics,
                        FilterId: null
                    };

                    if (metric === Services.MetricType.Sales) {
                        grid.push(<IForecastFilterGridRow>{
                            FilterId: null,
                            LastYear: (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(fo.Metrics.LastYearSales[partIndex] || 0),
                            SystemForecast: (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(fo.Metrics.SystemSales[partIndex] || 0),
                            ManagerForecast: (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(self.GetEditValue(fo.Metrics, partIndex, metric) || 0),
                            IsEditable: true,
                            Filtered: filtered
                        });
                    } else {
                        grid.push(<IForecastFilterGridRow>{
                            FilterId: null,
                            LastYear: "" + (fo.Metrics.LastYearTransactions[partIndex] || "0"),
                            SystemForecast: "" + (fo.Metrics.SystemTransactions[partIndex] || "0"),
                            ManagerForecast: "" + (self.GetEditValue(fo.Metrics, partIndex, metric) || "0"),
                            IsEditable: true,
                            Filtered: filtered
                        });
                    }
                }
            } else {
                _.each(this.$scope.GridData, (row: IForecastFilterGridRow): void => {
                    grid.push(<IForecastFilterGridRow>{
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
        }

        private SetEditCell($el: any, index: number): void {
            var metricKey = this.$scope.Options.MetricKey,
                value = this.GetEditValue(this.$scope.ForecastObject.Metrics, index, metricKey);

            if (value && typeof value === "object") {
                value = value.min;
            }

            this.$scope.EditingIndex = index;
            this.$scope.Editing = <IEditInline>{
                OriginalValue: value,
                PercentChange: this.$scope.Options.MetricKey === Services.MetricType.Events ? value : 0,
                IsCurrency: metricKey === Services.MetricType.Sales,
                HideValue: metricKey === Services.MetricType.Events,
                $el: $el
            };
        }

        private SubmitNewValue(edit: IEditInline): void {
            var metric = this.$scope.Options.MetricKey,
                cleanReg = /[^0-9,.,-]/g,
                newValueString = String(edit.NewValue).replace(cleanReg, ""),
                newPercentString = String(edit.PercentChange).replace(cleanReg, ""),
                value = Number(newValueString),
                percent = Number(newPercentString);

            // todo temp fix for comma issue with number-only-input directive
            if (isNaN(value)) {
                value = Number(newValueString.replace(/[\,]/g, ""));
            }

            if (this.$scope.Options.MetricKey === Services.MetricType.Events) {
                value = percent;
            }

            if (value !== edit.OriginalValue) {
                this.EditValue(this.$scope.EditingIndex, metric, value);
            }

            this.$scope.Cancel();
        }

        private EditValue(index: number, metric: string, updatedValue: number): void {
            var forecastObject = this.$scope.ForecastObject,               
                partIndex: number = this.$scope.Options.PartIndex || 0,
                filterId: number = this.$scope.Options.Filter ? this.$scope.Options.Filter.Id : null,
                gridRow: IForecastFilterGridRow,
                oldValue: any;

            _.each(this.$scope.GridData, (filtered: IForecastFilterGridRow): void => {
                if (filtered.FilterId === filterId) {
                    gridRow = filtered;
                }
            });

            oldValue = this.GetEditValue(gridRow.Filtered.Data, index, metric);

            this.forecastingObjectService.EditDailyValue(forecastObject, index, metric, oldValue, updatedValue);
            gridRow.Filtered.IsDirty = true;
            forecastObject.IsDirty = this.forecastingObjectService.IsDirty(forecastObject);
            forecastObject.HourlyEdit = true;
        }

        private GetEditValue(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string): any {
            return this.forecastingObjectService.GetEditValue(alls, index, metric);
        }

        private NavigateVertical(isUp: boolean): void {
            var edit = this.$scope.Editing,
                $sel;

            if (edit && edit.$el) {
                if (isUp) {
                    $sel = edit.$el.parents("tr").prevAll(":visible").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                } else {
                    $sel = edit.$el.parents("tr").nextAll(":visible").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                }

                if (!$sel.length) {
                    if (isUp && edit.$el.parent("td").length) {
                        $sel = $(".forecastGrid .table-header .form-control");
                    } else if (!isUp && !edit.$el.parent("td").length) {
                        $sel = $(".forecastGrid tr:visible").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                    }
                }

                if (!$sel.length) {
                    $sel = edit.$el;
                }

                this.SubmitNewValue(edit);

                if ($sel.length) {
                    this.$timeout((): void => {
                        $sel.click();
                    });
                }
            }
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("ForecastGridController", ForecastGridController,
        Core.NG.$typedScope<IForecastGridScope>(),
        Core.NG.$modal,
        Core.NG.$filter,
        Core.$translation,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$timeout, Core.$systemSettingsService);

    class ForecastGrid implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                },
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastGridDirective.html",
                controller: "Forecasting.ForecastGridController",
                link: ($scope: IForecastGridScope, element: any): void => {
                    element.on("keydown", (e: JQueryEventObject): void => {
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
    }

    Core.NG.ForecastingModule.RegisterDirective("forecastGrid", ForecastGrid);
}
