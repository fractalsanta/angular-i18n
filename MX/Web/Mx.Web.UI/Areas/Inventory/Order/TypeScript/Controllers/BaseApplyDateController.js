var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var BaseApplyDateController = (function () {
            function BaseApplyDateController($scope, instance, translationService, periodCloseService, authService, receiveOrderService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.instance = instance;
                this.translationService = translationService;
                this.periodCloseService = periodCloseService;
                this.authService = authService;
                this.receiveOrderService = receiveOrderService;
                this.constants = constants;
                this._user = authService.GetUser();
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                });
                $scope.Model = {
                    ApplyDate: null,
                    MaxDate: null,
                    ShowApplyDate: false,
                    PeriodClosed: false,
                    PeriodCheckInProgress: false
                };
                receiveOrderService.GetLocalStoreDateTimeString().then(function (result) {
                    _this._storeTimeTracker = new Core.LocalTimeTracker(moment(result.data));
                    $scope.Model.ApplyDate = _this._storeTimeTracker.Get().toDate();
                    $scope.Model.MaxDate = $scope.Model.ApplyDate;
                });
                $scope.IsApplyDateValid = function (value) {
                    if (!value) {
                        return false;
                    }
                    var m = moment(value);
                    if (!m.isValid()) {
                        return false;
                    }
                    var now = _this.GetCurrentDateTime();
                    return !m.isAfter(now);
                };
                $scope.OpenApplyDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.Model.ShowApplyDate = !$scope.Model.ShowApplyDate;
                };
                $scope.Cancel = function () {
                    instance.dismiss();
                };
                $scope.Confirm = function () {
                    instance.close($scope.Model.ApplyDate);
                };
                $scope.$watch("Model.ApplyDate", function () {
                    _this.UpdatePeriodCloseStatus();
                });
            }
            BaseApplyDateController.prototype.GetCurrentDateTime = function () {
                return this._storeTimeTracker.Get();
            };
            BaseApplyDateController.prototype.UpdatePeriodCloseStatus = function () {
                var _this = this;
                var m = moment(this.$scope.Model.ApplyDate);
                if (!m.isValid()) {
                    return;
                }
                var formattedDate = m.format(this.constants.InternalDateFormat);
                if (this._lastCheckedDate !== formattedDate) {
                    this._lastCheckedDate = formattedDate;
                    this.$scope.Model.PeriodCheckInProgress = true;
                    this.periodCloseService.GetPeriodLockStatus(this._user.BusinessUser.MobileSettings.EntityId, formattedDate)
                        .success(function (result) {
                        _this.$scope.Model.PeriodClosed = (result.IsClosed && !_this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                        _this.$scope.Model.PeriodCheckInProgress = false;
                    });
                }
            };
            return BaseApplyDateController;
        }());
        Order.BaseApplyDateController = BaseApplyDateController;
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
