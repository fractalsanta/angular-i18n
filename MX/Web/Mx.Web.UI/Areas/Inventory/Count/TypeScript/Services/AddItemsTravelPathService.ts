module Inventory.Count {
    export class AddItemsTravelPathService implements IAddItemsTravelPathService {

        constructor(private authService: Core.Auth.IAuthService
            , private travelPathAddItemsService: Inventory.Count.Api.ITravelPathAddItemsService) {
        }

        GetSearchItems(searchCriteria: string) {
            var user = this.authService.GetUser();
            var promise = <ng.IPromise<IAddItem[]>> {};
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                promise = this.travelPathAddItemsService.GetSearchItemsLimited(searchCriteria, user.BusinessUser.MobileSettings.EntityId)
                    .then((result) => {
                        var items = <Inventory.IAddItem[]>[];
                        if (result.data != null) {
                            _.forEach(result.data, (item) => {
                                var newAddItem = <Inventory.IAddItem>{
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
        }
    }

    addItemsTravelPathService = Core.NG.InventoryCountModule.RegisterService("AddItemsTravelPathService"
        , AddItemsTravelPathService
        , Core.Auth.$authService
        , Inventory.Count.Api.$travelPathAddItemsService
        );
}