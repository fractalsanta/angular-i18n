var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        "use strict";
        var ReviewController = (function () {
            function ReviewController($scope, $routeParams, reviewService, $authService, translationService, countService, $modal, popupMessageService, $anchorScroll, $location, $filter, $storage) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.reviewService = reviewService;
                this.$authService = $authService;
                this.translationService = translationService;
                this.countService = countService;
                this.$modal = $modal;
                this.popupMessageService = popupMessageService;
                this.$anchorScroll = $anchorScroll;
                this.$location = $location;
                this.$filter = $filter;
                this.$storage = $storage;
                this._storageKey = "mxReviewConfig";
                this._defaultConfig = {
                    ShowCostPercent: true
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                    _this.SetPageTitle();
                });
                $scope.CanViewVariance = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Variance);
                $scope.CanViewCountVariance = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Count_Variance);
                $scope.SelectedGroup = null;
                $scope.ConfigOptions = this.LoadConfig();
                if (!$scope.CanViewVariance) {
                    $scope.ConfigOptions.ShowCostPercent = false;
                }
                $scope.CountType = countService.GetCountType($routeParams.CountType);
                $scope.CountTypeName = Count.Api.Models.CountType[$scope.CountType];
                $scope.LocationId = $routeParams.LocationId;
                var user = $authService.GetUser();
                reviewService.GetReview($scope.LocationId, $scope.CountType, user.BusinessUser.MobileSettings.EntityId)
                    .success(function (result) {
                    $scope.ReviewData = result;
                    _.forEach($scope.ReviewData.Groups, function (tempGroup) {
                        tempGroup.HasItems = tempGroup.Items && tempGroup.Items.length > 0;
                    });
                    $scope.ReviewDataItems = _.flatten($scope.ReviewData.Groups, "Items");
                    if ($scope.ReviewData.ActivitySinceDate && moment($scope.ReviewData.ActivitySinceDate).isValid()) {
                        var browserTimeOffset = moment().zone() / 60, entityBrowserTimeOffset = $scope.ReviewData.EntityTimeOffset - browserTimeOffset;
                        $scope.ReviewData.ActivitySinceDate = moment($scope.ReviewData.ActivitySinceDate).add("h", entityBrowserTimeOffset).format("L LT");
                    }
                });
                $scope.ReviewDataGroupClick = function (group) {
                    $scope.SelectedGroup = group;
                    $scope.ReviewDataItems = [];
                    if (group != null) {
                        $scope.ReviewDataItems = _.flatten(_.where($scope.ReviewData.Groups, function (el) { return group === el; }), "Items");
                    }
                    else {
                        $scope.ReviewDataItems = _.flatten($scope.ReviewData.Groups, "Items");
                    }
                    if (group != null) {
                        if (group.Items == null || group.Items.length === 0) {
                            if ($scope.ReviewData != null && $scope.ReviewData.Groups != null) {
                                var groupHasBeenFound = false;
                                _.forEach($scope.ReviewData.Groups, function (grItem) {
                                    if (groupHasBeenFound && grItem.Items.length > 0) {
                                        $scope.ReviewDataItems = $scope.ReviewDataItems.concat(grItem.Items);
                                    }
                                    else {
                                        groupHasBeenFound = false;
                                    }
                                    if (grItem === group) {
                                        groupHasBeenFound = true;
                                    }
                                });
                            }
                        }
                    }
                    _this.$anchorScroll();
                };
                var finishCount = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/FinishCount.html",
                        controller: "Inventory.Count.FinishCount",
                        windowClass: "narrow",
                        resolve: {
                            countType: function () {
                                return $scope.CountTypeName;
                            }
                        }
                    });
                };
                $scope.FinishNow = function () {
                    if (countService.HasNoCostItems()) {
                        $modal.open({
                            templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                            controller: "Inventory.Count.UpdateCostInventory"
                        }).result.then(finishCount);
                    }
                    else {
                        finishCount();
                    }
                };
                $scope.FinishLater = function () {
                    _this.popupMessageService.ShowSuccess($scope.Translation.InventoryCountSaved);
                    _this.$location.path("/");
                };
                $scope.GetTotal = function () {
                    var total;
                    if (!$scope.ConfigOptions.ShowCostPercent) {
                        total = _this.FormatToCurrency($scope.ReviewData.TotalCounted);
                    }
                    else {
                        total = _this.FormatToPercent($scope.ReviewData.TotalPercent);
                    }
                    return total;
                };
                $scope.GetValue = function (group) {
                    var total;
                    if (!$scope.ConfigOptions.ShowCostPercent) {
                        total = _this.FormatToCurrency(group.GroupValue);
                    }
                    else {
                        total = _this.FormatToPercent(group.GroupPercentValue);
                    }
                    return total;
                };
                $scope.OpenColumnConfig = function () {
                    var modal = $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/ConfigureColumns.html",
                        controller: "Inventory.Count.ConfigureColumnsController",
                        resolve: {
                            isPercent: function () { return $scope.ConfigOptions.ShowCostPercent; }
                        }
                    });
                    modal.result.then(function (result) {
                        $scope.ConfigOptions.ShowCostPercent = result;
                        _this.PersistConfig($scope.ConfigOptions);
                    });
                };
            }
            ReviewController.prototype.FormatToCurrency = function (val) {
                var formattedVal = this.$filter("currency")(val).toString();
                return formattedVal;
            };
            ReviewController.prototype.FormatToPercent = function (val) {
                var formattedVal = this.$filter("number")(val, 2).toString() + " %";
                return formattedVal;
            };
            ReviewController.prototype.SetPageTitle = function () {
                var type = this.countService.GetTranslatedCountType(this.$scope.CountType, this.$scope.Translation), header = this.$scope.Translation.Review + type + " " + this.$scope.Translation.Count;
                this.popupMessageService.SetPageTitle(header);
            };
            ReviewController.prototype.PersistConfig = function (config) {
                this.$storage.set(this._storageKey, config);
            };
            ReviewController.prototype.LoadConfig = function () {
                var config = this.$storage.get(this._storageKey) || {};
                config = angular.extend({}, this._defaultConfig, config);
                return config;
            };
            return ReviewController;
        }());
        Core.NG.InventoryCountModule.RegisterRouteController("Review/:CountType/:LocationId", "Templates/Review.html", ReviewController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Inventory.Count.Api.$reviewService, Core.Auth.$authService, Core.$translation, Count.$countService, Core.NG.$modal, Core.$popupMessageService, Core.NG.$anchorScroll, Core.NG.$location, Core.NG.$filter, Core.NG.$mxlocalStorage);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
