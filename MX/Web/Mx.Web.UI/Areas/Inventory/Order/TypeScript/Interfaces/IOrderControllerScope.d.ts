declare module Inventory.Order {

    export interface IOrderControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        OrderSummaryData: Api.Models.IOrderHeader[];
        ScheduledOrderSummaryData: Api.Models.IScheduledOrderHeader[];
        GridDefinitions: { Field: string; Title: string; Width?: string; }[];

        DisplayOptions: {
            SearchText: string;
            SortProperty: string;
            SortAscending: boolean;
            OrderTabActive: boolean;
            ScheduledTabActive: boolean;
            FilterText: string;
            CanCreateOrder: boolean;
        };

        PagingOptions: ng.ui.bootstrap.IPaginationConfig;
        CurrentPageOrders: Api.Models.IOrderHeader[];
        FilteredOrders: Api.Models.IOrderHeader[];
        ApplySearchFilter(): void;
        RequiresPaging(): boolean;
        ChangePage(page:number): void;
        CurrentPage: Number;

        PagingOptionsScheduled: ng.ui.bootstrap.IPaginationConfig;
        CurrentPageOrdersScheduled: Api.Models.IScheduledOrderHeader[];
        FilteredOrdersScheduled: Api.Models.IScheduledOrderHeader[];
        ApplySearchFilterScheduled(): void;
        RequiresPagingScheduled(): boolean;
        ChangePageScheduled(page: number): void;
        CurrentPageScheduled: number;

        ScheduledTabClick(): void;
        OrdersTabClick(): void;

        FilterLast(days: number): void;
        FilterScheduledOrdersByDate(selectedDate: Date): void;

        OpenCustomRangeDialog(): void;
        OpenNewOrderDialog(): void;

        ViewOrder(order: Api.Models.IOrderHeader): void;

        SkipScheduledOrder(order: Api.Models.IScheduledOrderHeader): void;
        CreateScheduledOrder(order: Api.Models.IScheduledOrderHeader): void;
        ViewScheduledOrderDetail(order: Api.Models.IScheduledOrderHeader): void;

        DayPickerOptions: Core.NG.IMxDayPickerOptions;

        SortColumn(field: string): void;

        IsOffline: boolean;

        ActiveOrdersGridDefinitions: { Field: string; Title: string; Width?: string }[];
        ScheduledOrdersGridDefinitions: { Field: string; Title: string; Width?: string }[];

        HeaderRefresh: Core.NG.IDirectiveCallback;
        HeaderRefreshScheduled: Core.NG.IDirectiveCallback;

        IsInOverdueMode(): boolean;
        GoToScheduledOrders(): void;
        PeriodClosed: boolean;
    }
}