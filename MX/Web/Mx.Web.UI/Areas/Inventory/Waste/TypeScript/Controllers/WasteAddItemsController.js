var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        "use strict";
        var WasteAddItemsController = (function () {
            function WasteAddItemsController($scope, $log, $authService, modalInstance, wasteService, translationService, existingItems) {
                this.$scope = $scope;
                this.$log = $log;
                this.$authService = $authService;
                this.modalInstance = modalInstance;
                this.wasteService = wasteService;
                this.translationService = translationService;
                this.existingItems = existingItems;
                var user = $authService.GetUser();
                $scope.vm = {
                    SearchText: '',
                    SelectedIdHash: {},
                    Items: [],
                    AddSelectedItems: [],
                    ExistingIdHash: 0
                };
                $scope.vm.ExistingIdHash = function () {
                    var existingIdHash = {};
                    $.each(existingItems, function () {
                        existingIdHash[this.Id + this.IsRaw] = this;
                    });
                    return existingIdHash;
                }();
                translationService.GetTranslations().then(function (result) {
                    var tran = $scope.Translation = result.InventoryWaste;
                    $scope.GridDefinitions = [
                        { Field: "", Title: "", ColWidth: "col-xs-1" },
                        { Field: "Name", Title: tran.Description, ColWidth: "col-xs-8" },
                        { Field: "IsRaw", Title: tran.Type, ColWidth: "col-xs-3" }
                    ];
                    $scope.$broadcast("mxTableSync-refresh");
                });
                $scope.DisplayOptions = {
                    SortProperty: "Name",
                    SortAscending: true
                };
                $scope.SearchTextValid = function () {
                    return ($scope.vm.SearchText && $scope.vm.SearchText.length >= 1);
                };
                $scope.Search = function (searchText) {
                    if ($scope.SearchTextValid()) {
                        setTimeout(function () {
                            $(document.activeElement).blur();
                        }, 10);
                        wasteService.GetWasteItemsLimited(user.BusinessUser.MobileSettings.EntityId, searchText)
                            .success(function (results) {
                            $scope.vm.Items = results;
                            $scope.Sort();
                            $scope.$broadcast("mxTableSync-refresh");
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
                    $scope.vm.Items = _.sortBy($scope.vm.Items, sortHandler);
                    if (!options.SortAscending) {
                        $scope.vm.Items.reverse();
                    }
                };
                $scope.AddItem = function (item) {
                    var ids = $scope.vm.SelectedIdHash, selectedItems = $scope.vm.AddSelectedItems;
                    ids["" + item.Id + item.IsRaw] = !ids["" + item.Id + item.IsRaw];
                    if (ids["" + item.Id + item.IsRaw] === true) {
                        selectedItems.push(item);
                    }
                    else {
                        $.each(selectedItems, function (i) {
                            if (("" + this.Id + this.IsRaw) === ("" + item.Id + item.IsRaw)) {
                                selectedItems.splice(i, 1);
                                return false;
                            }
                        });
                    }
                };
                $scope.Cancel = function () { return modalInstance.dismiss(); };
                $scope.AddItemsToQueue = function () {
                    modalInstance.close($scope.vm.AddSelectedItems);
                };
            }
            return WasteAddItemsController;
        }());
        Core.NG.InventoryWasteModule.RegisterNamedController("WasteAddItemsController", WasteAddItemsController, Core.NG.$typedScope(), Core.NG.$log, Core.Auth.$authService, Core.NG.$modalInstance, Inventory.Waste.Api.$wasteService, Core.$translation, Core.NG.$typedCustomResolve("existingItems"));
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
