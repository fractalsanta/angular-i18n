module Inventory.Count {

    interface INewLocation {
        NewLocationName: string;
    }

    interface ITravelPathLocationControllerScope extends ng.IScope {
        TravelPathData: Inventory.Count.Api.Models.ITravelPathEntity;
        LocationClicked(travelPathItem: Inventory.Count.Api.Models.ITravelPath): void;   
        CurrentTravelPathItem(): Inventory.Count.Api.Models.ITravelPath; 

        LocationSortIconClicked(item: Inventory.Count.Api.Models.ITravelPath): void;
        CancelSort(): void;
        SelectedLocation: Inventory.Count.Api.Models.ITravelPath;

        AddLocationClicked(newLocationName: string): void;

        CancelEditLocation(): void;
        CancelEditOfOtherLocation(item: Inventory.Count.Api.Models.ITravelPath) : void;

        RenameLocation(travelPathItem: Inventory.Count.Api.Models.ITravelPath): void;
        DeleteLocation(travelPathItem: Inventory.Count.Api.Models.ITravelPath): void;
        CanDeleteLocation(travePathItem: Inventory.Count.Api.Models.ITravelPath): boolean;
        Cancel(): void;

        CheckCanDeleteLocation(): boolean;
        NewLocation: INewLocation;
        LocationItemInEdit: Inventory.Count.Api.Models.ITravelPath;
        OldLocationName: string;
        LocationEditClicked(item: Inventory.Count.Api.Models.ITravelPath);
        IsLocationInEdit(item: Inventory.Count.Api.Models.ITravelPath);  
        
        Translation: Api.Models.IL10N;      
}


    class TravelPathLocationController {

        private currentLocationIdx: number = 0;        

        constructor(
            private $scope: ITravelPathLocationControllerScope,
            private popupMessageService: Core.IPopupMessageService,
            private $authService: Core.Auth.IAuthService,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private travelPathService: ITravelPathService,
            private travelPathLocationService: Api.ITravelPathLocationService,
            private confirmationService: Core.IConfirmationService,
            private translationService: Core.ITranslationService
        ) {

            var user = $authService.GetUser();

            translationService.GetTranslations().then((result) => {
                $scope.Translation = result.InventoryCount;
            });

            popupMessageService.ClearMessages();

            $scope.LocationItemInEdit = null;
            $scope.TravelPathData = null;
            $scope.SelectedLocation = null;
            $scope.NewLocation = <INewLocation>{};


            travelPathService.GetModelPromise().then((result) => {
                $scope.TravelPathData = result.data;
                $scope.TravelPathData.TravelPath = _.filter($scope.TravelPathData.TravelPath, (location) => { return this.IsLocationModifiable(location); });
            });

            $scope.LocationClicked = (travelPathItem) => {
                this.currentLocationIdx = _.indexOf($scope.TravelPathData.TravelPath, travelPathItem);
            };

            $scope.CheckCanDeleteLocation = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_CanDeleteLocation);
            };

            $scope.CanDeleteLocation = (item: Inventory.Count.Api.Models.ITravelPath)=> {
                return $scope.CheckCanDeleteLocation() && item.Items.length === 0 && item.Id !== 0;
            };

            $scope.CurrentTravelPathItem = ()=> {
                if ($scope.TravelPathData != null) {

                    if ($scope.TravelPathData.TravelPath != null && $scope.TravelPathData.TravelPath.length > this.currentLocationIdx) {
                        return this.$scope.TravelPathData.TravelPath[this.currentLocationIdx];
                    } else {
                        return null;
                    }
                }
                return null;
        };


            $scope.LocationEditClicked = (item: Inventory.Count.Api.Models.ITravelPath) => {
                if ($scope.LocationItemInEdit != item) {
                    $scope.CancelEditLocation();
                    $scope.CancelSort();
                    $scope.OldLocationName = item.Location;
                    $scope.LocationItemInEdit = item;
                }
            };

            $scope.IsLocationInEdit = (item: Inventory.Count.Api.Models.ITravelPath)=> {
                return $scope.LocationItemInEdit === item;
            };

            $scope.CancelSort = ()=> {
                $scope.SelectedLocation = null;
            };

            //fa-bars fa-thumb-tack fa-bullseye Icons
            //Item icon(s) click event
            //1st click - selects an Item - $scope.SelectedItem
            //2nd click - performs sort
            $scope.LocationSortIconClicked = (item) => {

                if ($scope.SelectedLocation == null) {
                    $scope.CancelEditLocation();
                    $scope.SelectedLocation = item;
                } else {

                    if ($scope.SelectedLocation !== item) {

                        var entityId = user.BusinessUser.MobileSettings.EntityId;

                        travelPathLocationService.PutLocation(
                            0 //locationId - for activate / deactivate / rename
                            , entityId, "" //newLocationName
                            , item.Id //targetLocatioId
                            , $scope.SelectedLocation.Id //movingLocationId
                            , false //activateLocation
                            , false //deactivateLocation
                            , false // renameLocation
                            , true //resortLocation
                            , this.travelPathService.GetSignalRconnectionId()
                            ).then(result=> {

                                var locations = this.travelPathService.GetLocations(entityId);
                                var systemNewItem = locations[0];
                                for (var i = 0; i < locations.length; i++) {
                                    if (locations[i].LocationType === "SystemNewItem")
                                        systemNewItem = locations[i];
                                    break;
                                }
                                $scope.TravelPathData.TravelPath.splice(0, 0, systemNewItem);

                            $scope.TravelPathData.TravelPath = _.without($scope.TravelPathData.TravelPath, $scope.SelectedLocation);
                            var newposIdx = _.findIndex($scope.TravelPathData.TravelPath, (arrItem)=> { return arrItem === item; });
                            $scope.TravelPathData.TravelPath.splice(newposIdx + 1, 0, $scope.SelectedLocation);
                            $scope.SelectedLocation = null;

                            var locationIds = _.map($scope.TravelPathData.TravelPath, (tp) => tp.Id);
                            this.travelPathService.ResortLocations(locationIds, entityId);

                                $scope.TravelPathData.TravelPath = _.filter($scope.TravelPathData.TravelPath, (location) => { return this.IsLocationSortable(location); });
                        });
                    } else {
                        $scope.SelectedLocation = null;
                    }
                }
            };

            $scope.RenameLocation = (travelPathItem: Inventory.Count.Api.Models.ITravelPath) => {

                if (!_.some($scope.TravelPathData.TravelPath, (element) => { return element.Location === travelPathItem.Location && element.Id !== travelPathItem.Id; })) {

                    var entityId = user.BusinessUser.MobileSettings.EntityId;

                    travelPathLocationService.PutLocation(
                        travelPathItem.Id //locationId - for activate / deactivate / rename
                        , entityId
                        , travelPathItem.Location //newLocationName
                        , 0 //targetLocatioId
                        , 0 //movingLocationId
                        , false //activateLocation
                        , false //deactivateLocation
                        , true // renameLocation
                        , false //resortLocation
                        , this.travelPathService.GetSignalRconnectionId()
                        ).then(result=> {
                            popupMessageService.ShowSuccess($scope.Translation.TravelPathLocationHasBeenUpdated);
                            this.travelPathService.RenameLocation(travelPathItem.Id, travelPathItem.Location, entityId);

                        $scope.LocationItemInEdit = null;
                    });  
                                                             
                    } else {
                        popupMessageService.ShowError($scope.Translation.TravelPathLocationAlreadyExists);
                }

            };

            $scope.AddLocationClicked = (newLocationName: string)=> {
                
                var newLocation = <Api.Models.ITravelPath>{
                    Id: 0,
                    Location: newLocationName,
                    LocationType: "",
                    Items:[]
                };

                if (!_.some($scope.TravelPathData.TravelPath, (element) => { return element.Location.toLowerCase() === newLocationName.toLowerCase(); })) {

                    var entityId = user.BusinessUser.MobileSettings.EntityId;

                    travelPathLocationService.PostAddLocation(entityId, newLocationName, this.travelPathService.GetSignalRconnectionId()).then((result) => {
                        newLocation.Id = result.data.Id;

                        $scope.TravelPathData.TravelPath.push(newLocation);
                        this.currentLocationIdx = _.indexOf($scope.TravelPathData.TravelPath, newLocation);
                        $scope.NewLocation.NewLocationName = "";
                        popupMessageService.ShowSuccess($scope.Translation.TravelPathLocationHasBeenAdded);

                        this.travelPathService.AddNewLocation(result.data, entityId);

                    });
                } else {
                    popupMessageService.ShowError($scope.Translation.TravelPathLocationAlreadyExists);
                }

            };

            $scope.CancelEditLocation = () => {
                if ($scope.LocationItemInEdit != null) {
                    $scope.LocationItemInEdit.Location = $scope.OldLocationName;
                    $scope.LocationItemInEdit = null;
                }
            };

            $scope.DeleteLocation = (travelPathItem: Inventory.Count.Api.Models.ITravelPath)=> {
                confirmationService.Confirm( {
                    Title: $scope.Translation.DeleteLocation,
                    Message: $scope.Translation.TravelPathDoYouWantToDeleteLocation.toString().format(travelPathItem.Location),
                    ConfirmText: $scope.Translation.DeleteText,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger
                }).then((result) => {
                    if (result) {

                        var entityId = user.BusinessUser.MobileSettings.EntityId;

                        travelPathLocationService.DeleteLocation(travelPathItem.Id, entityId, this.travelPathService.GetSignalRconnectionId()).then(() => {
                            popupMessageService.ShowSuccess($scope.Translation.TravelPathLocationHasBeenDeleted);
                            $scope.TravelPathData.TravelPath = _.without($scope.TravelPathData.TravelPath, travelPathItem);
                            this.currentLocationIdx = 0;

                            this.travelPathService.DeActivateLocation(travelPathItem.Id, entityId);
                        });
                    }
                });

            };

            $scope.Cancel = ()=> {
                this.popupMessageService.ClearMessages();
                modalInstance.dismiss();
            };
        }

        private IsLocationModifiable(location: Api.Models.ITravelPath) {
            //must be a User or SystemDefault location type to be allowed to Rename, Move or Delete
            return location.LocationType === "User" || location.LocationType === "SystemDefault";
        }

        private IsLocationSortable(location: Api.Models.ITravelPath) {
            return location.LocationType != "SystemNewItem";
        }
    }

    Core.NG.InventoryCountModule.RegisterNamedController("TravelPathLocationController", TravelPathLocationController,
        Core.NG.$typedScope<ITravelPathLocationControllerScope>(),
        Core.$popupMessageService,
        Core.Auth.$authService,
        Core.NG.$modalInstance,
        $travelPathService,
        Inventory.Count.Api.$travelPathLocationService,
        Core.$confirmationService,
        Core.$translation
        );

}  