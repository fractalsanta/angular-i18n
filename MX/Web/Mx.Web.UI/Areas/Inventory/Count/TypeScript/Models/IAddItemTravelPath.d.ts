declare module Inventory.Count {
    export interface IAddItemTravelPath extends Inventory.IAddItem {
        Outer: string;
        Inner: string;
        Unit: string;
        Type: string;     
        Tp: number;
        Freq: string;
    }
} 