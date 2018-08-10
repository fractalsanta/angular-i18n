declare module Inventory.Count {
    export interface IAddItemsTravelPathService extends IAddItemService {
    }

    export var addItemsTravelPathService: Core.NG.INamedService<IAddItemService>;
}
 