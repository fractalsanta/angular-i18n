var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var TransferAddItemsController = (function () {
            function TransferAddItemsController($scope, $log, $authService, modalInstance, transferStoreService, translationService, existingItems, fromStoreId, toStoreId, direction) {
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryTransfer;
                });
                $scope.IsPresent = function (item) {
                    return _.some(existingItems, function (selected) {
                        return item.Id == selected.Id
                            && item.Description == selected.Description
                            && item.Code == selected.Code;
                    });
                };
                $scope.IsSelected = function (item) {
                    return _.some($scope.AddSelectedItems, function (selected) {
                        return item.Id == selected.Id
                            && item.Description == selected.Description
                            && item.Code == selected.Code;
                    });
                };
                $scope.AddSelectedItems = [];
                $scope.Search = function (searchText) {
                    if (searchText.length >= 1) {
                        transferStoreService.GetTransferableItemsBetweenStoresLimited(+fromStoreId, +toStoreId, searchText, direction)
                            .success(function (items) {
                            _.forEach(items, function (item) {
                                if (!item.OnHandQuantity) {
                                    item.OnHandQuantity = 0;
                                }
                            });
                            $scope.Items = _.uniq(_.union($scope.AddSelectedItems, items), false, function (item) { return item.Id; });
                        });
                    }
                };
                $scope.AddItem = function (item) {
                    if (!$scope.IsSelected(item)) {
                        $scope.AddSelectedItems.push(item);
                    }
                    else {
                        _.remove($scope.AddSelectedItems, function (x) {
                            return x.Id == item.Id
                                && x.Description == item.Description
                                && x.Code == item.Code;
                        });
                    }
                    $scope.AddSelectedItems = _.sortBy($scope.AddSelectedItems, function (value) { return value.Description + value.Code; });
                };
                $scope.Cancel = function () { return modalInstance.dismiss(); };
                $scope.AddItemsToQueue = function () {
                    modalInstance.close($scope.AddSelectedItems);
                };
            }
            return TransferAddItemsController;
        }());
        Transfer.TransferAddItemsController = TransferAddItemsController;
        Core.NG.InventoryTransferModule.RegisterNamedController("transferAddItemsController", TransferAddItemsController, Core.NG.$typedScope(), Core.NG.$log, Core.Auth.$authService, Core.NG.$modalInstance, Inventory.Transfer.Api.$transferStoreService, Core.$translation, Core.NG.$typedCustomResolve("existingItems"), Core.NG.$typedCustomResolve("fromStoreId"), Core.NG.$typedCustomResolve("toStoreId"), Core.NG.$typedCustomResolve("direction"));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
