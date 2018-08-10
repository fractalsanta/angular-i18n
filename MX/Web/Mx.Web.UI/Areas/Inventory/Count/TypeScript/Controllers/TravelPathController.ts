module Inventory.Count {

    interface ITravelPathControllerScope extends ng.IScope {
        TravelPathData: Inventory.Count.Api.Models.ITravelPathEntity;
        LocationClicked(travelPathItem: Inventory.Count.Api.Models.ITravelPath): void;
        CurrentTravelPathItem(): Inventory.Count.Api.Models.ITravelPath;

        ItemTravelPathIconClicked(item: Inventory.Count.Api.Models.ITravelPathItem): void;
        SelectedItem: Inventory.Count.Api.Models.ITravelPathItem;
        DoingUpdate: boolean;
        CheckedItem: Inventory.Count.Api.Models.ITravelPathItem;
        ItemRowClicked(item: Inventory.Count.Api.Models.ITravelPathItem): void;
        SelectedItems: Inventory.Count.Api.Models.ITravelPathItem[];
        CheckItemIsSelected(item: Inventory.Count.Api.Models.ITravelPathItem): boolean;

        AddNewItems(): void;
        ItemCountTypeClick(item: Inventory.Count.Api.Models.ITravelPathItem, countType: Inventory.Count.Api.Models.CountType, location: Api.Models.ITravelPath): void;
        ItemUomClick (item: Inventory.Count.Api.Models.ITravelPathItem, uomIndex: number, location: Api.Models.ITravelPath): void;

        ManageLocationsClick(): void;

        MoveItemsClicked(): void;
        CopyItemsClicked(): void;
        DeleteItemsClicked(): void; 
        
        CountType: Api.Models.CountType;
        CountTypeName: string;

        CheckSpotPermission(): boolean;
        CheckDailyPermission(): boolean;
        CheckWeeklyPermission(): boolean;
        CheckMonthlyPermission(): boolean;
        CheckPeriodicPermission(): boolean;
        CheckCanDeleteItem(): boolean;
        CheckCanViewUoms(): boolean;

        SetSearchItemText: string;
        SearchItemsInLocations(searchtext: string): Inventory.Count.Api.Models.ITravelPathItem[];
        ResetSearchItem(): void;
        SetSearchItem(itemDescription: Api.Models.ITravelPathItem);
        GetHighlightHash(): string;

        LocationsToHighlight: Inventory.Count.Api.Models.ITravelPath[];
        ItemsToHighlight: Inventory.Count.Api.Models.ITravelPathItem[];

        LocationNeedsToBeHighlighted(location: Inventory.Count.Api.Models.ITravelPath, firstOrPreviouslySelected?: boolean): boolean;
        LocationScrollToSet(location: Inventory.Count.Api.Models.ITravelPath): boolean;

        ItemNeedsToBeHighlighted(item: Inventory.Count.Api.Models.ITravelPathItem, firstOnly?: boolean): boolean;
        ItemIsLast(item: Inventory.Count.Api.Models.ITravelPathItem): boolean;
        ClearSearchResult(): void;
        ClearSearchText(): void;
        ChangeViewingMode(mode: number);
        CurrentViewingMode: number;
        TranslatedCurrentViewingMode(): string;

        Translation: Api.Models.IL10N;
    }

    class TravelPathController {

        private _currentLocationIdx: number = 0;
        private _signalRCallbackOccured: boolean = false;
        private _locationScrollIsSet: boolean = false;
        private _haveSelectedSearch: boolean = false;

        constructor(
            private $scope: ITravelPathControllerScope,
            private travelPathService: ITravelPathService,
            private $log: ng.ILogService,
            private $authService: Core.Auth.IAuthService,
            private $modal: ng.ui.bootstrap.IModalService,
            private confirmation: Core.IConfirmationService,
            $routeParams: IRouteParams,
            private popupMessageService: Core.IPopupMessageService,
            private translationService: Core.ITranslationService,
            countService: ICountService,
            private $timeout: ng.ITimeoutService
            ) {

            $scope.ClearSearchText = () => {
                $scope.SetSearchItemText = "";
            }

            $scope.$watch('SetSearchItemText', () => {
                if (this._haveSelectedSearch) {
                    this._haveSelectedSearch = false;
                    return;
                }
                $scope.ClearSearchResult();
            });

            var user = $authService.GetUser();

            $scope.LocationsToHighlight = [];
            $scope.ItemsToHighlight = [];

            translationService.GetTranslations().then((result)=> {
                $scope.Translation = result.InventoryCount;
                popupMessageService.SetPageTitle($scope.Translation.TravelPath);
            });

            if ($routeParams.CountType != null) {
                $scope.CountType = countService.GetCountType($routeParams.CountType);
                $scope.CountTypeName = Api.Models.CountType[$scope.CountType];
            }

            $scope.ClearSearchResult = () => {
                $scope.LocationsToHighlight = [];
                $scope.ItemsToHighlight = [];

                this._locationScrollIsSet = false;
            }

            $scope.LocationNeedsToBeHighlighted = (location: Inventory.Count.Api.Models.ITravelPath, firstOrPreviouslySelected = false) => {
                if ($scope.SetSearchItemText == null || $scope.SetSearchItemText.length == 0) {
                    $scope.ClearSearchResult();
                    return false;
                }
                if (!firstOrPreviouslySelected) {
                    return _.some($scope.LocationsToHighlight, (loc) => {
                        return loc.Id == location.Id && loc.Location == location.Location;
                    });
                } else {

                    if (this._currentLocationIdx > 0) {
                        if ($scope.TravelPathData.TravelPath[this._currentLocationIdx] == location) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return $scope.LocationsToHighlight.length > 0 && $scope.LocationsToHighlight[0].Id == location.Id && $scope.LocationsToHighlight[0].Location == location.Location;
                    }
                }
            }

            $scope.LocationScrollToSet = (location: Inventory.Count.Api.Models.ITravelPath) => {
                var result = false;

                if ($scope.LocationsToHighlight.length > 0) {
                    if (this._signalRCallbackOccured) {
                        if ($scope.TravelPathData.TravelPath[this._currentLocationIdx].Id == location.Id) {
                            result = true;
                        } else {
                            result = false;
                        }
                        this._signalRCallbackOccured = false;
                    } else {
                        if (!this._locationScrollIsSet) {
                            if (this._currentLocationIdx > 0) {
                                if ($scope.TravelPathData.TravelPath[this._currentLocationIdx] == location) {
                                    result = true;
                                } else {
                                    result = false;
                                }
                            } else {
                                result = $scope.LocationsToHighlight.length > 0 && $scope.LocationsToHighlight[0].Id == location.Id && $scope.LocationsToHighlight[0].Location == location.Location;
                            }
                        }

                        if (result) {
                            this._locationScrollIsSet = true;
                        }
                    }
                }
                return result;
            }

            $scope.LocationNeedsToBeHighlighted = (location: Inventory.Count.Api.Models.ITravelPath) => {
                return _.some($scope.LocationsToHighlight, (loc) => {
                    return loc.Id == location.Id && loc.Location == location.Location;
                });
            }

            $scope.ItemNeedsToBeHighlighted = (item: Inventory.Count.Api.Models.ITravelPathItem, firstOnly = false) => {
                if ($scope.SetSearchItemText == null || $scope.SetSearchItemText.length == 0) {
                    return false;
                }
                if (!firstOnly) {
                    return _.some($scope.ItemsToHighlight, (element) => {
                        return element.ItemId == item.ItemId;
                    });
                } else {
                    return $scope.ItemsToHighlight.length > 0 && $scope.ItemsToHighlight[0].ItemId == item.ItemId;
                }
            }

            $scope.ItemIsLast = (item: Inventory.Count.Api.Models.ITravelPathItem) => {
                if ($scope.DoingUpdate && $scope.CheckedItem && $scope.CheckedItem.ItemId == item.ItemId) {
                    $scope.DoingUpdate = false;
                    return true;
                }
                return false;
            }

            $scope.SearchItemsInLocations = (searchtext: string) => {
                if (searchtext != null && searchtext.length >= 1) {
                    var searchresult = _.uniq(_.where(travelPathService.FlattenTravelPathItems(), (item : Api.Models.ITravelPathItem)=> {
                        return item.Description.toLowerCase().indexOf(searchtext.toLowerCase()) > -1
                        || item.Code.toLowerCase().indexOf(searchtext.toLowerCase()) > -1;
                    }),x=>x.ItemId);
                    var decriptions = _.sortBy(searchresult, (x: Api.Models.ITravelPathItem) => x.Description.toUpperCase() + x.Code.toUpperCase());
                    return _.first(decriptions, 10);
                }
                return null;
            }
            
            $scope.ResetSearchItem = () => {
                if ($scope.LocationsToHighlight.length > 0) {
                    this._signalRCallbackOccured = true;
                }
                $scope.ClearSearchText();
            }

            $scope.SetSearchItem = (selected: Api.Models.ITravelPathItem) => {
                this._haveSelectedSearch = true;

                $scope.LocationsToHighlight = [];
                $scope.ItemsToHighlight = [];

                _.forEach($scope.TravelPathData.TravelPath, (location: Inventory.Count.Api.Models.ITravelPath) => {
                    _.forEach(_.where(location.Items, element => element.ItemId == selected.ItemId), (el) => {
                        $scope.ItemsToHighlight.push(el);

                        if (!_.contains($scope.LocationsToHighlight, location)) {
                            $scope.LocationsToHighlight.push(location);
                        }
                    });
                });

                if ($scope.LocationsToHighlight != null && $scope.LocationsToHighlight.length > 0) {
                    if ($scope.TravelPathData.TravelPath.length > this._currentLocationIdx) {
                        if (!_.contains($scope.LocationsToHighlight, $scope.TravelPathData.TravelPath[this._currentLocationIdx])) {
                            $scope.LocationClicked($scope.LocationsToHighlight[0]);
                        }
                    } else {
                        this._currentLocationIdx = 0;
                        $scope.LocationClicked($scope.LocationsToHighlight[0]);
                    }
                }

                if (!this._signalRCallbackOccured) {
                    if ($scope.LocationsToHighlight.length > 1) {
                        this.popupMessageService.ShowSuccess($scope.Translation.FoundInXLocations.format($scope.LocationsToHighlight.length));
                    } else if ($scope.LocationsToHighlight.length == 1) {
                        this.popupMessageService.ShowSuccess($scope.Translation.FoundInOneLocations);
                    }
                }              
            };

            $scope.CurrentTravelPathItem = () => {

                if ($scope.TravelPathData.TravelPath != null && $scope.TravelPathData.TravelPath.length > this._currentLocationIdx) {
                    return this.$scope.TravelPathData.TravelPath[this._currentLocationIdx];
                } else {
                    return null;
                }
            };

            $scope.CheckSpotPermission = ()=> {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_SpotFrequency_CanView);
            };

            $scope.CheckDailyPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_DailyFrequency_CanView);
            };

            $scope.CheckWeeklyPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_WeeklyFrequency_CanView);
            };

            $scope.CheckMonthlyPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_MonthlyFrequency_CanView);
            };

            $scope.CheckPeriodicPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_PeriodicFrequency_CanView);
            };

            $scope.CheckCanDeleteItem = ()=> {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_CanDeleteItem);
            };

            $scope.CheckCanViewUoms = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_UnitsOfMeasure_CanView) && $scope.TravelPathData.CanShowDisableCountForStockTakeUnits;
            }

            $scope.LocationClicked = (travelPathItem) => {
                if (!$scope.TravelPathData || $scope.CurrentTravelPathItem() === travelPathItem) {
                    return;
                }
                this._currentLocationIdx = _.indexOf($scope.TravelPathData.TravelPath, travelPathItem);
                travelPathService.SetCurrentLocationIndex(this._currentLocationIdx);
                travelPathService.SetCurrentLocation(travelPathItem);
                $scope.SelectedItem = null;
                $scope.CheckedItem = null;
                $scope.SelectedItems = [];
            };

            //fa-bars fa-thumb-tack fa-bullseye Icons
            //Item icon(s) click event
            //1st click - selects an Item - $scope.SelectedItem
            //2nd click - performs sort
            $scope.ItemTravelPathIconClicked = (item) => {

                if ($scope.SelectedItem == null ) {
                    $scope.SelectedItem = item;
                    $scope.CheckedItem = item;
                    $scope.SelectedItems = [];
                } else {

                    if ($scope.SelectedItem != item) {
                        $scope.DoingUpdate = true;
                        var updateTravelPathModel = <Inventory.Count.Api.Models.IUpdateTravelPath>{};

                        updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Sort;
                        updateTravelPathModel.TargetId = item.ItemId;
                        updateTravelPathModel.ItemIds = [$scope.SelectedItem.ItemId];
                        updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;

                        travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).then((result)=> {

                            $scope.CurrentTravelPathItem().Items = _.without($scope.CurrentTravelPathItem().Items, $scope.SelectedItem);
                            var newposIdx = _.findIndex($scope.CurrentTravelPathItem().Items, (arrItem)=> { return arrItem == item; });
                            $scope.CurrentTravelPathItem().Items.splice(newposIdx + 1, 0, $scope.SelectedItem);

                            $scope.SelectedItem = null;
                        });
                    } else {
                        $scope.SelectedItem = null;
                    }
                }

            };

            $scope.ItemRowClicked = (item) => {
                $scope.SelectedItem = null;
                $scope.CheckedItem = item;
                if ($scope.SelectedItems != null) {
                    var isItemAlreadySelected = _.contains($scope.SelectedItems, item);
                    if (isItemAlreadySelected) {
                        $scope.SelectedItems = _.without($scope.SelectedItems, item);
                    } else {
                        $scope.SelectedItems.push(item);
                    }
                }
            };

            $scope.CheckItemIsSelected = (item) => {
                return _.contains($scope.SelectedItems, item);
            };

            $scope.SelectedItem = null;
            $scope.SelectedItems = [];
            $scope.CurrentViewingMode = 0;

            $scope.TranslatedCurrentViewingMode = ():string => {
                if ($scope.CurrentViewingMode === Count.Api.Models.TravelPathCountUpdateMode.UnitOfMeasure) {
                    return $scope.Translation.UnitOfMeasure;
                }
                return $scope.Translation.CountFrequency;
            }

            $scope.TravelPathData = travelPathService.GetModel().TravelPathEntity;

            travelPathService.ModelReceived.SubscribeController($scope, () => {
                $scope.DoingUpdate = true;
                var locations = ($scope.TravelPathData) ? $scope.TravelPathData.TravelPath : null;
                
                $scope.ResetSearchItem();

                if (locations && locations.length > 0) {
                    var lastSelectedLocation = travelPathService.GetCurrentLocation(),
                        foundIndex: number = null;

                    if (lastSelectedLocation) {
                        foundIndex = _.findIndex(locations, (currentLocation: Api.Models.ITravelPath): boolean => {
                            return currentLocation.Id === lastSelectedLocation.Id;
                        });
                    }

                    this._currentLocationIdx = (foundIndex !== null && foundIndex > -1) ? foundIndex : 0;

                    travelPathService.SetCurrentLocationIndex(this._currentLocationIdx);
                    travelPathService.SetCurrentLocation($scope.TravelPathData.TravelPath[this._currentLocationIdx]);

                    $scope.SelectedItem = null;
                    $scope.SelectedItems = [];

                    // above results in the updating of travel path items that causes them to not be rendered

                    if (this.IsIOS712()) {
                        //
                        // iOS 7.1.2 has an problem with mx-scroll-to-element
                        //
                        $timeout(() => {
                            $(".IOS712FIX tbody").append("<tr style='height: 1px;' id='find-me-tr' style='visibility: hidden;'><td span='4'></td></tr>");
                            $timeout(() => {
                                $("#find-me-tr").remove();
                            });
                        }, 500);
                    }
                }
            });

            $scope.AddNewItems = () => {

                travelPathService.SetCurrentLocationIndex(this._currentLocationIdx);
                travelPathService.SetCurrentLocation($scope.CurrentTravelPathItem());

                var addItemModel = <Inventory.IAddItemModel>{
                    ExistingCodes: _.map(travelPathService.GetCurrentLocation().Items, (item) => item.Code),
                    VendorId: null
                }

                $modal.open({
                    templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                    controller: "Inventory.AddItemsControllerTravelPath",
                    resolve: {
                        addItemModel: () => { return addItemModel; }
                    }        
                }).result.then((items: IAddItemTravelPath[]) => {                    
                    var updateTravelPathModel = <Inventory.Count.Api.Models.IUpdateTravelPath>{};
                        updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Add;
                        updateTravelPathModel.TargetId = 0;
                        updateTravelPathModel.AddItems = [];
                        updateTravelPathModel.Frequencies = [];
                        updateTravelPathModel.ItemIds = [];

                    _.forEach(items, (x: IAddItemTravelPath) => {
                            updateTravelPathModel.AddItems.push(x.Name);
                            updateTravelPathModel.Frequencies.push(x.Freq);
                            updateTravelPathModel.ItemIds.push(x.Id);
                        });

                        updateTravelPathModel.LocationId = 0;
                        updateTravelPathModel.TargetLocationId = travelPathService.GetCurrentLocation().Id;

                        travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId);
                    });
            };

            $scope.ManageLocationsClick = ()=> {
                $modal.open({
                    templateUrl: "/Areas/Inventory/Count/Templates/TravelPathLocation.html",
                    controller: "Inventory.Count.TravelPathLocationController",
                    resolve: {
                        currentLocationIdx: () => { return this._currentLocationIdx; }
                    }
                }).result.then((result)=> {

                    }
                );
            };


            $scope.ItemCountTypeClick = (item, countType, location)=> {
                var countTypeEnabled: boolean = false;

                if (countType == Api.Models.CountType.Spot) {
                    item.IsSpotCounted = !item.IsSpotCounted;
                    countTypeEnabled = item.IsSpotCounted;
                }

                if (countType == Api.Models.CountType.Daily) {
                    item.IsDailyCounted = !item.IsDailyCounted;
                    countTypeEnabled = item.IsDailyCounted;
                }

                if (countType == Api.Models.CountType.Weekly) {
                    item.IsWeeklyCounted = !item.IsWeeklyCounted;
                    countTypeEnabled = item.IsWeeklyCounted;
                }

                if (countType == Api.Models.CountType.Monthly) {
                    item.IsMonthlyCounted = !item.IsMonthlyCounted;
                    countTypeEnabled = item.IsMonthlyCounted;
                }

                if (countType == Api.Models.CountType.Periodic) {
                    item.IsPeriodicCounted = !item.IsPeriodicCounted;
                    countTypeEnabled = item.IsPeriodicCounted;
                }

                item.Frequency = (item.IsSpotCounted ? "1" : "0").concat(item.IsDailyCounted ? "1" : "0"
                    , item.IsWeeklyCounted ? "1" : "0"
                    , item.IsPeriodicCounted ? "1" : "0"
                    , item.IsMonthlyCounted ? "1" : "0");

                var updateFrequency = <Api.Models.ITravelPathItemUpdate>{};
                updateFrequency.CountType = countType;
                updateFrequency.Enabled = countTypeEnabled;
                updateFrequency.EntityId = user.BusinessUser.MobileSettings.EntityId;
                updateFrequency.Frequency = item.Frequency;
                updateFrequency.ItemId = item.ItemId;
                updateFrequency.LocationId = location.Id;
                updateFrequency.UpdateMode = Count.Api.Models.TravelPathCountUpdateMode.Frequency;

                this.travelPathService.UpdateTravelPathItem(updateFrequency);

                travelPathService.ResetOtherCounts(item);
            };

            var canToggleButton = (item, index) => {
                // If UOM has been set for the item, then we need to consider it disabled. If the UOM for the items is not configured, then consider it disabled.
                var outerUnitDisabled: boolean;
                var innerUnitDisabled: boolean;
                var weightUnitDisabled: boolean;
                var inventoryUnitDisabled: boolean;
                // Check outer unit.
                if (!item.IsOuterUomSet) {
                    outerUnitDisabled = true;
                } else {
                    outerUnitDisabled = item.DisableOuterUnit;
                }
                // Check inner unit.
                if (!item.IsInnerUomSet) {
                    innerUnitDisabled = true;
                } else {
                    innerUnitDisabled = item.DisableInnerUnit;
                }
                // Check weight unit.
                if (!item.IsWeightUomSet) {
                    weightUnitDisabled = true;
                } else {
                    weightUnitDisabled = item.DisableWeightUnit;
                }
                // Check inventory unit.
                if (!item.IsInventoryUnitUomSet) {
                    inventoryUnitDisabled = true;
                } else {
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
            }

            $scope.ItemUomClick = (item, uomIndex, location) => {
                var updateTravelPathItemUom = <Api.Models.ITravelPathItemUpdate>{};
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
                this.travelPathService.UpdateTravelPathItem(updateTravelPathItemUom);
            };

            var showLocationsList = () => {
                return $modal.open({
                    templateUrl: "/Areas/Inventory/Count/Templates/TravelPathLocationListOnly.html",
                    controller: "Inventory.Count.TravelPathLocationListOnlyController",
                    resolve: {
                        currentLocationIdx: () => { return this._currentLocationIdx; }
                    }
                }).result;
            };

            $scope.MoveItemsClicked = () => {
                // Return if there are no selected items
                if ($scope.SelectedItems.length === 0) {
                    return;
                }
            
                $scope.DoingUpdate = true;
                this.travelPathService.SetLocationModalListMultiSelect(false);
                showLocationsList().then((selectionResult: Inventory.Count.Api.Models.ITravelPath[]) => {

                    if (selectionResult.length > 0) {
                        var updateTravelPathModel = <Inventory.Count.Api.Models.IUpdateTravelPath>{};
                        var selectedLocation = selectionResult[0];

                        updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Move;
                        updateTravelPathModel.TargetId = 0;

                        var itemIdsToCopy = <number[]>_.map($scope.SelectedItems, 'ItemId');
                        var existingItemIds = <number[]>_.map(_.find($scope.TravelPathData.TravelPath, (element) => { return element.Id === selectedLocation.Id; }).Items, 'ItemId');

                        if (existingItemIds != null && existingItemIds.length > 0) {
                            itemIdsToCopy = _.difference(itemIdsToCopy, existingItemIds);
                        }

                        if (itemIdsToCopy.length > 0) {

                            updateTravelPathModel.ItemIds = itemIdsToCopy;
                            updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                            updateTravelPathModel.TargetLocationId = selectedLocation.Id;

                            travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).success(res=> {
                                popupMessageService.ShowSuccess($scope.Translation.ItemsHaveBeenMoved);
                                $scope.SelectedItems = [];
                            }).error(res=> {

                            });
                        } else {
                            popupMessageService.ShowWarning($scope.Translation.ItemAlreadyExistsInLocation);
                            $scope.SelectedItems = [];
                        }
                    }
                });
            };

            $scope.CopyItemsClicked = () => {
                // Return if there are no selected items.
                if ($scope.SelectedItems.length === 0) {
                    return;
                }

                $scope.DoingUpdate = true;
                this.travelPathService.SetLocationModalListMultiSelect(true);
                showLocationsList().then((selectionResult: Inventory.Count.Api.Models.ITravelPath[]) => {

                    if (selectionResult.length > 0) {
                        var selectedLocations = selectionResult;
                        var overallUpdateResult = true;
                        _.forEach(selectedLocations, (result)=> {

                            var updateTravelPathModel = <Inventory.Count.Api.Models.IUpdateTravelPath>{};
                            updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Copy;
                            updateTravelPathModel.TargetId = 0;

                            var itemIdsToCopy = <number[]>_.map($scope.SelectedItems, 'ItemId');
                            var existingItemIds = <number[]>_.map(_.find($scope.TravelPathData.TravelPath, (element)=> { return element.Id === result.Id; }).Items, 'ItemId');

                            if (existingItemIds != null && existingItemIds.length > 0) {
                                itemIdsToCopy = _.difference(itemIdsToCopy, existingItemIds);
                            }

                            if (itemIdsToCopy.length > 0) {

                                updateTravelPathModel.ItemIds = itemIdsToCopy;
                                updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                                updateTravelPathModel.TargetLocationId = result.Id;
                                travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).then(res=> {
                                    popupMessageService.ShowSuccess($scope.Translation.ItemsHaveBeenCopied);
                                }), (res)=> {
                                    popupMessageService.ShowError($scope.Translation.ErrorHacOccuredPleaseContactSysAdmin);
                                    overallUpdateResult = false;
                                };
                            } else {
                                popupMessageService.ShowWarning($scope.Translation.ItemAlreadyExistsInLocation);
                            }

                        }); //-----_.forEach(selectedLocations, (result)=> {
                        $scope.SelectedItems = [];
                    }
                });

            };

            $scope.DeleteItemsClicked = () => {
                // Return if there are no selected items
                if ($scope.SelectedItems.length === 0) {
                    return;
                }

                var message = $scope.Translation.DoYouWantToDeleteItems.toString().format($scope.SelectedItems.length);

                confirmation.Confirm({
                    Title: $scope.Translation.DeleteItems,
                    ConfirmText: $scope.Translation.DeleteText,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                    Message: message
                }).then((result) => {
                        if (result) {
                            var updateTravelPathModel = <Inventory.Count.Api.Models.IUpdateTravelPath>{};
                            updateTravelPathModel.Type = Inventory.Count.Api.Models.TravelPathActionType.Delete;
                            updateTravelPathModel.TargetId = 0;
                            updateTravelPathModel.ItemIds = <any[]>_.map($scope.SelectedItems, 'ItemId');
                            updateTravelPathModel.LocationId = $scope.CurrentTravelPathItem().Id;
                            updateTravelPathModel.TargetLocationId = 0;
                            travelPathService.PostUpdateTravelPath(updateTravelPathModel, user.BusinessUser.MobileSettings.EntityId).then(res=> {
                                popupMessageService.ShowSuccess($scope.Translation.ItemsHaveBeenDeleted);
                                $scope.SelectedItems = [];
                            });

                        }
                    }
                );
            };
            
            $scope.ChangeViewingMode = (mode) => {
                if ($scope.CurrentViewingMode === mode)
                    return;
                $scope.CurrentViewingMode = mode;
            }
        }

        IsIOS712(): boolean {
            if (window.isIOSDevice()) {
                return window.hasInUserAgent("7_1_2");
            }

            return false;
        }
    }

    Core.NG.InventoryCountModule.RegisterRouteController("TravelPath{Ignore:/?}{CountType}", "Templates/TravelPath.html", TravelPathController,
        Core.NG.$typedScope<ITravelPathControllerScope>(),
        $travelPathService,
        Core.NG.$log,
        Core.Auth.$authService,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.NG.$typedStateParams<IRouteParams>(),
        Core.$popupMessageService,
        Core.$translation,
        $countService,
        Core.NG.$timeout
        );

} 
