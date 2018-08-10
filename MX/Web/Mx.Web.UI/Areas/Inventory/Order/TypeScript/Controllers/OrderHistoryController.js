var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var OrderHistoryController = (function () {
            function OrderHistoryController($scope, $authService, translationService, $orderHistoryService, $receiveOrderService, popupMessageService, stateService, constants, searchOrderService) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.translationService = translationService;
                this.$orderHistoryService = $orderHistoryService;
                this.$receiveOrderService = $receiveOrderService;
                this.popupMessageService = popupMessageService;
                this.stateService = stateService;
                this.constants = constants;
                this.searchOrderService = searchOrderService;
                this.Initialize();
                $scope.SelectDatesRange = function () { return _this.SelectDatesRange(); };
                $scope.RequiresPaging = function () {
                    return ($scope.Orders.length > $scope.PagingOptions.itemsPerPage);
                };
                $scope.ApplySearchFilter = function () { return _this.ApplySearchFilter(); };
                $scope.SortByColumn = function (field) { return _this.SortByColumn(field); };
                $scope.ViewOrder = function (order) { return _this.ViewOrder(order); };
            }
            OrderHistoryController.prototype.SetupGrid = function () {
                this.$scope.DisplayOptions = {
                    SortProperty: "OrderDate",
                    SortAscending: false
                };
                this.$scope.OrdersHistoryGridDefinitions = [
                    { Field: "VendorName", Title: this.$scope.L10N.Supplier },
                    { Field: "DisplayId", Title: this.$scope.L10N.OrderNumber },
                    { Field: "OrderDate", Title: this.$scope.L10N.OrderDate },
                    { Field: "ReceivedDate", Title: this.$scope.L10N.DeliveryDate },
                    { Field: "Status", Title: this.$scope.L10N.Status },
                    { Field: "TotalItems", Title: this.$scope.L10N.ItemsInDelivery },
                    { Title: "", Field: "" }
                ];
            };
            OrderHistoryController.prototype.Initialize = function () {
                var _this = this;
                this.translationService.GetTranslations().then(function (result) {
                    _this.$scope.L10N = result.InventoryOrder;
                    _this.SetPageTitle();
                    _this.SetupGrid();
                    _this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, function () {
                        if (_this.stateService.current.name === Core.UiRouterState.OrderHistoryStates.History) {
                            _this.$scope.ChangePage(_this.$scope.CurrentPage);
                            _this.SetPageTitle();
                        }
                    });
                });
                var today = moment();
                this.$scope.Model = {
                    DatesRange: {
                        EndDate: today.toDate(),
                        StartDate: today.subtract('days', 14).toDate()
                    },
                    FilterText: ""
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
                this.$scope.Orders = [];
                this.$scope.FilteredOrders = [];
                this.$scope.CurrentPageOrders = [];
                this.$receiveOrderService.OrderModified.SubscribeController(this.$scope, function () { return _this.GetOrdersHistory(); });
            };
            OrderHistoryController.prototype.SetPageTitle = function () {
                this.popupMessageService.SetPageTitle(this.$scope.L10N.OrderHistory);
            };
            OrderHistoryController.prototype.SelectDatesRange = function () {
                this.GetOrdersHistory();
            };
            OrderHistoryController.prototype.GetOrdersHistory = function () {
                var _this = this;
                var user = this.$authService.GetUser();
                if (user != null && user.BusinessUser != null) {
                    this.$orderHistoryService.GetOrdersByRange(user.BusinessUser.MobileSettings.EntityId, moment(this.$scope.Model.DatesRange.StartDate).format(this.constants.InternalDateTimeFormat), moment(this.$scope.Model.DatesRange.EndDate).format(this.constants.InternalDateTimeFormat)).then(function (result) {
                        _.each(result.data, function (order) {
                            order.TotalCases = Math.round(order.TotalCases * 100) / 100;
                        });
                        _this.$scope.Orders = result.data;
                        _this.ApplySearchFilter();
                    });
                }
            };
            OrderHistoryController.prototype.ApplySearchFilter = function () {
                var _this = this;
                var searchFilterText = this.$scope.Model.FilterText;
                this.$scope.FilteredOrders =
                    _.filter(this.$scope.Orders, function (item) { return _this.searchOrderService.Filter(item, searchFilterText); });
                this.$scope.ChangePage(1);
            };
            OrderHistoryController.prototype.SortByColumn = function (field) {
                if (this.$scope.DisplayOptions.SortProperty === field) {
                    this.$scope.DisplayOptions.SortAscending = !this.$scope.DisplayOptions.SortAscending;
                }
                else {
                    this.$scope.DisplayOptions.SortProperty = field;
                    this.$scope.DisplayOptions.SortAscending = true;
                }
                this.$scope.Orders = _.sortBy(this.$scope.Orders, function (order) {
                    return order[field] != null ? order[field] : "";
                });
                if (!this.$scope.DisplayOptions.SortAscending) {
                    this.$scope.Orders.reverse();
                }
                this.ApplySearchFilter();
            };
            OrderHistoryController.prototype.ViewOrder = function (order) {
                if (this.popupMessageService.IsOffline()) {
                    return;
                }
                if (order.OrderStatus == Order.Api.Models.OrderStatus.Cancelled) {
                    this.stateService.go(Core.UiRouterState.OrderHistoryStates.PlacedOrderDetails, { OrderId: order.Id });
                }
                if (order.OrderStatus == Order.Api.Models.OrderStatus.Received
                    || order.OrderStatus == Order.Api.Models.OrderStatus.AutoReceived) {
                    this.stateService.go(Core.UiRouterState.OrderHistoryStates.ReceivedOrderDetails, { OrderId: order.DisplayId });
                }
            };
            return OrderHistoryController;
        }());
        Order.orderHistoryController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderHistoryController", OrderHistoryController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, Order.Api.$orderHistoryService, Order.$receiveOrderService, Core.$popupMessageService, Core.NG.$state, Core.Constants, Order.$searchOrderService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
