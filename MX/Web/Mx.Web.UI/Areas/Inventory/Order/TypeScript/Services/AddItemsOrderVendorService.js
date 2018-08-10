var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var AddItemsOrderVendorService = (function () {
            function AddItemsOrderVendorService(authService, orderAddVendorItemsApiService) {
                this.authService = authService;
                this.orderAddVendorItemsApiService = orderAddVendorItemsApiService;
            }
            AddItemsOrderVendorService.prototype.GetSearchItems = function (searchCriteria, vendorId) {
                var user = this.authService.GetUser();
                var promise = {};
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    promise = this.orderAddVendorItemsApiService.GetVendorItems(user.BusinessUser.MobileSettings.EntityId, vendorId, searchCriteria).then(function (result) {
                        var items = [];
                        if (result.data != null) {
                            _.forEach(result.data, function (item) {
                                var newAddItem = {
                                    Id: item.VendorEntityItemId,
                                    Name: item.Description,
                                    Code: item.VendorCode,
                                    EnabledForSelection: true
                                };
                                items.push(newAddItem);
                            });
                        }
                        return items;
                    });
                }
                return promise;
            };
            return AddItemsOrderVendorService;
        }());
        Order.addItemsOrderVendorService = Core.NG.InventoryOrderModule.RegisterService("AddItemsOrderVendorService", AddItemsOrderVendorService, Core.Auth.$authService, Order.Api.$orderAddItemsService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
