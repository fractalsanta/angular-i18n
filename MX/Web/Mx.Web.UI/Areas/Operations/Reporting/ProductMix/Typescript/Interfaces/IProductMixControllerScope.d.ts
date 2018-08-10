declare module Operations.Reporting.ProductMix {

    export interface ICategory {
        GroupId: number;
        GroupDescription: string;
        SortOrder: number;
        Items: IIndexedProductDetails[];
    }

    export interface IIndexedProductDetails extends Reporting.Api.Models.IProductDetails {
        Index: number;
    }

    export interface IProductMixControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;

        ShowViewManager(): void;
        UpdateFavouriteView(event: Event, view: Reporting.Api.Models.IViewModel);
        GetView(view: Reporting.Api.Models.IViewModel);
        ChangeDates(dates: Date[]): void;

        IsReportLoading(): boolean;
        IsTotals(): boolean;
        ShowTotals(): boolean;
        IsActive(category: number): boolean;
        SetCategory(category: number): void;
        GetTotal(column: Reporting.Api.Models.IReportColumnData): any;     
        GetTotalByGroup(column: Reporting.Api.Models.IReportColumnData, group: number): any;   
        GetProductByIndex(index: number): Reporting.Api.Models.IProductDetails;
        GetSortedValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number): any;


        SortBy(key: string): void;
        SortByCategory(): void;
        SortRows(col: Reporting.Api.Models.IReportColumnData): void;
        SortCategories(col: Reporting.Api.Models.IReportColumnData): void;

        Search();
        ClearSearch();

        Vm: {
            Dates: Date[];
            Views: Reporting.Api.Models.IViewModel[];
            SelectedView: Reporting.Api.Models.IViewModel;
            ShowViewManager: boolean;
            State: Core.IPickerMode;
            SearchText: string;

            SortMap: IIndexedProductDetails[];
            SortColumnId: number;
            SortAscending: boolean;
            SortItemCode: boolean;
            SortItemDescription: boolean;
            SortCategory: boolean;

            Columns: Reporting.Api.Models.IReportColumnData[];            
            Categories: ICategory[];            
            ExportCurrentViewUri: string;
        };
    }
}