var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var TravelPathLocationController = (function () {
            function TravelPathLocationController($scope, popupMessageService, $authService, modalInstance, travelPathService, travelPathLocationService, confirmationService, translationService) {
                var _this = this;
                this.$scope = $scope;
                this.popupMessageService = popupMessageService;
                this.$authService = $authService;
                this.modalInstance = modalInstance;
                this.travelPathService = travelPathService;
                this.travelPathLocationService = travelPathLocationService;
                this.confirmationService = confirmationService;
                this.translationService = translationService;
                this.currentLocationIdx = 0;
                var user = $authService.GetUser();
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                });
                popupMessageService.ClearMessages();
                $scope.LocationItemInEdit = null;
                $scope.TravelPathData = null;
                $scope.SelectedLocation = null;
                $scope.NewLocation = {};
                travelPathService.GetModelPromise().then(function (result) {
                    $scope.TravelPathData = result.data;
                    $scope.TravelPathData.TravelPath = _.filter($scope.TravelPathData.TravelPath, function (location) { return _this.IsLocationModifiable(location); });
                });
                $scope.LocationClicked = function (travelPathItem) {
                    _this.currentLocationIdx = _.indexOf($scope.TravelPathData.TravelPath, travelPathItem);
                };
                $scope.CheckCanDeleteLocation = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_CanDeleteLocation);
                };
                $scope.CanDeleteLocation = function (item) {
                    return $scope.CheckCanDeleteLocation() && item.Items.length === 0 && item.Id !== 0;
                };
                $scope.CurrentTravelPathItem = function () {
                    if ($scope.TravelPathData != null) {
                        if ($scope.TravelPathData.TravelPath != null && $scope.TravelPathData.TravelPath.length > _this.currentLocationIdx) {
                            return _this.$scope.TravelPathData.TravelPath[_this.currentLocationIdx];
                        }
                        else {
                            return null;
                        }
                    }
                    return null;
                };
                $scope.LocationEditClicked = function (item) {
                    if ($scope.LocationItemInEdit != item) {
                        $scope.CancelEditLocation();
                        $scope.CancelSort();
                        $scope.OldLocationName = item.Location;
                        $scope.LocationItemInEdit = item;
                    }
                };
                $scope.IsLocationInEdit = function (item) {
                    return $scope.LocationItemInEdit === item;
                };
                $scope.CancelSort = function () {
                    $scope.SelectedLocation = null;
                };
                $scope.LocationSortIconClicked = function (item) {
                    if ($scope.SelectedLocation == null) {
                        $scope.CancelEditLocation();
                        $scope.SelectedLocation = item;
                    }
                    else {
                        if ($scope.SelectedLocation !== item) {
                            var entityId = user.BusinessUser.MobileSettings.EntityId;
                            travelPathLocationService.PutLocation(0, entityId, "", item.Id, $scope.SelectedLocation.Id, false, false, false, true, _this.travelPathService.GetSignalRconnectionId()).then(function (result) {
                                var locations = _this.travelPathService.GetLocations(entityId);
                                var systemNewItem = locations[0];
                                for (var i = 0; i < locations.length; i++) {
                                    if (locations[i].LocationType === "SystemNewItem")
                                        systemNewItem = locations[i];
                                    break;
                                }
                                $scope.TravelPathData.TravelPath.splice(0, 0, systemNewItem);
                                $scope.TravelPathData.TravelPath = _.without($scope.TravelPathData.TravelPath, $scope.SelectedLocation);
                                var newposIdx = _.findIndex($scope.TravelPathData.TravelPath, function (arrItem) { return arrItem === item; });
                                $scope.TravelPathData.TravelPath.splice(newposIdx + 1, 0, $scope.SelectedLocation);
                                $scope.SelectedLocation = null;
                                var locationIds = _.map($scope.TravelPathData.TravelPath, function (tp) { return tp.Id; });
                                _this.travelPathService.ResortLocations(locationIds, entityId);
                                $scope.TravelPathData.TravelPath = _.filter($scope.TravelPathData.TravelPath, function (location) { return _this.IsLocationSortable(location); });
                            });
                        }
                        else {
                            $scope.SelectedLocation = null;
                        }
                    }
                };
                $scope.RenameLocation = function (travelPathItem) {
                    if (!_.some($scope.TravelPathData.TravelPath, function (element) { return element.Location === travelPathItem.Location && element.Id !== travelPathItem.Id; })) {
                        var entityId = user.BusinessUser.MobileSettings.EntityId;
                        travelPathLocationService.PutLocation(travelPathItem.Id, entityId, travelPathItem.Location, 0, 0, false, false, true, false, _this.travelPathService.GetSignalRconnectionId()).then(function (result) {
                            popupMessageService.ShowSuccess($scope.Translation.TravelPathLocationHasBeenUpdated);
                            _this.travelPathService.RenameLocation(travelPathItem.Id, travelPathItem.Location, entityId);
                            $scope.LocationItemInEdit = null;
                        });
                    }
                    else {
                        popupMessageService.ShowError($scope.Translation.TravelPathLocationAlreadyExists);
                    }
                };
                $scope.AddLocationClicked = function (newLocationName) {
                    var newLocation = {
                        Id: 0,
                        Location: newLocationName,
                        LocationType: "",
                        Items: []
                    };
                    if (!_.some($scope.TravelPathData.TravelPath, function (element) { return element.Location.toLowerCase() === newLocationName.toLowerCase(); })) {
                        var entityId = user.BusinessUser.MobileSettings.EntityId;
                        travelPathLocationService.PostAddLocation(entityId, newLocationName, _this.travelPathService.GetSignalRconnectionId()).then(function (result) {
                            newLocation.Id = result.data.Id;
                            $scope.TravelPathData.TravelPath.push(newLocation);
                            _this.currentLocationIdx = _.indexOf($scope.TravelPathData.TravelPath, newLocation);
                            $scope.NewLocation.NewLocationName = "";
                            popupMessageService.ShowSuccess($scope.Translation.TravelPathLocationHasBeenAdded);
                            _this.travelPathService.AddNewLocation(result.data, entityId);
                        });
                    }
                    else {
                        popupMessageService.ShowError($scope.Translation.TravelPathLocationAlreadyExists);
                    }
                };
                $scope.CancelEditLocation = function () {
                    if ($scope.LocationItemInEdit != null) {
                        $scope.LocationItemInEdit.Location = $scope.OldLocationName;
                        $scope.LocationItemInEdit = null;
                    }
                };
                $scope.DeleteLocation = function (travelPathItem) {
                    confirmationService.Confirm({
                        Title: $scope.Translation.DeleteLocation,
                        Message: $scope.Translation.TravelPathDoYouWantToDeleteLocation.toString().format(travelPathItem.Location),
                        ConfirmText: $scope.Translation.DeleteText,
                        ConfirmationType: Core.ConfirmationTypeEnum.Danger
                    }).then(function (result) {
                        if (result) {
                            var entityId = user.BusinessUser.MobileSettings.EntityId;
                            travelPathLocationService.DeleteLocation(travelPathItem.Id, entityId, _this.travelPathService.GetSignalRconnectionId()).then(function () {
                                popupMessageService.ShowSuccess($scope.Translation.TravelPathLocationHasBeenDeleted);
                                $scope.TravelPathData.TravelPath = _.without($scope.TravelPathData.TravelPath, travelPathItem);
                                _this.currentLocationIdx = 0;
                                _this.travelPathService.DeActivateLocation(travelPathItem.Id, entityId);
                            });
                        }
                    });
                };
                $scope.Cancel = function () {
                    _this.popupMessageService.ClearMessages();
                    modalInstance.dismiss();
                };
            }
            TravelPathLocationController.prototype.IsLocationModifiable = function (location) {
                return location.LocationType === "User" || location.LocationType === "SystemDefault";
            };
            TravelPathLocationController.prototype.IsLocationSortable = function (location) {
                return location.LocationType != "SystemNewItem";
            };
            return TravelPathLocationController;
        }());
        Core.NG.InventoryCountModule.RegisterNamedController("TravelPathLocationController", TravelPathLocationController, Core.NG.$typedScope(), Core.$popupMessageService, Core.Auth.$authService, Core.NG.$modalInstance, Count.$travelPathService, Inventory.Count.Api.$travelPathLocationService, Core.$confirmationService, Core.$translation);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
