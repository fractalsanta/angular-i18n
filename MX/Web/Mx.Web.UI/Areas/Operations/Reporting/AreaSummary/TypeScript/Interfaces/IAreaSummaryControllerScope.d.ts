declare module Operations.Reporting.AreaSummary {
    export interface IAreaSummaryControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Vm: {
            Views: Reporting.Api.Models.IViewModel[];
            SelectedView: Reporting.Api.Models.IViewModel;
            Areas: Core.Api.Models.IEntityModel[];
            SelectedArea: Core.Api.Models.IEntityModel;
            DatePickerOptions: Core.NG.IMxDayPickerOptions;
            ShowViewManager: boolean;
            Date: Date;
            ReportData: Reporting.Api.Models.IReportData;
            SortMap: number[];
            CurrentPageSortMap: number[];
            SortColumnId: number;
            SortAscending: boolean;
            CurrentPage: number;
            PagingOptions: ng.ui.bootstrap.IPaginationConfig;
            ExportCurrentViewUri: string;
            ExportFileName: string;
        };
        ReportIsBeingLoaded(): boolean;
        ChangeDate(date: Date): void;
        ShowManager(): void;
        GetView(view: Reporting.Api.Models.IViewModel);
        GetArea(area: Core.Api.Models.IEntityModel);
        GetSortedRowByIndex(row: number): string;
        GetSortedValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number): any;
        SortRows(col: Reporting.Api.Models.IReportColumnData): void;
        ResetSort(): void;
        RequiresPaging(): boolean;
        ChangePage(page: number): void;
        FavouriteClick(event: Event, view: Reporting.Api.Models.IViewModel);
        ExportData(): void;
    }
}
