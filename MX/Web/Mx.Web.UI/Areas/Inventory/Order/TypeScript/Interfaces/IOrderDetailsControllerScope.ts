declare module Inventory.Order {

    interface IOrderDetailsControllerScope extends ng.IScope {
        $filter: ng.IFilterService;

        FilterOptions: { filterText: string };
        ColumnDefinitions: IColumnDefinition[];
        PagingOptions: ng.ui.bootstrap.IPaginationConfig;
        ChangePage(page: number): void;
        IsOfflineMode(): boolean;
        CurrentPage: number;
        CanAddItems: boolean;

        OrderData: Api.Models.IOrder;
        OriginalDetails: Api.Models.IOrderDetail[];
        CurrentPageDetails: Api.Models.IOrderDetail[];

        IsReadOnly: boolean;
        FilterText: string;
        CategoryText: string;
        SelectedItemDetails: any[];
        SelectedItem: Api.Models.IOrderDetail;
        AllQuantitiesAreValid: boolean;

        TotalItems: number;
        TotalCases: number;

        RefreshOrder(): void;
        ClearFilter(): void;
        ClearCategoryFilter(): void;
        FilterItemsInOrder(): void;
        SetCategory(category: Api.Models.ICategory): void;
        OnRowSelect(e: Event): void;
        OnInputSelect(detail: Api.Models.IOrderDetail);
        OpenColumnConfig(): void;
        ToggleOrderDetails(): void;

        RecalculateTotals(entity: Api.Models.IOrderDetail): void;
        SendDetailUpdate(entity: Api.Models.IOrderDetail): void;
        GetItemOrderHistory(entity: Api.Models.IOrderDetail): void;
        UpdateSelectedDetails(e: Event, entity: Api.Models.IOrderDetail): void;

        ItemOrderHistoryList: Api.Models.IOrderItemHistoryHeader[][];

        PushUpdate(entityId: number, quantity: number): void;
        FinishNow(): void;
        FinishLater(): void;
        Delete(): void;

        Translations: Api.Models.IL10N;
        RefreshTableHeaders: Core.NG.IDirectiveCallback;

        AddNewItems(): void;
        PeriodClosed: boolean;
        SetOrderDetailItemCss(detailItem: Api.Models.IOrderDetail): string;
        ConversionRatesValid(): boolean;
    }
}   