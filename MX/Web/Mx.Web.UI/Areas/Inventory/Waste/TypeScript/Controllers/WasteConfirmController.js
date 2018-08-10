var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        "use strict";
        var WasteConfirmController = (function () {
            function WasteConfirmController($scope, modalInstance, translationService, items, totalCost, $authService, $periodCloseService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.modalInstance = modalInstance;
                this.translationService = translationService;
                this.items = items;
                this.totalCost = totalCost;
                this.$authService = $authService;
                this.$periodCloseService = $periodCloseService;
                this.constants = constants;
                this._user = $authService.GetUser();
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryWaste;
                });
                this._currentDate = new Date();
                $scope.Model = {
                    ShowApplyDate: false,
                    MaxDate: moment().toDate(),
                    ApplyDate: this._currentDate,
                    DateOptions: {
                        'year-format': "'yy'",
                        'starting-day': 1,
                        showWeeks: false
                    },
                    ItemsCount: items.length,
                    TotalCost: totalCost,
                    PeriodClosed: false
                };
                $scope.Cancel = function () { return modalInstance.dismiss(); };
                $scope.Submit = function () {
                    modalInstance.close($scope.Model.ApplyDate);
                };
                $scope.ValidateDate = function (value) {
                    if (!value) {
                        return false;
                    }
                    var m = moment(value);
                    if (!m.isValid()) {
                        return false;
                    }
                    return !m.isAfter(moment());
                };
                $scope.Model.ShowApplyDate = false;
                $scope.OpenApplyDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.Model.ShowApplyDate = !$scope.Model.ShowApplyDate;
                };
                $scope.Init = function () {
                    _this.$scope.UpdatePeriodClosedStatus(_this._currentDate);
                    _this.$scope.$watch("Model.ApplyDate", function () {
                        if (_this._currentDate !== $scope.Model.ApplyDate) {
                            _this._currentDate = $scope.Model.ApplyDate;
                            _this.$scope.UpdatePeriodClosedStatus($scope.Model.ApplyDate);
                        }
                    });
                };
                $scope.UpdatePeriodClosedStatus = function (currentDate) {
                    $periodCloseService.GetPeriodLockStatus(_this._user.BusinessUser.MobileSettings.EntityId, moment(currentDate).format(_this.constants.InternalDateFormat))
                        .success(function (result) {
                        $scope.Model.PeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Waste_CanEditClosedPeriods));
                    });
                };
                $scope.Init();
            }
            return WasteConfirmController;
        }());
        Core.NG.InventoryWasteModule.RegisterNamedController("WasteConfirmController", WasteConfirmController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("items"), Core.NG.$typedCustomResolve("totalCost"), Core.Auth.$authService, Workforce.PeriodClose.Api.$periodCloseService, Core.Constants);
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
