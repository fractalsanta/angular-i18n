var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var CountGroupController = (function () {
            function CountGroupController($scope, $routeParams, countService, $authService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.countService = countService;
                this.$authService = $authService;
                this._currentGroup = null;
                this._haveSelectedSearch = false;
                $scope.SearchItemText = '';
                $scope.$watch('PageSettings.CurrentPage', function () { return $scope.ChangePage(); });
                $scope.$watch('SearchItemText', function () { $scope.ClearSearchResult(); });
                $scope.PageSettings = { MaxNumberOfPages: 5, CurrentPage: 1, ItemsPerPage: 20 };
                $scope.CountType = countService.GetCountType($routeParams.CountType);
                $scope.CountTypeName = Count.Api.Models.CountType[$scope.CountType];
                $scope.ClearSearchText = function () {
                    $scope.SearchItemText = '';
                };
                $scope.ClearSearchResult = function () {
                    if (_this._haveSelectedSearch) {
                        _this._haveSelectedSearch = false;
                        return;
                    }
                    $scope.Groups = _.clone($scope.GroupItemList);
                    if ($scope.GroupItemList.length > 0) {
                        $scope.ChangeGroup($scope.GroupItemList[0]);
                    }
                };
                $scope.AreaGroups = countService.GetCurrentModel().Inventory;
                $scope.GroupItemList = this.GetGroupsList();
                $scope.Groups = _.clone($scope.GroupItemList);
                countService.UpdateDefaultCountView(Count.InventoryCountView.Groups);
                $scope.ChangeGroup = function (item) {
                    if (!$scope.GroupItemList || $scope.GroupItemList.length === 0 || $scope.CurrentGroup() === item) {
                        return;
                    }
                    $scope.PageSettings.CurrentPage = 1;
                    _this._currentGroup = item;
                    $scope.ChangePage();
                };
                $scope.CurrentGroup = function () {
                    return _this._currentGroup || ($scope.GroupItemList.length ? $scope.GroupItemList[0] : null);
                };
                $scope.SearchItems = function (text) {
                    if (text) {
                        var result = _.where(countService.GetUniqueProducts(), function (item) {
                            return _.contains(item.Description.toLowerCase(), text.toLowerCase()) ||
                                _.contains(item.ProductCode.toLowerCase(), text.toLowerCase());
                        });
                        return _.first(result, 10);
                    }
                    return [];
                };
                $scope.SelectSearchItem = function (selectedItem) {
                    _this._haveSelectedSearch = true;
                    $scope.SearchItemText = selectedItem.Description + ' (' + selectedItem.ProductCode + ')';
                    $scope.Groups = [];
                    var firstTime = true;
                    for (var i = 0; i < $scope.GroupItemList.length; i++) {
                        var group = {
                            GroupName: $scope.GroupItemList[i].GroupName,
                            CountItems: _.filter($scope.GroupItemList[i].CountItems, function (item) {
                                return (item.ItemId == selectedItem.ItemId && item.VendorItemId === selectedItem.VendorItemId);
                            })
                        };
                        if (group.CountItems.length > 0) {
                            $scope.Groups.push(group);
                            if (firstTime) {
                                $scope.ChangeGroup(group);
                                firstTime = false;
                            }
                        }
                    }
                };
                $scope.GetUncounted = function (group) { return _.where(group.CountItems, function (item) { return !item
                    .ReadyToApply &&
                    !(item.Status === Count.Api.Models.CountStatus.Pending); })
                    .length; };
                $scope.GroupStatusClass = function (group) {
                    return _this.countService.GetCssItemStatusClass(_this.GetGroupStatus(group));
                };
                $scope.GroupStatusColour = function (group) {
                    return _this.countService.GetCssItemStatusColor(_this.GetGroupStatus(group));
                };
                $scope.ChangePage = function () {
                    if ($scope.CurrentGroup() == null) {
                        $scope.PageItems = [];
                    }
                    var startIndex = ($scope.PageSettings.CurrentPage - 1) * $scope.PageSettings.ItemsPerPage;
                    $scope.PageItems = $scope.CurrentGroup().CountItems.slice(startIndex, startIndex + $scope.PageSettings.ItemsPerPage);
                };
                $scope.UpdateItem = function (item, type) { return _this.countService.PushUpdate(item, type); };
                $scope.StatusClass = function (item) { return _this.countService.GetCssStatusClass(item); };
                $scope.StatusTitle = function (item) { return _this.countService.GetTranslatedCountStatus(item.Status); };
                $scope.StatusColor = function (item) { return _this.countService.GetCssStatusColor(item); };
            }
            CountGroupController.prototype.GetGroupsList = function () {
                return this.countService.GetItemGroups();
            };
            CountGroupController.prototype.GetGroupStatus = function (group) {
                if (_.where(group.CountItems, function (item) { return item.Status === Count.Api.Models.CountStatus.Variance; }).length > 0) {
                    return Count.Api.Models.CountStatus.Variance;
                }
                if (_.where(group.CountItems, function (item) { return !item.ReadyToApply && item.Status === Count.Api.Models.CountStatus.Pending; }).length > 0) {
                    return Count.Api.Models.CountStatus.NotCounted;
                }
                if (_.where(group.CountItems, function (item) { return item.Status === Count.Api.Models.CountStatus.Partial; }).length > 0) {
                    return Count.Api.Models.CountStatus.Partial;
                }
                return Count.Api.Models.CountStatus.Counted;
            };
            return CountGroupController;
        }());
        Count.CountGroupController = CountGroupController;
        Count.myCountGroupController = Core.NG.InventoryCountModule.RegisterNamedController("CountGroupController", CountGroupController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Count.$countService, Core.Auth.$authService, Core.Constants);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
