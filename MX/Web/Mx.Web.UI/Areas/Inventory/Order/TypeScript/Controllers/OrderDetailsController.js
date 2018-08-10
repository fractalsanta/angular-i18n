var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var OrderDetailsController = (function () {
            function OrderDetailsController($scope, $routeParams, popupService, $modalService, $filter, translationService, orderUpdateService, userSettingService, stateService, constants, $authService, confirmation, $orderService, $periodCloseService) {
                var _this = this;
                this.$scope = $scope;
                this.$filter = $filter;
                this.orderUpdateService = orderUpdateService;
                this.userSettingService = userSettingService;
                this.stateService = stateService;
                this.confirmation = confirmation;
                this.SetAllQuantitiesAreValid = function () {
                    var currentOrders = _this.$scope.OrderData.Details;
                    _this.$scope.AllQuantitiesAreValid = true;
                    for (var i = 0; i < currentOrders.length; i += 1) {
                        var orderWithValidation = currentOrders[i];
                        _this.SetQuantityIsValidAndErrorMessage(orderWithValidation);
                        if (!orderWithValidation.QuantityIsValid) {
                            _this.$scope.AllQuantitiesAreValid = false;
                            break;
                        }
                    }
                };
                this.SetQuantityIsValidAndErrorMessage = function (entity) {
                    var min = entity.MinOrderQty, max = entity.MaxOrderQty, quantity = Number(entity.PurchaseUnitQuantity);
                    if (quantity === 0) {
                        entity.QuantityIsValid = true;
                        entity.ErrorMessage = "";
                    }
                    else if ((quantity < min && min !== 0) || (quantity > max && max !== 0)) {
                        entity.QuantityIsValid = false;
                        if (max === 0) {
                            entity.ErrorMessage = _this.$scope.Translations.InvalidQuantityMessageNoMax.format(min);
                        }
                        else {
                            entity.ErrorMessage = _this.$scope.Translations.InvalidQuantityMessage.format(min, max);
                        }
                    }
                    else {
                        entity.QuantityIsValid = true;
                        entity.ErrorMessage = "";
                    }
                };
                this.Initialize();
                this.SetupWatches();
                this.$scope.CanAddItems = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanAddItemToOrder);
                this.$scope.PeriodClosed = false;
                $scope.AddNewItems = function () {
                    var addItemModel = {
                        ExistingCodes: _.map($scope.OriginalDetails, function (item) { return item.ItemCode; }),
                        VendorId: $scope.OrderData.VendorId
                    };
                    $modalService.open({
                        templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                        controller: "Inventory.AddItemsControllerOrderDetails",
                        resolve: {
                            addItemModel: function () { return addItemModel; }
                        }
                    }).result.then(function (items) {
                        var codes = _.map(items, function (item) { return item.Code; });
                        return orderUpdateService.OrderAddItems($scope.OrderData.Id, codes);
                    }).then(function (items) {
                        $.each(items, function (item, detail) {
                            var add = detail;
                            add.Updateable = true;
                            $scope.CurrentPageDetails.unshift(add);
                            $scope.OrderData.Details.unshift(add);
                            _this._originalValues[add.Id] = add.PurchaseUnitQuantity;
                            _this._detailMap[add.Id] = add;
                            _this.$scope.OriginalDetails.push(add);
                            _this.FilterItems(null);
                        });
                        if (_this.$scope.RefreshTableHeaders.call != null) {
                            _this.$scope.RefreshTableHeaders.call();
                        }
                    });
                };
                $scope.ClearFilter = function () {
                    $scope.FilterText = $scope.Translations.AllItems;
                    _this._filteringItems = false;
                    _this.FilterItems($scope.FilterOptions.filterText);
                };
                $scope.FilterItemsInOrder = function () {
                    $scope.FilterText = $scope.Translations.ItemsInOrder;
                    _this._filteringItems = true;
                    _this.FilterItems($scope.FilterOptions.filterText);
                };
                $scope.ClearCategoryFilter = function () {
                    $scope.CategoryText = $scope.Translations.AllCategories;
                    _this._currentCategory = null;
                    _this.FilterItems($scope.FilterOptions.filterText);
                };
                $scope.SetCategory = function (category) {
                    $scope.CategoryText = category.Name;
                    _this._currentCategory = category;
                    _this.FilterItems($scope.FilterOptions.filterText);
                };
                $scope.RecalculateTotals = function (entity) {
                    entity.ExtendedAmount = entity.UnitPrice * entity.PurchaseUnitQuantity;
                    var totalInOrder = 0, caseSum = 0, orderTotal = 0;
                    _.each($scope.OrderData.Details, function (entry) {
                        if (Number(entry.PurchaseUnitQuantity) > 0) {
                            totalInOrder += 1;
                            caseSum += Number(entry.PurchaseUnitQuantity);
                            orderTotal += entry.ExtendedAmount;
                        }
                        else if (!entry.PurchaseUnitQuantity) {
                            entry.PurchaseUnitQuantity = 0;
                        }
                    });
                    $scope.OrderData.ItemsInOrder = totalInOrder;
                    $scope.OrderData.TotalAmount = orderTotal;
                    $scope.TotalCases = Math.round(caseSum * 100) / 100;
                    _this.SetQuantityIsValidAndErrorMessage(entity);
                    $scope.UpdateSelectedDetails(null, entity);
                };
                $scope.SendDetailUpdate = function (orderItem) {
                    if (_this._originalValues[orderItem.Id] !== orderItem.PurchaseUnitQuantity) {
                        orderItem.PurchaseUnitQuantity = Number(orderItem.PurchaseUnitQuantity);
                        _this._originalValues[orderItem.Id] = orderItem.PurchaseUnitQuantity;
                        _this.orderUpdateService.PushUpdate(orderItem.Id, orderItem.SupplyOrderDetailId, orderItem.PurchaseUnitQuantity);
                    }
                };
                $scope.FinishNow = function () {
                    var anyItemsOrdered = _.any($scope.OrderData.Details, function (entry) {
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
                    modal.result.then(function (finishResult) {
                        _this.orderUpdateService.PostCreateSupplyOrder($scope.OrderData.Id, finishResult.AutoReceive, finishResult.InvoiceNumber, moment(finishResult.ReceiveTime).format(constants.InternalDateTimeFormat))
                            .then(function (result) {
                            var failed = false, eoresult = result.ElectronicOrderResult;
                            if (eoresult != null) {
                                if (!eoresult.OrderSent) {
                                    popupService.ShowError(eoresult.OrderError || $scope.Translations.GenericElectronicOrderError);
                                    failed = true;
                                }
                                else if (eoresult.OrderError) {
                                    popupService.ShowWarning(eoresult.OrderError);
                                    failed = true;
                                }
                            }
                            if (failed) {
                                $scope.RefreshOrder();
                            }
                            else {
                                popupService.ShowSuccess($scope.Translations.OrderPlacedSuccessfully.format(result.SupplyOrderId));
                                _this.stateService.go("^");
                            }
                        })
                            .catch(function (result) {
                            switch (String(result.status)) {
                                case "409":
                                    popupService.ShowWarning(_this.$scope.Translations.OrderConflictError);
                                    _this.$scope.RefreshOrder();
                                    break;
                                default:
                                    popupService.ShowError(_this.$scope.Translations.GenericCreateOrderError);
                                    break;
                            }
                        });
                    });
                };
                $scope.Delete = function () {
                    confirmation.Confirm({
                        Title: $scope.Translations.DeleteOrder,
                        Message: $scope.Translations.ConfirmDeleteOrder,
                        ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                        ConfirmText: $scope.Translations.Delete
                    }).then(function () {
                        $orderService.DeleteOrder($scope.OrderData.Id).then(function () {
                            stateService.go(Core.UiRouterState.OrderStates.Place);
                            popupService.ShowSuccess($scope.Translations.OrderNumber + " " +
                                $scope.OrderData.Id + " " +
                                $scope.Translations.DeletedSuccessfully);
                        });
                    });
                };
                $scope.RefreshOrder = function () {
                    _this.orderUpdateService.GetOrder($routeParams.OrderId).then(function (result) {
                        if (result == null) {
                            return;
                        }
                        $scope.OrderData = result;
                        $scope.IsReadOnly = ($scope.OrderData.Id !== $scope.OrderData.DisplayId);
                        $scope.OriginalDetails = $scope.OrderData.Details.slice(0);
                        _this._originalValues = {};
                        _this._detailMap = {};
                        _.each($scope.OriginalDetails, function (orderItem) {
                            _this._originalValues[orderItem.Id] = orderItem.PurchaseUnitQuantity;
                            _this._detailMap[orderItem.Id] = orderItem;
                            _this.SetQuantityIsValidAndErrorMessage(orderItem);
                        });
                        _this.SetAllQuantitiesAreValid();
                        $scope.ClearFilter();
                        $scope.ClearCategoryFilter();
                        if (!$scope.ConversionRatesValid()) {
                            popupService.ShowError($scope.Translations.ConversionRatesMissing);
                        }
                    });
                };
                $scope.OnInputSelect = function (detail) {
                    $scope.UpdateSelectedDetails(null, detail);
                };
                $scope.OnRowSelect = function (e) {
                    var row = $(e.target).closest("tr"), id = row.attr("data-id"), detail = _this._detailMap[id];
                    $scope.UpdateSelectedDetails(e, detail);
                };
                $scope.IsOfflineMode = function () {
                    return _this.orderUpdateService.IsOfflineMode();
                };
                $scope.GetItemOrderHistory = function (entity) {
                    if (!_this.orderUpdateService.IsOfflineMode()) {
                        _this.orderUpdateService.GetOrderItemHistory(entity.Id).then(function (result) {
                            $scope.ItemOrderHistoryList[entity.Id] = result;
                        });
                    }
                };
                $scope.UpdateSelectedDetails = function (e, orderItem) {
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
                        $scope.SelectedItemDetails = _.map($scope.ColumnDefinitions.slice(3), function (entry) {
                            return {
                                Name: $scope.Translations[entry.HeaderKey],
                                Value: (entry.Filter) ? $filter(entry.Filter)(orderItem[entry.FieldKey]) : orderItem[entry.FieldKey]
                            };
                        });
                    }
                    _this.SetAllQuantitiesAreValid();
                };
                $scope.OpenColumnConfig = function () {
                    var modal = $modalService.open({
                        templateUrl: "/Areas/Inventory/Order/Templates/ConfigureColumns.html",
                        controller: "Inventory.Order.ConfigureColumnsController",
                        resolve: {
                            columnDefinitions: function () { return $scope.ColumnDefinitions; }
                        }
                    });
                    modal.result.then(function (result) {
                        if (result) {
                            var columnDefinitionAsJSON = JSON.stringify(result);
                            userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.OrderColumnPreferences, columnDefinitionAsJSON);
                            $scope.ColumnDefinitions = result;
                            $scope.UpdateSelectedDetails(null, $scope.SelectedItem);
                        }
                    });
                };
                $scope.SetOrderDetailItemCss = function (detailItem) {
                    if (detailItem.ConversionRate == 0)
                        return "warning";
                    return ($scope.SelectedItem == detailItem ? "info" : "");
                };
                $scope.ConversionRatesValid = function () {
                    return !_.any($scope.OrderData.Details, function (d) { return d.ConversionRate == 0; });
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                    popupService.SetPageTitle($scope.Translations.OrderDetails);
                    $scope.ClearFilter();
                    $scope.ClearCategoryFilter();
                });
                $scope.RefreshOrder();
                $orderService.GetStoreLocalDateTimeString()
                    .success(function (result) {
                    $periodCloseService.GetPeriodLockStatus($authService.GetUser().BusinessUser.MobileSettings.EntityId, moment(result).format(constants.InternalDateFormat))
                        .success(function (result) {
                        $scope.PeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                        if ($scope.PeriodClosed) {
                            popupService.ShowError(_this.$scope.Translations.PeriodIsClosed);
                        }
                    });
                });
            }
            OrderDetailsController.prototype.Initialize = function () {
                var _this = this;
                this.$scope.$filter = this.$filter;
                this.SetColumnDefinition();
                this.$scope.Translations = {};
                this.$scope.ItemOrderHistoryList = [];
                this.$scope.CurrentPageDetails = [];
                this.$scope.RefreshTableHeaders = { call: null };
                var itemsPerPage = 50;
                this.$scope.ChangePage = function (page) {
                    _this.$scope.CurrentPage = page;
                    var index = (page - 1) * itemsPerPage;
                    _this.$scope.CurrentPageDetails =
                        _this.$scope.OrderData.Details.slice(index, index + itemsPerPage);
                };
                this.$scope.PagingOptions = {
                    itemsPerPage: itemsPerPage,
                    numPages: 5
                };
                this.$scope.FilterOptions = {
                    filterText: ""
                };
            };
            OrderDetailsController.prototype.SetupWatches = function () {
                var _this = this;
                this.$scope.$watch("FilterOptions.filterText", function (value) {
                    _this.FilterItems(value);
                });
                this.$scope.$watchCollection("OrderData.Details", function () {
                    $(window).resize();
                });
                this.$scope.$watchCollection('ColumnDefinitions', function () {
                    if (_this.$scope.RefreshTableHeaders.call != null) {
                        _this.$scope.RefreshTableHeaders.call();
                    }
                });
            };
            OrderDetailsController.prototype.SetColumnDefinition = function () {
                var _this = this;
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
                this.userSettingService.GetUserSetting(userSettingType).then(function (result) {
                    var savedDefinitions = result;
                    if (!result || (typeof result === "string" && !result.trim())) {
                        _this.$scope.ColumnDefinitions = defaultColumnDefinition;
                        var defaultColumnDefinitionAsJSON = JSON.stringify(defaultColumnDefinition);
                        _this.userSettingService.SetUserSetting(userSettingType, defaultColumnDefinitionAsJSON);
                    }
                    else {
                        _this.$scope.ColumnDefinitions = JSON.parse(savedDefinitions);
                    }
                }).catch(function () {
                    _this.$scope.ColumnDefinitions = defaultColumnDefinition;
                });
            };
            OrderDetailsController.prototype.FilterItems = function (filterText) {
                var _this = this;
                var categoryTotals = {}, totalItems = 0, totalCases = 0;
                if (!this.$scope.OrderData) {
                    return;
                }
                filterText = filterText == null ? "" : filterText.trim().toLocaleLowerCase();
                this.$scope.OrderData.Details = _.filter(this.$scope.OriginalDetails, function (entry) {
                    if (categoryTotals[entry.CategoryId] === undefined) {
                        categoryTotals[entry.CategoryId] = 0;
                    }
                    if (_this._filteringItems && entry.PurchaseUnitQuantity <= 0) {
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
                    if (_this._currentCategory && entry.CategoryId !== _this._currentCategory.CategoryId) {
                        return false;
                    }
                    return true;
                });
                _.each(this.$scope.OrderData.Categories, function (entry) {
                    entry.TotalItems = categoryTotals[entry.CategoryId];
                });
                this.$scope.TotalItems = totalItems;
                this.$scope.TotalCases = Math.round(totalCases * 100) / 100;
                this.$scope.ChangePage(1);
            };
            return OrderDetailsController;
        }());
        Order.orderDetailController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderDetailController", OrderDetailsController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.$popupMessageService, Core.NG.$modal, Core.NG.$filter, Core.$translation, Order.Services.$orderUpdateService, Administration.User.Services.$userSettingService, Core.NG.$state, Core.Constants, Core.Auth.$authService, Core.$confirmationService, Order.$orderService, Workforce.PeriodClose.Api.$periodCloseService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
