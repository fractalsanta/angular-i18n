declare module Inventory.Order {

    export interface IAddItemsOrderVendorService extends IAddItemService {
    }

    export var addItemsOrderVendorService: Core.NG.INamedService<IAddItemsOrderVendorService>;
}   