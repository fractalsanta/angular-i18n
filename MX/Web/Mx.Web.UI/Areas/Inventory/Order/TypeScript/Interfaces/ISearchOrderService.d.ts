declare module Inventory.Order {

    export interface ISearchOrderService {
        Filter(orderToSearch: ISearchOrder, searchFilterText: string): boolean;
    }

    export var $searchOrderService: Core.NG.INamedService<ISearchOrderService>;
}  
