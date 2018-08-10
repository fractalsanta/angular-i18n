module Forecasting {
    "use strict";

    export interface IForecastFilterGridRow {
        FilterId: number;
        LastYear: string;
        SystemForecast: string;
        ManagerForecast: string;
        IsEditable: boolean;
        Filtered: Services.IAllForecastingDataFiltered;
    }

    export interface IForecastFilterGridScope extends ng.IScope {
        Options: Services.IForecastingOptions;
        ForecastObject: Services.IForecastObject;
        L10N: Api.Models.ITranslations;
        GridData: IForecastFilterGridRow[];

        OnClickSetByPercentage(value: boolean, e: JQueryEventObject): void;
        OnClick(e: JQueryEventObject): void;
        CURRENCY_SYM: string;
        InlineOptions: IEditInlineOptions;
        Editing: IEditInline;
        EditingIndex?: number;
        CellValue(alls: Api.Models.IForecastingMetricAlls, index: number): any;
        CellNotEditable(alls: Api.Models.IForecastingMetricAlls): boolean;
        Cancel(): void;
        RowNotEditable(row: IForecastFilterGridRow, index: number): boolean;
    }

    export class ForecastFilterGridController {
        private savedFO: Services.IForecastObject;

        constructor(
            private $scope: IForecastFilterGridScope,
            private translationService: Core.ITranslationService,
            private $filter: ng.IFilterService,
            private systemSettingsService: Core.ISystemSettingsService,
            private forecastingObjectService: Services.IForecastingObjectService,
            private $timeout: ng.ITimeoutService
            ) {

            $scope.$watch("Options", (newValue: Services.IForecastingOptions, oldValue: Services.IForecastingOptions): void => {
                this.LoadData();
            }, true);

            $scope.$watch("ForecastObject", (fo: Services.IForecastObject): void => {
                this.$scope.ForecastObject = fo;
                this.LoadData();

                if (fo && (!this.savedFO || this.savedFO.Forecast.Version !== fo.Forecast.Version)) {
                    this.savedFO = _.cloneDeep(fo);
                }

                if (fo && !fo.IsDirty) {
                    fo.EditedFilterIndex = undefined;
                }
            }, true);

            // #region edit

            $scope.InlineOptions = <IEditInlineOptions>{
                IsByPercentage: false
            };

            $scope.CURRENCY_SYM = systemSettingsService.GetCurrencySymbol();

            $scope.OnClickSetByPercentage = (value: boolean, e: JQueryEventObject): void => {
                var target = $(e.target);

                $scope.InlineOptions.IsByPercentage = value;
            };

            $scope.CellValue = (alls: Api.Models.IForecastingMetricAlls, index: number): any => {
                var fo = this.$scope.ForecastObject;
                return fo ? this.forecastingObjectService.CellValue(alls, index, $scope.Options.MetricKey) : 0;
            };

            $scope.CellNotEditable = (alls: Api.Models.IForecastingMetricAlls): boolean => {
                return this.forecastingObjectService.CellNotEditableByPercentage(alls, this.$scope.Options.PartIndex || 0, $scope.Options.MetricKey, $scope.InlineOptions.IsByPercentage) || $scope.ForecastObject.IsLocked;
            };

            $scope.OnClick = (e: JQueryEventObject): void => {
                var target = $(e.target),
                    edit = $(e.target).closest(".form-control");

                if (target.is("input")) {
                    return;
                }

                if (edit.length) {
                    this.CellClicked(edit);
                }
            };

            $scope.$watch("Editing.EditedValue", (newValue: number): void => {
                if (newValue != undefined) {
                    if ($scope.Editing.NavigationKey) {
                        this.NavigateVertical($scope.Editing.NavigationKey === Core.KeyCodes.Up);
                    } else {
                        this.SubmitNewValue($scope.Editing);
                    }
                }
            }, false);

            $scope.Cancel = (): void => {
                $scope.EditingIndex = null;
                $scope.Editing = null;
            };

            $scope.RowNotEditable = (row: IForecastFilterGridRow, index: number): boolean => {
                if (!this.$scope.ForecastObject) {
                    return true;
                }

                var EditedIndex = this.$scope.ForecastObject.EditedFilterIndex;

                if (EditedIndex !== undefined) {
                    // edit totals or not edit totals not both
                    if ((EditedIndex === 0 && index !== 0) || (EditedIndex !== 0 && index === 0)) {
                        return true;
                    }
                }

                return !row.IsEditable || $scope.CellNotEditable(row.Filtered.Data);
            };

            // #endregion

            this.Initialize();
        }

        Initialize(): void {
            this.translationService.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                this.$scope.L10N = results.Forecasting;
            });
        }

        LoadData(): void {
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
                        FilterId:  null
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

        ReCalculateTotal(saved: Services.IForecastObject, current: Services.IForecastObject): void {
            var options = this.$scope.Options;

            if (!options.HasFilters) {
                return;
            }

            current.EditedFilterIndex = this.$scope.EditingIndex;

            if (current.EditedFilterIndex) {
                this.forecastingObjectService.ReCalculateFilteredTotal(this.savedFO, this.$scope.ForecastObject, options.Filters, options.FiltersMap);
            }
        }

        // #region inline editing

        CellClicked(edit: any): void {
            var row = edit.closest("[row-index]");

            if (row.length && edit.length) {
                var partIndex: number = this.$scope.Options.PartIndex || 0,
                    gridDataIndex: number = Number(row.attr("row-index")),
                    gridRow: IForecastFilterGridRow = this.$scope.GridData[gridDataIndex];

                if (!this.$scope.RowNotEditable(gridRow, gridDataIndex) && gridDataIndex !== this.$scope.EditingIndex) {
                    this.SetEditCell(edit, gridRow.Filtered.Data, partIndex, gridDataIndex);
                }
            }
        }

        SetEditCell($el: any, alls: Api.Models.IForecastingMetricAlls, index: number, gridDataIndex: number): void {
            var metricKey = this.$scope.Options.MetricKey,
                value = this.GetEditValue(alls, index, metricKey);

            this.$scope.EditingIndex = gridDataIndex;
            this.$scope.Editing = <IEditInline>{
                OriginalValue: value,
                PercentChange: 0,
                IsCurrency: metricKey === Services.MetricType.Sales,
                HideValue: false,
                $el: $el
            };
        }

        GetEditValue(alls: Api.Models.IForecastingMetricAlls, index: number, metric: string): any {
            return this.forecastingObjectService.GetEditValue(alls, index,  metric);
        }

        EditValue(gridDataIndex: number, metric: string, updatedValue: number): void {
            var fo: Services.IForecastObject = this.$scope.ForecastObject,
                gridRow: IForecastFilterGridRow = this.$scope.GridData[gridDataIndex],
                partIndex: number = this.$scope.Options.PartIndex || 0,
                oldValue = this.GetEditValue(gridRow.Filtered.Data, partIndex, metric);

            this.forecastingObjectService.EditDailyValueAlls(gridRow.Filtered.Data, partIndex, metric, oldValue, updatedValue);
            gridRow.Filtered.IsDirty = true;
            fo.IsDirty = true;
        }

        SubmitNewValue(edit: IEditInline): void {
            var metric = this.$scope.Options.MetricKey,
                cleanReg = /[^0-9,.,-]/g,
                newValueString = String(edit.NewValue).replace(cleanReg, ""),
                value = Number(newValueString);

            // todo temp fix for comma issue with number-only-input directive
            if (isNaN(value)) {
                value = Number(newValueString.replace(/[\,]/g, ""));
            }

            if (value !== edit.OriginalValue) {
                this.EditValue(this.$scope.EditingIndex, metric, value);
                this.ReCalculateTotal(this.savedFO, this.$scope.ForecastObject);
            }

            this.$scope.Cancel();
        }

        NavigateVertical(isUp: boolean): void {
            var edit = this.$scope.Editing,
                $sel;

            if (edit && edit.$el) {
                if (isUp) {
                    $sel = edit.$el.parents("tr").prevAll("tr").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
                } else {
                    $sel = edit.$el.parents("tr").nextAll("tr").has(".form-control:not(.mx-fg-isdisabled)").first().find(".form-control");
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

        // #endregion
    }

    Core.NG.ForecastingModule.RegisterNamedController("ForecastFilterGridController", ForecastFilterGridController,
        Core.NG.$typedScope<IForecastFilterGridScope>(),
        Core.$translation,
        Core.NG.$filter,
        Core.$systemSettingsService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$timeout);

    class ForecastFilterGrid implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
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
    }

    Core.NG.ForecastingModule.RegisterDirective("forecastFilterGrid", ForecastFilterGrid);
}