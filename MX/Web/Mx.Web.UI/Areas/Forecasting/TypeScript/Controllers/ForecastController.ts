module Forecasting {
    "use strict";

    interface IForecastControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;

        DayStringInvalid: boolean;
        IsEditorView: boolean;
        IsGraphView: boolean;
        IsGridView: boolean;
        IsSalesItemView: boolean;
        IsLocked: boolean;
        IsDirty(): boolean;
        HasData: boolean;
        HasForecast: boolean;
        Loading: boolean;
        ViewHistory: boolean;
        DayString: string;
        DisplayMetric: string;
        CanRevertForecast: boolean;

        ForecastingOptions: Services.IForecastingOptions;
        ForecastObject: Services.IForecastObject;
        FOSalesItem: Services.IForecastObject;

        ForecastSalesItems?: Services.IForecastSalesItems;
        FilteredForecastSalesItems?: Api.Models.ISalesItem[];

        Metrics: any;
        DropDownMetrics: any;
        DaySegments: any;
        DropDownDaySegments: any;

        ParseLocation(url: string, params: any): void;
        OpenEditDialog(metricKey: string, metric: string): void;
        LoadData(reload?: boolean): void;
        GetForecast(): void;
        GetBlankForecast(): void;
        SetData(fo: Services.IForecastObject): void;
        Clear(clearCache: boolean): void;
        ClearSalesItems(): void;
        ShouldCancelAdjustments(newUrl?: string): boolean;
        ClearChanges(noPrompt?: boolean, dialog?: string, modal?: boolean): void;
        DoClearChanges(): void;
        SaveChanges(): void;
        SaveAdjustments(): void;
        LoadSalesItems(entityId: number, forecastId: number): void;
        LoadSalesItemData(salesItemData: any): void;
        ResetForecasts(): void;
        OnDatePickerChange(selectedDate: Date): void;
        ForecastPickerOptions: Core.NG.IMxDayPickerOptions;
        SelectSalesItem(): void;
    }

    interface IForecastControllerRouteParams {
        view: string;
        metric: string;
        id?: string;
        part?: string;
    }

    var calendarDateFormat = "YYYY-MM-DD";

    class ForecastController {
        constructor(
            private $scope: IForecastControllerScope,
            $routeParams: IForecastControllerRouteParams,
            $location: ng.ILocationService,
            $modal: ng.ui.bootstrap.IModalService,
            confirmationService: Core.IConfirmationService,
            translation: Core.ITranslationService,
            private messageService: Core.IPopupMessageService,
            dataService: Services.IDataService,
            forecastingObjectService: Services.IForecastingObjectService,
            $state: ng.ui.IStateService,
            $filter: ng.IFilterService) {

            // Lowercase metric to ensure simple case-insensitive comparison.
            $routeParams.metric = $routeParams.metric.toLowerCase();

            var metricMap = {
                sales: { Template: "c", Metric: "ManagerSales", TranslationKey: "Sales",
                    MetricKey: Services.MetricType.Sales },
                transactions: { Template: "n", Metric: "ManagerTransactionCount", TranslationKey: "Transactions",
                    MetricKey: Services.MetricType.Transactions },
                salesitems: { Template: "n", TranslationKey: "SalesItems",
                    MetricKey: Services.MetricType.Transactions },
                events: { Template: "n", Metric: "ManagerAdjustments", TranslationKey: "ManagerAdjustments",
                    MetricKey: Services.MetricType.Events }
            },
                isSalesItem = ($routeParams.metric === "salesitems"),
                currentMetric = metricMap[$routeParams.metric];

            $scope.ParseLocation = (url: string, params: IForecastControllerRouteParams): void => {
                params.metric = params.metric.toLowerCase();
                isSalesItem = (params.metric === "salesitems");
                currentMetric = metricMap[params.metric];

                $scope.IsEditorView = true;
                $scope.IsSalesItemView = isSalesItem;
                $scope.IsGraphView = url.toLowerCase().indexOf("graph") !== -1;
                $scope.IsGridView = !$scope.IsGraphView;
                $scope.HasData = false;
                $scope.Loading = false;

                $scope.ForecastingOptions = <Services.IForecastingOptions>{
                    Metric: params.metric,
                    MetricKey: currentMetric.MetricKey,
                    Template: currentMetric.Template,
                    Part: (params.part) ? Number(params.part) : ((!isSalesItem && params.id) ? Number(params.id) : null),
                    ItemId: (params.part || isSalesItem) ? Number(params.id) : null,
                    IntervalTypes: Services.IntervalTypes,
                    ForecastIndex: 0,
                    EventProfile: forecastingObjectService.GetCache(Services.CacheName.EventProfile),
                    HasFilters: false
                };

                if ($scope.ForecastingOptions.MetricKey === Services.MetricType.Events && !$scope.ForecastingOptions.EventProfile) {
                    forecastingObjectService.EditEventAdjustmentsCompleted(true);
                } else {
                    translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                        $scope.Translations = result.Forecasting;
                        var title = $scope.IsEditorView && $scope.ForecastingOptions.MetricKey === Services.MetricType.Events ?
                            $scope.Translations.TitleEventAdjustments : $scope.Translations.TitleForecasting;
                        messageService.SetPageTitle(title);
                        $scope.DisplayMetric = result.Forecasting[currentMetric.TranslationKey];
                    });
                }

                if (!isSalesItem) {
                    $scope.ClearSalesItems();
                }
            };

            $scope.Translations = <Api.Models.ITranslations>{};

            $scope.IsDirty = (): boolean => {
                if ($scope.ForecastObject && $scope.ForecastObject.IsDirty) {
                    return true;
                }
                if ($scope.FOSalesItem && $scope.FOSalesItem.IsDirty) {
                    return true;
                }
                if ($scope.ForecastingOptions.MetricKey === Services.MetricType.Events &&
                        $scope.ForecastingOptions.EventProfile && $scope.ForecastingOptions.EventProfile.Id === 0) {
                    return true;
                }

                return false;
            };

            var date: any = localStorage.getItem("DateMenu.DateString");
            if (date) {
                date = moment(date).toDate();
            } else {
                date = moment().toDate();
            }

            $scope.ForecastPickerOptions = <Core.NG.IMxDayPickerOptions>{
                Date: date,
                DayOffset: 1
            };

            $scope.DayString = moment(date).format(calendarDateFormat);

            $scope.OpenEditDialog = (metricKey: string, metric: string): void => {
                var myFO = (isSalesItem) ? $scope.FOSalesItem : $scope.ForecastObject,
                    myO = $scope.ForecastingOptions,
                    modalInstance,
                    oldValue,
                    values = {
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

                oldValue = metricKey === Services.MetricType.Events ? 100 : values[metricKey];

                if (myFO.IsDirty && myFO.HourlyEdit) {
                    $scope.ClearChanges(false, $scope.Translations.AdjustmentsCancelAggregate, true);
                    return;
                }

                modalInstance = $modal.open({
                    templateUrl: "/Areas/Forecasting/Templates/EditForecastDialog.html",
                    controller: "Forecasting.EditForecastController",
                    resolve: {
                        targetPropertyValue: (): number => {
                            return oldValue;
                        },
                        metric: (): string => {
                            return metric;
                        },
                        isCurrency: (): boolean => {
                            return (myO.MetricKey === Services.MetricType.Sales);
                        }
                    }
                });

                modalInstance.result.then((updatedValue: number): void => {
                    if (metricKey === Services.MetricType.Events) {
                        updatedValue = updatedValue - 100;
                    }

                    forecastingObjectService.EditDailyValue(myFO, myO.PartIndex, myO.MetricKey, oldValue, updatedValue);
                    myFO.IsDirty = forecastingObjectService.IsDirty(myFO);
                });
            };

            $scope.LoadData = (reload?: boolean): void => {
                var fo: Services.IForecastObject = forecastingObjectService.GetCache(Services.CacheName.FC),
                    fos: Services.IForecastObject = forecastingObjectService.GetCache(Services.CacheName.FCS),
                    salesItems: Services.IForecastSalesItems = forecastingObjectService.GetCache(Services.CacheName.FCSI);

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

                    if ($scope.ForecastingOptions.MetricKey === Services.MetricType.Events) {
                        $scope.SetData(fo);
                    } else {
                        $scope.ForecastSalesItems = salesItems;
                        $scope.LoadSalesItems(fo.Forecast.EntityId, fo.Forecast.Id);
                        $scope.SetData((isSalesItem && fos) ? fos : fo);
                    }
                } else {
                    $scope.HasData = false;
                    $scope.Clear(true);

                    $scope.GetForecast();
                }
            };

            $scope.GetForecast = (): void => {
                var fo = null;
                if ($scope.ForecastingOptions.MetricKey === Services.MetricType.Events) {
                    $scope.GetBlankForecast();
                    return;
                }
                if ($scope.DayStringInvalid) {
                    return;
                }

                $scope.Loading = true;
                dataService.GetAllForecastingDataForDate($scope.DayString).then((data: Services.IAllForecastingData): void => {
                    if (data.Forecast) {
                        if (data.Forecast.BusinessDay.substring(0, 10) !== $scope.DayString) {
                            return;
                        }

                        $scope.ForecastObject = fo = <Services.IForecastObject>{
                            DayString: $scope.DayString,
                            Forecast: data.Forecast,
                            Metrics: data.ForecastMetricAlls,
                            IsDirty: false,
                            IsLocked: data.Forecast.IsDayLocked,
                            ViewHistory: dataService.CanViewHistory(),
                            HourlyEdit: false,
                            CanRevertForecast: dataService.CanRevertForecast()
                        };

                        forecastingObjectService.SetCache(Services.CacheName.FC, fo);

                        $scope.HasData = true;
                        $scope.Loading = false;
                        $scope.HasForecast = true;
                        if (!isSalesItem) {
                            $scope.ClearSalesItems();
                            $scope.SetData(fo);
                        } else if ($scope.ForecastSalesItems && $scope.ForecastSalesItems.SelectedSalesItem) {
                            $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                        }

                        $scope.LoadSalesItems(fo.Forecast.EntityId, fo.Forecast.Id);
                    }

                    if (fo !== null && fo.Metrics.IntervalStarts.length > 0) {
                        messageService.Dismiss();
                    } else {
                        this.AlertNoData(false);
                        $scope.Clear(true);
                        $scope.Loading = false;
                        return;
                    }
                }).catch((): void => {
                    this.AlertNoData(false);
                    $scope.Clear(true);
                    $scope.Loading = false;
                });
            };

            $scope.GetBlankForecast = (): void => {
                var fo = null;
                $scope.Loading = true;
                dataService.GetBlankForecastingData().then((data: Services.IAllForecastingData): void => {
                    data.Forecast = (<any>data).data.Forecast;
                    data.Forecast.EntityId = dataService.GetEntityId();
                    data.ForecastMetricAlls = (<any>data).data;
                    if (data.Forecast) {
                        $scope.ForecastObject = fo = <Services.IForecastObject>{
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
                        forecastingObjectService.SetCache(Services.CacheName.FC, fo);

                        $scope.HasData = true;
                        $scope.Loading = false;

                        $scope.SetData(fo);
                    }
                    
                    messageService.Dismiss();
                }).catch((ex: any): void => {
                    this.AlertNoData(false);
                        $scope.Clear(true);
                        $scope.Loading = false;
                    });
            };

            $scope.Clear = (clearCache: boolean): void => {
                $scope.ForecastObject = null;
                $scope.FOSalesItem = null;

                if (clearCache) {
                    forecastingObjectService.ClearCache( [Services.CacheName.FC, Services.CacheName.FCS, Services.CacheName.FCSI] );
                }
            };

            $scope.ClearSalesItems = (): void => {
                $scope.FOSalesItem = null;
                forecastingObjectService.ClearCache([Services.CacheName.FCS]);

                if ($scope.ForecastSalesItems) {
                    $scope.ForecastSalesItems.SelectedSalesItem = null;
                    $scope.ForecastSalesItems.SearchParam = "";
                }
            };

            $scope.SetData = (fo: Services.IForecastObject): void => {
                // note: fo could be ForecastObject or FOSalesItem
                $scope.ForecastingOptions.PartIndex = $scope.ForecastingOptions.Part !== null ?
                    fo.Metrics.TypeIndexes[Services.IntervalTypes.DaySegment][$scope.ForecastingOptions.Part] :
                    $scope.ForecastingOptions.ForecastIndex;
                $scope.IsLocked = fo ? fo.IsLocked : true;
                $scope.HasData = fo ? true : false;

                if ($scope.ForecastingOptions.MetricKey === Services.MetricType.Events) {
                    var alls = fo.Metrics;
                    forecastingObjectService.UpdateRanges(alls, alls.NewManagerAdjustments, alls.ManagerAdjustments);
                }
            };

            $scope.ShouldCancelAdjustments = (newUrl?: string): boolean => {
                if ($scope.ForecastingOptions.MetricKey !== Services.MetricType.Events) {
                    return window.confirm($scope.Translations.AdjustmentsCancelLocation);
                } else {
                    var editing = $scope.ForecastingOptions.EventProfile && $scope.ForecastingOptions.EventProfile.Id;
                    var confirm: Core.IConfirmation;
                    if (editing) {
                        confirm = {
                            Title: $scope.Translations.CancelEditManualAdjustmentsTitle ,
                            Message: $scope.Translations.CancelEditManualAdjustments ,
                            ConfirmText: $scope.Translations.CancelManualAdjustmentsYes,
                            ConfirmationType: Core.ConfirmationTypeEnum.Positive
                        };
                    } else {
                        confirm = {
                            Title: $scope.Translations.CancelManualAdjustmentsTitle,
                            Message: $scope.Translations.CancelManualAdjustments,
                            ConfirmText: $scope.Translations.CancelManualAdjustmentsYes,
                            ConfirmationType: Core.ConfirmationTypeEnum.Positive
                        };
                    }

                    confirmationService.Confirm( confirm).then((result: boolean): void => {
                        if (result) {
                            $scope.DoClearChanges();
                            forecastingObjectService.EditEventAdjustmentsCompleted(true, newUrl);
                        }
                    });
                }

                return false;
            };

            var clearChanges = (modal: boolean): void => {
                $scope.DoClearChanges();

                if (modal) {
                    $scope.OpenEditDialog($scope.ForecastingOptions.MetricKey, $scope.ForecastingOptions.Metric);
                }

            }

            $scope.ClearChanges = (noPrompt?: boolean, message?: string, modal?: boolean): void => {
                message = message || $scope.Translations.AdjustmentsCancelMessage;

                if (noPrompt) {
                    clearChanges(modal);
                } else {
                    confirmationService.Confirm({
                        Title: $scope.Translations.AdjustmentsCancelTitle,
                        Message: message,
                        ConfirmText: $scope.Translations.AdjustmentsCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(() => {
                        clearChanges(modal);
                    });
                }
            };

            $scope.DoClearChanges = (): void => {
                forecastingObjectService.ClearEdits($scope.ForecastObject);
                if (isSalesItem) {
                    forecastingObjectService.ClearEdits($scope.FOSalesItem);
                }

                if ($scope.ForecastingOptions.MetricKey === Services.MetricType.Events && $scope.ForecastingOptions.EventProfile) {
                    $scope.ForecastingOptions.EventProfile = null;
                }

                if ($scope.IsGraphView && $scope.DayString) {
                    $scope.LoadData();
                }
            };

            $scope.SelectSalesItem = (): void => {
                $modal.open({
                    templateUrl: "/Areas/Forecasting/Templates/SelectSalesItemsDialog.html",
                    controller: "Forecasting.SelectSalesItemController",
                    windowClass: "modal-transparent",
                    resolve: {
                        ForecastSalesItems: (): Services.IForecastSalesItems => { return $scope.ForecastSalesItems; }
                    }
                });
            };

            $scope.SaveChanges = (): void => {
                var fo = $scope.ForecastObject,
                    fos = $scope.FOSalesItem,
                    updateResult;

                if (!isSalesItem) {
                    updateResult = dataService.UpdateMetrics(fo.Forecast.Id, fo.Forecast.Version, fo.Metrics).success((): void => {
                        $scope.ForecastObject.IsDirty = forecastingObjectService.IsDirty($scope.ForecastObject);
                    });
                } else {
                    updateResult = dataService.UpdateSalesItemMetrics(fo.Forecast.Id, $scope.ForecastingOptions.ItemId, fo.Forecast.Version, fos.Metrics).success((): void => {
                        $scope.FOSalesItem.IsDirty = forecastingObjectService.IsDirty($scope.FOSalesItem);
                    });
                }

                updateResult.success((): void => {
                    messageService.ShowSuccess("Changes saved successfully.");
                    $scope.GetForecast();
                    if (isSalesItem) {
                        $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                    }
                }).error((data: any, status: string): void => {
                        switch (String(status)) {
                            case "409":
                                alert(this.$scope.Translations.ForecastExists);
                                if (!isSalesItem) {
                                $scope.LoadData(true);
                                } else {
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

            $scope.SaveAdjustments = (): void => {
                forecastingObjectService.EditEventAdjustmentsCompleted(false);
                $scope.DoClearChanges();
            };

            // #region Sales Item Logic
            $scope.FOSalesItem = null;

            $scope.LoadSalesItems = (entityId: number, forecastId: number): void => {
                var reload = false;
                
                if (!$scope.ForecastSalesItems || $scope.ForecastSalesItems.EntityId !== entityId) {
                    reload = true;
                }

                if (reload) {
                    dataService.GetSalesItemsForForecastData(forecastId).then((salesItemData: any): void => {
                        $scope.ForecastSalesItems = <any>{
                            EntityId: entityId,
                            SalesItems: $filter("orderBy")(salesItemData.data, "Description"),
                            SearchParam: ""
                        };

                        forecastingObjectService.SetCache(Services.CacheName.FCSI, $scope.ForecastSalesItems);

                        if ($scope.ForecastingOptions.ItemId) {
                            $scope.ForecastSalesItems.SelectedSalesItem = _.find($scope.ForecastSalesItems.SalesItems, { Id: $scope.ForecastingOptions.ItemId });
                            if ($scope.ForecastSalesItems.SelectedSalesItem) {
                                $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                            }
                        }
                    });
                }
            };

            $scope.LoadSalesItemData = (salesItem: Api.Models.ISalesItem): void => {
                var fos: Services.IForecastObject, salesItemId = salesItem.Id;

                if ($scope.IsDirty()) {
                    if (!$scope.ShouldCancelAdjustments()) {
                        return;
                    }
                }

                $scope.ForecastingOptions.ItemId = salesItemId;
                dataService.GetSalesItemMetrics($scope.ForecastObject.Forecast.Id, salesItem.Id).success((metrics: any): void => {
                    if (metrics.IntervalStarts.length > 0) {
                        messageService.Dismiss();
                        $scope.HasData = true;
                    } else {
                        this.AlertNoData(true);
                       $scope.ForecastSalesItems.SelectedSalesItem = salesItem;
                        return;
                    }

                    fos = <Services.IForecastObject>{
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

                    $scope.FOSalesItem = forecastingObjectService.SetCache(Services.CacheName.FCS, fos);
                    if (isSalesItem) {
                        $scope.SetData(fos);
                    }
                })
                    .error((): void => {
                        this.messageService.ShowError(this.$scope.Translations.GenericErrorMessage);
                    });
            };

            $scope.$watch("ForecastSalesItems.SelectedSalesItem", (salesItem: Api.Models.ISalesItem): void => {
                if (isSalesItem && salesItem) {
                    $scope.LoadSalesItemData(salesItem);
                }
            }, false);

            // #endregion

            $scope.ResetForecasts = (): void => {
                    var fo = $scope.ForecastObject;

                if (confirm($scope.Translations.HistoryConfirmation)) {
                    dataService.RevertForecast(fo.Forecast.Id, fo.Forecast.Version).then((ver: any): void => {
                        if (ver.data > fo.Forecast.Version) {
                            $scope.HasData = true;
                            if (!isSalesItem) {
                                $scope.ForecastObject = null;
                                $scope.FOSalesItem = null;

                                forecastingObjectService.ClearCache([Services.CacheName.FC, Services.CacheName.FCS]);
                            }
                            $scope.GetForecast();
                            if (isSalesItem) {
                                $scope.LoadSalesItemData($scope.ForecastSalesItems.SelectedSalesItem);
                            }
                            this, messageService.ShowSuccess($scope.Translations.HistorySuccessful);
                        } else {
                            this.messageService.ShowWarning(this.$scope.Translations.ForecastExists);
                            $scope.LoadData(true);
                        }
                    });
                }
            };

            // #region Page Redirection Logic
            $scope.$on("$locationChangeSuccess", (e: ng.IAngularEvent, newUrl: string, oldUrl: string): void => {
                var editorRegex = /\/Forecasting\/Editor/i,
                    fo;

                if (editorRegex.test(newUrl)) {
                    fo = $scope.ForecastObject;
                    if (fo) {
                        $scope.SetData(fo);
                    }

                    $(":focus").blur();
                }
            });

            $scope.$on("$locationChangeStart", (e: ng.IAngularEvent, newUrl: string, oldUrl: string): void => {
                var forecastingRegex = /\/Forecasting\/Editor|\/Forecasting\/History/i,
                    gridRegex = /Grid/i,
                    salesItemRegex = /\/SalesItems/i;

                if (!forecastingRegex.test(newUrl)) {
                    localStorage.removeItem("DateMenu.DateString");
                }

                // ignore grid zooming
                if (gridRegex.test(newUrl) && gridRegex.test(oldUrl)) {
                    return;
                }

                if ($scope.ForecastSalesItems && !salesItemRegex.test(newUrl)) {
                    $scope.ForecastSalesItems.SelectedSalesItem = null;
                    $scope.ForecastSalesItems.SelectedDescription = null;
                }
                
                if (!$scope.IsDirty()) {
                    return;
                } else {
                    newUrl = newUrl.substring(newUrl.indexOf("/#/") + 2);

                    if (!$scope.ShouldCancelAdjustments(newUrl)) {
                        e.preventDefault();
                        return;
                    }
                }

                $scope.DoClearChanges();

                messageService.Dismiss();
            });

            $scope.$on("$destroy", (): void => {
                ;
            });

            // #endregion

            // #region  Calendar               
            $scope.OnDatePickerChange = (selectedDate: Date): void => {
                var dateString = moment(selectedDate).format(calendarDateFormat);
                if ($scope.DayString !== dateString) {
                    this.SetDayString(dateString);
                }
                localStorage.setItem("DateMenu.DateString", $scope.DayString);
                $scope.LoadData();
            };
            // #endregion

            $scope.ParseLocation($location.url(), $routeParams);

            if ($scope.ForecastingOptions.MetricKey !== Services.MetricType.Events ||
                    $scope.ForecastingOptions.EventProfile !== undefined) {
                $scope.LoadData();
            }
        }

        AlertNoData(skipMessage: boolean): void {
            this.$scope.HasData = false;
            this.$scope.IsLocked = true;

            this.$scope.HasForecast = skipMessage;
        }

        SetDayString(dayString: string): void {
            var prevent = false;
            if (this.$scope.IsDirty()) {
                prevent = !this.$scope.ShouldCancelAdjustments();
            }
            if (!prevent) {
                this.$scope.DayStringInvalid = false;
                this.$scope.DayString = dayString;
            } else {
                this.$scope.ForecastPickerOptions.Date = new Date(this.$scope.DayString);
            }
        }
    }

    Core.NG.ForecastingModule.RegisterRouteController("Editor/Graph/:metric", "Templates/ForecastView.html", ForecastController,
        Core.NG.$typedScope<IForecastControllerScope>(),
        Core.NG.$typedStateParams<IForecastControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$state,
        Core.NG.$filter);

    Core.NG.ForecastingModule.RegisterRouteController("Editor/Graph/:metric/:id{IgnoreSlash:/?}{part:.*}", "Templates/ForecastView.html", ForecastController,
        Core.NG.$typedScope<IForecastControllerScope>(),
        Core.NG.$typedStateParams<IForecastControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$state,
        Core.NG.$filter);

    Core.NG.ForecastingModule.RegisterRouteController("Editor/Grid/:metric", "Templates/ForecastView.html", ForecastController,
        Core.NG.$typedScope<IForecastControllerScope>(),
        Core.NG.$typedStateParams<IForecastControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$state,
        Core.NG.$filter);

    Core.NG.ForecastingModule.RegisterRouteController("Editor/Grid/:metric/:id{IgnoreSlash:/?}{part:.*}", "Templates/ForecastView.html", ForecastController,
        Core.NG.$typedScope<IForecastControllerScope>(),
        Core.NG.$typedStateParams<IForecastControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$state,
        Core.NG.$filter);

    Core.NG.ForecastingModule.RegisterNamedController("ForecastController", ForecastController,
        Core.NG.$typedScope<IForecastControllerScope>(),
        Core.NG.$typedStateParams<IForecastControllerRouteParams>(),
        Core.NG.$location,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.$translation,
        Core.$popupMessageService,
        Forecasting.Services.$dataService,
        Forecasting.Services.$forecastingObjectService,
        Core.NG.$state,
        Core.NG.$filter);
}