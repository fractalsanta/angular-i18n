module Inventory.Order {
    "use strict";

    export interface IColumnDefinition {
        HeaderKey: string;
        FieldKey: string;
        Filter?: string;
    }

    interface IOrderDetailUpdate extends Api.Models.IOrderDetail {
        Updateable: boolean;
    }

    class OrderDetailsController {
        private _currentCategory: Api.Models.ICategory;
        private _originalValues: {};
        private _detailMap: {};
        private _filteringItems: boolean;

        private Initialize() {

            this.$scope.$filter = this.$filter;

            this.SetColumnDefinition();

            this.$scope.Translations = <Api.Models.IL10N>{};
            this.$scope.ItemOrderHistoryList = [];
            this.$scope.CurrentPageDetails = [];
            this.$scope.RefreshTableHeaders = { call: null };

            var itemsPerPage = 50;
            this.$scope.ChangePage = (page: number): void => {
                this.$scope.CurrentPage = page;
                var index = (page - 1) * itemsPerPage;
                this.$scope.CurrentPageDetails =
                    this.$scope.OrderData.Details.slice(index, index + itemsPerPage);
            };

            this.$scope.PagingOptions = <ng.ui.bootstrap.IPaginationConfig>{
                itemsPerPage: itemsPerPage,
                numPages: 5
            };

            this.$scope.FilterOptions = {
                filterText: ""
            };            
        }

        private SetupWatches() {
            this.$scope.$watch("FilterOptions.filterText", (value: string): void => {
                this.FilterItems(value);
            });

            this.$scope.$watchCollection("OrderData.Details", (): void => {
                $(window).resize();
            });

            // whenever the user selects what columns to display on screen we must
            // recalculate the table headers
            this.$scope.$watchCollection('ColumnDefinitions', () => {
                if (this.$scope.RefreshTableHeaders.call != null) {
                    this.$scope.RefreshTableHeaders.call();
                }
            });
        }

        constructor(
            private $scope: IOrderDetailsControllerScope,
            $routeParams: IOrderDetailsControllerRouteParams,
            popupService: Core.IPopupMessageService,
            $modalService: ng.ui.bootstrap.IModalService,
            private $filter: ng.IFilterService,
            translationService: Core.ITranslationService,
            private orderUpdateService: Services.IOrderUpdateService,
            private userSettingService: Administration.User.Services.IUserSettingsService,
            private stateService: ng.ui.IStateService,
            constants: Core.IConstants,
            $authService: Core.Auth.IAuthService,
            private confirmation: Core.IConfirmationService,
            $orderService: Order.IOrderService,
            $periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService
            ) {

            this.Initialize();
            this.SetupWatches();
            this.$scope.CanAddItems = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanAddItemToOrder);
            this.$scope.PeriodClosed = false;

            $scope.AddNewItems = () => {

                var addItemModel = <IAddItemModel>{
                    ExistingCodes: _.map($scope.OriginalDetails, (item) => item.ItemCode),
                    VendorId: $scope.OrderData.VendorId
                };

                $modalService.open({
                    templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                    controller: "Inventory.AddItemsControllerOrderDetails",
                    resolve: {
                        addItemModel: () => { return addItemModel; }
                    }
                }).result.then((items: IAddItemOrdering[]) => {
                    var codes = _.map(items, (item) => item.Code);
                    return orderUpdateService.OrderAddItems($scope.OrderData.Id, codes);
                }).then((items: Api.Models.IOrderDetail[]) => {
                    $.each(items, (item: number, detail: Api.Models.IOrderDetail) => {                        
                        var add = <IOrderDetailUpdate>detail;
                        add.Updateable = true;
                        $scope.CurrentPageDetails.unshift(add);
                        $scope.OrderData.Details.unshift(add);
                        this._originalValues[add.Id] = add.PurchaseUnitQuantity;
                        this._detailMap[add.Id] = add;

                        this.$scope.OriginalDetails.push(add);
                        this.FilterItems(null);
                    });
                    if (this.$scope.RefreshTableHeaders.call != null) {
                        this.$scope.RefreshTableHeaders.call();
                    }
                });
            };

            $scope.ClearFilter = (): void => {
                $scope.FilterText = $scope.Translations.AllItems;
                this._filteringItems = false;
                this.FilterItems($scope.FilterOptions.filterText);
            };

            $scope.FilterItemsInOrder = (): void => {
                $scope.FilterText = $scope.Translations.ItemsInOrder;
                this._filteringItems = true;
                this.FilterItems($scope.FilterOptions.filterText);
            };

            $scope.ClearCategoryFilter = (): void => {
                $scope.CategoryText = $scope.Translations.AllCategories;

                this._currentCategory = null;
                this.FilterItems($scope.FilterOptions.filterText);
            };

            $scope.SetCategory = (category: Api.Models.ICategory): void => {
                $scope.CategoryText = category.Name;

                this._currentCategory = category;
                this.FilterItems($scope.FilterOptions.filterText);
            };

            $scope.RecalculateTotals = (entity: Api.Models.IOrderDetail): void => {
                entity.ExtendedAmount = entity.UnitPrice * entity.PurchaseUnitQuantity;

                var totalInOrder = 0,
                    caseSum = 0,
                    orderTotal = 0;

                _.each($scope.OrderData.Details, (entry: Api.Models.IOrderDetail): void => {
                    if (Number(entry.PurchaseUnitQuantity) > 0) {
                        totalInOrder += 1;
                        caseSum += Number(entry.PurchaseUnitQuantity);
                        orderTotal += entry.ExtendedAmount;
                    } else if(! entry.PurchaseUnitQuantity) {
                        entry.PurchaseUnitQuantity = 0;
                    }
                });

                $scope.OrderData.ItemsInOrder = totalInOrder;
                $scope.OrderData.TotalAmount = orderTotal;
                $scope.TotalCases = Math.round(caseSum * 100) / 100;

                this.SetQuantityIsValidAndErrorMessage(<IOrderDetailWithValidation>entity);
                $scope.UpdateSelectedDetails(null, entity);
            };

            $scope.SendDetailUpdate = (orderItem: Api.Models.IOrderDetail): void => {
                if (this._originalValues[orderItem.Id] !== orderItem.PurchaseUnitQuantity) {
                    orderItem.PurchaseUnitQuantity = Number(orderItem.PurchaseUnitQuantity);
                    this._originalValues[orderItem.Id] = orderItem.PurchaseUnitQuantity;
                    this.orderUpdateService.PushUpdate(orderItem.Id, orderItem.SupplyOrderDetailId, orderItem.PurchaseUnitQuantity);
                }
            };

            $scope.FinishNow = (): void => {
                var anyItemsOrdered = _.any($scope.OrderData.Details, (entry: Api.Models.IOrderDetail): boolean => {
                    return entry.PurchaseUnitQuantity > 0;
                });

                if (!anyItemsOrdered) {
                    popupService.ShowWarning($scope.Translations.Youmustorderatleastoneitem);
                    return;
                }

                var modal = $modalService.open({
                    templateUrl: "/Areas/Inventory/Order/Templates/FinishOrder.html",
                    controller: "Inventory.Order.FinishOrderController",
                    size: "sm"
                });

                modal.result.then((finishResult: IFinishOrderResult): void => {
                    this.orderUpdateService.PostCreateSupplyOrder(
                        $scope.OrderData.Id,
                        finishResult.AutoReceive,
                        finishResult.InvoiceNumber,
                        moment(finishResult.ReceiveTime).format(constants.InternalDateTimeFormat))
                        .then(result => {
                            var failed = false,
                                eoresult = result.ElectronicOrderResult;

                            if (eoresult != null) {
                                if (!eoresult.OrderSent) {
                                    popupService.ShowError(
                                        eoresult.OrderError || $scope.Translations.GenericElectronicOrderError);
                                    failed = true;
                                } else if (eoresult.OrderError) {
                                    popupService.ShowWarning(eoresult.OrderError);
                                    failed = true;
                                }
                            }

                            if (failed) {
                                $scope.RefreshOrder();
                            } else {
                                popupService.ShowSuccess(
                                    $scope.Translations.OrderPlacedSuccessfully.format(result.SupplyOrderId));
                                    this.stateService.go("^");
                            }
                        })
                        .catch((result: any): void => {
                            switch (String(result.status)) {
                                case "409":
                                    popupService.ShowWarning(this.$scope.Translations.OrderConflictError);
                                    this.$scope.RefreshOrder();
                                    break;
                                default:
                                    popupService.ShowError(this.$scope.Translations.GenericCreateOrderError);
                                    break;
                            }
                        });
                });
            };

            $scope.Delete = (): void => {
                confirmation.Confirm({
                    Title: $scope.Translations.DeleteOrder,
                    Message: $scope.Translations.ConfirmDeleteOrder,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                    ConfirmText: $scope.Translations.Delete
                }).then((): void => {
                    $orderService.DeleteOrder($scope.OrderData.Id).then(() => {
                            stateService.go(Core.UiRouterState.OrderStates.Place);
                            popupService.ShowSuccess(
                                $scope.Translations.OrderNumber + " " +
                                $scope.OrderData.Id + " " +
                                $scope.Translations.DeletedSuccessfully);
                        });
                    });
            };

            $scope.RefreshOrder = (): void => {
                this.orderUpdateService.GetOrder($routeParams.OrderId).then(result => {
                    if (result == null) {
                        return;
                    }
                    $scope.OrderData = result;
                    $scope.IsReadOnly = ($scope.OrderData.Id !== $scope.OrderData.DisplayId);
                    $scope.OriginalDetails = $scope.OrderData.Details.slice(0);

                    this._originalValues = {};
                    this._detailMap = {};

                    _.each($scope.OriginalDetails, (orderItem: Api.Models.IOrderDetail): void => {
                        this._originalValues[orderItem.Id] = orderItem.PurchaseUnitQuantity;
                        this._detailMap[orderItem.Id] = orderItem;
                        this.SetQuantityIsValidAndErrorMessage(<IOrderDetailWithValidation>orderItem);
                    });

                    this.SetAllQuantitiesAreValid();

                    $scope.ClearFilter();
                    $scope.ClearCategoryFilter();

                    if (!$scope.ConversionRatesValid()) {
                        popupService.ShowError($scope.Translations.ConversionRatesMissing);
                    }
                });
            };

            $scope.OnInputSelect = (detail: Api.Models.IOrderDetail): void => {
                $scope.UpdateSelectedDetails(null, detail);
            };

            $scope.OnRowSelect = (e: Event): void => {
                var row = $(e.target).closest("tr"),
                    id = row.attr("data-id"),
                    detail = <Api.Models.IOrderDetail>this._detailMap[id];

                $scope.UpdateSelectedDetails(e, detail);

            };

            $scope.IsOfflineMode = (): boolean => {
                return this.orderUpdateService.IsOfflineMode();
            }

                $scope.GetItemOrderHistory = (entity: Api.Models.IOrderDetail): void  => {
                if (!this.orderUpdateService.IsOfflineMode()) {
                    this.orderUpdateService.GetOrderItemHistory(entity.Id).then(result => {
                        $scope.ItemOrderHistoryList[entity.Id] = result;
                    });
                }
            };

            $scope.UpdateSelectedDetails = (e: Event, orderItem: Api.Models.IOrderDetail): void => {
                if (e) {
                    e.stopPropagation();
                }

                if (!orderItem || ($scope.SelectedItem === orderItem && e)) {
                    return;
                }

                if (!$scope.ItemOrderHistoryList[orderItem.Id]) {
                    $scope.GetItemOrderHistory(orderItem);
                }

                $scope.SelectedItem = orderItem;

                if ($scope.ColumnDefinitions) {
                    $scope.SelectedItemDetails = _.map($scope.ColumnDefinitions.slice(3), (entry: IColumnDefinition): any => {
                        return {
                            Name: $scope.Translations[entry.HeaderKey],
                            Value: (entry.Filter) ? (<ng.IFilterNumber>$filter(entry.Filter))(orderItem[entry.FieldKey]) : orderItem[entry.FieldKey]
                        };
                    });
                }

                this.SetAllQuantitiesAreValid();
            };
            
            $scope.OpenColumnConfig = (): void => {
                var modal = $modalService.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Inventory/Order/Templates/ConfigureColumns.html",
                    controller: "Inventory.Order.ConfigureColumnsController",
                    resolve: {
                        columnDefinitions: (): IColumnDefinition[]=> { return $scope.ColumnDefinitions; }
                    }
                });

                modal.result.then((result: IColumnDefinition[]): void => {
                    if (result) {
                        var columnDefinitionAsJSON = JSON.stringify(result);
                        userSettingService.SetUserSetting(
                            Administration.User.Api.Models.UserSettingEnum.OrderColumnPreferences,
                            columnDefinitionAsJSON);

                        $scope.ColumnDefinitions = result;
                        $scope.UpdateSelectedDetails(null, $scope.SelectedItem);
                    }
                });
            };

            $scope.SetOrderDetailItemCss = (detailItem: Api.Models.IOrderDetail): string => {
                if (detailItem.ConversionRate == 0)
                    return "warning";

                return ($scope.SelectedItem == detailItem ? "info" : "");
            }

            $scope.ConversionRatesValid = (): boolean => {
                return !_.any($scope.OrderData.Details, d => d.ConversionRate == 0);
            }

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.InventoryOrder;

                popupService.SetPageTitle($scope.Translations.OrderDetails);

                $scope.ClearFilter();
                $scope.ClearCategoryFilter();
            });

            $scope.RefreshOrder();

            // set period closed for the stores current time
            $orderService.GetStoreLocalDateTimeString()
                .success((result) => {
                    $periodCloseService.GetPeriodLockStatus($authService.GetUser().BusinessUser.MobileSettings.EntityId, moment(result).format(constants.InternalDateFormat))
                        .success((result) => {
                            $scope.PeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));

                            if ($scope.PeriodClosed) {
                                popupService.ShowError(this.$scope.Translations.PeriodIsClosed);
                            }
                        });
                });            
        }

        SetColumnDefinition(): void {
            var defaultColumnDefinition = [
                { HeaderKey: "OnOrder", FieldKey: "OnOrderQuantity" },
                { HeaderKey: "Forecast", FieldKey: "Usage" },
                { HeaderKey: "BuildTo", FieldKey: "BuildToLevelQty" },
                { HeaderKey: "OnHand", FieldKey: "OnHandQuantity" },
                { HeaderKey: "Price", FieldKey: "UnitPrice", Filter: "currency" },
                { HeaderKey: "ExtendedPrice", FieldKey: "ExtendedAmount", Filter: "currency" },
                { HeaderKey: "Min", FieldKey: "MinOrderQty" },
                { HeaderKey: "Max", FieldKey: "MaxOrderQty" },
                { HeaderKey: "Taxable", FieldKey: "TaxableFlag" },
                { HeaderKey: "LastOrder", FieldKey: "LastOrderQuantity" },
                { HeaderKey: "ConversionRate", FieldKey: "ConversionRate" }
            ];
            var userSettingType = Administration.User.Api.Models.UserSettingEnum.OrderColumnPreferences;

            this.userSettingService.GetUserSetting(userSettingType).then(result => {
                var savedDefinitions = result;

                if (!result || (typeof result === "string" && !result.trim())) {
                    this.$scope.ColumnDefinitions = defaultColumnDefinition;
                    var defaultColumnDefinitionAsJSON = JSON.stringify(defaultColumnDefinition);
                    this.userSettingService.SetUserSetting(userSettingType, defaultColumnDefinitionAsJSON);
                } else {
                    this.$scope.ColumnDefinitions = JSON.parse(savedDefinitions);
                }
            }).catch((): void => {
                this.$scope.ColumnDefinitions = defaultColumnDefinition;
            });
        }

        FilterItems(filterText: string): void {
            var categoryTotals = {},
                totalItems = 0,
                totalCases = 0;

            if (!this.$scope.OrderData) {
                return;
            }

            filterText = filterText == null ? "" : filterText.trim().toLocaleLowerCase();

            this.$scope.OrderData.Details = _.filter(this.$scope.OriginalDetails, (entry: Api.Models.IOrderDetail): boolean => {
                if (categoryTotals[entry.CategoryId] === undefined) {
                    categoryTotals[entry.CategoryId] = 0;
                }

                if (this._filteringItems && entry.PurchaseUnitQuantity <= 0) {
                    return false;
                }

                if (filterText &&
                    !(entry.Description.toLocaleLowerCase().indexOf(filterText) > -1
                    || entry.ItemCode.toLocaleLowerCase().indexOf(filterText) > -1)) {
                    return false;
                }

                totalCases += +entry.PurchaseUnitQuantity;
                totalItems += 1;
                categoryTotals[entry.CategoryId] += 1;

                if (this._currentCategory && entry.CategoryId !== this._currentCategory.CategoryId) {
                    return false;
                }

                return true;
            });

            _.each(this.$scope.OrderData.Categories, (entry: Api.Models.ICategory): void => {
                entry.TotalItems = categoryTotals[entry.CategoryId];
            });

            this.$scope.TotalItems = totalItems;
            this.$scope.TotalCases = Math.round(totalCases * 100) / 100;

            this.$scope.ChangePage(1);
        }

        SetAllQuantitiesAreValid = (): void => {
            var currentOrders = this.$scope.OrderData.Details;

            this.$scope.AllQuantitiesAreValid = true;
            for (var i = 0; i < currentOrders.length; i += 1) {
                var orderWithValidation = <IOrderDetailWithValidation>currentOrders[i];
                this.SetQuantityIsValidAndErrorMessage(<IOrderDetailWithValidation>orderWithValidation);

                if (!orderWithValidation.QuantityIsValid) {
                    this.$scope.AllQuantitiesAreValid = false;
                    break;
                }
            }
        };

        SetQuantityIsValidAndErrorMessage = (entity: IOrderDetailWithValidation): void => {
            var min = entity.MinOrderQty,
                max = entity.MaxOrderQty,
                quantity = Number(entity.PurchaseUnitQuantity);

            if (quantity === 0) {
                entity.QuantityIsValid = true;
                entity.ErrorMessage = "";
            }
            else if ( (quantity < min && min !== 0) || (quantity > max && max !== 0)) {
                entity.QuantityIsValid = false;
                if (max === 0) {
                    entity.ErrorMessage = this.$scope.Translations.InvalidQuantityMessageNoMax.format(min);
                } else {                    
                    entity.ErrorMessage = this.$scope.Translations.InvalidQuantityMessage.format(min, max);
                }
            } else {
                entity.QuantityIsValid = true;
                entity.ErrorMessage = "";
            }
        };        
    }

    export var orderDetailController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderDetailController", OrderDetailsController,
        Core.NG.$typedScope<IOrderDetailsControllerScope>(),
        Core.NG.$typedStateParams<IOrderDetailsControllerRouteParams>(),
        Core.$popupMessageService,
        Core.NG.$modal,
        Core.NG.$filter,
        Core.$translation,
        Services.$orderUpdateService,
        Administration.User.Services.$userSettingService,
        Core.NG.$state,
        Core.Constants,
        Core.Auth.$authService,
        Core.$confirmationService,
        Order.$orderService,
        Workforce.PeriodClose.Api.$periodCloseService
        );
}
