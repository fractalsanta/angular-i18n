var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var NewOrderController = (function () {
            function NewOrderController($scope, $modalInstance, $authService, $vendorService, $orderService, $stateService, translationService, constants, userSettingService, $periodCloseService) {
                var _this = this;
                this.constants = constants;
                this.userSettingService = userSettingService;
                var user = $authService.GetUser(), daysToCover = 0;
                $scope.Translations = {};
                $scope.FormData = {
                    ShowDeliveryDate: false,
                    ShowCoverDate: false,
                    Vendors: [],
                    SelectedVendor: null,
                    DeliveryMinimumDate: new Date(),
                    DeliveryDate: null,
                    CoverMinimumDate: null,
                    CoverUntilDate: null,
                    PreferredVendorId: null,
                    PeriodClosed: false
                };
                $vendorService.Get(user.BusinessUser.MobileSettings.EntityId)
                    .success(function (results) {
                    results = _.sortBy(results, "Name");
                    $scope.FormData.Vendors = results;
                    userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.DefaultSupplierPreference).then(function (result) {
                        $scope.FormData.PreferredVendorId = parseInt(result);
                    }).catch(function () {
                        $scope.FormData.PreferredVendorId = -1;
                    }).finally(function () {
                        var favoriteVendor = _.filter($scope.FormData.Vendors, function (filterVendor) { return filterVendor.Id == $scope.FormData.PreferredVendorId; });
                        $scope.SelectVendor(favoriteVendor.length > 0 ? favoriteVendor[0] : results[0]);
                    });
                    $scope.UpdatePeriodClosedStatus();
                });
                $scope.OpenDeliveryDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.FormData.ShowDeliveryDate = !$scope.FormData.ShowDeliveryDate;
                    $scope.FormData.ShowCoverDate = false;
                };
                $scope.OpenCoverDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.FormData.ShowCoverDate = !$scope.FormData.ShowCoverDate;
                    $scope.FormData.ShowDeliveryDate = false;
                };
                $scope.OnDeliveryChange = function (newDate) {
                    if (!newDate) {
                        $scope.FormData.DeliveryDate = newDate = new Date();
                    }
                    $scope.FormData.CoverMinimumDate = moment(newDate).add("d", 1).toDate();
                    if ($scope.FormData.CoverUntilDate < $scope.FormData.CoverMinimumDate) {
                        $scope.FormData.CoverUntilDate = $scope.FormData.CoverMinimumDate;
                    }
                    $scope.OnCoverChange($scope.FormData.CoverUntilDate);
                };
                $scope.OnCoverChange = function (newDate) {
                    if ($scope.FormData.DeliveryDate) {
                        daysToCover = moment(newDate).diff(moment($scope.FormData.DeliveryDate), "days");
                    }
                };
                $scope.CollapseCalendars = function () {
                    $scope.FormData.ShowCoverDate = false;
                    $scope.FormData.ShowDeliveryDate = false;
                };
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.Confirm = function () {
                    $orderService.PostCreateAutoSelectTemplate(user.BusinessUser.MobileSettings.EntityId, $scope.FormData.SelectedVendor.Id, moment($scope.FormData.DeliveryDate).format(constants.InternalDateTimeFormat), daysToCover)
                        .then(function (result) {
                        $modalInstance.close();
                        $stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: result });
                    });
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                });
                $scope.SelectVendor = function (vendor) {
                    $scope.FormData.SelectedVendor = vendor;
                };
                $scope.SetPreferredVendor = function ($event, vendorId) {
                    if (vendorId == $scope.FormData.PreferredVendorId)
                        vendorId = -1;
                    userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.DefaultSupplierPreference, vendorId.toString());
                    $scope.FormData.PreferredVendorId = vendorId;
                    $event.preventDefault();
                    $event.stopPropagation();
                };
                $scope.UpdatePeriodClosedStatus = function () {
                    $orderService.GetStoreLocalDateTimeString()
                        .success(function (result) {
                        $periodCloseService.GetPeriodLockStatus(user.BusinessUser.MobileSettings.EntityId, moment(result).format(_this.constants.InternalDateFormat))
                            .success(function (result) {
                            $scope.FormData.PeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                        });
                    });
                };
            }
            return NewOrderController;
        }());
        Core.NG.InventoryOrderModule.RegisterNamedController("NewOrder", NewOrderController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.Auth.$authService, Order.Api.$vendorService, Order.$orderService, Core.NG.$state, Core.$translation, Core.Constants, Administration.User.Services.$userSettingService, Workforce.PeriodClose.Api.$periodCloseService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
