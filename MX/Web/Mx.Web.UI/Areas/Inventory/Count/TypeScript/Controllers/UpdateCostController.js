var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var UpdateCostController = (function () {
            function UpdateCostController($scope, $authService, $modalInstance, updateCostCheckService, translationService, popupMessageService, constants, IsJustReturnUpdated) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.$modalInstance = $modalInstance;
                this.updateCostCheckService = updateCostCheckService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.constants = constants;
                this.IsJustReturnUpdated = IsJustReturnUpdated;
                this._numericInputPattern = new RegExp(constants.NumericalInputBoxPattern);
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                    if (!$scope.CheckUpdateCostPermission()) {
                        popupMessageService.ShowError($scope.Translation.CountUpdateCostPermission);
                    }
                });
                var user = $authService.GetUser();
                $scope.HasNoCostItems = true;
                $modalInstance.result.then(null, function (reason) {
                    if (reason === "backdrop click") {
                        $scope.UndoCostChanges();
                    }
                });
                $scope.NumericalInputBoxPattern = function () { return _this._numericInputPattern; };
                $scope.ItemCostChanged = function () {
                    $scope.HasNoCostItems = _.some($scope.NoCostItems, (function (item) {
                        if (item.ItemCost == 0 || item.ItemCost == null) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }));
                };
                $scope.UpdateCost = function () {
                    var promise = {};
                    if (!$scope.HasNoCostItems) {
                        var updatecostRequest = _this.GetUpdateCostRequest(_this.$scope.NoCostItems);
                        promise = _this.updateCostCheckService.UpdateNoCostItems(updatecostRequest);
                    }
                    return promise;
                };
                if (updateCostCheckService.HasNoCostItems()) {
                    $scope.NoCostItems = updateCostCheckService.GetNoCostValues();
                }
                $scope.Continue = function () {
                    if (!_this.IsJustReturnUpdated) {
                        $scope.UpdateCost().then(function () {
                            $scope.DialogResult = true;
                            $modalInstance.close($scope.DialogResult);
                        });
                    }
                    else {
                        $modalInstance.close(_this.GetUpdateCostRequest(_this.$scope.NoCostItems));
                    }
                };
                $scope.Cancel = function () {
                    $scope.UndoCostChanges();
                    $scope.DialogResult = false;
                    $modalInstance.dismiss("Cancel");
                };
                $scope.UndoCostChanges = function () {
                    _.forEach($scope.NoCostItems, function (item) {
                        item.ItemCost = null;
                    });
                };
                $scope.CheckUpdateCostPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanUpdate_Cost);
                };
            }
            UpdateCostController.prototype.GetUpdateCostRequest = function (noCostItems) {
                var updatecostRequest = new Array();
                _.forEach(noCostItems, function (item) {
                    var updatecostModel = {};
                    updatecostModel.ItemId = item.ItemId;
                    updatecostModel.InventoryUnitCost = item.ItemCost;
                    updatecostModel.ReportingUnit = item.OuterUnit || item.InventoryUnit;
                    updatecostModel.InventoryUnit = item.InventoryUnit;
                    updatecostRequest.push(updatecostModel);
                });
                return updatecostRequest;
            };
            return UpdateCostController;
        }());
        Core.NG.InventoryCountModule.RegisterNamedController("UpdateCostInventory", UpdateCostController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$modalInstance, Count.$countService, Core.$translation, Core.$popupMessageService, Core.Constants, Core.NG.$typedCustomResolve("IsJustReturnUpdated"));
        Core.NG.InventoryCountModule.RegisterNamedController("UpdateCostTransfers", UpdateCostController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$modalInstance, Inventory.Transfer.transfersService, Core.$translation, Core.$popupMessageService, Core.Constants, Core.NG.$typedCustomResolve("IsJustReturnUpdated"));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
