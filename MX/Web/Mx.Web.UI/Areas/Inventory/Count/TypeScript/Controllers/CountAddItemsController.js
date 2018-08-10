var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var CountAddItemsController = (function () {
            function CountAddItemsController($scope, countService, $authService, modalInstance, translationService, $locationService, countId, locations) {
                var _this = this;
                this.$scope = $scope;
                this.countService = countService;
                this.$authService = $authService;
                this.modalInstance = modalInstance;
                this.translationService = translationService;
                this.$locationService = $locationService;
                this.countId = countId;
                this.locations = locations;
                $scope.SelectedItems = [];
                $scope.Locations = locations;
                if (locations.length > 0) {
                    $scope.LocationId = locations[0].Id;
                }
                $scope.ItemTypeId = 0;
                var user = $authService.GetUser();
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                    $scope.ItemTypes = [
                        { Name: $scope.Translation.AllItems, Value: 0 },
                        { Name: $scope.Translation.InventoryItems, Value: 1 },
                        { Name: $scope.Translation.VendorEntityItem, Value: 2 }];
                });
                $scope.Search = function (searchText) {
                    if (searchText.length >= 1) {
                        _this.countService.SearchAllEntityItemsAndVendorEntityItems(user.BusinessUser.MobileSettings.EntityId, countId, $scope.LocationId, $scope.ItemTypeId, searchText)
                            .success(function (items) {
                            _.forEach(items, function (item) {
                                item.VendorItemId > 0 ? item.DisplayItemType = $scope.Translation.VendorEntityItem : item.DisplayItemType = $scope.Translation.EntityItem;
                                item.LocationId = $scope.LocationId;
                            });
                            $scope.Items = items;
                        });
                    }
                };
                $scope.IsSelected = function (item) {
                    return _.some($scope.SelectedItems, function (selected) {
                        return item.Id === selected.Id
                            && item.VendorItemId === selected.VendorItemId
                            && item.Description === selected.Description
                            && item.ProductCode === selected.ProductCode;
                    });
                };
                $scope.AddItem = function (item) {
                    if (!$scope.IsSelected(item)) {
                        $scope.SelectedItems.push(item);
                    }
                    else {
                        _.remove($scope.SelectedItems, function (x) {
                            return x.Id === item.Id
                                && x.VendorItemId === item.VendorItemId
                                && x.Description === item.Description
                                && x.ProductCode === item.ProductCode;
                        });
                    }
                    $scope.SelectedItems = _.sortBy($scope.SelectedItems, function (value) { return value.Description + value.ProductCode; });
                };
                $scope.Cancel = function () { return modalInstance.dismiss(); };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                });
                $scope.ReturnItemsToCount = function () {
                    modalInstance.close($scope.SelectedItems);
                };
            }
            return CountAddItemsController;
        }());
        Count.CountAddItemsController = CountAddItemsController;
        Count.myCountAddItemsController = Core.NG.InventoryCountModule.RegisterNamedController("countAddItemsController", CountAddItemsController, Core.NG.$typedScope(), Count.$countService, Core.Auth.$authService, Core.NG.$modalInstance, Core.$translation, Core.NG.$location, Core.NG.$typedCustomResolve("countId"), Core.NG.$typedCustomResolve("locations"));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
