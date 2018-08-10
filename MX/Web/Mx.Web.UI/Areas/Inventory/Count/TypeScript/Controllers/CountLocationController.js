var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var CountLocationController = (function () {
            function CountLocationController($scope, $routeParams, countService, $authService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.countService = countService;
                this.$authService = $authService;
                this._haveSelectedSearch = false;
                this._currentLocation = null;
                $scope.$watch('PagingSettings.CurrentPage', function () { return $scope.ChangePage(); });
                $scope.$watch('SetSearchItemText', function () {
                    $scope.ClearSearchResult();
                });
                $scope.Uncounted = function (location) { return _.where(location.Items, function (item) { return !item.ReadyToApply && !(item.Status === Count.Api.Models.CountStatus.Pending); }).length; };
                $scope.AreaGroups = countService.GetCurrentModel().Inventory;
                $scope.Locations = $scope.AreaGroups.Locations;
                countService.UpdateDefaultCountView(Count.InventoryCountView.Locations);
                $scope.PagingSettings = { MaxNumberOfPages: 5, CurrentPage: 1, ItemsPerPage: 20 };
                $scope.CountType = countService.GetCountType($routeParams.CountType);
                $scope.CountTypeName = Count.Api.Models.CountType[$scope.CountType];
                $scope.StatusClass = function (item) { return _this.countService.GetCssStatusClass(item); };
                $scope.StatusColor = function (item) { return _this.countService.GetCssStatusColor(item); };
                $scope.StatusTitle = function (item) {
                    return countService.GetTranslatedCountStatus(item.Status);
                };
                $scope.UpdateItem = function (item, type) { return _this.countService.PushUpdate(item, type); };
                $scope.CurrentLocation = function () {
                    return _this._currentLocation || (_this.$scope.AreaGroups.Locations.length ? _this.$scope.AreaGroups.Locations[0] : null);
                };
                $scope.LocationStatusClass = function (location) { return _this.GetCssLocationStatusClass(location); };
                $scope.LocationStatusColor = function (location) { return _this.GetCssLocationStatusColor(location); };
                $scope.ChangePage = function () {
                    if ($scope.CurrentLocation() == null) {
                        $scope.PageItems = [];
                        return;
                    }
                    var startItemIndex = ($scope.PagingSettings.CurrentPage - 1) * $scope.PagingSettings.ItemsPerPage;
                    $scope.PageItems = $scope.CurrentLocation().Items.slice(startItemIndex, startItemIndex + $scope.PagingSettings.ItemsPerPage);
                };
                $scope.ChangeAreaGroup = function (location) {
                    if (!$scope.AreaGroups || !$scope.AreaGroups.Locations || $scope.CurrentLocation() === location) {
                        return;
                    }
                    $scope.PagingSettings.CurrentPage = 1;
                    _this._currentLocation = location;
                    $scope.ChangePage();
                };
                if ($scope.Locations.length > 0) {
                    $scope.ChangeAreaGroup($scope.Locations[0]);
                }
                $scope.SearchItems = function (searchText) {
                    if (searchText) {
                        var searchResult = _.where(countService.GetUniqueProducts(), function (item) {
                            return _.contains(item.Description.toLowerCase(), searchText.toLowerCase()) ||
                                _.contains(item.ProductCode.toLowerCase(), searchText.toLowerCase());
                        });
                        return _.first(searchResult, 10);
                    }
                    return [];
                };
                $scope.SetSearchItem = function (selected) {
                    _this._haveSelectedSearch = true;
                    $scope.SetSearchItemText = selected.Description + ' (' + selected.ProductCode + ')';
                    $scope.Locations = [];
                    var firsttime = true;
                    for (var i = 0; i < $scope.AreaGroups.Locations.length; i++) {
                        var location = {
                            Name: $scope.AreaGroups.Locations[i].Name,
                            Items: _.filter($scope.AreaGroups.Locations[i].Items, function (item) {
                                var isMatch = (item.ItemId === selected.ItemId && item.VendorItemId === selected.VendorItemId);
                                return isMatch;
                            })
                        };
                        if (location.Items.length > 0) {
                            $scope.Locations.push(location);
                            if (firsttime) {
                                $scope.ChangeAreaGroup(location);
                                firsttime = false;
                            }
                        }
                    }
                };
                $scope.ClearSearchText = function () {
                    $scope.SetSearchItemText = '';
                };
                $scope.ClearSearchResult = function () {
                    if (_this._haveSelectedSearch) {
                        _this._haveSelectedSearch = false;
                        return;
                    }
                    $scope.Locations = $scope.AreaGroups.Locations;
                    if ($scope.AreaGroups.Locations.length > 0) {
                        $scope.ChangeAreaGroup($scope.AreaGroups.Locations[0]);
                    }
                };
                countService.SetCountModelHasBeenReloadedCallback(function () {
                    if (_this._currentLocation != null) {
                        var location = _.find($scope.AreaGroups.Locations, function (loc) { return loc.Id === _this._currentLocation.Id; });
                        $scope.ChangeAreaGroup(location);
                    }
                    $scope.Locations = $scope.AreaGroups.Locations;
                });
                countService.ModelReceived.SubscribeController($scope, function () {
                    $scope.ChangePage();
                    $scope.ClearSearchText();
                    $scope.Locations = $scope.AreaGroups.Locations;
                });
                $scope.ChangePage();
            }
            CountLocationController.prototype.GetLocationStatus = function (location) {
                var variance = _.where(location.Items, function (item) { return item.Status === Count.Api.Models.CountStatus.Variance; }).length;
                if (variance > 0)
                    return Count.Api.Models.CountStatus.Variance;
                var uncounted = _.where(location.Items, function (item) { return !item.ReadyToApply && !(item.Status === Count.Api.Models.CountStatus.Pending); }).length;
                if (uncounted > 0) {
                    return Count.Api.Models.CountStatus.NotCounted;
                }
                var partial = _.where(location.Items, function (item) { return item.Status === Count.Api.Models.CountStatus.Partial; }).length;
                if (partial > 0) {
                    return Count.Api.Models.CountStatus.Partial;
                }
                return Count.Api.Models.CountStatus.Counted;
            };
            CountLocationController.prototype.GetCssLocationStatusClass = function (location) {
                var status = this.GetLocationStatus(location);
                return this.countService.GetCssItemStatusClass(status);
            };
            CountLocationController.prototype.GetCssLocationStatusColor = function (location) {
                var status = this.GetLocationStatus(location);
                return this.countService.GetCssLocationStatusColor(status);
            };
            return CountLocationController;
        }());
        Count.myCountLocationController = Core.NG.InventoryCountModule.RegisterNamedController("CountLocationController", CountLocationController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Count.$countService, Core.Auth.$authService, Core.Constants);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
