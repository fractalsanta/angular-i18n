var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var CountItemsController = (function () {
            function CountItemsController($scope, $routeParams, countService, $authService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.countService = countService;
                this.$authService = $authService;
                this._currentItems = null;
                this._selectedItem = null;
                $scope.Search = { ProductFull: '' };
                $scope.$watch('PagingSettings.CurrentPage', function () { return $scope.ChangePage(); });
                $scope.$watch('Search.ProductFull', function () {
                    $scope.ClearSelected();
                });
                $scope.HasMatch = function () {
                    return _this.ListContains($scope.Search.ProductFull, $scope.ItemList);
                };
                $scope.ClearSearchResult = function () {
                    $scope.Search.ProductFull = '';
                };
                $scope.ClearSelected = function () {
                    _this._currentItems = null;
                    $scope.ChangePage();
                    if (_this._selectedItem) {
                        _this._selectedItem.Selected = false;
                    }
                };
                $scope.Uncounted = function (item) { return _.where(_this.countService.GetSameItems(item.ItemId, item.VendorItemId), function (i) { return !i.ReadyToApply && !(i.Status === Count.Api.Models.CountStatus.Pending); }).length; };
                $scope.ItemList = this.GetItemList();
                countService.UpdateDefaultCountView(Count.InventoryCountView.Items);
                $scope.PagingSettings = { MaxNumberOfPages: 5, CurrentPage: 1, ItemsPerPage: 20 };
                $scope.CountType = countService.GetCountType($routeParams.CountType);
                $scope.CountTypeName = Count.Api.Models.CountType[$scope.CountType];
                $scope.StatusClass = this.countService.GetCssStatusClass;
                $scope.StatusColor = this.countService.GetCssStatusColor;
                $scope.StatusTitle = function (item) {
                    return countService.GetTranslatedCountStatus(item.Status);
                };
                $scope.UpdateItem = function (item, type) { return _this.countService.PushUpdate(item, type); };
                $scope.SelectedItems = function () {
                    return _this._currentItems;
                };
                $scope.ItemStatusClass = function (description) { return _this.GetCssItemStatusClass(description); };
                $scope.ItemStatusColor = function (description) { return _this.GetCssItemStatusColor(description); };
                $scope.ChangePage = function () {
                    if (_this._currentItems == null) {
                        $scope.PageItems = [];
                        return;
                    }
                    var startItemIndex = ($scope.PagingSettings.CurrentPage - 1) * $scope.PagingSettings.ItemsPerPage;
                    $scope.PageItems = $scope.SelectedItems().slice(startItemIndex, startItemIndex + $scope.PagingSettings.ItemsPerPage);
                };
                $scope.ChangeItems = function (item) {
                    if (_this._selectedItem) {
                        _this._selectedItem.Selected = false;
                    }
                    _this._selectedItem = item;
                    $scope.PagingSettings.CurrentPage = 1;
                    _this._currentItems = countService.GetSameItems(item.Item.ItemId, item.Item.VendorItemId);
                    item.Selected = true;
                    $scope.ChangePage();
                };
                countService.SetCountModelHasBeenReloadedCallback(function () {
                    if (_this._currentItems != null) {
                        $scope.ChangeItems(_this._selectedItem);
                    }
                });
                countService.ModelReceived.SubscribeController($scope, function () {
                    $scope.ItemList = _this.GetItemList();
                    $scope.ChangePage();
                });
                $scope.ChangePage();
            }
            CountItemsController.prototype.GetItemList = function () {
                return _.map(this.countService.GetUniqueProducts(), function (item) {
                    return {
                        Item: item,
                        ProductFull: item.Description.toUpperCase() + ' (' + item.ProductCode.toUpperCase() + ')',
                        Selected: false
                    };
                });
            };
            CountItemsController.prototype.ListContains = function (text, itemList) {
                var upper = text.toUpperCase();
                return text ? _.some(itemList, function (item) { return _.contains(item.ProductFull, upper); }) : true;
            };
            CountItemsController.prototype.GetItemStatus = function (testItem) {
                var items = this.countService.GetSameItems(testItem.ItemId, testItem.VendorItemId);
                var variance = _.where(items, function (item) { return item.Status === Count.Api.Models.CountStatus.Variance; }).length;
                if (variance > 0)
                    return Count.Api.Models.CountStatus.Variance;
                var uncounted = _.where(items, function (item) { return !item.ReadyToApply && !(item.Status === Count.Api.Models.CountStatus.Pending); }).length;
                if (uncounted > 0) {
                    return Count.Api.Models.CountStatus.NotCounted;
                }
                var partial = _.where(items, function (item) { return item.Status === Count.Api.Models.CountStatus.Partial; }).length;
                if (partial > 0) {
                    return Count.Api.Models.CountStatus.Partial;
                }
                return Count.Api.Models.CountStatus.Counted;
            };
            CountItemsController.prototype.GetCssItemStatusClass = function (item) {
                var status = this.GetItemStatus(item);
                return this.countService.GetCssItemStatusClass(status);
            };
            CountItemsController.prototype.GetCssItemStatusColor = function (item) {
                var status = this.GetItemStatus(item);
                return this.countService.GetCssItemStatusColor(status);
            };
            return CountItemsController;
        }());
        Count.CountItemsController = CountItemsController;
        Count.myCountItemsController = Core.NG.InventoryCountModule.RegisterNamedController("CountItemController", CountItemsController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Count.$countService, Core.Auth.$authService, Core.Constants);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
