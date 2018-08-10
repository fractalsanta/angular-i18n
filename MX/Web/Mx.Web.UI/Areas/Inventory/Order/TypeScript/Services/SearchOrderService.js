var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var SearchOrderService = (function () {
            function SearchOrderService(translationService) {
                var _this = this;
                this.translationService = translationService;
                this.translationService.GetTranslations().then(function (translations) {
                    _this.orderTranslations = translations.InventoryOrder;
                });
            }
            SearchOrderService.prototype.Filter = function (orderToSearch, searchFilterText) {
                searchFilterText = searchFilterText.toLowerCase();
                if (orderToSearch.VendorName.toLowerCase().indexOf(searchFilterText) > -1
                    || this.orderTranslations[orderToSearch.Status].toLowerCase().indexOf(searchFilterText) > -1
                    || orderToSearch.DisplayId.toString().indexOf(searchFilterText) > -1) {
                    return true;
                }
                return false;
            };
            return SearchOrderService;
        }());
        Order.SearchOrderService = SearchOrderService;
        Order.$searchOrderService = Core.NG.InventoryOrderModule.RegisterService("SearchOrderService", SearchOrderService, Core.$translation);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
