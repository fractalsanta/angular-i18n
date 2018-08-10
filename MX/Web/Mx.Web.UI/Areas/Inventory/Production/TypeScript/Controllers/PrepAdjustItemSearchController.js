var Inventory;
(function (Inventory) {
    var Production;
    (function (Production) {
        "use strict";
        var PrepAdjustItemSearchController = (function () {
            function PrepAdjustItemSearchController($scope, modalInstance, translationService, prepAdjustItemSearchService, $authService, existingItems) {
                var _this = this;
                this.$scope = $scope;
                this.modalInstance = modalInstance;
                this.translationService = translationService;
                this.prepAdjustItemSearchService = prepAdjustItemSearchService;
                this.$authService = $authService;
                this.existingItems = existingItems;
                var user = $authService.GetUser();
                $scope.Model = {
                    SearchText: '',
                    SelectedIdHash: {},
                    Items: [],
                    AddSelectedItems: [],
                    ExistingIdHash: 0
                };
                $scope.Model.ExistingIdHash = function () {
                    var existingIdHash = {};
                    $.each(existingItems, function () {
                        existingIdHash[this.Id] = this;
                    });
                    return existingIdHash;
                }();
                $scope.DisplayOptions = {
                    SortProperty: "Description",
                    SortAscending: true
                };
                translationService.GetTranslations().then(function (result) {
                    var tran = $scope.Translations = result.InventoryProduction;
                    $scope.GridDefinitions = [
                        { Field: "", Title: "", ColWidth: "col-xs-1" },
                        { Field: "Name", Title: tran.Description, ColWidth: "col-xs-11" }
                    ];
                    $scope.$broadcast("mxTableSync-refresh");
                });
                $scope.SearchTextValid = function () {
                    return ($scope.Model.SearchText && $scope.Model.SearchText.length >= 1);
                };
                $scope.LoadInitialData = function () {
                    _this.prepAdjustItemSearchService.GetPrepAdjustItemsByEntityId(user.BusinessUser.MobileSettings.EntityId, "", 0)
                        .success(function (results) {
                        _.each(results, function (item) {
                            item.Outers = undefined;
                            item.Inners = undefined;
                            item.Units = undefined;
                        });
                        if (results.length <= 10) {
                            $scope.Model.Items = results;
                        }
                    });
                };
                $scope.Search = function (searchText) {
                    if ($scope.SearchTextValid()) {
                        setTimeout(function () {
                            $(document.activeElement).blur();
                        }, 10);
                        _this.prepAdjustItemSearchService.GetPrepAdjustItemsByEntityId(user.BusinessUser.MobileSettings.EntityId, searchText, 0)
                            .success(function (results) {
                            _.each(results, function (item) {
                                item.Outers = undefined;
                                item.Inners = undefined;
                                item.Units = undefined;
                            });
                            $scope.Model.Items = results;
                        });
                    }
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
                    $scope.Model.Items = _.sortBy($scope.Model.Items, sortHandler);
                    if (!options.SortAscending) {
                        $scope.Model.Items.reverse();
                    }
                };
                $scope.AddItem = function (item) {
                    var ids = $scope.Model.SelectedIdHash, selectedItems = $scope.Model.AddSelectedItems;
                    ids["" + item.Id] = !ids["" + item.Id];
                    if (ids["" + item.Id] === true) {
                        selectedItems.push(item);
                    }
                    else {
                        $.each(selectedItems, function (i) {
                            if (("" + this.Id) === ("" + item.Id)) {
                                selectedItems.splice(i, 1);
                                return false;
                            }
                        });
                    }
                };
                $scope.Cancel = function () { return modalInstance.dismiss(); };
                $scope.OK = function () { return modalInstance.close($scope.Model.AddSelectedItems); };
                $scope.LoadInitialData();
            }
            return PrepAdjustItemSearchController;
        }());
        Core.NG.InventoryProductionModule.RegisterNamedController("PrepAdjustItemSearchController", PrepAdjustItemSearchController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Production.Api.$prepAdjustItemSearchService, Core.Auth.$authService, Core.NG.$typedCustomResolve("existingItems"));
    })(Production = Inventory.Production || (Inventory.Production = {}));
})(Inventory || (Inventory = {}));
