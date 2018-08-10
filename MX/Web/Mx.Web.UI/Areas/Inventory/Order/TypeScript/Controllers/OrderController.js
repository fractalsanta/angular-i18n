var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ActiveTab;
        (function (ActiveTab) {
            ActiveTab[ActiveTab["Orders"] = 0] = "Orders";
            ActiveTab[ActiveTab["Scheduled"] = 1] = "Scheduled";
        })(ActiveTab || (ActiveTab = {}));
        var OrderController = (function () {
            function OrderController($scope, $rootScope, $authService, $orderService, $modalService, stateService, popupMessageService, translationService, signalr, constants, searchOrderService, periodCloseService) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.$orderService = $orderService;
                this.stateService = stateService;
                this.popupMessageService = popupMessageService;
                this.constants = constants;
                this.searchOrderService = searchOrderService;
                this.periodCloseService = periodCloseService;
                this._twoWeeks = 14;
                this.dateFormat = "MMM Do, YYYY";
                $scope.HeaderRefresh = { call: null };
                $scope.HeaderRefreshScheduled = { call: null };
                $scope.PeriodClosed = false;
                this._user = $authService.GetUser();
                var onlineHandler = function () {
                    $scope.IsOffline = false;
                    var currentActiveTab = _this.GetCurrentActiveTab();
                    if (currentActiveTab === ActiveTab.Orders) {
                        if (_this._customRange) {
                            _this.GetOrdersByRange(moment(_this._customRange.StartDate), moment(_this._customRange.EndDate));
                        }
                        else {
                            $scope.FilterLast(_this._twoWeeks);
                        }
                    }
                    else if (currentActiveTab === ActiveTab.Scheduled) {
                        _this.GetScheduledOrders();
                    }
                };
                $scope.DisplayOptions = {
                    SearchText: "",
                    SortProperty: "",
                    SortAscending: true,
                    OrderTabActive: (stateService.current.name === Core.UiRouterState.OrderStates.Place || stateService.current.name === Core.UiRouterState.OrderStates.Details),
                    ScheduledTabActive: (stateService.current.name === Core.UiRouterState.OrderStates.Scheduled || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdueDetails),
                    CanCreateOrder: $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanCreate),
                    FilterText: ""
                };
                signalr.SetConnectedListener(onlineHandler, $scope);
                signalr.SetReconnectedListener(onlineHandler, $scope);
                signalr.SetDisconnectedListener(function () { $scope.IsOffline = true; }, $scope);
                $orderService.OrderModified.SubscribeController($scope, onlineHandler);
                $scope.GoToScheduledOrders = function () {
                    _this.stateService.go(Core.UiRouterState.OrderStates.Scheduled);
                };
                this.$scope.ChangePage = function (page) {
                    _this.$scope.CurrentPage = page;
                    var index = (page - 1) * _this.$scope.PagingOptions.itemsPerPage;
                    _this.$scope.CurrentPageOrders = _this.$scope.FilteredOrders.slice(index, index + _this.$scope.PagingOptions.itemsPerPage);
                };
                this.$scope.PagingOptions = {
                    itemsPerPage: 20,
                    numPages: 5
                };
                $scope.RequiresPaging = function () { return ($scope.OrderSummaryData && $scope.OrderSummaryData.length > $scope.PagingOptions.itemsPerPage); };
                $scope.ApplySearchFilter = function () { return _this.ApplySearchFilter(); };
                this.$scope.OrderSummaryData = [];
                this.$scope.FilteredOrders = [];
                this.$scope.CurrentPageOrders = [];
                $scope.FilterLast = function (days) {
                    if ($scope.IsOffline) {
                        return;
                    }
                    $scope.DisplayOptions.FilterText = $scope.Translations.Last + " " + days + " " + $scope.Translations.Days;
                    _this._customRange = null;
                    _this.GetOrdersByRange(moment().add("d", -days), moment());
                };
                $scope.OpenCustomRangeDialog = function () {
                    if ($scope.IsOffline) {
                        return;
                    }
                    var modalInstance = $modalService.open({
                        templateUrl: "/Areas/Inventory/Order/Templates/CustomRange.html",
                        controller: "Inventory.Order.CustomRange",
                        windowClass: "wide-sm",
                        resolve: { customRange: function () { return _this._customRange; } }
                    });
                    modalInstance.result.then(function (result) {
                        _this._customRange = result;
                        $scope.DisplayOptions.FilterText = moment(result.StartDate).format(_this.dateFormat) + " - " + moment(result.EndDate).format(_this.dateFormat);
                        _this.GetOrdersByRange(moment(result.StartDate), moment(result.EndDate));
                    });
                };
                $scope.OpenNewOrderDialog = function () {
                    if ($scope.IsOffline) {
                        return;
                    }
                    $modalService.open({
                        templateUrl: "/Areas/Inventory/Order/Templates/NewOrder.html",
                        controller: "Inventory.Order.NewOrder",
                        windowClass: "smaller"
                    });
                };
                $scope.ViewOrder = function (order) {
                    if ($scope.IsOffline) {
                        return;
                    }
                    _this.stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: order.Id });
                };
                $scope.SortColumn = function (property) {
                    var options = $scope.DisplayOptions, sortPath = property.split("."), length = sortPath.length, sortHandler = function (order) {
                        var value = order, i;
                        for (i = 0; i < length; i += 1) {
                            value = value[sortPath[i]];
                        }
                        return value;
                    };
                    options.SortAscending = !options.SortAscending;
                    if (options.SortProperty !== property) {
                        options.SortAscending = true;
                    }
                    options.SortProperty = property;
                    if ($scope.DisplayOptions.OrderTabActive) {
                        $scope.OrderSummaryData = _.sortBy($scope.OrderSummaryData, sortHandler);
                        if (!options.SortAscending) {
                            $scope.OrderSummaryData.reverse();
                        }
                        _this.ApplySearchFilter();
                    }
                    else {
                        $scope.ScheduledOrderSummaryData = _.sortBy($scope.ScheduledOrderSummaryData, sortHandler);
                        if (!options.SortAscending) {
                            $scope.ScheduledOrderSummaryData.reverse();
                        }
                        _this.ApplySearchFilterScheduled();
                    }
                };
                this.$scope.ChangePage(1);
                this.$scope.ChangePageScheduled = function (page) {
                    _this.$scope.CurrentPageScheduled = page;
                    var index = (page - 1) * _this.$scope.PagingOptionsScheduled.itemsPerPage;
                    _this.$scope.CurrentPageOrdersScheduled = _this.$scope.FilteredOrdersScheduled.slice(index, index + _this.$scope.PagingOptionsScheduled.itemsPerPage);
                };
                this.$scope.PagingOptionsScheduled = {
                    itemsPerPage: 20,
                    numPages: 5
                };
                $scope.RequiresPagingScheduled = function () { return ($scope.ScheduledOrderSummaryData && $scope.ScheduledOrderSummaryData.length > $scope.PagingOptionsScheduled.itemsPerPage); };
                $scope.ApplySearchFilterScheduled = function () { return _this.ApplySearchFilterScheduled(); };
                this.$scope.ScheduledOrderSummaryData = [];
                this.$scope.FilteredOrdersScheduled = [];
                this.$scope.CurrentPageOrdersScheduled = [];
                $scope.DayPickerOptions = {
                    Date: new Date(),
                    DayOffset: 1,
                    MonthOffset: null
                };
                $scope.IsInOverdueMode = function () {
                    return _this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue;
                };
                $scope.FilterScheduledOrdersByDate = function () {
                    if ($scope.IsOffline) {
                        return;
                    }
                    _this.GetScheduledOrders();
                };
                $scope.SkipScheduledOrder = function (order) {
                    if ($scope.IsOffline) {
                        return;
                    }
                    $orderService.PutVoidedScheduledOrder(_this._user.BusinessUser.MobileSettings.EntityId, order.ActionItemDate.toString(), order.ActionItemInstanceId, _this._user.BusinessUser.UserName, order.ActionItemId).then(function () {
                        _this.GetScheduledOrders();
                    });
                };
                $scope.CreateScheduledOrder = function (order) {
                    if ($scope.IsOffline) {
                        return;
                    }
                    $orderService.PostGenerateSalesOrderFromScheduledOrder(_this._user.BusinessUser.MobileSettings.EntityId, order.ActionItemDate.toString(), order.ActionItemId, order.ActionItemInstanceId).then(function (result) {
                        _this.stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: result });
                    });
                };
                $scope.ViewScheduledOrderDetail = function (order) {
                    if ($scope.IsOffline) {
                        return;
                    }
                    if (order.TransactionSalesOrderId > 0) {
                        if (_this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                            _this.stateService.go(Core.UiRouterState.OrderStates.ScheduledOverdueDetails, { OrderId: order.TransactionSalesOrderId });
                        }
                        else {
                            _this.stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: order.TransactionSalesOrderId });
                        }
                    }
                };
                $scope.OrdersTabClick = function () {
                    _this.SetPageTitle(ActiveTab.Orders);
                    $scope.FilterLast(_this._twoWeeks);
                };
                $scope.ScheduledTabClick = function () {
                    if ($scope.IsOffline) {
                        return;
                    }
                    _this.SetPageTitle(ActiveTab.Scheduled);
                    _this.GetScheduledOrders();
                };
                $rootScope.$on(Core.ApplicationEvent.HttpError, function (event) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    if (args != null && args.length > 0) {
                        var response = args[0];
                        if (response.status === 0) {
                            event.preventDefault();
                        }
                    }
                });
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                    $scope.ActiveOrdersGridDefinitions = [
                        { Field: "VendorName", Title: $scope.Translations.Supplier },
                        { Field: "DisplayId", Title: $scope.Translations.OrderNumber },
                        { Field: "OrderDate", Title: $scope.Translations.OrderDate },
                        { Field: "DeliveryDate", Title: $scope.Translations.DeliveryDate },
                        { Field: "CoverUntilDate", Title: $scope.Translations.CoverUntil },
                        { Field: "Status", Title: $scope.Translations.Status },
                        { Title: "", Field: "" }
                    ];
                    $scope.ScheduledOrdersGridDefinitions = [
                        { Field: "Supplier", Title: $scope.Translations.Supplier },
                        { Field: "DeliveryDate", Title: $scope.Translations.DeliveryDate },
                        { Field: "CutoffTime", Title: $scope.Translations.Cutoff },
                        { Field: "Status", Title: $scope.Translations.Status },
                        { Title: "", Field: "" },
                        { Title: "", Field: "" }
                    ];
                    if (stateService.current.name === Core.UiRouterState.OrderStates.Scheduled || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                        $scope.GridDefinitions = $scope.ScheduledOrdersGridDefinitions;
                    }
                    else {
                        $scope.GridDefinitions = $scope.ActiveOrdersGridDefinitions;
                    }
                    _this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, function () {
                        if (stateService.current.name === Core.UiRouterState.OrderStates.Place
                            || stateService.current.name === Core.UiRouterState.OrderStates.Scheduled
                            || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                            if (angular.isFunction(_this.$scope.HeaderRefresh.call)) {
                                _this.$scope.HeaderRefresh.call();
                            }
                            if (angular.isFunction(_this.$scope.HeaderRefreshScheduled.call)) {
                                _this.$scope.HeaderRefreshScheduled.call();
                            }
                            _this.SetPageTitle(_this.GetCurrentActiveTab());
                        }
                    });
                });
            }
            OrderController.prototype.GetCurrentActiveTab = function () {
                if (this.$scope.DisplayOptions.OrderTabActive) {
                    return ActiveTab.Orders;
                }
                else {
                    return ActiveTab.Scheduled;
                }
            };
            OrderController.prototype.SetPageTitle = function (tab) {
                if (tab === ActiveTab.Orders) {
                    this.popupMessageService.SetPageTitle(this.$scope.Translations.Orders);
                }
                else if (tab === ActiveTab.Scheduled
                    && this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                    this.popupMessageService.SetPageTitle(this.$scope.Translations.OverdueScheduledOrders);
                }
                else {
                    this.popupMessageService.SetPageTitle(this.$scope.Translations.ScheduledOrders);
                }
            };
            OrderController.prototype.GetOrdersByRange = function (fromDate, toDate) {
                var _this = this;
                this.$scope.ScheduledOrderSummaryData = null;
                this.$scope.GridDefinitions = this.$scope.ActiveOrdersGridDefinitions;
                this.$orderService.GetOrdersByRange(this._user.BusinessUser.MobileSettings.EntityId, fromDate.format(this.constants.InternalDateTimeFormat), toDate.format(this.constants.InternalDateTimeFormat))
                    .then(function (results) {
                    if (!_this.$scope.OrderSummaryData || !_this.$scope.DisplayOptions.SortProperty) {
                        _this.$scope.DisplayOptions.SortAscending = false;
                        _this.$scope.DisplayOptions.SortProperty = "OrderDate";
                    }
                    _this.$scope.OrderSummaryData = results;
                    _this.SortWithoutDirectionChange(_this.$scope.DisplayOptions.SortProperty);
                    _this.ApplySearchFilter();
                });
            };
            OrderController.prototype.ApplySearchFilter = function () {
                var _this = this;
                var searchFilterText = this.$scope.DisplayOptions.SearchText;
                this.$scope.FilteredOrders =
                    _.filter(this.$scope.OrderSummaryData, function (item) { return _this.searchOrderService.Filter(item, searchFilterText); });
                this.$scope.ChangePage(1);
            };
            OrderController.prototype.GetScheduledOrders = function () {
                var _this = this;
                this.$scope.OrderSummaryData = null;
                this.$scope.GridDefinitions = this.$scope.ScheduledOrdersGridDefinitions;
                var date = moment(this.$scope.DayPickerOptions.Date);
                var scheduledOrdersPromise;
                this.UpdatePeriodCloseStatus();
                if (this.$scope.IsInOverdueMode()) {
                    scheduledOrdersPromise = this.$orderService.GetOverdueScheduledOrders(this._user.BusinessUser.MobileSettings.EntityId);
                }
                else {
                    scheduledOrdersPromise = this.$orderService.GetScheduledOrders(this._user.BusinessUser.MobileSettings.EntityId, date.format(this.constants.InternalDateFormat));
                }
                scheduledOrdersPromise.then(function (results) {
                    if (!_this.$scope.ScheduledOrderSummaryData || !_this.$scope.DisplayOptions.SortProperty) {
                        _this.$scope.DisplayOptions.SortAscending = false;
                        _this.$scope.DisplayOptions.SortProperty = "DeliveryDate";
                    }
                    _this.$scope.ScheduledOrderSummaryData = results;
                    _this.SortWithoutDirectionChange(_this.$scope.DisplayOptions.SortProperty);
                    _this.ApplySearchFilterScheduled();
                });
            };
            OrderController.prototype.UpdatePeriodCloseStatus = function () {
                var _this = this;
                this.periodCloseService.GetPeriodLockStatus(this._user.BusinessUser.MobileSettings.EntityId, moment(this.$scope.DayPickerOptions.Date).format(this.constants.InternalDateFormat))
                    .success(function (result) {
                    _this.$scope.PeriodClosed = (result.IsClosed && !_this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                    if (_this.$scope.PeriodClosed) {
                        _this.popupMessageService.ShowError(_this.$scope.Translations.PeriodIsClosed);
                    }
                });
            };
            OrderController.prototype.ApplySearchFilterScheduled = function () {
                var searchFilterText = this.$scope.DisplayOptions.SearchText.toLowerCase();
                this.$scope.FilteredOrdersScheduled = _.filter(this.$scope.ScheduledOrderSummaryData, function (item) {
                    if (item.Supplier.toLowerCase().indexOf(searchFilterText) > -1
                        || item.Status.toLowerCase().indexOf(searchFilterText) > -1) {
                        return true;
                    }
                    return false;
                });
                this.$scope.ChangePageScheduled(1);
            };
            OrderController.prototype.SortWithoutDirectionChange = function (property) {
                this.$scope.DisplayOptions.SortAscending = !this.$scope.DisplayOptions.SortAscending;
                this.$scope.SortColumn(property);
            };
            return OrderController;
        }());
        Order.orderController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderController", OrderController, Core.NG.$typedScope(), Core.NG.$rootScope, Core.Auth.$authService, Order.$orderService, Core.NG.$modal, Core.NG.$state, Core.$popupMessageService, Core.$translation, Core.$signalR, Core.Constants, Order.$searchOrderService, Workforce.PeriodClose.Api.$periodCloseService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
