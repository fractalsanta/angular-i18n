var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var AddItemsTravelPathService = (function () {
            function AddItemsTravelPathService(authService, travelPathAddItemsService) {
                this.authService = authService;
                this.travelPathAddItemsService = travelPathAddItemsService;
            }
            AddItemsTravelPathService.prototype.GetSearchItems = function (searchCriteria) {
                var user = this.authService.GetUser();
                var promise = {};
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    promise = this.travelPathAddItemsService.GetSearchItemsLimited(searchCriteria, user.BusinessUser.MobileSettings.EntityId)
                        .then(function (result) {
                        var items = [];
                        if (result.data != null) {
                            _.forEach(result.data, function (item) {
                                var newAddItem = {
                                    Id: +item.Id,
                                    Name: item.Name,
                                    Outer: item.Outer,
                                    Inner: item.Inner,
                                    Unit: item.Unit,
                                    Tp: item.Tp,
                                    Freq: item.Freq,
                                    Type: item.Type,
                                    Code: item.Code,
                                    EnabledForSelection: item.EnabledForSelection
                                };
                                items.push(newAddItem);
                            });
                        }
                        return items;
                    });
                }
                return promise;
            };
            return AddItemsTravelPathService;
        }());
        Count.AddItemsTravelPathService = AddItemsTravelPathService;
        Count.addItemsTravelPathService = Core.NG.InventoryCountModule.RegisterService("AddItemsTravelPathService", AddItemsTravelPathService, Core.Auth.$authService, Inventory.Count.Api.$travelPathAddItemsService);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
