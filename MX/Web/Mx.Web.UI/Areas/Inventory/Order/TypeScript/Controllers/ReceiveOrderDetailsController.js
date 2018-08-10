var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReceiveOrderDetailsController = (function () {
            function ReceiveOrderDetailsController($scope, authService, $routeParams, translationService, receiveOrderService, $modal, confirmationService, popupMessageService, stateService, constants, periodCloseService) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.receiveOrderService = receiveOrderService;
                this.$modal = $modal;
                this.confirmationService = confirmationService;
                this.stateService = stateService;
                this.periodCloseService = periodCloseService;
                this._numericInputPattern = new RegExp(constants.NumericalInputBoxPattern);
                $scope.Return = function (skipChanges) {
                    if (!skipChanges && _this.PageIsDirty()) {
                        _this.confirmationService.Confirm({
                            Title: _this.$scope.Translation.DiscardChanges,
                            Message: _this.$scope.Translation.CancelConfirmation,
                            ConfirmText: _this.$scope.Translation.Confirm,
                            ConfirmationType: Core.ConfirmationTypeEnum.Positive
                        }).then(function () {
                            _this.stateService.go(Core.UiRouterState.DefaultMainDetailStates.Main);
                        });
                    }
                    else {
                        _this.stateService.go(Core.UiRouterState.DefaultMainDetailStates.Main);
                    }
                };
                var orderId = Number($routeParams.OrderId);
                if (isNaN(orderId)) {
                    $scope.Return();
                    return;
                }
                $scope.Model = {
                    ReceiveOrder: null,
                    IsReadOnly: true,
                    SearchFilter: "",
                    IsSelectAllItems: false,
                    CanBePushedToTomorrow: false,
                    CanCorrectReceive: false,
                    CanChangeApplyDate: false,
                    InCorrectMode: false,
                    ShowAddItems: false,
                    CanAddItems: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_CanAddItemToReceipt),
                    TotalDeliveryCost: 0,
                    TotalDeliveryCases: 0,
                    IsPeriodClosed: false,
                    CanEditPrice: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_EditPriceOnReceive),
                    CanEditCorrectReceivePrice: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_EditPriceOnCorrectReceive)
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryOrder;
                    popupMessageService.SetPageTitle(result.InventoryOrder.ReceiveOrderDetail);
                    _this.GetReceiveOrder(orderId);
                });
                $scope.AddNewItems = function () {
                    var addItemModel = {
                        ExistingCodes: _.map($scope.Model.ReceiveOrder.Items, function (item) { return item.ItemCode; }),
                        VendorId: $scope.Model.ReceiveOrder.VendorId
                    };
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                        controller: "Inventory.AddItemsControllerOrderDetails",
                        resolve: {
                            addItemModel: function () { return addItemModel; }
                        }
                    }).result.then(function (items) {
                        var codes = _.map(items, function (item) { return item.Code; });
                        return _this.receiveOrderService.OrderAddItems(_this.$scope.Model.ReceiveOrder.Id, codes);
                    }).then(function (newItems) {
                        $.each(newItems, function (item, detail) {
                            _this._initialItemValues[detail.Id] = angular.copy(detail);
                            $scope.Model.ReceiveOrder.Items.unshift(detail);
                            _this.$scope.OriginalDetails.push(detail);
                        });
                        $scope.ClearCategoryFilter();
                    });
                };
                $scope.ActionsEnabled = function () {
                    if (receiveOrderService.IsOffline() || ($scope.Model.ReceiveOrder && $scope.Model.ReceiveOrder.HasBeenCopied)) {
                        return false;
                    }
                    return $scope.AreThereAnyItemsToReceive() ||
                        ($scope.InReceivingMode() && ($scope.Model.CanBePushedToTomorrow ||
                            $scope.Model.CanCorrectReceive ||
                            $scope.AreThereAnyItemsToReceive())) ||
                        $scope.ShowChangeApplyDate() ||
                        $scope.Model.InCorrectMode;
                };
                $scope.HasReceived = function () {
                    return $scope.Model.ReceiveOrder && ($scope.Model.ReceiveOrder.OrderStatus === 5 || $scope.Model.ReceiveOrder.OrderStatus === 9);
                };
                $scope.IsItemReadOnly = function (item) {
                    return (item.Received || $scope.Model.ReceiveOrder.HasBeenCopied);
                };
                $scope.ItemCheckBoxDisable = function (item) {
                    return item.Received || $scope.Model.ReceiveOrder.HasBeenCopied || $scope.Model.InCorrectMode;
                };
                $scope.HasASN = function () {
                    return $scope.Model.ReceiveOrder && $scope.Model.ReceiveOrder.ReceivedShippingNotification;
                };
                $scope.ShowReceiveTextBox = function (item) {
                    return !$scope.Model.ReceiveOrder.HasBeenCopied && (!item.Received || (item.Received && $scope.Model.InCorrectMode));
                };
                $scope.NumericalInputBoxPattern = function () { return _this._numericInputPattern; };
                $scope.AreThereAnyItemsToReceive = function () {
                    if ($scope.Model.ReceiveOrder && $scope.Model.ReceiveOrder.Items && $scope.Model.ReceiveOrder.Items.length) {
                        return _.any($scope.Model.ReceiveOrder.Items, function (item) { return (item.IsReadyToBeReceived && !item.Received); });
                    }
                    return false;
                };
                $scope.SelectAllItems = function () {
                    if (!$scope.Model.ReceiveOrder.HasBeenCopied && !$scope.Model.InCorrectMode) {
                        $scope.Model.IsSelectAllItems = !$scope.Model.IsSelectAllItems;
                        _.forEach($scope.Model.ReceiveOrder.Items, function (item) {
                            if (!item.Received) {
                                item.IsReadyToBeReceived = $scope.Model.IsSelectAllItems;
                            }
                        });
                    }
                };
                $scope.ItemCheckBoxClicked = function (item) {
                    if (!item.Received && !$scope.Model.ReceiveOrder.HasBeenCopied && !$scope.Model.InCorrectMode) {
                        item.IsReadyToBeReceived = !item.IsReadyToBeReceived;
                        $scope.Model.IsSelectAllItems = !_.any($scope.Model.ReceiveOrder.Items, function (x) { return !(x.IsReadyToBeReceived); });
                    }
                };
                $scope.BeginCorrectReceive = function () {
                    $scope.Model.InCorrectMode = true;
                    _this._originalValues = [];
                    _.forEach($scope.Model.ReceiveOrder.Items, function (item) {
                        if (item.Received) {
                            _this._originalValues[item.Id] = item.ReceivedQuantity;
                        }
                    });
                };
                $scope.FinishNow = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Order/Templates/FinishReceiveOrder.html",
                        controller: "Inventory.Order.FinishReceiveOrder",
                        windowClass: "narrow",
                        resolve: {
                            invoiceNumber: function () { return $scope.Model.ReceiveOrder.InvoiceNumber; }
                        }
                    }).result.then(function (result) {
                        if (result != null) {
                            $scope.Model.ReceiveOrder.InvoiceNumber = result.InvoiceNumber;
                            receiveOrderService.FinishReceiveOrder(result.ApplyDate, $scope.Model.ReceiveOrder)
                                .then(function (response) {
                                if (response) {
                                    popupMessageService.ShowSuccess($scope.Translation.ReceiveOrderSubmitInProgress);
                                    $scope.Return(true);
                                }
                                else {
                                    popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                                }
                            });
                        }
                    });
                };
                $scope.ChangeApplyDate = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Order/Templates/ChangeApplyDate.html",
                        controller: "Inventory.Order.ChangeApplyDate",
                        windowClass: "narrow"
                    }).result.then(function (newApplyDate) {
                        if (newApplyDate) {
                            receiveOrderService.ChangeApplyDate(newApplyDate, $scope.Model.ReceiveOrder)
                                .then(function (result) {
                                if (result.NewOrderId) {
                                    popupMessageService.ShowSuccess($scope.Translation.ChangeApplyDateSuccessful.format(result.NewOrderId));
                                    _this.stateService.go(_this.stateService.current.name, { OrderId: result.NewOrderId });
                                }
                                else if (result.IsPeriodClosed) {
                                    popupMessageService.ShowError($scope.Translation.PeriodIsClosed);
                                }
                                else {
                                    popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                                }
                            });
                        }
                    });
                };
                $scope.PushToTomorrow = function () {
                    receiveOrderService.PushOrderToTomorrow($scope.Model.ReceiveOrder).then(function () {
                        popupMessageService.ShowSuccess($scope.Translation.TheOrderHasBeenPushedToTomorrow.format($scope.Model.ReceiveOrder.OrderNumber));
                        $scope.Return();
                    });
                };
                $scope.SaveChanges = function () {
                    var containsErrors = _.any($scope.Model.ReceiveOrder.Items, function (value) {
                        return (!angular.isDefined(value.Price) || value.Price === null) || (!angular.isDefined(value.ReceivedQuantity) || value.ReceivedQuantity === null);
                    });
                    if (!containsErrors) {
                        $scope.PeriodCloseStatusCheckAndSaveChanges();
                    }
                    else {
                        popupMessageService.ShowError($scope.Translation.InvalidHistoricalOrderForm);
                    }
                };
                $scope.Change = function (item) {
                    if (_this.ItemChanged(item)) {
                        item.IsReadyToBeReceived = true;
                        $scope.UpdateTotals();
                    }
                };
                $scope.UpdateTotals = function () {
                    $scope.Model.TotalDeliveryCases = 0;
                    $scope.Model.TotalDeliveryCost = 0;
                    _.each(_this.$scope.Model.ReceiveOrder.Items, function (orderItem) {
                        $scope.Model.TotalDeliveryCases += Number(orderItem.ReceivedQuantity);
                        $scope.Model.TotalDeliveryCost += Number(orderItem.Price) * Number(orderItem.ReceivedQuantity);
                    });
                };
                $scope.CancelChanges = function () {
                    _.forEach($scope.Model.ReceiveOrder.Items, function (item) {
                        if (item.Received && _this._originalValues[item.Id] !== undefined) {
                            item.ReceivedQuantity = _this._originalValues[item.Id];
                        }
                    });
                    _this.ClearCorrectMode();
                };
                $scope.IsOfflineMode = function () {
                    return receiveOrderService.IsOffline();
                };
                $scope.InReceivingMode = function () {
                    return !($scope.Model.InCorrectMode);
                };
                $scope.ShowChangeApplyDate = function () {
                    return $scope.InReceivingMode() && $scope.Model.CanChangeApplyDate;
                };
                $scope.ClearCategoryFilter = function () {
                    $scope.CategoryText = $scope.Translation.AllCategories;
                    _this._currentCategory = null;
                    _this.FilterItems();
                };
                $scope.SetCategory = function (category) {
                    $scope.CategoryText = category.Name;
                    _this._currentCategory = category;
                    _this.FilterItems();
                };
                $scope.PeriodCloseStatusCheckAndSaveChanges = function () {
                    _this.periodCloseService.GetPeriodLockStatus(authService.GetUser().BusinessUser.MobileSettings.EntityId, moment(receiveOrderService.GetLocalStoreDateTimeString()).format(constants.InternalDateFormat))
                        .success(function (result) {
                        $scope.Model.IsPeriodClosed = (result.IsClosed && !_this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                        if ($scope.Model.IsPeriodClosed) {
                            popupMessageService.ShowError(_this.$scope.Translation.PeriodClosed);
                        }
                        else {
                            receiveOrderService.AdjustReceiveOrder($scope.Model.ReceiveOrder).then(function (response) {
                                if (response) {
                                    _this.ClearCorrectMode();
                                    popupMessageService.ShowSuccess($scope.Translation.ReceiveAdjustmentSuccess);
                                }
                                else {
                                    popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                                }
                            });
                        }
                    });
                };
                $scope.PriceInEditMode = function (item) {
                    if ($scope.Model.InCorrectMode) {
                        return $scope.Model.CanEditCorrectReceivePrice;
                    }
                    else {
                        if ($scope.IsItemReadOnly(item)) {
                            return false;
                        }
                        else {
                            return $scope.Model.CanEditPrice;
                        }
                    }
                };
            }
            ReceiveOrderDetailsController.prototype.ClearCorrectMode = function () {
                var _this = this;
                this.$scope.Model.InCorrectMode = false;
                _.each(this.$scope.Model.ReceiveOrder.Items, function (item) {
                    if (item.Received) {
                        _this._initialItemValues[item.Id] = angular.copy(item);
                    }
                });
                this._originalValues = [];
            };
            ReceiveOrderDetailsController.prototype.GetReceiveOrder = function (orderId) {
                var _this = this;
                this.receiveOrderService.GetReceiveOrder(orderId).success(function (order) {
                    _this.$scope.Model.ReceiveOrder = order;
                    _this.$scope.OriginalDetails = order.Items.slice(0);
                    var anyReceived = _.any(order.Items, function (item) { return item.Received; }), anyNotReceived = _.any(order.Items, function (item) { return !(item.Received); }), canCorrect = _this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_Receive_CanCorrect), canChangeApplyDate = _this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanChangeApplyDate);
                    _this._initialItemValues = [];
                    _.forEach(_this.$scope.Model.ReceiveOrder.Items, function (item) {
                        _this.SetDefaultReceivedDisplayQuantity(item);
                        _this._initialItemValues[item.Id] = angular.copy(item);
                    });
                    _this.$scope.Model.CanBePushedToTomorrow = order.CanBePushedToTomorrow;
                    _this.$scope.Model.CanCorrectReceive = (canCorrect && anyReceived);
                    _this.$scope.Model.CanChangeApplyDate = (anyReceived && canChangeApplyDate);
                    _this.$scope.Model.IsReadOnly = (_this.$scope.HasReceived() && !anyNotReceived);
                    _this.$scope.Model.ShowAddItems = !anyReceived;
                    _this.$scope.UpdateTotals();
                    _this.$scope.ClearCategoryFilter();
                });
            };
            ReceiveOrderDetailsController.prototype.SetDefaultReceivedDisplayQuantity = function (item) {
                if (!item.Received && !this.$scope.Model.ReceiveOrder.HasBeenCopied) {
                    if (this.$scope.HasASN()) {
                        item.ReceivedQuantity = item.VendorShippedQuantity;
                    }
                    else {
                        item.ReceivedQuantity = item.OrderedQuantity;
                    }
                }
            };
            ReceiveOrderDetailsController.prototype.PageIsDirty = function () {
                var _this = this;
                return _.any(this.$scope.Model.ReceiveOrder.Items, function (item) {
                    var tempItem = _this._initialItemValues[item.Id];
                    return (tempItem.Price != item.Price ||
                        tempItem.ReceivedQuantity != item.ReceivedQuantity ||
                        tempItem.ReturnedQuantity != item.ReturnedQuantity);
                });
            };
            ReceiveOrderDetailsController.prototype.ItemChanged = function (item) {
                var tempItem = this._initialItemValues[item.Id];
                return (tempItem.Price != item.Price ||
                    tempItem.ReceivedQuantity !== item.ReceivedQuantity ||
                    tempItem.ReturnedQuantity !== item.ReturnedQuantity);
            };
            ReceiveOrderDetailsController.prototype.FilterItems = function () {
                var _this = this;
                var categoryTotals = {}, totalItems = 0;
                if (!this.$scope.Model.ReceiveOrder) {
                    return;
                }
                this.$scope.Model.ReceiveOrder.Items = _.filter(this.$scope.OriginalDetails, function (entry) {
                    if (categoryTotals[entry.CategoryId] === undefined) {
                        categoryTotals[entry.CategoryId] = 0;
                    }
                    totalItems += 1;
                    categoryTotals[entry.CategoryId] += 1;
                    if (_this._currentCategory && entry.CategoryId !== _this._currentCategory.CategoryId) {
                        return false;
                    }
                    return true;
                });
                _.each(this.$scope.Model.ReceiveOrder.Categories, function (entry) {
                    entry.TotalItems = categoryTotals[entry.CategoryId];
                });
                this.$scope.TotalItems = totalItems;
            };
            return ReceiveOrderDetailsController;
        }());
        Order.ReceiveOrderDetailsController = ReceiveOrderDetailsController;
        Order.receiveOrderDetailController = Core.NG.InventoryOrderModule.RegisterNamedController("ReceiveOrderDetailsController", ReceiveOrderDetailsController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$typedStateParams(), Core.$translation, Order.$receiveOrderService, Core.NG.$modal, Core.$confirmationService, Core.$popupMessageService, Core.NG.$state, Core.Constants, Workforce.PeriodClose.Api.$periodCloseService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
