var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastingController = (function () {
        function ForecastingController($scope, $state, translationService, popupMessageService, $modal, confirmationService, $q, $filter, dataService, forecastingObjectService, forecastFilterService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.$modal = $modal;
            this.confirmationService = confirmationService;
            this.$q = $q;
            this.$filter = $filter;
            this.dataService = dataService;
            this.forecastingObjectService = forecastingObjectService;
            this.forecastFilterService = forecastFilterService;
            this.calendarDateFormat = "YYYY-MM-DD";
            this.$scope.NavigateTo = function (state, extendedParams) {
                var tmp = _.clone(_this.$state.params);
                _this.AddKeyValues(tmp, extendedParams);
                _this.$state.go(_this.$state.current.parent.name + "." + state, tmp, { inherit: true, location: true, notify: true });
            };
            this.$scope.NavigateToParam = function (key, value, extendedParams) {
                var tmp = _.clone(_this.$state.params);
                tmp[key] = value;
                _this.AddKeyValues(tmp, extendedParams);
                _this.$state.go(_this.$state.current.name, tmp, { inherit: true, location: true, notify: true });
            };
            this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, function (event, toState, toParams, fromState, fromParms) {
                if (JSON.stringify(toParams) !== JSON.stringify(fromParms)) {
                    _this.UpdateForecastingOptions(_this.$state.params);
                }
                _this.RegisterOnLocationChangeStart();
            });
            $scope.GetForecastingOptions = function () {
                return _this.ForecastingOptions;
            };
            $scope.GetForecastObject = function () {
                var fo = _this.FOData && !_this.$scope.Vm.Loading ? _this.FOData.GetForecastingObject() : null;
                if (fo) {
                    if (_this.ForecastingOptions.Part !== null) {
                        _this.UpdateForecastingOptions(_this.$state.params);
                    }
                }
                return fo;
            };
            $scope.IsDirty = function () {
                var fo = $scope.GetForecastObject();
                if (fo && fo.IsDirty) {
                    return true;
                }
                return false;
            };
            $scope.SelectFilter = function (filterId) {
                var selFilter;
                if (filterId && _this.$scope.Vm.Filters) {
                    _.each(_this.$scope.Vm.Filters, function (filter) {
                        if (filterId === filter.Id) {
                            selFilter = filter;
                        }
                    });
                }
                _this.ForecastingOptions.Filter = selFilter;
                _this.FOData.SetFilter(selFilter);
            };
            $scope.ClearChangesWithConfirmation = function () {
                confirmationService.Confirm({
                    Title: $scope.Vm.L10N.AdjustmentsCancelTitle,
                    Message: $scope.Vm.L10N.AdjustmentsCancelMessage,
                    ConfirmText: $scope.Vm.L10N.AdjustmentsCancelConfirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then(function (result) {
                    if (result) {
                        $scope.ClearChanges();
                    }
                });
            };
            $scope.ClearChanges = function () {
                _this.FOData.ClearChanges();
                _this.LoadData();
            };
            $scope.SaveChanges = function () {
                var isFiltered = _this.$scope.GetForecastingOptions().HasFilters;
                _this.SaveData(isFiltered);
            };
            $scope.ResetForecasts = function () {
                confirmationService.Confirm({
                    Title: $scope.Vm.L10N.ResetForecastModalWindowTitle,
                    Message: $scope.Vm.L10N.HistoryConfirmation,
                    ConfirmText: $scope.Vm.L10N.ForecastReset,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then(function (result) {
                    if (result) {
                        _this.ResetForecasts();
                    }
                });
            };
            $scope.HasViewHistoryPermission = function () {
                return dataService.CanViewHistory();
            };
            $scope.CanViewHistory = function () {
                return dataService.CanViewHistory() && $scope.Vm.HasForecast && (!$scope.IsSalesItems || $scope.Vm.SalesItem != null);
            };
            $scope.ShowResetButton = function () {
                var fo = $scope.GetForecastObject(), options = $scope.GetForecastingOptions(), enable = fo && options &&
                    fo.CanRevertForecast && !fo.Forecast.IsDayLocked && fo.Forecast.HasBeenEdited &&
                    options.MetricKey !== Forecasting.Services.MetricType.Events;
                return enable;
            };
            $scope.ShouldCancelAdjustments = function (newUrl) {
                confirmationService.Confirm({
                    Title: $scope.Vm.L10N.AdjustmentsCancelTitle,
                    Message: $scope.Vm.L10N.AdjustmentsCancelLocation,
                    ConfirmText: $scope.Vm.L10N.AdjustmentsCancelConfirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then(function (result) {
                    if (result) {
                        _this.unregisterLocationChangeStart();
                        _this.unregisterLocationChangeStart = null;
                        $scope.ClearChanges();
                        window.location.href = newUrl;
                    }
                });
            };
            this.RegisterOnLocationChangeStart = function () {
                if (_this.unregisterLocationChangeStart) {
                    return;
                }
                _this.unregisterLocationChangeStart = $scope.$on("$locationChangeStart", function (e, newUrl, oldUrl) {
                    if (_this.$scope.IsDirty()) {
                        if (newUrl.indexOf(oldUrl.split("&")[0]) === -1) {
                            _this.$scope.ShouldCancelAdjustments(newUrl);
                            e.preventDefault();
                        }
                    }
                });
            };
            $scope.GetSalesItems = function () {
                return _this.FODataSalesItems.Items;
            };
            $scope.SelectSalesItem = function () {
                if ($scope.GetSalesItems().SalesItems.length) {
                    $modal.open({
                        templateUrl: "/Areas/Forecasting/Templates/SelectSalesItemsDialog.html",
                        controller: "Forecasting.SelectSalesItemController",
                        windowClass: "modal-transparent",
                        resolve: {
                            ForecastSalesItems: function () { return _this.$scope.GetSalesItems(); }
                        }
                    });
                }
            };
            $scope.$watch("GetForecastingOptions()", function (newValue, oldValue) {
                if (newValue.Metric !== oldValue.Metric) {
                    if (newValue.Metric === Forecasting.Services.MetricType.SalesItems || oldValue.Metric === Forecasting.Services.MetricType.SalesItems) {
                        _this.FODataSalesItems.SetItemId(null);
                        _this.LoadData(newValue.Metric === Forecasting.Services.MetricType.SalesItems);
                    }
                }
                else if (_this.$scope.IsSalesItems && newValue.ItemId !== oldValue.ItemId) {
                    if (newValue.ItemId !== _this.FODataSalesItems.GetItemId()) {
                        _this.FODataSalesItems.SetItemId(newValue.ItemId);
                        _this.LoadData();
                    }
                }
            }, true);
            $scope.$watch(function () {
                return _this.$scope.GetSalesItems().SelectedSalesItem;
            }, function (newValue, oldValue) {
                if (!(!newValue && !oldValue) && newValue !== oldValue) {
                    var newItemId = newValue ? newValue.Id : null, oldItemId = oldValue ? oldValue.Id : null;
                    $scope.Vm.SalesItem = newValue;
                    if (newItemId !== oldItemId) {
                        _this.$state.params.itemid = newItemId ? newItemId.toString() : undefined;
                        _this.UpdateForecastingOptions(_this.$state.params);
                        if (_this.$scope.IsSalesItems && newItemId !== _this.FODataSalesItems.GetItemId()) {
                            _this.FODataSalesItems.SetItemId(newItemId);
                            _this.LoadData();
                        }
                    }
                }
            }, false);
            $scope.OnDatePickerChange = function (selectedDate) {
                var dateString = moment(selectedDate).format(_this.calendarDateFormat);
                if ($scope.DayString !== dateString) {
                    _this.SetDayString(dateString);
                }
                localStorage.setItem("DateMenu.DateString", $scope.DayString);
                _this.LoadData(true);
            };
            this.Initialize();
        }
        ForecastingController.prototype.Initialize = function () {
            var params, currentMetric, fo;
            this.FODataSalesItems = new Forecasting.Services.ForecastObjectDataSalesItem(this.$q, this.dataService, this.forecastingObjectService, this.$filter);
            this.FOData = this.FODataSalesItems.GetParent();
            this.$scope.Vm = {
                L10N: {},
                ForecastPickerOptions: {
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
            currentMetric = Forecasting.Services.metricMap[params.metric];
            fo = this.FOData.GetForecastingObject();
            this.ForecastingOptions = {
                Metric: params.metric,
                MetricKey: currentMetric.MetricKey,
                Template: currentMetric.Template,
                Part: params.part === null ? null : Number(params.part),
                PartIndex: params.part === null || !fo || !fo.Metrics ? 0 : fo.Metrics.TypeIndexes[Forecasting.Services.IntervalTypes.DaySegment][params.part],
                ItemId: params.itemid ? Number(params.itemid) : null,
                IntervalTypes: Forecasting.Services.IntervalTypes,
                ForecastIndex: 0,
                EventProfile: this.forecastingObjectService.GetCache(Forecasting.Services.CacheName.EventProfile),
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
        };
        ForecastingController.prototype.GetL10N = function () {
            var _this = this;
            this.translationService.GetTranslations()
                .then(function (l10NData) {
                _this.$scope.Vm.L10N = l10NData.Forecasting;
                _this.$scope.MetricDropdownOptions = [
                    { "name": _this.$scope.Vm.L10N.Sales, "value": "sales" },
                    { "name": _this.$scope.Vm.L10N.Transactions, "value": "transactions" }
                ];
                _this.SetTitle();
            });
        };
        ForecastingController.prototype.GetFilters = function () {
            var _this = this;
            this.forecastFilterService.GetForecastFilters()
                .success(function (filters) {
                filters = filters && filters.length ? filters : null;
                if (filters) {
                    var allFiltersEditable = true;
                    _.each(filters, function (filter) {
                        if (filter.Id !== null) {
                            allFiltersEditable = allFiltersEditable && filter.IsForecastEditableViaGroup;
                        }
                    });
                    filters.unshift({
                        Name: _this.$scope.Vm.L10N.Total || "Total",
                        Id: null,
                        ForecastFilterGroupTypes: [],
                        IsForecastEditableViaGroup: allFiltersEditable
                    });
                }
                _this.$scope.Vm.Filters = filters;
                if (filters) {
                    var mapping = [], map = {};
                    _.each(filters, function (filter) {
                        var option = {
                            Filter: filter,
                            Visible: true
                        };
                        mapping.push(option);
                    });
                    _.each(mapping, function (option) {
                        map[option.Filter.Id || 0] = option;
                    });
                    _this.ForecastingOptions.Filters = _this.$scope.Vm.Filters;
                    _this.ForecastingOptions.FiltersMap = map;
                    _this.ForecastingOptions.HasFilters = true;
                }
            })
                .error(function () {
                ;
            });
        };
        ForecastingController.prototype.SetTitle = function () {
            if (this.$scope.Vm.L10N.TitleForecasting) {
                var currentMetric = Forecasting.Services.metricMap[this.$state.params.metric || "transactions"];
                this.popupMessageService.SetPageTitle(this.$scope.Vm.L10N.TitleForecasting + " - " +
                    this.$scope.Vm.L10N[currentMetric.TranslationKey]);
            }
        };
        ForecastingController.prototype.SetDayString = function (dayString) {
            this.$scope.DayStringInvalid = false;
            this.$scope.DayString = dayString;
        };
        ForecastingController.prototype.AddKeyValues = function (params, extendedParams) {
            if (extendedParams) {
                var pairs = extendedParams.split("&");
                _.each(pairs, function (pair) {
                    var keyValue = pair.split("=");
                    params[keyValue[0]] = keyValue[1];
                });
            }
        };
        ForecastingController.prototype.UpdateForecastingOptions = function (params) {
            params.metric = params.metric ? params.metric.toLowerCase() : params.metric;
            var currentMetric = Forecasting.Services.metricMap[params.metric || "transactions"], fo = this.FOData.GetForecastingObject(), options = this.ForecastingOptions, isSalesItem = params.metric === "salesitems";
            if (options) {
                options.Metric = params.metric;
                options.MetricKey = currentMetric.MetricKey;
                options.IsCurrency = currentMetric.IsCurrency;
                options.Part = params.part === null ? null : Number(params.part);
                options.PartIndex = options.Part === null || !fo || !fo.Metrics ? 0 : fo.Metrics.TypeIndexes[Forecasting.Services.IntervalTypes.DaySegment][params.part];
                options.ItemId = params.itemid && isSalesItem ? Number(params.itemid) : null;
                if (fo && fo.Metrics) {
                    options.PartIndex = params.part === null ? 0 : fo.Metrics.TypeIndexes[Forecasting.Services.IntervalTypes.DaySegment][params.part];
                }
                this.SetTitle();
                this.$scope.IsSalesItems = isSalesItem;
                if (!isSalesItem) {
                    this.$scope.Vm.SalesItem = null;
                    this.FODataSalesItems.Clear(true);
                }
            }
        };
        ForecastingController.prototype.LoadData = function (reload) {
            var _this = this;
            this.FOData = this.$scope.IsSalesItems ? this.FODataSalesItems : this.FODataSalesItems.GetParent();
            var vm = this.$scope.Vm;
            vm.Loading = true;
            vm.HasData = false;
            vm.HasForecast = false;
            vm.NotHasForecastForSalesItem = false;
            this.FOData.LoadData(this.$scope.DayString, reload).then(function (data) {
                if (data && _this.$scope.DayString !== data.DayString) {
                    return;
                }
                vm.Loading = false;
                if (data !== null) {
                    if (data.Metrics.IntervalStarts.length > 0) {
                        _this.popupMessageService.Dismiss();
                        vm.HasData = true;
                        vm.HasForecast = true;
                        vm.HasFiltered = vm.Filters && vm.Filters.length &&
                            data && data.MetricsFiltered !== null;
                    }
                    else {
                        data = null;
                    }
                }
                if (data === null) {
                    _this.Clear(true);
                }
            }).catch(function () {
                vm.Loading = false;
                if (_this.$scope.IsSalesItems && _this.FODataSalesItems.Parent.ForecastObject === null) {
                    vm.NotHasForecastForSalesItem = true;
                }
            });
        };
        ForecastingController.prototype.SaveData = function (filtered) {
            var _this = this;
            this.FOData.SaveChanges(filtered)
                .then(function () {
                _this.popupMessageService.ShowSuccess(_this.$scope.Vm.L10N.SavedSuccessfully);
            })
                .catch(function (result) {
                switch (String(result.status)) {
                    case "409":
                        _this.popupMessageService.ShowWarning(_this.$scope.Vm.L10N.ForecastExists);
                        _this.LoadData(true);
                        break;
                    default:
                        _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + result.message);
                        break;
                }
            });
        };
        ForecastingController.prototype.Clear = function (clearCache) {
            this.$scope.Vm.HasData = false;
            this.$scope.Vm.HasForecast = false;
            this.FOData.Clear(clearCache);
            if (clearCache) {
                this.forecastingObjectService.ClearCache([Forecasting.Services.CacheName.FC, Forecasting.Services.CacheName.FCS, Forecasting.Services.CacheName.FCSI]);
            }
        };
        ForecastingController.prototype.ResetForecasts = function () {
            var _this = this;
            this.FOData.ResetForecasts().then(function (ver) {
                _this.popupMessageService.ShowSuccess(_this.$scope.Vm.L10N.HistorySuccessful);
                _this.Clear(true);
            }).catch(function () {
                _this.popupMessageService.ShowWarning(_this.$scope.Vm.L10N.ForecastExists);
            }).finally(function () {
                _this.LoadData(true);
            });
        };
        return ForecastingController;
    }());
    Forecasting.ForecastingController = ForecastingController;
    Forecasting.forecastingViewsController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingController", ForecastingController, Core.NG.$typedScope(), Core.NG.$state, Core.$translation, Core.$popupMessageService, Core.NG.$modal, Core.$confirmationService, Core.NG.$q, Core.NG.$filter, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Forecasting.Api.$forecastFilterService);
})(Forecasting || (Forecasting = {}));
