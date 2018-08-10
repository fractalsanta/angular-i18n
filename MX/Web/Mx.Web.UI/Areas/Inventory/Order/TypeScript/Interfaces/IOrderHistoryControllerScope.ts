declare module Inventory.Order {    

    interface IOrderHistoryControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        PagingOptions: ng.ui.bootstrap.IPaginationConfig;
        ChangePage(page: number): void;
        CurrentPage: number;

        OrdersHistoryGridDefinitions: { Field: string; Title: string; }[];
        DisplayOptions: {
            SortProperty: string;
            SortAscending: boolean;
        };
        SortByColumn(field: string);

        Orders: Api.Models.IOrderHeader[];
        FilteredOrders: Api.Models.IOrderHeader[];
        CurrentPageOrders: Api.Models.IOrderHeader[];

        ApplySearchFilter(): void;
        RequiresPaging(): boolean;

        Model: {
            DatesRange: Core.IDateRange;
            FilterText: string; 
        };

        SelectDatesRange(): void;
        ViewOrder(order: Api.Models.IOrderHeader): void;
    }
} 