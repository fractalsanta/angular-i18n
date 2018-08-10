var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        "use strict";
        var FilterEnum;
        (function (FilterEnum) {
            FilterEnum[FilterEnum["AllItems"] = 0] = "AllItems";
            FilterEnum[FilterEnum["RawItems"] = 1] = "RawItems";
            FilterEnum[FilterEnum["FinishedItems"] = 2] = "FinishedItems";
        })(FilterEnum || (FilterEnum = {}));
        var WasteController = (function () {
            function WasteController($scope, wasteService, $wasteReasonService, $wasteFavoriteService, $authService, $q, $modal, popupMessageService, translationService, $location, constants) {
                var _this = this;
                this.$scope = $scope;
                this.wasteService = wasteService;
                this.$wasteFavoriteService = $wasteFavoriteService;
                this._user = $authService.GetUser();
                var checkItemHasCounts = function (item) {
                    if (item.Counts && (Number(item.Counts.Outers) || Number(item.Counts.Inners) || Number(item.Counts.Units))) {
                        return true;
                    }
                    return false;
                }, checkHasWaste = function (waste) {
                    var i;
                    for (i = 0; i < waste.length; i++) {
                        var item = waste[i];
                        if (item.Counts && item.Counts.Reason && checkItemHasCounts(item)) {
                            return true;
                        }
                    }
                    return false;
                }, initialize = function () {
                    $scope.DisplayOptions = {
                        Filter: FilterEnum.AllItems
                    };
                    $scope.GetFilterEnum = function () {
                        return FilterEnum;
                    };
                    translationService.GetTranslations().then(function (result) {
                        var tran = $scope.Translations = result.InventoryWaste;
                        $scope.Header = {
                            Columns: [
                                { Title: tran.Description + " (" + tran.ItemCode + ")", Fields: ["Name", "ItemCode"] },
                                { Title: tran.Outer },
                                { Title: tran.Inner },
                                { Title: tran.Unit },
                                { Title: tran.Reason },
                                { Title: tran.Cost, Fields: ["Counts.Cost"] },
                                { Title: "" }
                            ],
                            OnSortEvent: function () {
                                _this.Sort();
                            }
                        };
                        $scope.TranslatedCurrentFilter = function () {
                            switch ($scope.DisplayOptions.Filter) {
                                case FilterEnum.AllItems:
                                    return $scope.Translations.AllItems;
                                case FilterEnum.RawItems:
                                    return $scope.Translations.RawItems;
                                case FilterEnum.FinishedItems:
                                    return $scope.Translations.FinishedItems;
                            }
                            return "";
                        };
                        popupMessageService.SetPageTitle(tran.PageTitle);
                    });
                    _this.LoadFavorites();
                    $wasteReasonService.Get().success(function (result) {
                        $scope.Reasons = result;
                    });
                };
                $scope.SetFilter = function (filterIndex) {
                    $scope.DisplayOptions.Filter = filterIndex;
                    $scope.Filter();
                };
                $scope.CheckItemHasCounts = checkItemHasCounts;
                $scope.CostPerItem = function (item) {
                    if (item.Counts && (Number(item.Counts.Outers) || Number(item.Counts.Inners) || Number(item.Counts.Units))) {
                        var cost = (Math.round(item.InventoryUnitCost * 100 *
                            (Number(item.Counts.Units || '0') +
                                Number(item.Counts.Inners || '0') * item.UnitsPerInner +
                                Number(item.Counts.Outers || '0') * item.UnitsPerOuter))) / 100;
                        item.Counts.Cost = cost;
                        return cost;
                    }
                    if (item.Counts) {
                        item.Counts.Cost = 0.00;
                    }
                    return 0.00;
                };
                $scope.TotalCost = function (items) {
                    return _.reduce(items, function (sum, item) { return sum + item.Counts.Cost; }, 0.0);
                };
                $scope.$watch("WasteItems", function () {
                    $scope.HasWaste = checkHasWaste($scope.WasteItems);
                }, true);
                $scope.ToggleFavorite = function (item) {
                    item.IsFavorite = !item.IsFavorite;
                    if (item.IsFavorite) {
                        $wasteFavoriteService.PostAdd(_this._user.BusinessUser.MobileSettings.EntityId, item.Id, item.IsRaw);
                    }
                    else {
                        $wasteFavoriteService.Delete(_this._user.BusinessUser.MobileSettings.EntityId, item.Id, item.IsRaw);
                    }
                };
                $scope.AddNewItems = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Waste/Templates/WasteAddItems.html",
                        controller: "Inventory.Waste.WasteAddItemsController",
                        resolve: {
                            existingItems: function () { return $scope.WasteItems; }
                        }
                    }).result.then(function (result) {
                        $.merge($scope.WasteItems, result);
                        $scope.Header.Selected = null;
                        $scope.Filter();
                    });
                };
                $scope.RemoveItem = function (item) {
                    var index = $scope.WasteItems.indexOf(item);
                    $scope.WasteItems.splice(index, 1);
                    if ($scope.WasteItems.length == 0) {
                        $scope.SetFilter(FilterEnum.AllItems);
                    }
                    $scope.Filter();
                };
                $scope.Finish = function () {
                    var waste = $scope.WasteItems, queueItems = [], totalCost, i, j;
                    for (i = 0; i < waste.length; i++) {
                        var item = waste[i];
                        if (item.Counts && item.Counts.Reason && checkItemHasCounts(item)) {
                            for (j = 0; j < $scope.Reasons.length; j++) {
                                if ($scope.Reasons[j].Id === item.Counts.Reason.Id) {
                                    item.Counts.Reason.Description = $scope.Reasons[j].Text;
                                }
                            }
                            queueItems.push(item);
                        }
                    }
                    totalCost = $scope.TotalCost(queueItems);
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Waste/Templates/WasteConfirm.html",
                        controller: "Inventory.Waste.WasteConfirmController",
                        size: 'sm',
                        resolve: {
                            items: function () { return queueItems; },
                            totalCost: function () { return totalCost; }
                        }
                    }).result.then(function (result) {
                        var applyDate = moment(result).format(constants.InternalDateTimeFormat);
                        wasteService.PostWasteItems(_this._user.BusinessUser.MobileSettings.EntityId, queueItems, applyDate).success(function () {
                            popupMessageService.ShowSuccess($scope.Translations.AdjustmentSubmitSuccess);
                            _this.LoadFavorites();
                        }).error(function () {
                            popupMessageService.ShowError($scope.Translations.AdjustmentSubmitFail);
                        });
                        ;
                    });
                };
                $scope.Filter = function () {
                    $scope.FilteredWasteItems = _.filter($scope.WasteItems, function (item) {
                        return $scope.DisplayOptions.Filter == FilterEnum.AllItems ||
                            ($scope.DisplayOptions.Filter == FilterEnum.RawItems && item.IsRaw) ||
                            ($scope.DisplayOptions.Filter == FilterEnum.FinishedItems && !item.IsRaw);
                    });
                };
                initialize();
            }
            WasteController.prototype.LoadFavorites = function () {
                var _this = this;
                this.$scope.WasteItems = [];
                this.$scope.FilteredWasteItems = [];
                this.$wasteFavoriteService.Get(this._user.BusinessUser.MobileSettings.EntityId).success(function (result) {
                    $.merge(_this.$scope.WasteItems, result);
                    _this.Sort();
                });
            };
            WasteController.prototype.Sort = function () {
                this.$scope.WasteItems = this.$scope.Header.DefaultSort(this.$scope.WasteItems);
                this.$scope.Filter();
            };
            return WasteController;
        }());
        Core.NG.InventoryWasteModule.RegisterRouteController("Record", "Templates/Waste.html", WasteController, Core.NG.$typedScope(), Inventory.Waste.Api.$wasteService, Inventory.Waste.Api.$wasteReasonService, Inventory.Waste.Api.$wasteFavoriteService, Core.Auth.$authService, Core.NG.$q, Core.NG.$modal, Core.$popupMessageService, Core.$translation, Core.NG.$location, Core.Constants);
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
