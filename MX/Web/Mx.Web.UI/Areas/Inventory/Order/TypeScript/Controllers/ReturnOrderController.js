var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReturnOrderController = (function () {
            function ReturnOrderController($scope, authService, returnOrderService, $location, popupMessageService, $modalService, translationService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.returnOrderService = returnOrderService;
                this.popupMessageService = popupMessageService;
                this.$modalService = $modalService;
                this.constants = constants;
                this._idPropertyName = "Id";
                var authorizedToAccessReturns = authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanReturn);
                if (!authorizedToAccessReturns) {
                    $location.path("/Core/Forbidden");
                    return;
                }
                $scope.Translations = {};
                $scope.Model = {
                    FilterText: "",
                    DateRange: ""
                };
                this.$scope.ChangePage = function (page) {
                    _this.$scope.CurrentPage = page;
                    var index = (page - 1) * $scope.PagingOptions.itemsPerPage;
                    _this.$scope.CurrentPageOrders = _this.$scope.FilteredOrders.slice(index, index + _this.$scope.PagingOptions.itemsPerPage);
                };
                $scope.PagingOptions = {
                    itemsPerPage: 20,
                    numPages: 5
                };
                $scope.Orders = [];
                $scope.FilteredOrders = [];
                $scope.CurrentPageOrders = [];
                $scope.$watch("Model.FilterText", function () {
                    _this.ApplySearchFilterAndOrder();
                });
                $scope.FilterLast = function (days) {
                    $scope.Model.DateRange = $scope.Translations.Last + " " + days + " " + $scope.Translations.Days;
                    _this.LoadData(moment().add("d", -days), moment());
                };
                $scope.RequiresPaging = function () {
                    return ($scope.Orders.length > $scope.PagingOptions.itemsPerPage);
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
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                    popupMessageService.SetPageTitle(result.InventoryOrder.ReturnOrder);
                    $scope.FilterLast(14);
                });
                $scope.ViewOrder = function (order) {
                    $location.path("/Inventory/Order/Return/Details/" + order.DisplayId);
                };
            }
            ReturnOrderController.prototype.LoadData = function (startDate, endDate) {
                var _this = this;
                var user = this.authService.GetUser();
                this.returnOrderService.GetReceivedOrders(user.BusinessUser.MobileSettings.EntityId, startDate.format(this.constants.InternalDateTimeFormat), endDate.format(this.constants.InternalDateTimeFormat))
                    .success(function (results) {
                    _this.$scope.Orders = results;
                    _this.ApplySearchFilterAndOrder();
                });
            };
            ReturnOrderController.prototype.ApplySearchFilterAndOrder = function () {
                var upperCaseSearchFilterText = this.$scope.Model.FilterText.toUpperCase();
                this.$scope.FilteredOrders = _.filter(this.$scope.Orders, function (item) {
                    if (item.VendorName.toUpperCase().indexOf(upperCaseSearchFilterText) > -1) {
                        return true;
                    }
                    var orderIdString = item.DisplayId.toString();
                    if (orderIdString.indexOf(upperCaseSearchFilterText) > -1) {
                        return true;
                    }
                    return false;
                });
                this.$scope.FilteredOrders = _.sortBy(this.$scope.FilteredOrders, [this._idPropertyName]);
                this.$scope.ChangePage(1);
            };
            return ReturnOrderController;
        }());
        Order.ReturnOrderController = ReturnOrderController;
        Core.NG.InventoryOrderModule.RegisterRouteController("Return", "Templates/Return.html", ReturnOrderController, Core.NG.$typedScope(), Core.Auth.$authService, Order.Api.$returnOrderService, Core.NG.$location, Core.$popupMessageService, Core.NG.$modal, Core.$translation, Core.Constants);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
