var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ConfigureColumnsController = (function () {
            function ConfigureColumnsController($scope, $modalInstance, $translation, columnDefinitions) {
                $translation.GetTranslations().then(function (result) {
                    $scope.Translations = result.InventoryOrder;
                });
                $scope.SortingOptions = {
                    ConnectWith: ".mx-column-container",
                    Stop: function () {
                        if ($scope.ActiveColumns.length > 3) {
                            $scope.InactiveColumns.unshift($scope.ActiveColumns.pop());
                        }
                        else if ($scope.ActiveColumns.length < 3) {
                            $scope.ActiveColumns.push($scope.InactiveColumns.shift());
                        }
                    }
                };
                $scope.ActiveColumns = columnDefinitions.slice(0, 3);
                $scope.InactiveColumns = columnDefinitions.slice(3);
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.Confirm = function () {
                    $modalInstance.close($scope.ActiveColumns.concat($scope.InactiveColumns));
                };
            }
            return ConfigureColumnsController;
        }());
        Core.NG.InventoryOrderModule.RegisterNamedController("ConfigureColumnsController", ConfigureColumnsController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("columnDefinitions"));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
