declare module Inventory {
    export interface IAddItemModel {        
        ExistingCodes: string[];
        VendorId?: number;
        Title?: string;
    }
}  