module Inventory.Count {

    interface ITravelPathLocationListOnlyControllerScope extends ng.IScope {
        TravelPathData: Inventory.Count.Api.Models.ITravelPathEntity;
        LocationClicked(travelPathItem: Inventory.Count.Api.Models.ITravelPath): void;
        SelectedLocations: Inventory.Count.Api.Models.ITravelPath[];
        CheckLocationAlreadySelected(travelPathItem: Inventory.Count.Api.Models.ITravelPath): void;

        SelectLocationClicked():void;
        Cancel(): void;

        Translation: Api.Models.IL10N;

        MultiSelect: boolean;
    }


    class TravelPathLocationListOnlyController {

        constructor(
            private $scope: ITravelPathLocationListOnlyControllerScope,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private travelPathService: ITravelPathService,
            private translationService: Core.ITranslationService
        ) {

            translationService.GetTranslations().then((result) => {
                $scope.Translation = result.InventoryCount;
            });

            $scope.TravelPathData = null;
            $scope.SelectedLocations = [];

            travelPathService.GetModelPromise().then(result => {
                $scope.TravelPathData = result.data;
                var currentLocationId = travelPathService.GetCurrentLocation().Id;
                $scope.TravelPathData.TravelPath = _.filter($scope.TravelPathData.TravelPath, item => item.LocationType != "SystemNewItem" && item.Id !== currentLocationId);
            });

            $scope.MultiSelect = travelPathService.GetLocationModalListMultiSelect();

            $scope.LocationClicked = (travelPathItem) => {
                if (!travelPathService.GetLocationModalListMultiSelect()) {
                    $scope.SelectedLocations = [];
                }

                var isLocationAlreadySelected = _.contains($scope.SelectedLocations, travelPathItem);
                if (isLocationAlreadySelected) {
                    $scope.SelectedLocations = _.without($scope.SelectedLocations, travelPathItem);
                } else {
                    $scope.SelectedLocations.push(travelPathItem);
                }               
            };

            $scope.SelectLocationClicked = () => {
                $modalInstance.close($scope.SelectedLocations);
            };

            $scope.Cancel = () => $modalInstance.dismiss();

            $scope.CheckLocationAlreadySelected = (travelPathItem: Inventory.Count.Api.Models.ITravelPath)=> {
                var isLocationAlreadySelected = _.contains($scope.SelectedLocations, travelPathItem);
                return isLocationAlreadySelected;
            };

        }

    }

    Core.NG.InventoryCountModule.RegisterNamedController("TravelPathLocationListOnlyController", TravelPathLocationListOnlyController,
        Core.NG.$typedScope<ITravelPathLocationListOnlyControllerScope>(),
        Core.NG.$modalInstance,
        $travelPathService,
        Core.$translation
        );

}  