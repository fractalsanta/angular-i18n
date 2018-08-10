var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var TravelPathController = (function () {
            function TravelPathController($scope, travelPathService, $log, $authService, $modal, confirmation, $routeParams, popupMessageService, translationService, countService, $timeout) {
                var _this = this;
                this.$scope = $scope;
                this.travelPathService = travelPathService;
                this.$log = $log;
                this.$authService = $authService;
                this.$modal = $modal;
                this.confirmation = confirmation;
                this.popupMessageService = popupMessageService;
                this.translationService = translationService;
                this.$timeout = $timeout;
                this._currentLocationIdx = 0;
                this._signalRCallbackOccured = false;
                this._locationScrollIsSet = false;
                this._haveSelectedSearch = false;
                $scope.ClearSearchText = function () {
                    $scope.SetSearchItemText = "";
                };
                $scope.$watch('SetSearchItemText', function () {
                    if (_this._haveSelectedSearch) {
                        _this._haveSelectedSearch = false;
                        return;
                    }
                    $scope.ClearSearchResult();
                });
                var user = $authService.GetUser();
                $scope.LocationsToHighlight = [];
                $scope.ItemsToHighlight = [];
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                    popupMessageService.SetPageTitle($scope.Translation.TravelPath);
                });
                if ($routeParams.CountType != null) {
                    $scope.CountType = countService.GetCountType($routeParams.CountType);
                    $scope.CountTypeName = Count.Api.Models.CountType[$scope.CountType];
                }
                $scope.ClearSearchResult = function () {
                    $scope.LocationsToHighlight = [];
                    $scope.ItemsToHighlight = [];
                    _this._locationScrollIsSet = false;
                };
                $scope.LocationNeedsToBeHighlighted = function (location, firstOrPreviouslySelected) {
                    if (firstOrPreviouslySelected === void 0) { firstOrPreviouslySelected = false; }
                    if ($scope.SetSearchItemText == null || $scope.SetSearchItemText.length == 0) {
                        $scope.ClearSearchResult();
                        return false;
                    }
                    if (!firstOrPreviouslySelected) {
                        return _.some($scope.LocationsToHighlight, function (loc) {
                            return loc.Id == location.Id && loc.Location == location.Location;
                        });
                    }
                    else {
                        if (_this._currentLocationIdx > 0) {
                            if ($scope.TravelPathData.TravelPath[_this._currentLocationIdx] == location) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            return $scope.LocationsToHighlight.length > 0 && $scope.LocationsToHighlight[0].Id == location.Id && $scope.LocationsToHighlight[0].Location == location.Location;
                        }
                    }
                };
                $scope.LocationScrollToSet = function (location) {
                    var result = false;
                    if ($scope.LocationsToHighlight.length > 0) {
                        if (_this._signalRCallbackOccured) {
                            if ($scope.TravelPathData.TravelPath[_this._currentLocationIdx].Id == location.Id) {
                                result = true;
                            }
                            else {
                                result = false;
                            }
                            _this._signalRCallbackOccured = false;
                        }
                        else {
                            if (!_this._locationScrollIsSet) {
                                if (_this._currentLocationIdx > 0) {
                                    if ($scope.TravelPathData.TravelPath[_this._currentLocationIdx] == location) {
                                        result = true;
                                    }
                                    else {
                                        result = false;
                                    }
                                }
                                else {
                                    result = $scope.LocationsToHighlight.length > 0 && $scope.LocationsToHighlight[0].Id == location.Id && $scope.LocationsToHighlight[0].Location == location.Location;
                                }
                            }
                            if (result) {
                                _this._locationScrollIsSet = true;
                            }
                        }
                    }
                    return result;
                };
                $scope.LocationNeedsToBeHighlighted = function (location) {
                    return _.some($scope.LocationsToHighlight, function (loc) {
                        return loc.Id == location.Id && loc.Location == location.Location;
                    });
                };
                $scope.ItemNeedsToBeHighlighted = function (item, firstOnly) {
                    if (firstOnly === void 0) { firstOnly = false; }
                    if ($scope.SetSearchItemText == null || $scope.SetSearchItemText.length == 0) {
                        return false;
                    }
                    if (!firstOnly) {
                        return _.some($scope.ItemsToHighlight, function (element) {
                            return element.ItemId == item.ItemId;
                        });
                    }
                    else {
                        return $scope.ItemsToHighlight.length > 0 && $scope.ItemsToHighlight[0].ItemId == item.ItemId;
                    }
                };
                $scope.ItemIsLast = function (item) {
                    if ($scope.DoingUpdate && $scope.CheckedItem && $scope.CheckedItem.ItemId == item.ItemId) {
                        $scope.DoingUpdate = false;
                        return true;
                    }
                    return false;
                };
                $scope.SearchItemsInLocations = function (searchtext) {
                    if (searchtext != null && searchtext.length >= 1) {
                        var searchresult = _.uniq(_.where(travelPathService.FlattenTravelPathItems(), function (item) {
                            return item.Description.toLowerCase().indexOf(searchtext.toLowerCase()) > -1
                                || item.Code.toLowerCase().indexOf(searchtext.toLowerCase()) > -1;
                        }), function (x) { return x.ItemId; });
                        var decriptions = _.sortBy(searchresult, function (x) { return x.Description.toUpperCase() + x.Code.toUpperCase(); });
                        return _.first(decriptions, 10);
                    }
                    return null;
                };
                $scope.ResetSearchItem = function () {
                    if ($scope.LocationsToHighlight.length > 0) {
                        _this._signalRCallbackOccured = true;
                    }
                    $scope.ClearSearchText();
                };
                $scope.SetSearchItem = function (selected) {
                    _this._haveSelectedSearch = true;
                    $scope.LocationsToHighlight = [];
                    $scope.ItemsToHighlight = [];
                    _.forEach($scope.TravelPathData.TravelPath, function (location) {
                        _.forEach(_.where(location.Items, function (element) { return element.ItemId == selected.ItemId; }), function (el) {
                            $scope.ItemsToHighlight.push(el);
                            if (!_.contains($scope.LocationsToHighlight, location)) {
                                $scope.LocationsToHighlight.push(location);
                            }
                        });
                    });
                    if ($scope.LocationsToHighlight != null && $scope.LocationsToHighlight.length > 0) {
                        if ($scope.TravelPathData.TravelPath.length > _this._currentLocationIdx) {
                            if (!_.contains($scope.LocationsToHighlight, $scope.TravelPathData.TravelPath[_this._currentLocationIdx])) {
                                $scope.LocationClicked($scope.LocationsToHighlight[0]);
                            }
                        }
                        else {
                            _this._currentLocationIdx = 0;
                            $scope.LocationClicked($scope.LocationsToHighlight[0]);
                        }
                    }
                    if (!_this._signalRCallbackOccured) {
                        if ($scope.LocationsToHighlight.length > 1) {
                            _this.popupMessageService.ShowSuccess($scope.Translation.FoundInXLocations.format($scope.LocationsToHighlight.length));
                        }
                        else if ($scope.LocationsToHighlight.length == 1) {
                            _this.popupMessageService.ShowSuccess($scope.Translation.FoundInOneLocations);
                        }
                    }
                };
                $scope.CurrentTravelPathItem = function () {
                    if ($scope.TravelPathData.TravelPath != null && $scope.TravelPathData.TravelPath.length > _this._currentLocationIdx) {
                        return _this.$scope.TravelPathData.TravelPath[_this._currentLocationIdx];
                    }
                    else {
                        return null;
                    }
                };
                $scope.CheckSpotPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_SpotFrequency_CanView);
                };
                $scope.CheckDailyPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_DailyFrequency_CanView);
                };
                $scope.CheckWeeklyPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_WeeklyFrequency_CanView);
                };
                $scope.CheckMonthlyPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_MonthlyFrequency_CanView);
                };
                $scope.CheckPeriodicPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_PeriodicFrequency_CanView);
                };
                $scope.CheckCanDeleteItem = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_CanDeleteItem);
                };
                $scope.CheckCanViewUoms = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_UnitsOfMeasure_CanView) && $scope.TravelPathData.CanShowDisableCountForStockTakeUnits;
                };
                $scope.LocationClicked = function (travelPathItem) {
                    if (!$scope.TravelPathData || $scope.CurrentTravelPathItem() === travelPathItem) {
                        return;
                    }
                    _this._currentLocationIdx = _.indexOf($scope.TravelPathData.TravelPath, travelPathItem);
                    travelPathService.SetCurrentLocationIndex(_this._currentLocationIdx);
                    travelPathService.SetCurrentLocation(travelPathItem);
                    $scope.SelectedItem = null;
                    $scope.CheckedItem = null;
                    $scope.SelectedItems = [];
                };
                $scope.ItemTravelPathIconClicked = function (item) {
                    if ($scope.SelectedItem == null) {
                        $scope.SelectedItem = item;
                        $scope.CheckedItem = item;
                        $scope.SelectedItems = [];
                    }
                    else {
                        if ($scope.SelectedItem != item) {
                            $scope.DoingUpdate = true;
                            var updateTravelPathModel = {};
                            updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Sort;
                            updateTravelPathModel.TargetId = item.ItemId;
                            updateTravelPathModel.ItemIds = [$scope.SelectedItem.ItemId];
                            updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                            travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).then(function (result) {
                                $scope.CurrentTravelPathItem().Items = _.without($scope.CurrentTravelPathItem().Items, $scope.SelectedItem);
                                var newposIdx = _.findIndex($scope.CurrentTravelPathItem().Items, function (arrItem) { return arrItem == item; });
                                $scope.CurrentTravelPathItem().Items.splice(newposIdx + 1, 0, $scope.SelectedItem);
                                $scope.SelectedItem = null;
                            });
                        }
                        else {
                            $scope.SelectedItem = null;
                        }
                    }
                };
                $scope.ItemRowClicked = function (item) {
                    $scope.SelectedItem = null;
                    $scope.CheckedItem = item;
                    if ($scope.SelectedItems != null) {
                        var isItemAlreadySelected = _.contains($scope.SelectedItems, item);
                        if (isItemAlreadySelected) {
                            $scope.SelectedItems = _.without($scope.SelectedItems, item);
                        }
                        else {
                            $scope.SelectedItems.push(item);
                        }
                    }
                };
                $scope.CheckItemIsSelected = function (item) {
                    return _.contains($scope.SelectedItems, item);
                };
                $scope.SelectedItem = null;
                $scope.SelectedItems = [];
                $scope.CurrentViewingMode = 0;
                $scope.TranslatedCurrentViewingMode = function () {
                    if ($scope.CurrentViewingMode === Count.Api.Models.TravelPathCountUpdateMode.UnitOfMeasure) {
                        return $scope.Translation.UnitOfMeasure;
                    }
                    return $scope.Translation.CountFrequency;
                };
                $scope.TravelPathData = travelPathService.GetModel().TravelPathEntity;
                travelPathService.ModelReceived.SubscribeController($scope, function () {
                    $scope.DoingUpdate = true;
                    var locations = ($scope.TravelPathData) ? $scope.TravelPathData.TravelPath : null;
                    $scope.ResetSearchItem();
                    if (locations && locations.length > 0) {
                        var lastSelectedLocation = travelPathService.GetCurrentLocation(), foundIndex = null;
                        if (lastSelectedLocation) {
                            foundIndex = _.findIndex(locations, function (currentLocation) {
                                return currentLocation.Id === lastSelectedLocation.Id;
                            });
                        }
                        _this._currentLocationIdx = (foundIndex !== null && foundIndex > -1) ? foundIndex : 0;
                        travelPathService.SetCurrentLocationIndex(_this._currentLocationIdx);
                        travelPathService.SetCurrentLocation($scope.TravelPathData.TravelPath[_this._currentLocationIdx]);
                        $scope.SelectedItem = null;
                        $scope.SelectedItems = [];
                        if (_this.IsIOS712()) {
                            $timeout(function () {
                                $(".IOS712FIX tbody").append("<tr style='height: 1px;' id='find-me-tr' style='visibility: hidden;'><td span='4'></td></tr>");
                                $timeout(function () {
                                    $("#find-me-tr").remove();
                                });
                            }, 500);
                        }
                    }
                });
                $scope.AddNewItems = function () {
                    travelPathService.SetCurrentLocationIndex(_this._currentLocationIdx);
                    travelPathService.SetCurrentLocation($scope.CurrentTravelPathItem());
                    var addItemModel = {
                        ExistingCodes: _.map(travelPathService.GetCurrentLocation().Items, function (item) { return item.Code; }),
                        VendorId: null
                    };
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                        controller: "Inventory.AddItemsControllerTravelPath",
                        resolve: {
                            addItemModel: function () { return addItemModel; }
                        }
                    }).result.then(function (items) {
                        var updateTravelPathModel = {};
                        updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Add;
                        updateTravelPathModel.TargetId = 0;
                        updateTravelPathModel.AddItems = [];
                        updateTravelPathModel.Frequencies = [];
                        updateTravelPathModel.ItemIds = [];
                        _.forEach(items, function (x) {
                            updateTravelPathModel.AddItems.push(x.Name);
                            updateTravelPathModel.Frequencies.push(x.Freq);
                            updateTravelPathModel.ItemIds.push(x.Id);
                        });
                        updateTravelPathModel.LocationId = 0;
                        updateTravelPathModel.TargetLocationId = travelPathService.GetCurrentLocation().Id;
                        travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId);
                    });
                };
                $scope.ManageLocationsClick = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/TravelPathLocation.html",
                        controller: "Inventory.Count.TravelPathLocationController",
                        resolve: {
                            currentLocationIdx: function () { return _this._currentLocationIdx; }
                        }
                    }).result.then(function (result) {
                    });
                };
                $scope.ItemCountTypeClick = function (item, countType, location) {
                    var countTypeEnabled = false;
                    if (countType == Count.Api.Models.CountType.Spot) {
                        item.IsSpotCounted = !item.IsSpotCounted;
                        countTypeEnabled = item.IsSpotCounted;
                    }
                    if (countType == Count.Api.Models.CountType.Daily) {
                        item.IsDailyCounted = !item.IsDailyCounted;
                        countTypeEnabled = item.IsDailyCounted;
                    }
                    if (countType == Count.Api.Models.CountType.Weekly) {
                        item.IsWeeklyCounted = !item.IsWeeklyCounted;
                        countTypeEnabled = item.IsWeeklyCounted;
                    }
                    if (countType == Count.Api.Models.CountType.Monthly) {
                        item.IsMonthlyCounted = !item.IsMonthlyCounted;
                        countTypeEnabled = item.IsMonthlyCounted;
                    }
                    if (countType == Count.Api.Models.CountType.Periodic) {
                        item.IsPeriodicCounted = !item.IsPeriodicCounted;
                        countTypeEnabled = item.IsPeriodicCounted;
                    }
                    item.Frequency = (item.IsSpotCounted ? "1" : "0").concat(item.IsDailyCounted ? "1" : "0", item.IsWeeklyCounted ? "1" : "0", item.IsPeriodicCounted ? "1" : "0", item.IsMonthlyCounted ? "1" : "0");
                    var updateFrequency = {};
                    updateFrequency.CountType = countType;
                    updateFrequency.Enabled = countTypeEnabled;
                    updateFrequency.EntityId = user.BusinessUser.MobileSettings.EntityId;
                    updateFrequency.Frequency = item.Frequency;
                    updateFrequency.ItemId = item.ItemId;
                    updateFrequency.LocationId = location.Id;
                    updateFrequency.UpdateMode = Count.Api.Models.TravelPathCountUpdateMode.Frequency;
                    _this.travelPathService.UpdateTravelPathItem(updateFrequency);
                    travelPathService.ResetOtherCounts(item);
                };
                var canToggleButton = function (item, index) {
                    var outerUnitDisabled;
                    var innerUnitDisabled;
                    var weightUnitDisabled;
                    var inventoryUnitDisabled;
                    if (!item.IsOuterUomSet) {
                        outerUnitDisabled = true;
                    }
                    else {
                        outerUnitDisabled = item.DisableOuterUnit;
                    }
                    if (!item.IsInnerUomSet) {
                        innerUnitDisabled = true;
                    }
                    else {
                        innerUnitDisabled = item.DisableInnerUnit;
                    }
                    if (!item.IsWeightUomSet) {
                        weightUnitDisabled = true;
                    }
                    else {
                        weightUnitDisabled = item.DisableWeightUnit;
                    }
                    if (!item.IsInventoryUnitUomSet) {
                        inventoryUnitDisabled = true;
                    }
                    else {
                        inventoryUnitDisabled = item.DisableInventoryUnit;
                    }
                    if (index === 1 && !item.DisableOuterUnit && innerUnitDisabled && weightUnitDisabled && inventoryUnitDisabled) {
                        return false;
                    }
                    if (index === 2 && !item.DisableInnerUnit && outerUnitDisabled && weightUnitDisabled && inventoryUnitDisabled) {
                        return false;
                    }
                    if (index === 3 && !item.DisableWeightUnit && outerUnitDisabled && innerUnitDisabled && inventoryUnitDisabled) {
                        return false;
                    }
                    if (index === 4 && !item.DisableInventoryUnit && outerUnitDisabled && innerUnitDisabled && weightUnitDisabled) {
                        return false;
                    }
                    return true;
                };
                $scope.ItemUomClick = function (item, uomIndex, location) {
                    var updateTravelPathItemUom = {};
                    if (!canToggleButton(item, uomIndex)) {
                        return;
                    }
                    if (uomIndex === 1) {
                        item.DisableOuterUnit = !item.DisableOuterUnit;
                        updateTravelPathItemUom.Enabled = item.DisableOuterUnit;
                    }
                    if (uomIndex === 2) {
                        item.DisableInnerUnit = !item.DisableInnerUnit;
                        updateTravelPathItemUom.Enabled = item.DisableInnerUnit;
                    }
                    if (uomIndex === 3) {
                        item.DisableWeightUnit = !item.DisableWeightUnit;
                        updateTravelPathItemUom.Enabled = item.DisableWeightUnit;
                    }
                    if (uomIndex === 4) {
                        item.DisableInventoryUnit = !item.DisableInventoryUnit;
                        updateTravelPathItemUom.Enabled = item.DisableInventoryUnit;
                    }
                    updateTravelPathItemUom.LocationId = location.Id;
                    updateTravelPathItemUom.CountType = uomIndex;
                    updateTravelPathItemUom.EntityId = user.BusinessUser.MobileSettings.EntityId;
                    updateTravelPathItemUom.ItemId = item.ItemId;
                    updateTravelPathItemUom.UpdateMode = Count.Api.Models.TravelPathCountUpdateMode.UnitOfMeasure;
                    _this.travelPathService.UpdateTravelPathItem(updateTravelPathItemUom);
                };
                var showLocationsList = function () {
                    return $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/TravelPathLocationListOnly.html",
                        controller: "Inventory.Count.TravelPathLocationListOnlyController",
                        resolve: {
                            currentLocationIdx: function () { return _this._currentLocationIdx; }
                        }
                    }).result;
                };
                $scope.MoveItemsClicked = function () {
                    if ($scope.SelectedItems.length === 0) {
                        return;
                    }
                    $scope.DoingUpdate = true;
                    _this.travelPathService.SetLocationModalListMultiSelect(false);
                    showLocationsList().then(function (selectionResult) {
                        if (selectionResult.length > 0) {
                            var updateTravelPathModel = {};
                            var selectedLocation = selectionResult[0];
                            updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Move;
                            updateTravelPathModel.TargetId = 0;
                            var itemIdsToCopy = _.map($scope.SelectedItems, 'ItemId');
                            var existingItemIds = _.map(_.find($scope.TravelPathData.TravelPath, function (element) { return element.Id === selectedLocation.Id; }).Items, 'ItemId');
                            if (existingItemIds != null && existingItemIds.length > 0) {
                                itemIdsToCopy = _.difference(itemIdsToCopy, existingItemIds);
                            }
                            if (itemIdsToCopy.length > 0) {
                                updateTravelPathModel.ItemIds = itemIdsToCopy;
                                updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                                updateTravelPathModel.TargetLocationId = selectedLocation.Id;
                                travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).success(function (res) {
                                    popupMessageService.ShowSuccess($scope.Translation.ItemsHaveBeenMoved);
                                    $scope.SelectedItems = [];
                                }).error(function (res) {
                                });
                            }
                            else {
                                popupMessageService.ShowWarning($scope.Translation.ItemAlreadyExistsInLocation);
                                $scope.SelectedItems = [];
                            }
                        }
                    });
                };
                $scope.CopyItemsClicked = function () {
                    if ($scope.SelectedItems.length === 0) {
                        return;
                    }
                    $scope.DoingUpdate = true;
                    _this.travelPathService.SetLocationModalListMultiSelect(true);
                    showLocationsList().then(function (selectionResult) {
                        if (selectionResult.length > 0) {
                            var selectedLocations = selectionResult;
                            var overallUpdateResult = true;
                            _.forEach(selectedLocations, function (result) {
                                var updateTravelPathModel = {};
                                updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Copy;
                                updateTravelPathModel.TargetId = 0;
                                var itemIdsToCopy = _.map($scope.SelectedItems, 'ItemId');
                                var existingItemIds = _.map(_.find($scope.TravelPathData.TravelPath, function (element) { return element.Id === result.Id; }).Items, 'ItemId');
                                if (existingItemIds != null && existingItemIds.length > 0) {
                                    itemIdsToCopy = _.difference(itemIdsToCopy, existingItemIds);
                                }
                                if (itemIdsToCopy.length > 0) {
                                    updateTravelPathModel.ItemIds = itemIdsToCopy;
                                    updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                                    updateTravelPathModel.TargetLocationId = result.Id;
                                    travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).then(function (res) {
                                        popupMessageService.ShowSuccess($scope.Translation.ItemsHaveBeenCopied);
                                    }), function (res) {
                                        popupMessageService.ShowError($scope.Translation.ErrorHacOccuredPleaseContactSysAdmin);
                                        overallUpdateResult = false;
                                    };
                                }
                                else {
                                    popupMessageService.ShowWarning($scope.Translation.ItemAlreadyExistsInLocation);
                                }
                            });
                            $scope.SelectedItems = [];
                        }
                    });
                };
                $scope.DeleteItemsClicked = function () {
                    if ($scope.SelectedItems.length === 0) {
                        return;
                    }
                    var message = $scope.Translation.DoYouWantToDeleteItems.toString().format($scope.SelectedItems.length);
                    confirmation.Confirm({
                        Title: $scope.Translation.DeleteItems,
                        ConfirmText: $scope.Translation.DeleteText,
                        ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                        Message: message
                    }).then(function (result) {
                        if (result) {
                            var updateTravelPathModel = {};
                            updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Delete;
                            updateTravelPathModel.TargetId = 0;
                            updateTravelPathModel.ItemIds = _.map($scope.SelectedItems, 'ItemId');
                            updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                            updateTravelPathModel.TargetLocationId = 0;
                            travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).then(function (res) {
                                popupMessageService.ShowSuccess($scope.Translation.ItemsHaveBeenDeleted);
                                $scope.SelectedItems = [];
                            });
                        }
                    });
                };
                $scope.ChangeViewingMode = function (mode) {
                    if ($scope.CurrentViewingMode === mode)
                        return;
                    $scope.CurrentViewingMode = mode;
                };
            }
            TravelPathController.prototype.IsIOS712 = function () {
                if (window.isIOSDevice()) {
                    return window.hasInUserAgent("7_1_2");
                }
                return false;
            };
            return TravelPathController;
        }());
        Core.NG.InventoryCountModule.RegisterRouteController("TravelPath{Ignore:/?}{CountType}", "Templates/TravelPath.html", TravelPathController, Core.NG.$typedScope(), Count.$travelPathService, Core.NG.$log, Core.Auth.$authService, Core.NG.$modal, Core.$confirmationService, Core.NG.$typedStateParams(), Core.$popupMessageService, Core.$translation, Count.$countService, Core.NG.$timeout);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
