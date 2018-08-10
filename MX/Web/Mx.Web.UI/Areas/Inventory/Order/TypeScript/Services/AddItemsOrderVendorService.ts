module Inventory.Order {

    class AddItemsOrderVendorService implements IAddItemsOrderVendorService {

        constructor(private authService: Core.Auth.IAuthService,
            private orderAddVendorItemsApiService: Api.IOrderAddItemsService) {

        }

        GetSearchItems(searchCriteria: string, vendorId: number) {
            var user = this.authService.GetUser();
            var promise = <ng.IPromise<IAddItem[]>> {};
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                promise = this.orderAddVendorItemsApiService.GetVendorItems(user.BusinessUser.MobileSettings.EntityId, vendorId, searchCriteria).then((result) => {
                    var items = <Inventory.IAddItem[]>[];

                    if (result.data != null) {
                        _.forEach(result.data, (item) => {
                            var newAddItem = <Inventory.IAddItem>{
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
        }

    }

    addItemsOrderVendorService = Core.NG.InventoryOrderModule.RegisterService("AddItemsOrderVendorService"
        , AddItemsOrderVendorService
        , Core.Auth.$authService
        , Api.$orderAddItemsService);
}