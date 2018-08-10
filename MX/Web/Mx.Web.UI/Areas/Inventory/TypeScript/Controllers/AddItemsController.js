var Inventory;
(function (Inventory) {
    "use strict";
    var AddItemsController = (function () {
        function AddItemsController(scope, modalInstance, addItemsService, translationService, addItemModel) {
            this.scope = scope;
            this.modalInstance = modalInstance;
            this.addItemsService = addItemsService;
            this.translationService = translationService;
            this.addItemModel = addItemModel;
            this.Initialize();
            scope.Search = function (searchText) {
                if (searchText.length >= 1) {
                    addItemsService.GetSearchItems(searchText, addItemModel.VendorId)
                        .then(function (items) {
                        if (items) {
                            items = _.sortBy(items, function (item) { return item.Name; });
                            items = _.union(scope.AddSelectedItems, items);
                            items = _.unique(items, function (item) { return item.Id; });
                            _.forEach(items, function (element) {
                                if (_.some(addItemModel.ExistingCodes, function (code) { return element.Code === code; })) {
                                    element.EnabledForSelection = false;
                                }
                            });
                            scope.Items = items;
                        }
                    });
                }
            };
            scope.AddItemRowClicked = function (item) {
                var isItemAlreadySelected = _.contains(scope.AddSelectedItems, item);
                if (isItemAlreadySelected) {
                    scope.AddSelectedItems = _.without(scope.AddSelectedItems, item);
                }
                else {
                    scope.AddSelectedItems.push(item);
                }
            };
            scope.CheckItemIsSelected = function (item) {
                return _.contains(scope.AddSelectedItems, item);
            };
            scope.GetTitle = function () {
                return addItemModel.Title ? addItemModel.Title : scope.Translation.TravelPathAddNewItems;
            };
            scope.Cancel = function () { return modalInstance.dismiss(); };
            scope.AddItemsToLocation = function () {
                modalInstance.close(scope.AddSelectedItems);
            };
        }
        AddItemsController.prototype.Initialize = function () {
            var _this = this;
            this.scope.AddSelectedItems = [];
            this.translationService.GetTranslations().then(function (result) {
                _this.scope.Translation = result.InventoryCount;
            });
        };
        return AddItemsController;
    }());
    Inventory.AddItemsController = AddItemsController;
    Core.NG.InventoryModule.RegisterNamedController("AddItemsControllerTravelPath", AddItemsController, Core.NG.$typedScope(), Core.NG.$modalInstance, Inventory.Count.addItemsTravelPathService, Core.$translation, Core.NG.$typedCustomResolve("addItemModel"));
    Core.NG.InventoryModule.RegisterNamedController("AddItemsControllerOrderDetails", AddItemsController, Core.NG.$typedScope(), Core.NG.$modalInstance, Inventory.Order.addItemsOrderVendorService, Core.$translation, Core.NG.$typedCustomResolve("addItemModel"));
})(Inventory || (Inventory = {}));
