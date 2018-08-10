 declare module Inventory.Production {
     export interface IPrepAdjustControllerScope extends ng.IScope {
         //Header: Core.Directives.IGridHeader;
         GridDefinitions: { Field: string; Title: string; Width?: string; ColWidth: string; }[];
         Translations: Api.Models.IL10N;
         vm: {
             Items: Api.Models.IPrepAdjustedItem[];
         };

         Finish(): void;
         AddNewItems(): void;
         RemoveItem(item: Api.Models.IPrepAdjustedItem): void;
         CostPerItem(item: Api.Models.IPrepAdjustedItem): number;
         HasPrepAdjustmentItems: boolean;
         GetPrepAdjustItems(): void;

         DisplayOptions: {
             SortProperty: string;
             SortAscending: boolean;
         };

         SortColumn(field: string): void;
         Sort(): void;
         ToggleFavorite(item) :void;
     }
 }