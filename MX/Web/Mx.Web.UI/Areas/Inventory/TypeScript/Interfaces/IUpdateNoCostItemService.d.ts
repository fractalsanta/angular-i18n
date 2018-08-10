declare module Inventory {
    export interface IUpdateNoCostItemService {
        HasNoCostItems(): boolean;
        UpdateNoCostItems(items: Inventory.Count.Api.Models.IUpdateCostViewModel[]): ng.IHttpPromise<{}>;
        GetNoCostValues(): Inventory.Count.Api.Models.ICountItem[];
    }
}
 