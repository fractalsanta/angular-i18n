 module Core {
     export interface ICountNavigationItem extends Core.INavigationItem {
         Type?: Inventory.Count.Api.Models.CountType;
         InProgress?: boolean;
         IsAvailable?: boolean;
    }
}