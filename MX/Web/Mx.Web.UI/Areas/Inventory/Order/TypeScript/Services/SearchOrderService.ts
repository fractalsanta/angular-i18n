module Inventory.Order {
    "use strict";

    export class SearchOrderService implements ISearchOrderService {
        private orderTranslations: Api.Models.IL10N;

        constructor(
            private translationService: Core.ITranslationService) {
            this.translationService.GetTranslations().then(translations => {
                this.orderTranslations = translations.InventoryOrder;
            });
        }

        public Filter(orderToSearch: ISearchOrder, searchFilterText: string): boolean {
            searchFilterText = searchFilterText.toLowerCase();

            if (orderToSearch.VendorName.toLowerCase().indexOf(searchFilterText) > -1
                || this.orderTranslations[orderToSearch.Status].toLowerCase().indexOf(searchFilterText) > -1
                || orderToSearch.DisplayId.toString().indexOf(searchFilterText) > -1
                ) {
                return true;
            }

            return false;
        }
    }

    $searchOrderService = Core.NG.InventoryOrderModule.RegisterService("SearchOrderService", SearchOrderService, Core.$translation);
}