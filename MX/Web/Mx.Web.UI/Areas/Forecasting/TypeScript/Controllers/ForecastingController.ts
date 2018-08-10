module Forecasting {
    "use strict";

    export interface IForecastingControllerScope extends ng.IScope {
        OnDatePickerChange(selectedDate: Date): void;
        DayString: string;
        DayStringInvalid: boolean;
        IsSalesItems: boolean;
        MetricDropdownOptions: { name: string, value: string }[];
        Vm: {
            L10N: Api.Models.ITranslations;
            ForecastPickerOptions: Core.NG.IMxDayPickerOptions;
            HasData: boolean;
            HasForecast: boolean;
            NotHasForecastForSalesItem?: boolean;
            Loading: boolean;
            SalesItem?: Api.Models.ISalesItem;
            Filters?: Api.Models.IForecastFilterRecord[];
            HasFiltered: boolean;
        };

        NavigateTo(state: string): void;
        NavigateToParam(key: string, value: string): void;
        GetForecastingOptions(): Services.IForecastingOptions;
        GetForecastObject(): Services.IForecastObject;
        SelectFilter(filterId?: number): void;
        ClearChangesWithConfirmation(): void;
        ClearChanges(): void;
        SaveChanges(): void;
        ResetForecasts(): void;
        GetSalesItems(): Services.IForecastSalesItems;
        SelectSalesItem(): void;
        HasViewHistoryPermission(): boolean;
        CanViewHistory(): boolean;
        ShowResetButton(): boolean;

        IsDirty(): boolean;
        ShouldCancelAdjustments(newUrl: string): void;
    }

    export class ForecastingController {
        private calendarDateFormat: string = "YYYY-MM-DD";
        private ForecastingOptions: Services.IForecastingOptions;
        private FOData: Services.IForecastingObjectData;
        private FODataSalesItems: Services.ForecastObjectDataSalesItem;
        private RegisterOnLocationChangeStart: () => void;
        private unregisterLocationChangeStart: Function;

        constructor(
            private $scope: IForecastingControllerScope,
            private $state: ng.ui.IStateService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private $modal: ng.ui.bootstrap.IModalService,
            private confirmationService: Core.IConfirmationService,
            private $q: ng.IQService,
            private $filter: ng.IFilterService,
            private dataService: Services.IDataService,
            private forecastingObjectService: Services.IForecastingObjectService,
            private forecastFilterService: Api.IForecastFilterService) {

            // #region states

            this.$scope.NavigateTo = (state: string, extendedParams?: string): void => {
                var tmp: any = _.clone(this.$state.params);
                this.AddKeyValues(tmp, extendedParams);

                this.$state.go((<any>this.$state.current).parent.name + "." + state, tmp, { inherit: true, location: true, notify: true });
            };

            this.$scope.NavigateToParam = (key: string, value: string, extendedParams?: string): void => {
                var tmp: any = _.clone(this.$state.params);
                tmp[key] = value;
                this.AddKeyValues(tmp, extendedParams);

                this.$state.go(this.$state.current.name, tmp, { inherit: true, location: true, notify: true });
            };

            this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, (event: any, toState: any, toParams: any, fromState: any, fromParms: any): void => {
                if (JSON.stringify(toParams) !== JSON.stringify(fromParms)) {
                    this.UpdateForecastingOptions(this.$state.params);
                }

                this.RegisterOnLocationChangeStart();
            });

            // #endregion

            // #region data

            $scope.GetForecastingOptions = (): Services.IForecastingOptions => {
                return this.ForecastingOptions;
            };

            $scope.GetForecastObject = (): Services.IForecastObject => {
                var fo = this.FOData && !this.$scope.Vm.Loading ? this.FOData.GetForecastingObject() : null;

                if (fo) {
                    if (this.ForecastingOptions.Part !== null) {
                        this.UpdateForecastingOptions(this.$state.params);
                    }
                }

                return fo;
            };

            $scope.IsDirty = (): boolean => {
                var fo: Services.IForecastObject = $scope.GetForecastObject();

                if (fo && fo.IsDirty) {
                    return true;
                }

                return false;
            };

            $scope.SelectFilter = (filterId?: number): void => {
                var selFilter: Api.Models.IForecastFilterRecord;

                if (filterId && this.$scope.Vm.Filters) {
                    _.each(this.$scope.Vm.Filters, (filter: Api.Models.IForecastFilterRecord): void => {
                        if (filterId === filter.Id) {
                            selFilter = filter;
                        }
                    });
                }

                this.ForecastingOptions.Filter = selFilter;
                this.FOData.SetFilter(selFilter);
            };

            $scope.ClearChangesWithConfirmation = (): void => {
                confirmationService.Confirm({
                    Title: $scope.Vm.L10N.AdjustmentsCancelTitle,
                    Message: $scope.Vm.L10N.AdjustmentsCancelMessage,
                    ConfirmText: $scope.Vm.L10N.AdjustmentsCancelConfirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then((result: boolean): void => {
                    if (result) {
                        $scope.ClearChanges();
                    }
                });
            };

            $scope.ClearChanges = (): void => {
                this.FOData.ClearChanges();
                this.LoadData();
            };

            $scope.SaveChanges = (): void => {
                var isFiltered: boolean = this.$scope.GetForecastingOptions().HasFilters;
                this.SaveData(isFiltered);
            };

            $scope.ResetForecasts = (): void => {
                confirmationService.Confirm({
                    Title: $scope.Vm.L10N.ResetForecastModalWindowTitle,
                    Message: $scope.Vm.L10N.HistoryConfirmation,
                    ConfirmText: $scope.Vm.L10N.ForecastReset,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then((result: boolean): void => {
                    if (result) {
                        this.ResetForecasts();
                    }
                });
            };

            $scope.HasViewHistoryPermission = (): boolean => {
                return dataService.CanViewHistory();
            };

            $scope.CanViewHistory = (): boolean => {
                return dataService.CanViewHistory() && $scope.Vm.HasForecast && (!$scope.IsSalesItems || $scope.Vm.SalesItem != null);
            };

            $scope.ShowResetButton = (): boolean => {
                var fo: Services.IForecastObject = $scope.GetForecastObject(),
                    options: Services.IForecastingOptions = $scope.GetForecastingOptions(),
                    enable: boolean = fo && options &&
                    fo.CanRevertForecast && !fo.Forecast.IsDayLocked && fo.Forecast.HasBeenEdited &&
                    options.MetricKey !== Services.MetricType.Events;

                return enable;
            };

            $scope.ShouldCancelAdjustments = (newUrl: string): void => {
                confirmationService.Confirm({
                    Title: $scope.Vm.L10N.AdjustmentsCancelTitle,
                    Message: $scope.Vm.L10N.AdjustmentsCancelLocation,
                    ConfirmText: $scope.Vm.L10N.AdjustmentsCancelConfirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then((result: boolean): void => {
                        if (result) {
                            this.unregisterLocationChangeStart();
                            this.unregisterLocationChangeStart = null;
                            $scope.ClearChanges();
                            window.location.href = newUrl;
                        }
                    });
            };

            this.RegisterOnLocationChangeStart = (): void => {
                if (this.unregisterLocationChangeStart) {
                    return;
                }

                this.unregisterLocationChangeStart = $scope.$on("$locationChangeStart", (e: ng.IAngularEvent, newUrl: string, oldUrl: string): void => {
                    if (this.$scope.IsDirty()) {
                        if (newUrl.indexOf(oldUrl.split("&")[0]) === -1) {
                            this.$scope.ShouldCancelAdjustments(newUrl);
                            e.preventDefault();
                        }
                    }
                });
            };

            // #endregion

            // #region sales items

            $scope.GetSalesItems = (): Services.IForecastSalesItems => {
                return this.FODataSalesItems.Items;
            };

            $scope.SelectSalesItem = (): void => {
                if ($scope.GetSalesItems().SalesItems.length) {
                    $modal.open({
                        templateUrl: "/Areas/Forecasting/Templates/SelectSalesItemsDialog.html",
                        controller: "Forecasting.SelectSalesItemController",
                        windowClass: "modal-transparent",
                        resolve: {
                            ForecastSalesItems: (): Services.IForecastSalesItems => { return this.$scope.GetSalesItems(); }
                        }
                    });
                }
            };

            $scope.$watch("GetForecastingOptions()", (newValue: Services.IForecastingOptions, oldValue: Services.IForecastingOptions): void => {
                if (newValue.Metric !== oldValue.Metric) {
                    if (newValue.Metric === Services.MetricType.SalesItems || oldValue.Metric === Services.MetricType.SalesItems) {
                        this.FODataSalesItems.SetItemId(null);
                        this.LoadData(newValue.Metric === Services.MetricType.SalesItems);
                    }
                } else if (this.$scope.IsSalesItems && newValue.ItemId !== oldValue.ItemId) {
                    if (newValue.ItemId !== this.FODataSalesItems.GetItemId()) {
                        this.FODataSalesItems.SetItemId(newValue.ItemId);
                        this.LoadData();
                    }
                }
            }, true);

            $scope.$watch((): any => {
                return this.$scope.GetSalesItems().SelectedSalesItem;
            }, (newValue: Api.Models.ISalesItem, oldValue: Api.Models.ISalesItem): void => {
                if (!(!newValue && !oldValue) && newValue !== oldValue) {
                    var newItemId = newValue ? newValue.Id : null,
                        oldItemId = oldValue ? oldValue.Id : null;

                    $scope.Vm.SalesItem = newValue;
                    if (newItemId !== oldItemId) {
                        (<any>this.$state.params).itemid = newItemId ? newItemId.toString() : undefined;
                        this.UpdateForecastingOptions(this.$state.params);

                        if (this.$scope.IsSalesItems && newItemId !== this.FODataSalesItems.GetItemId()) {
                            this.FODataSalesItems.SetItemId(newItemId);
                            this.LoadData();
                        }
                    }
                }
            }, false);

            // #endregion

            // #region  Calendar               

            $scope.OnDatePickerChange = (selectedDate: Date): void => {
                var dateString = moment(selectedDate).format(this.calendarDateFormat);
                if ($scope.DayString !== dateString) {
                    this.SetDayString(dateString);
                }
                localStorage.setItem("DateMenu.DateString", $scope.DayString);
                this.LoadData(true);
            };

            // #endregion

            this.Initialize();
        }

        Initialize(): void {
            var params, currentMetric, fo;

            this.FODataSalesItems = new Services.ForecastObjectDataSalesItem(this.$q, this.dataService, this.forecastingObjectService, this.$filter);
            this.FOData = this.FODataSalesItems.GetParent();

            this.$scope.Vm = {
                L10N: <Api.Models.ITranslations>{},
                ForecastPickerOptions: <Core.NG.IMxDayPickerOptions>{
                    Date: null,
                    DayOffset: 1
                },
                HasData: false,
                HasForecast: false,
                Loading: false,
                HasFiltered: false
            };

            params = this.$state.params;
            params.metric = (params.metric || "transactions").toLowerCase();
            currentMetric = Services.metricMap[params.metric];
            fo = this.FOData.GetForecastingObject();

            this.ForecastingOptions = <Services.IForecastingOptions>{
                Metric: params.metric,
                MetricKey: currentMetric.MetricKey,
                Template: currentMetric.Template,
                Part: params.part === null ? null : Number(params.part),
                PartIndex: params.part === null || !fo || !fo.Metrics ? 0 : fo.Metrics.TypeIndexes[Services.IntervalTypes.DaySegment][params.part],
                ItemId: params.itemid ? Number(params.itemid) : null,
                IntervalTypes: Services.IntervalTypes,
                ForecastIndex: 0,
                EventProfile: this.forecastingObjectService.GetCache(Services.CacheName.EventProfile),
                Filters: this.$scope.Vm.Filters,
                FiltersMap: {},
                HasFilters: false
            };
            this.$scope.IsSalesItems = params.metric === "salesitems";
            this.FODataSalesItems.SetItemId(this.ForecastingOptions.ItemId);
            
            this.Clear(true);
            this.GetL10N();
            this.GetFilters();
            
            var date = moment().toDate();
            this.$scope.Vm.ForecastPickerOptions.Date = date;
            this.SetDayString(moment(date).format(this.calendarDateFormat));
            this.LoadData();
            
            this.RegisterOnLocationChangeStart();
        }

        GetL10N(): void {
            this.translationService.GetTranslations()
                .then((l10NData: any): void => {
                    this.$scope.Vm.L10N = l10NData.Forecasting;
                    
                    this.$scope.MetricDropdownOptions = [
                        { "name": this.$scope.Vm.L10N.Sales, "value": "sales" },
                        { "name": this.$scope.Vm.L10N.Transactions, "value": "transactions" }                    
                ];

                this.SetTitle();
            });
        }

        GetFilters(): void {
            this.forecastFilterService.GetForecastFilters()
                .success((filters: Api.Models.IForecastFilterRecord[]): void => {
                    filters = filters && filters.length ? filters : null;

                    if (filters) {
                        var allFiltersEditable: boolean = true;

                        _.each(filters, (filter: Api.Models.IForecastFilterRecord): void => {
                            if (filter.Id !== null) {
                                allFiltersEditable = allFiltersEditable && filter.IsForecastEditableViaGroup;
                            }
                        });

                        filters.unshift(<Api.Models.IForecastFilterRecord>{
                            Name: this.$scope.Vm.L10N.Total || "Total",
                            Id: null,
                            ForecastFilterGroupTypes: [],
                            IsForecastEditableViaGroup: allFiltersEditable
                        });
                    }

                    this.$scope.Vm.Filters = filters;

                    if (filters) {
                        var mapping = [], map: any = {};

                        _.each(filters, (filter: Api.Models.IForecastFilterRecord): void => {
                            var option = <Services.IFilterOptions>{
                                Filter: filter,
                                Visible: true
                            };

                            mapping.push(option);
                        });

                        _.each(mapping, (option: Services.IFilterOptions): void => {
                            map[option.Filter.Id || 0] = option;
                        });

                        this.ForecastingOptions.Filters = this.$scope.Vm.Filters;
                        this.ForecastingOptions.FiltersMap = map;
                        this.ForecastingOptions.HasFilters = true;
                    }
                })
                .error((): void => {
                    ;
                });
        }

        SetTitle(): void {
            if (this.$scope.Vm.L10N.TitleForecasting) {
                var currentMetric = Services.metricMap[(<any>this.$state.params).metric || "transactions"];
                this.popupMessageService.SetPageTitle(
                    this.$scope.Vm.L10N.TitleForecasting + " - " +
                    this.$scope.Vm.L10N[currentMetric.TranslationKey]);
            }
        }

        SetDayString(dayString: string): void {
            this.$scope.DayStringInvalid = false;
            this.$scope.DayString = dayString;
        }

        AddKeyValues(params: any, extendedParams: string): void {
            if (extendedParams) {
                var pairs = extendedParams.split("&");
                _.each(pairs, (pair: string): void => {
                    var keyValue = pair.split("=");
                    params[keyValue[0]] = keyValue[1];
                });
            }
        }

        UpdateForecastingOptions(params: any): void {
            params.metric = params.metric ? params.metric.toLowerCase() : params.metric;

            var currentMetric: Services.IMetricMap = Services.metricMap[params.metric || "transactions"],
                fo = this.FOData.GetForecastingObject(),
                options = this.ForecastingOptions,
                isSalesItem = params.metric === "salesitems";

            if (options) {
                options.Metric = params.metric;
                options.MetricKey = currentMetric.MetricKey;
                options.IsCurrency = currentMetric.IsCurrency;
                options.Part = params.part === null ? null : Number(params.part);
                options.PartIndex = options.Part === null || !fo || !fo.Metrics ? 0 : fo.Metrics.TypeIndexes[Services.IntervalTypes.DaySegment][params.part];
                options.ItemId = params.itemid && isSalesItem ? Number(params.itemid) : null;

                if (fo && fo.Metrics) {
                    options.PartIndex = params.part === null ? 0 : fo.Metrics.TypeIndexes[Services.IntervalTypes.DaySegment][params.part];
                }

                this.SetTitle();

                this.$scope.IsSalesItems = isSalesItem;
                if (!isSalesItem) {
                    this.$scope.Vm.SalesItem = null;
                    this.FODataSalesItems.Clear(true);
                }
            }
        }

        LoadData(reload?: boolean): void {
            this.FOData = this.$scope.IsSalesItems ? this.FODataSalesItems : this.FODataSalesItems.GetParent();

            var vm = this.$scope.Vm;
            vm.Loading = true;
            vm.HasData = false;
            vm.HasForecast = false;
            vm.NotHasForecastForSalesItem = false;

            this.FOData.LoadData(this.$scope.DayString, reload).then((data: Services.IForecastObject): void => {
                if (data && this.$scope.DayString !== data.DayString) {
                    return;
                }

                vm.Loading = false;
                if (data !== null) {
                    if (data.Metrics.IntervalStarts.length > 0) {
                        this.popupMessageService.Dismiss();
                        vm.HasData = true;
                        vm.HasForecast = true;

                        vm.HasFiltered = vm.Filters && vm.Filters.length &&
                        data && data.MetricsFiltered !== null;
                    } else {
                        data = null;
                    }
                }

                if (data === null) {
                    this.Clear(true);
                }
            }).catch((): void => {
                vm.Loading = false;

                if (this.$scope.IsSalesItems && this.FODataSalesItems.Parent.ForecastObject === null) {
                    vm.NotHasForecastForSalesItem = true;
                }
            });
        }

        SaveData(filtered?: boolean): void {
            this.FOData.SaveChanges(filtered)
                .then((): void => {
                    this.popupMessageService.ShowSuccess(this.$scope.Vm.L10N.SavedSuccessfully);
                })
                .catch((result: any): void => {
                    switch (String(result.status)) {
                        case "409":
                            this.popupMessageService.ShowWarning(this.$scope.Vm.L10N.ForecastExists);
                            this.LoadData(true);
                            break;
                        default:
                            this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + result.message);
                            break;
                    }
                });
        }

        Clear(clearCache?: boolean): void {
            this.$scope.Vm.HasData = false;
            this.$scope.Vm.HasForecast = false;

            this.FOData.Clear(clearCache);

            if (clearCache) {
                this.forecastingObjectService.ClearCache([Services.CacheName.FC, Services.CacheName.FCS, Services.CacheName.FCSI]);
            }
        }

        ResetForecasts(): void {
            this.FOData.ResetForecasts().then((ver: any): void => {
                this.popupMessageService.ShowSuccess(this.$scope.Vm.L10N.HistorySuccessful);
                this.Clear(true);
            }).catch((): void => {
                this.popupMessageService.ShowWarning(this.$scope.Vm.L10N.ForecastExists);
            }).finally((): void => {
                this.LoadData(true);
            });
        }
    }

    export var forecastingViewsController =
        Core.NG.ForecastingModule.RegisterNamedController("ForecastingController", ForecastingController,
            Core.NG.$typedScope<IForecastingControllerScope>(),
            Core.NG.$state,
            Core.$translation,
            Core.$popupMessageService,
            Core.NG.$modal,
            Core.$confirmationService,
            Core.NG.$q,
            Core.NG.$filter,
            Forecasting.Services.$dataService,
            Forecasting.Services.$forecastingObjectService,
            Api.$forecastFilterService);
}
