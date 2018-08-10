declare module Operations.Reporting.InventoryMovement {

    export interface ICategory {
        GroupId: number;
        GroupDescription: string;
        SortOrder: number;
        Items: number[];
    }

    export interface IInventoryMovementControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        SortRows(col: Reporting.Api.Models.IReportColumnData): void;
        SortCategories(col: Reporting.Api.Models.IReportColumnData): void;
        SortBy(key: string): void;
        SortByCategory(): void;
        ChangeDates(dates: Date[]): void;
        GetSortedValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number): any;
        GetSortedRowByIndex(row: number): Date;
        GetView(view: Reporting.Api.Models.IViewModel);
        FavouriteClick(event: Event, view: Reporting.Api.Models.IViewModel);
        ExportData(): void;
        ShowManager(): void;
        ReportIsBeingLoaded(): boolean;
        IsActive(category: number): boolean;
        SetCategory(category: number): void;
        GetProductByIndex(index: number): Reporting.Api.Models.IProductDetails;
        GetTotal(column: Reporting.Api.Models.IReportColumnData): any;
        GetTotalByGroup(column: Reporting.Api.Models.IReportColumnData, group: number): any;

        ShowTotals(): void;
        IsTotals(): boolean;

        ClearSearch(): void;
        Search(): void;

        Vm: {
            Views: Reporting.Api.Models.IViewModel[];
            Dates: Date[]; // set by range picker

            SelectedView: Reporting.Api.Models.IViewModel;
            Columns: Reporting.Api.Models.IReportColumnData[];
            Categories: ICategory[];

            SortMap: number[];
            SortColumnId: number;
            SortAscending: boolean;
            SortItemCode: boolean;
            SortItemDescription: boolean;
            SortCategory: boolean;

            ShowViewManager: boolean;
            ExportCurrentViewUri: string;

            SearchText: string;

            State: Core.IPickerMode;

            CurrentEntity: any;
            ExportFileName: string;
        };
    }
}
