var Inventory;
(function (Inventory) {
    (function (Count) {
        "use strict";

        var TravelPathAddItemsController = (function () {
            function TravelPathAddItemsController($scope, $log, $authService, modalInstance, addItemsService, travelPathService, translationService) {
                this.$scope = $scope;
                this.$log = $log;
                this.$authService = $authService;
                this.modalInstance = modalInstance;
                this.addItemsService = addItemsService;
                this.travelPathService = travelPathService;
                this.translationService = translationService;
                var user = $authService.GetUser();

                $scope.AddSelectedItems = [];

                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                });

                $scope.Search = function (searchText) {
                    if (searchText.length >= 1) {
                        addItemsService.GetSearchItemsLimited(searchText, user.BusinessUser.MobileSettings.EntityId).success(function (results) {
                            var existingItems = travelPathService.GetCurrentLocation().Items;

                            results = _.sortBy(results, function (item) {
                                return item.Name;
                            });
                            results = _.union($scope.AddSelectedItems, results);
                            results = _.unique(results, function (item) {
                                return item.Id;
                            });

                            _.forEach(results, function (element) {
                                if (_.some(existingItems, function (exElement) {
                                    return element.Id === exElement.ItemId.toString();
                                })) {
                                    element.EnabledForSelection = false;
                                }
                            });

                            $scope.Items = results;
                        });
                    }
                };

                $scope.AddItemRowClicked = function (item) {
                    var isItemAlreadySelected = _.contains($scope.AddSelectedItems, item);

                    if (isItemAlreadySelected) {
                        $scope.AddSelectedItems = _.without($scope.AddSelectedItems, item);
                    } else {
                        $scope.AddSelectedItems.push(item);
                    }
                };

                $scope.CheckItemIsSelected = function (item) {
                    return _.contains($scope.AddSelectedItems, item);
                };

                $scope.Cancel = function () {
                    return modalInstance.dismiss();
                };

                $scope.AddItemsToLocation = function () {
                    var updateTravelPathModel = {};

                    updateTravelPathModel.Type = 5 /* Add */;
                    updateTravelPathModel.TargetId = 0;

                    updateTravelPathModel.AddItems = [];
                    updateTravelPathModel.Frequencies = [];
                    updateTravelPathModel.ItemIds = [];

                    _.forEach($scope.AddSelectedItems, function (x) {
                        updateTravelPathModel.AddItems.push(x.Name);
                        updateTravelPathModel.Frequencies.push(x.Freq);
                        updateTravelPathModel.ItemIds.push(Number(x.Id));
                    });

                    updateTravelPathModel.LocationId = 0;
                    updateTravelPathModel.TargetLocationId = travelPathService.GetCurrentLocation().Id;

                    travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId);

                    modalInstance.close();
                };
            }
            return TravelPathAddItemsController;
        })();

        Core.NG.InventoryCountModule.RegisterNamedController("TravelPathAddItemsController", TravelPathAddItemsController, Core.NG.$typedScope(), Core.NG.$log, Core.Auth.$authService, Core.NG.$modalInstance, Inventory.Count.Api.$travelPathAddItemsService, Count.$travelPathService, Core.$translation);
    })(Inventory.Count || (Inventory.Count = {}));
    var Count = Inventory.Count;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=TravelPathAddItemsController.js.map
