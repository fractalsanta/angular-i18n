declare module Inventory {
    export interface IAddItemService {
        GetSearchItems(searchCriteria: string, vendorId?: number): ng.IPromise<IAddItem[]>;
    }
}
  