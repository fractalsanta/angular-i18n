var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        "use strict";
        var CostOption = (function () {
            function CostOption() {
            }
            CostOption.Cost = "cost";
            CostOption.Percent = "percent";
            return CostOption;
        }());
        Count.CostOption = CostOption;
        var ConfigureColumnsController = (function () {
            function ConfigureColumnsController($scope, $modalInstance, $translation, isPercent) {
                $scope.IsPercent = isPercent;
                $scope.CostOptionRadioBtnValue = $scope.IsPercent === true ? CostOption.Percent : CostOption.Cost;
                $translation.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryCount;
                });
                $scope.ChangeOption = function (option) {
                    $scope.CostOptionRadioBtnValue = option;
                    if (option === CostOption.Cost) {
                        $scope.IsPercent = false;
                    }
                    else {
                        $scope.IsPercent = true;
                    }
                };
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.Confirm = function () {
                    $modalInstance.close($scope.IsPercent);
                };
            }
            return ConfigureColumnsController;
        }());
        Core.NG.InventoryCountModule.RegisterNamedController("ConfigureColumnsController", ConfigureColumnsController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("isPercent"));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
