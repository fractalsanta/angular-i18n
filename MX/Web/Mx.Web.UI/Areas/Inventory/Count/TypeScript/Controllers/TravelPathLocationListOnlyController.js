var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var TravelPathLocationListOnlyController = (function () {
            function TravelPathLocationListOnlyController($scope, $modalInstance, travelPathService, translationService) {
                this.$scope = $scope;
                this.$modalInstance = $modalInstance;
                this.travelPathService = travelPathService;
                this.translationService = translationService;
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                });
                $scope.TravelPathData = null;
                $scope.SelectedLocations = [];
                travelPathService.GetModelPromise().then(function (result) {
                    $scope.TravelPathData = result.data;
                    var currentLocationId = travelPathService.GetCurrentLocation().Id;
                    $scope.TravelPathData.TravelPath = _.filter($scope.TravelPathData.TravelPath, function (item) { return item.LocationType != "SystemNewItem" && item.Id !== currentLocationId; });
                });
                $scope.MultiSelect = travelPathService.GetLocationModalListMultiSelect();
                $scope.LocationClicked = function (travelPathItem) {
                    if (!travelPathService.GetLocationModalListMultiSelect()) {
                        $scope.SelectedLocations = [];
                    }
                    var isLocationAlreadySelected = _.contains($scope.SelectedLocations, travelPathItem);
                    if (isLocationAlreadySelected) {
                        $scope.SelectedLocations = _.without($scope.SelectedLocations, travelPathItem);
                    }
                    else {
                        $scope.SelectedLocations.push(travelPathItem);
                    }
                };
                $scope.SelectLocationClicked = function () {
                    $modalInstance.close($scope.SelectedLocations);
                };
                $scope.Cancel = function () { return $modalInstance.dismiss(); };
                $scope.CheckLocationAlreadySelected = function (travelPathItem) {
                    var isLocationAlreadySelected = _.contains($scope.SelectedLocations, travelPathItem);
                    return isLocationAlreadySelected;
                };
            }
            return TravelPathLocationListOnlyController;
        }());
        Core.NG.InventoryCountModule.RegisterNamedController("TravelPathLocationListOnlyController", TravelPathLocationListOnlyController, Core.NG.$typedScope(), Core.NG.$modalInstance, Count.$travelPathService, Core.$translation);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
