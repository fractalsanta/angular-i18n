var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReceiveOrderController = (function () {
            function ReceiveOrderController($scope, authService, receiveOrderService, $receiveOrderService, $modalService, popupMessageService, translationService, stateService, constants, searchOrderService) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.receiveOrderService = receiveOrderService;
                this.$receiveOrderService = $receiveOrderService;
                this.$modalService = $modalService;
                this.popupMessageService = popupMessageService;
                this.stateService = stateService;
                this.constants = constants;
                this.searchOrderService = searchOrderService;
                this._twoWeeks = 14;
                this._idPropertyName = "DisplayId";
                this._statusPropertyName = "Status";
                this._statusReceived = "Received";
                this.Initialize();
                $scope.$watch("Model.FilterText", function () {
                    _this.ApplySearchFilterAndOrder();
                });
                $scope.FilterLast = function (days) {
                    $scope.Model.DateRange = $scope.Translations.Last + " " + days + " " + $scope.Translations.Days;
                    _this._customRange = null;
                    _this.LoadData(moment().add("d", -days), moment());
                };
                $scope.OpenCustomRangeDialog = function () {
                    var modalInstance = $modalService.open({
                        templateUrl: "/Areas/Inventory/Order/Templates/CustomRange.html",
                        controller: "Inventory.Order.CustomRange",
                        windowClass: "wide-sm",
                        resolve: { customRange: function () { return _this._customRange; } }
                    });
                    modalInstance.result.then(function (result) {
                        var startDate = moment(result.StartDate), endDate = moment(result.EndDate), format = "LL";
                        _this._customRange = result;
                        $scope.Model.DateRange = startDate.format(format) + " - " + endDate.format(format);
                        _this.LoadData(startDate, endDate);
                    });
                };
                $scope.IsOrderReceived = function (order) {
                    return (order.Status === _this._statusReceived);
                };
                $scope.RequiresPaging = function () {
                    return ($scope.Orders.length > $scope.PagingOptions.itemsPerPage);
                };
                $scope.ViewOrder = function (order) {
                    if (_this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrder) {
                        _this.stateService.go(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderDetails, { OrderId: order.DisplayId });
                    }
                    if (_this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist) {
                        _this.stateService.go(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExistDetails, { OrderId: order.DisplayId });
                    }
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                    _this.SetPageTitle();
                    $scope.FilterLast(14);
                    _this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, function () {
                        if (_this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrder) {
                            _this.SetPageTitle();
                        }
                    });
                    if (_this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist) {
                        _this.OpenOrdersExistDialog();
                    }
                });
            }
            ReceiveOrderController.prototype.Initialize = function () {
                var _this = this;
                this.$scope.Translations = {};
                this.$scope.Model = {
                    FilterText: "",
                    DateRange: ""
                };
                var itemsPerPage = 20;
                this.$scope.ChangePage = function (page) {
                    _this.$scope.CurrentPage = page;
                    var index = (page - 1) * itemsPerPage;
                    _this.$scope.CurrentPageOrders = _this.$scope.FilteredOrders.slice(index, index + _this.$scope.PagingOptions.itemsPerPage);
                };
                this.$scope.PagingOptions = {
                    itemsPerPage: itemsPerPage,
                    numPages: 5
                };
                this.$scope.Orders = [];
                this.$scope.FilteredOrders = [];
                this.$scope.CurrentPageOrders = [];
                this.$receiveOrderService.OrderModified.SubscribeController(this.$scope, function () {
                    if (_this._customRange) {
                        _this.LoadData(moment(_this._customRange.StartDate), moment(_this._customRange.EndDate));
                    }
                    else {
                        _this.$scope.FilterLast(_this._twoWeeks);
                    }
                });
            };
            ReceiveOrderController.prototype.SetPageTitle = function () {
                this.popupMessageService.SetPageTitle(this.$scope.Translations.ReceiveOrder);
            };
            ReceiveOrderController.prototype.ApplySearchFilterAndOrder = function () {
                var _this = this;
                var searchFilterText = this.$scope.Model.FilterText;
                this.$scope.FilteredOrders =
                    _.filter(this.$scope.Orders, function (item) { return _this.searchOrderService.Filter(item, searchFilterText); });
                this.$scope.FilteredOrders = _.sortBy(this.$scope.FilteredOrders, [this._statusPropertyName, this._idPropertyName]);
                this.$scope.ChangePage(1);
            };
            ReceiveOrderController.prototype.OpenOrdersExistDialog = function () {
                this.popupMessageService.ShowError(this.$scope.Translations.PlacedOrdersExist);
            };
            ReceiveOrderController.prototype.LoadData = function (startDate, endDate) {
                var _this = this;
                var user = this.authService.GetUser();
                this.receiveOrderService.GetPlacedAndReceivedOrders(user.BusinessUser.MobileSettings.EntityId, startDate.format(this.constants.InternalDateFormat), endDate.format(this.constants.InternalDateFormat))
                    .success(function (results) {
                    _this.$scope.Orders = results;
                    _this.ApplySearchFilterAndOrder();
                });
            };
            return ReceiveOrderController;
        }());
        Order.ReceiveOrderController = ReceiveOrderController;
        Order.receiveOrderController = Core.NG.InventoryOrderModule.RegisterNamedController("ReceiveOrderController", ReceiveOrderController, Core.NG.$typedScope(), Core.Auth.$authService, Order.Api.$receiveOrderService, Order.$receiveOrderService, Core.NG.$modal, Core.$popupMessageService, Core.$translation, Core.NG.$state, Core.Constants, Order.$searchOrderService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
