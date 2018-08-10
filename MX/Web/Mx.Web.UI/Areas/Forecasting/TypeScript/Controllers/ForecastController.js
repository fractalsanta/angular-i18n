var Forecasting;
(function (Forecasting) {
    "use strict";
    var calendarDateFormat = "YYYY-MM-DD";
    var ForecastController = (function () {
        function ForecastController($scope, $routeParams, $location, $modal, confirmationService, translation, messageService, dataService, forecastingObjectService, $state, $filter) {
            var _this = this;
            this.$scope = $scope;
            this.messageService = messageService;
            $routeParams.metric = $routeParams.metric.toLowerCase();
            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales",
                    MetricKey: Forecasting.Services.MetricType.Sales },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions",
                    MetricKey: Forecasting.Services.MetricType.Transactions },
                salesitems: { Template: "n", TranslationKey: "SalesItems",
                    MetricKey: Forecasting.Services.MetricType.Transactions },
                events: { Template: "n", Metric: "ManagerAdjustments", TranslationKey: "ManagerAdjustments",
                    MetricKey: Forecasting.Services.MetricType.Events }
            }, isSalesItem = ($routeParams.metric === "salesitems"), currentMetric = metricMap[$routeParams.metric];
            $scope.ParseLocation = function (url, params) {
                params.metric = params.metric.toLowerCase();
                isSalesItem = (params.metric === "salesitems");
                currentMetric = metricMap[params.metric];
                $scope.IsEditorView = true;
                $scope.IsSalesItemView = isSalesItem;
                $scope.IsGraphView = url.toLowerCase().indexOf("graph") !== -1;
                $scope.IsGridView = !$scope.IsGraphView;
                $scope.HasData = false;
                $scope.Loading = false;
                $scope.ForecastingOptions = {
                    Metric: params.metric,
                    MetricKey: currentMetric.MetricKey,
                    Template: currentMetric.Template,
                    Part: (params.part) ? Number(params.part) : ((!isSalesItem && params.id) ? Number(params.id) : null),
                    ItemId: (params.part || isSalesItem) ? Number(params.id) : null,
                    IntervalTypes: Forecasting.Services.IntervalTypes,
                    ForecastIndex: 0,
                    EventProfile: forecastingObjectService.GetCache(Forecasting.Services.CacheName.EventProfile),
                    HasFilters: false
                };
                if ($scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events && !$scope.ForecastingOptions.EventProfile) {
                    forecastingObjectService.EditEventAdjustmentsCompleted(true);
                }
                else {
                    translation.GetTranslations().then(function (result) {
                        $scope.Translations = result.Forecasting;
                        var title = $scope.IsEditorView && $scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events ?
                            $scope.Translations.TitleEventAdjustments : $scope.Translations.TitleForecasting;
                        messageService.SetPageTitle(title);
                        $scope.DisplayMetric = result.Forecasting[currentMetric.TranslationKey];
                    });
                }
                if (!isSalesItem) {
                    $scope.ClearSalesItems();
                }
            };
            $scope.Translations = {};
            $scope.IsDirty = function () {
                if ($scope.ForecastObject && $scope.ForecastObject.IsDirty) {
                    return true;
                }
                if ($scope.FOSalesItem && $scope.FOSalesItem.IsDirty) {
                    return true;
                }
                if ($scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events &&
                    $scope.ForecastingOptions.EventProfile && $scope.ForecastingOptions.EventProfile.Id === 0) {
                    return true;
                }
                return false;
            };
            var date = localStorage.getItem("DateMenu.DateString");
            if (date) {
                date = moment(date).toDate();
            }
            else {
                date = moment().toDate();
            }
            $scope.ForecastPickerOptions = {
                Date: date,
                DayOffset: 1
            };
            $scope.DayString = moment(date).format(calendarDateFormat);
            $scope.OpenEditDialog = function (metricKey, metric) {
                var myFO = (isSalesItem) ? $scope.FOSalesItem : $scope.ForecastObject, myO = $scope.ForecastingOptions, modalInstance, oldValue, values = {
                    "sales": (myFO.Metrics.NewManagerSales ?
                        myFO.Metrics.NewManagerSales[myO.PartIndex] ||
                            myFO.Metrics.ManagerSales[myO.PartIndex] : undefined),
                    "transactions": (myFO.Metrics.NewManagerTransactions ?
                        myFO.Metrics.NewManagerTransactions[myO.PartIndex] ||
                            myFO.Metrics.ManagerTransactions[myO.PartIndex] : undefined),
                    "events": (myFO.Metrics.NewManagerAdjustments ?
                        myFO.Metrics.NewManagerAdjustments[myO.PartIndex] ||
                            myFO.Metrics.ManagerAdjustments[myO.PartIndex] : undefined)
                };
                oldValue = metricKey === Forecasting.Services.MetricType.Events ? 100 : values[metricKey];
                if (myFO.IsDirty && myFO.HourlyEdit) {
                    $scope.ClearChanges(false, $scope.Translations.AdjustmentsCancelAggregate, true);
                    return;
                }
                modalInstance = $modal.open({
                    templateUrl: "/Areas/Forecasting/Templates/EditForecastDialog.html",
                    controller: "Forecasting.EditForecastController",
                    resolve: {
                        targetPropertyValue: function () {
                            return oldValue;
                        },
                        metric: function () {
                            return metric;
                        },
                        isCurrency: function () {
                            return (myO.MetricKey === Forecasting.Services.MetricType.Sales);
                        }
                    }
                });
                modalInstance.result.then(function (updatedValue) {
                    if (metricKey === Forecasting.Services.MetricType.Events) {
                        updatedValue = updatedValue - 100;
                    }
                    forecastingObjectService.EditDailyValue(myFO, myO.PartIndex, myO.MetricKey, oldValue, updatedValue);
                    myFO.IsDirty = forecastingObjectService.IsDirty(myFO);
                });
            };
            $scope.LoadData = function (reload) {
                var fo = forecastingObjectService.GetCache(Forecasting.Services.CacheName.FC), fos = forecastingObjectService.GetCache(Forecasting.Services.CacheName.FCS), salesItems = forecastingObjectService.GetCache(Forecasting.Services.CacheName.FCSI);
                if (!reload) {
                    if (!(fo &&
                        fo.DayString === $scope.DayString &&
                        fo.Forecast.EntityId === dataService.GetEntityId())) {
                        reload = true;
                    }
                }
                if (!reload) {
                    $scope.ForecastObject = fo;
                    $scope.FOSalesItem = fos;
                    $scope.HasForecast = true;
                    if ($scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events) {
                        $scope.SetData(fo);
                    }
                    else {
                        $scope.ForecastSalesItems = salesItems;
                        $scope.LoadSalesItems(fo.Forecast.EntityId, fo.Forecast.Id);
                        $scope.SetData((isSalesItem && fos) ? fos : fo);
                    }
                }
                else {
                    $scope.HasData = false;
                    $scope.Clear(true);
                    $scope.GetForecast();
                }
            };
            $scope.GetForecast = function () {
                var fo = null;
                if ($scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events) {
                    $scope.GetBlankForecast();
                    return;
                }
                if ($scope.DayStringInvalid) {
                    return;
                }
                $scope.Loading = true;
                dataService.GetAllForecastingDataForDate($scope.DayString).then(function (data) {
                    if (data.Forecast) {
                        if (data.Forecast.BusinessDay.substring(0, 10) !== $scope.DayString) {
                            return;
                        }
                        $scope.ForecastObject = fo = {
                            DayString: $scope.DayString,
                            Forecast: data.Forecast,
                            Metrics: data.ForecastMetricAlls,
                            IsDirty: false,
                            IsLocked: data.Forecast.IsDayLocked,
                            ViewHistory: dataService.CanViewHistory(),
                            HourlyEdit: false,
                            CanRevertForecast: dataService.CanRevertForecast()
                        };
                        forecastingObjectService.SetCache(Forecasting.Services.CacheName.FC, fo);
                        $scope.HasData = true;
                        $scope.Loading = false;
                        $scope.HasForecast = true;
                        if (!isSalesItem) {
                            $scope.ClearSalesItems();
                            $scope.SetData(fo);
                        }
                        else if ($scope.ForecastSalesItems && $scope.ForecastSalesItems.SelectedSalesItem) {
                            $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                        }
                        $scope.LoadSalesItems(fo.Forecast.EntityId, fo.Forecast.Id);
                    }
                    if (fo !== null && fo.Metrics.IntervalStarts.length > 0) {
                        messageService.Dismiss();
                    }
                    else {
                        _this.AlertNoData(false);
                        $scope.Clear(true);
                        $scope.Loading = false;
                        return;
                    }
                }).catch(function () {
                    _this.AlertNoData(false);
                    $scope.Clear(true);
                    $scope.Loading = false;
                });
            };
            $scope.GetBlankForecast = function () {
                var fo = null;
                $scope.Loading = true;
                dataService.GetBlankForecastingData().then(function (data) {
                    data.Forecast = data.data.Forecast;
                    data.Forecast.EntityId = dataService.GetEntityId();
                    data.ForecastMetricAlls = data.data;
                    if (data.Forecast) {
                        $scope.ForecastObject = fo = {
                            DayString: $scope.DayString,
                            Forecast: data.Forecast,
                            Metrics: data.ForecastMetricAlls,
                            IsDirty: false,
                            IsLocked: false,
                            ViewHistory: false,
                            HourlyEdit: false,
                            CanRevertForecast: false
                        };
                        forecastingObjectService.SetAdjustments(fo);
                        forecastingObjectService.SetCache(Forecasting.Services.CacheName.FC, fo);
                        $scope.HasData = true;
                        $scope.Loading = false;
                        $scope.SetData(fo);
                    }
                    messageService.Dismiss();
                }).catch(function (ex) {
                    _this.AlertNoData(false);
                    $scope.Clear(true);
                    $scope.Loading = false;
                });
            };
            $scope.Clear = function (clearCache) {
                $scope.ForecastObject = null;
                $scope.FOSalesItem = null;
                if (clearCache) {
                    forecastingObjectService.ClearCache([Forecasting.Services.CacheName.FC, Forecasting.Services.CacheName.FCS, Forecasting.Services.CacheName.FCSI]);
                }
            };
            $scope.ClearSalesItems = function () {
                $scope.FOSalesItem = null;
                forecastingObjectService.ClearCache([Forecasting.Services.CacheName.FCS]);
                if ($scope.ForecastSalesItems) {
                    $scope.ForecastSalesItems.SelectedSalesItem = null;
                    $scope.ForecastSalesItems.SearchParam = "";
                }
            };
            $scope.SetData = function (fo) {
                $scope.ForecastingOptions.PartIndex = $scope.ForecastingOptions.Part !== null ?
                    fo.Metrics.TypeIndexes[Forecasting.Services.IntervalTypes.DaySegment][$scope.ForecastingOptions.Part] :
                    $scope.ForecastingOptions.ForecastIndex;
                $scope.IsLocked = fo ? fo.IsLocked : true;
                $scope.HasData = fo ? true : false;
                if ($scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events) {
                    var alls = fo.Metrics;
                    forecastingObjectService.UpdateRanges(alls, alls.NewManagerAdjustments, alls.ManagerAdjustments);
                }
            };
            $scope.ShouldCancelAdjustments = function (newUrl) {
                if ($scope.ForecastingOptions.MetricKey !== Forecasting.Services.MetricType.Events) {
                    return window.confirm($scope.Translations.AdjustmentsCancelLocation);
                }
                else {
                    var editing = $scope.ForecastingOptions.EventProfile && $scope.ForecastingOptions.EventProfile.Id;
                    var confirm;
                    if (editing) {
                        confirm = {
                            Title: $scope.Translations.CancelEditManualAdjustmentsTitle,
                            Message: $scope.Translations.CancelEditManualAdjustments,
                            ConfirmText: $scope.Translations.CancelManualAdjustmentsYes,
                            ConfirmationType: Core.ConfirmationTypeEnum.Positive
                        };
                    }
                    else {
                        confirm = {
                            Title: $scope.Translations.CancelManualAdjustmentsTitle,
                            Message: $scope.Translations.CancelManualAdjustments,
                            ConfirmText: $scope.Translations.CancelManualAdjustmentsYes,
                            ConfirmationType: Core.ConfirmationTypeEnum.Positive
                        };
                    }
                    confirmationService.Confirm(confirm).then(function (result) {
                        if (result) {
                            $scope.DoClearChanges();
                            forecastingObjectService.EditEventAdjustmentsCompleted(true, newUrl);
                        }
                    });
                }
                return false;
            };
            var clearChanges = function (modal) {
                $scope.DoClearChanges();
                if (modal) {
                    $scope.OpenEditDialog($scope.ForecastingOptions.MetricKey, $scope.ForecastingOptions.Metric);
                }
            };
            $scope.ClearChanges = function (noPrompt, message, modal) {
                message = message || $scope.Translations.AdjustmentsCancelMessage;
                if (noPrompt) {
                    clearChanges(modal);
                }
                else {
                    confirmationService.Confirm({
                        Title: $scope.Translations.AdjustmentsCancelTitle,
                        Message: message,
                        ConfirmText: $scope.Translations.AdjustmentsCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(function () {
                        clearChanges(modal);
                    });
                }
            };
            $scope.DoClearChanges = function () {
                forecastingObjectService.ClearEdits($scope.ForecastObject);
                if (isSalesItem) {
                    forecastingObjectService.ClearEdits($scope.FOSalesItem);
                }
                if ($scope.ForecastingOptions.MetricKey === Forecasting.Services.MetricType.Events && $scope.ForecastingOptions.EventProfile) {
                    $scope.ForecastingOptions.EventProfile = null;
                }
                if ($scope.IsGraphView && $scope.DayString) {
                    $scope.LoadData();
                }
            };
            $scope.SelectSalesItem = function () {
                $modal.open({
                    templateUrl: "/Areas/Forecasting/Templates/SelectSalesItemsDialog.html",
                    controller: "Forecasting.SelectSalesItemController",
                    windowClass: "modal-transparent",
                    resolve: {
                        ForecastSalesItems: function () { return $scope.ForecastSalesItems; }
                    }
                });
            };
            $scope.SaveChanges = function () {
                var fo = $scope.ForecastObject, fos = $scope.FOSalesItem, updateResult;
                if (!isSalesItem) {
                    updateResult = dataService.UpdateMetrics(fo.Forecast.Id, fo.Forecast.Version, fo.Metrics).success(function () {
                        $scope.ForecastObject.IsDirty = forecastingObjectService.IsDirty($scope.ForecastObject);
                    });
                }
                else {
                    updateResult = dataService.UpdateSalesItemMetrics(fo.Forecast.Id, $scope.ForecastingOptions.ItemId, fo.Forecast.Version, fos.Metrics).success(function () {
                        $scope.FOSalesItem.IsDirty = forecastingObjectService.IsDirty($scope.FOSalesItem);
                    });
                }
                updateResult.success(function () {
                    messageService.ShowSuccess("Changes saved successfully.");
                    $scope.GetForecast();
                    if (isSalesItem) {
                        $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                    }
                }).error(function (data, status) {
                    switch (String(status)) {
                        case "409":
                            alert(_this.$scope.Translations.ForecastExists);
                            if (!isSalesItem) {
                                $scope.LoadData(true);
                            }
                            else {
                                $scope.ClearChanges(true);
                                $scope.GetForecast();
                                $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                            }
                            break;
                        default:
                            messageService.ShowError("Error: " + status);
                    }
                });
            };
            $scope.SaveAdjustments = function () {
                forecastingObjectService.EditEventAdjustmentsCompleted(false);
                $scope.DoClearChanges();
            };
            $scope.FOSalesItem = null;
            $scope.LoadSalesItems = function (entityId, forecastId) {
                var reload = false;
                if (!$scope.ForecastSalesItems || $scope.ForecastSalesItems.EntityId !== entityId) {
                    reload = true;
                }
                if (reload) {
                    dataService.GetSalesItemsForForecastData(forecastId).then(function (salesItemData) {
                        $scope.ForecastSalesItems = {
                            EntityId: entityId,
                            SalesItems: $filter("orderBy")(salesItemData.data, "Description"),
                            SearchParam: ""
                        };
                        forecastingObjectService.SetCache(Forecasting.Services.CacheName.FCSI, $scope.ForecastSalesItems);
                        if ($scope.ForecastingOptions.ItemId) {
                            $scope.ForecastSalesItems.SelectedSalesItem = _.find($scope.ForecastSalesItems.SalesItems, { Id: $scope.ForecastingOptions.ItemId });
                            if ($scope.ForecastSalesItems.SelectedSalesItem) {
                                $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                            }
                        }
                    });
                }
            };
            $scope.LoadSalesItemData = function (salesItem) {
                var fos, salesItemId = salesItem.Id;
                if ($scope.IsDirty()) {
                    if (!$scope.ShouldCancelAdjustments()) {
                        return;
                    }
                }
                $scope.ForecastingOptions.ItemId = salesItemId;
                dataService.GetSalesItemMetrics($scope.ForecastObject.Forecast.Id, salesItem.Id).success(function (metrics) {
                    if (metrics.IntervalStarts.length > 0) {
                        messageService.Dismiss();
                        $scope.HasData = true;
                    }
                    else {
                        _this.AlertNoData(true);
                        $scope.ForecastSalesItems.SelectedSalesItem = salesItem;
                        return;
                    }
                    fos = {
                        Metrics: metrics,
                        Forecast: null,
                        DayString: $scope.DayString,
                        IsDirty: false,
                        IsLocked: $scope.ForecastObject.Forecast.IsDayLocked,
                        ViewHistory: dataService.CanViewHistory(),
                        HourlyEdit: false,
                        CanRevertForecast: dataService.CanRevertForecast(),
                        Description: $scope.ForecastSalesItems.SelectedDescription
                    };
                    $scope.FOSalesItem = forecastingObjectService.SetCache(Forecasting.Services.CacheName.FCS, fos);
                    if (isSalesItem) {
                        $scope.SetData(fos);
                    }
                })
                    .error(function () {
                    _this.messageService.ShowError(_this.$scope.Translations.GenericErrorMessage);
                });
            };
            $scope.$watch("ForecastSalesItems.SelectedSalesItem", function (salesItem) {
                if (isSalesItem && salesItem) {
                    $scope.LoadSalesItemData(salesItem);
                }
            }, false);
            $scope.ResetForecasts = function () {
                var fo = $scope.ForecastObject;
                if (confirm($scope.Translations.HistoryConfirmation)) {
                    dataService.RevertForecast(fo.Forecast.Id, fo.Forecast.Version).then(function (ver) {
                        if (ver.data > fo.Forecast.Version) {
                            $scope.HasData = true;
                            if (!isSalesItem) {
                                $scope.ForecastObject = null;
                                $scope.FOSalesItem = null;
                                forecastingObjectService.ClearCache([Forecasting.Services.CacheName.FC, Forecasting.Services.CacheName.FCS]);
                            }
                            $scope.GetForecast();
                            if (isSalesItem) {
                                $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                            }
                            _this, messageService.ShowSuccess($scope.Translations.HistorySuccessful);
                        }
                        else {
                            _this.messageService.ShowWarning(_this.$scope.Translations.ForecastExists);
                            $scope.LoadData(true);
                        }
                    });
                }
            };
            $scope.$on("$locationChangeSuccess", function (e, newUrl, oldUrl) {
                var editorRegex = /\/Forecasting\/Editor/i, fo;
                if (editorRegex.test(newUrl)) {
                    fo = $scope.ForecastObject;
                    if (fo) {
                        $scope.SetData(fo);
                    }
                    $(":focus").blur();
                }
            });
            $scope.$on("$locationChangeStart", function (e, newUrl, oldUrl) {
                var forecastingRegex = /\/Forecasting\/Editor|\/Forecasting\/History/i, gridRegex = /Grid/i, salesItemRegex = /\/SalesItems/i;
                if (!forecastingRegex.test(newUrl)) {
                    localStorage.removeItem("DateMenu.DateString");
                }
                if (gridRegex.test(newUrl) && gridRegex.test(oldUrl)) {
                    return;
                }
                if ($scope.ForecastSalesItems && !salesItemRegex.test(newUrl)) {
                    $scope.ForecastSalesItems.SelectedSalesItem = null;
                    $scope.ForecastSalesItems.SelectedDescription = null;
                }
                if (!$scope.IsDirty()) {
                    return;
                }
                else {
                    newUrl = newUrl.substring(newUrl.indexOf("/#/") + 2);
                    if (!$scope.ShouldCancelAdjustments(newUrl)) {
                        e.preventDefault();
                        return;
                    }
                }
                $scope.DoClearChanges();
                messageService.Dismiss();
            });
            $scope.$on("$destroy", function () {
                ;
            });
            $scope.OnDatePickerChange = function (selectedDate) {
                var dateString = moment(selectedDate).format(calendarDateFormat);
                if ($scope.DayString !== dateString) {
                    _this.SetDayString(dateString);
                }
                localStorage.setItem("DateMenu.DateString", $scope.DayString);
                $scope.LoadData();
            };
            $scope.ParseLocation($location.url(), $routeParams);
            if ($scope.ForecastingOptions.MetricKey !== Forecasting.Services.MetricType.Events ||
                $scope.ForecastingOptions.EventProfile !== undefined) {
                $scope.LoadData();
            }
        }
        ForecastController.prototype.AlertNoData = function (skipMessage) {
            this.$scope.HasData = false;
            this.$scope.IsLocked = true;
            this.$scope.HasForecast = skipMessage;
        };
        ForecastController.prototype.SetDayString = function (dayString) {
            var prevent = false;
            if (this.$scope.IsDirty()) {
                prevent = !this.$scope.ShouldCancelAdjustments();
            }
            if (!prevent) {
                this.$scope.DayStringInvalid = false;
                this.$scope.DayString = dayString;
            }
            else {
                this.$scope.ForecastPickerOptions.Date = new Date(this.$scope.DayString);
            }
        };
        return ForecastController;
    }());
    Core.NG.ForecastingModule.RegisterRouteController("Editor/Graph/:metric", "Templates/ForecastView.html", ForecastController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$confirmationService, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$state, Core.NG.$filter);
    Core.NG.ForecastingModule.RegisterRouteController("Editor/Graph/:metric/:id{IgnoreSlash:/?}{part:.*}", "Templates/ForecastView.html", ForecastController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$confirmationService, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$state, Core.NG.$filter);
    Core.NG.ForecastingModule.RegisterRouteController("Editor/Grid/:metric", "Templates/ForecastView.html", ForecastController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$confirmationService, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$state, Core.NG.$filter);
    Core.NG.ForecastingModule.RegisterRouteController("Editor/Grid/:metric/:id{IgnoreSlash:/?}{part:.*}", "Templates/ForecastView.html", ForecastController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$confirmationService, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$state, Core.NG.$filter);
    Core.NG.ForecastingModule.RegisterNamedController("ForecastController", ForecastController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$location, Core.NG.$modal, Core.$confirmationService, Core.$translation, Core.$popupMessageService, Forecasting.Services.$dataService, Forecasting.Services.$forecastingObjectService, Core.NG.$state, Core.NG.$filter);
})(Forecasting || (Forecasting = {}));
