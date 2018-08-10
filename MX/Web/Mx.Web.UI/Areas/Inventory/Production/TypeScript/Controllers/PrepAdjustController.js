var Inventory;
(function (Inventory) {
    var Production;
    (function (Production) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var PrepAdjustController = (function () {
            function PrepAdjustController($scope, prepAdjustService, $authService, translationService, $prepAdjustFavouriteService, popupMessageService, $modal, $locationService, constants) {
                var _this = this;
                this.prepAdjustService = prepAdjustService;
                this.$authService = $authService;
                this.translationService = translationService;
                this.$prepAdjustFavouriteService = $prepAdjustFavouriteService;
                this.User = $authService.GetUser();
                $scope.vm.Items = [];
                var canViewPage = $authService.CheckPermissionAllowance(Task.Inventory_PrepAdjust_CanView);
                if (!canViewPage) {
                    $locationService.path("/Core/Forbidden");
                    return;
                }
                ;
                var itemHasCounts = function (item) {
                    if ((Number(item.Outers) || Number(item.Inners) || Number(item.Units))) {
                        if (item.Outers > 0 || item.Inners > 0 || item.Units > 0) {
                            return true;
                        }
                    }
                    return false;
                }, checkHasPrepAdjustItems = function (items) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (itemHasCounts(item)) {
                            return true;
                        }
                    }
                    return false;
                }, initialize = function () {
                    $scope.DisplayOptions = {
                        SortProperty: "Name",
                        SortAscending: true
                    };
                    translationService.GetTranslations().then(function (result) {
                        var translations = $scope.Translations = result.InventoryProduction;
                        $scope.GridDefinitions =
                            [
                                { Field: "Name", Title: translations.DescriptionCode, ColWidth: "col-xs-5" },
                                { Field: "", Title: translations.Outer, ColWidth: "col-xs-2" },
                                { Field: "", Title: translations.Inner, ColWidth: "col-xs-2" },
                                { Field: "", Title: translations.Unit, ColWidth: "col-xs-2" },
                                { Field: "", Title: "", ColWidth: "col-xs-1" }
                            ];
                        popupMessageService.SetPageTitle(translations.PageTitle);
                    });
                    $prepAdjustFavouriteService.Get(_this.User.BusinessUser.MobileSettings.EntityId).success(function (result) {
                        $.merge($scope.vm.Items, result);
                    });
                };
                $scope.Finish = function () {
                    var prepAdjustItems = [];
                    _.each($scope.vm.Items, function (item) {
                        if (itemHasCounts(item)) {
                            prepAdjustItems.push(item);
                        }
                    });
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Production/Templates/PrepAdjustConfirm.html",
                        controller: "Inventory.Production.PrepAdjustConfirmController",
                        size: 'sm',
                        resolve: {
                            items: function () { return prepAdjustItems; }
                        }
                    }).result.then(function (result) {
                        var applyDate = moment(result).format(constants.InternalDateTimeFormat);
                        prepAdjustService.PostPrepAdjustItems(_this.$authService.GetUser().BusinessUser.MobileSettings.EntityId, prepAdjustItems, applyDate).success(function () {
                            popupMessageService.ShowSuccess($scope.Translations.AdjustmentSubmitSuccess);
                            $scope.vm.Items = [];
                        }).error(function () {
                            popupMessageService.ShowError($scope.Translations.AdjustmentSubmitFail);
                        });
                    });
                };
                $scope.AddNewItems = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Production/Templates/PrepAdjustItemSearch.html",
                        controller: "Inventory.Production.PrepAdjustItemSearchController",
                        size: 'smaller',
                        resolve: {
                            existingItems: function () { return $scope.vm.Items; }
                        }
                    }).result.then(function (result) {
                        $.merge($scope.vm.Items, result);
                    });
                };
                $scope.RemoveItem = function (item) {
                    var index = $scope.vm.Items.indexOf(item);
                    $scope.vm.Items.splice(index, 1);
                };
                $scope.SortColumn = function (property) {
                    var options = $scope.DisplayOptions;
                    options.SortAscending = !options.SortAscending;
                    if (options.SortProperty !== property) {
                        options.SortAscending = true;
                    }
                    options.SortProperty = property;
                    $scope.Sort();
                };
                $scope.Sort = function () {
                    var options = $scope.DisplayOptions, property = options.SortProperty, sortPath = property.split("."), length = sortPath.length, sortHandler = function (order) {
                        var value = order, i;
                        for (i = 0; i < length; i += 1) {
                            value = value[sortPath[i]];
                        }
                        return value.toLowerCase ? value.toLowerCase() : value;
                    };
                    $scope.vm.Items = _.sortBy($scope.vm.Items, sortHandler);
                    if (!options.SortAscending) {
                        $scope.vm.Items.reverse();
                    }
                };
                $scope.ToggleFavorite = function (item) {
                    item.IsFavorite = !item.IsFavorite;
                    if (item.IsFavorite) {
                        $prepAdjustFavouriteService.PostAddFavorite(_this.User.BusinessUser.MobileSettings.EntityId, item.Id);
                    }
                    else {
                        $prepAdjustFavouriteService.DeleteFavorite(_this.User.BusinessUser.MobileSettings.EntityId, item.Id);
                    }
                };
                $scope.$watch("vm.Items", function () {
                    $scope.HasPrepAdjustmentItems = checkHasPrepAdjustItems($scope.vm.Items);
                }, true);
                initialize();
            }
            return PrepAdjustController;
        }());
        Production.PrepAdjustController = PrepAdjustController;
        Core.NG.InventoryProductionModule.RegisterRouteController("PrepAdjust", "Templates/PrepAdjust.html", PrepAdjustController, Core.NG.$typedScope(), Production.Api.$prepAdjustService, Core.Auth.$authService, Core.$translation, Production.Api.$prepAdjustFavoriteService, Core.$popupMessageService, Core.NG.$modal, Core.NG.$location, Core.Constants);
    })(Production = Inventory.Production || (Inventory.Production = {}));
})(Inventory || (Inventory = {}));
