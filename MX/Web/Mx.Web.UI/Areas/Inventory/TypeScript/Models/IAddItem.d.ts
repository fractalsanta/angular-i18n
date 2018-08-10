declare module Inventory {
    export interface IAddItem {
        Id: number;
        Code: string;
        Name: string;
        EnabledForSelection: boolean;
    }
}