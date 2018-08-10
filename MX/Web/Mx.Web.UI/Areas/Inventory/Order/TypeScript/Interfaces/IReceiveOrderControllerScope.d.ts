declare module Inventory.Order {
    export interface IReceiveOrderControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        PagingOptions: ng.ui.bootstrap.IPaginationConfig;
        ChangePage(page: number): void;
        RequiresPaging(): boolean;
        CurrentPage: number;

        Orders: Api.Models.IReceiveOrderHeader[];
        FilteredOrders: Api.Models.IReceiveOrderHeader[];
        CurrentPageOrders: Api.Models.IReceiveOrderHeader[];

        IsOrderReceived(order: Api.Models.IReceiveOrderHeader): boolean;

        ViewOrder(order: Api.Models.IReceiveOrderHeader): void;

        FilterLast(days: number): void;
        OpenCustomRangeDialog(): void;

        Model: {
            DateRange: string; // text used in the 'filter by date range' drop down
            FilterText: string; // text used in the 'filter search' box
        };
    }
} 