declare module Operations.Reporting.StoreSummary {
    export interface IStoreSummaryControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        SortRows(col: Reporting.Api.Models.IReportColumnData): void;
        ResetSort(): void;
        GetSortedValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number): any;
        GetSortedRowByIndex(row: number): Date;
        GetView(view: Reporting.Api.Models.IViewModel);
        FavouriteClick(event: Event, view: Reporting.Api.Models.IViewModel);
        ExportData(): void;
        ShowManager(): void;
        ReportIsBeingLoaded(): boolean;
        Vm: {
            SelectedView: Reporting.Api.Models.IViewModel;
            ChangeDates: Core.IChangeWeekCallback;
            Views: Reporting.Api.Models.IViewModel[];
            ReportData: Reporting.Api.Models.IReportData;
            SortMap: number[];
            SortColumnId: number;
            SortAscending: boolean;
            DateFrom: Date;
            DateTo: Date;
            DateColumnType: Reporting.Api.Models.ReportColumnValueType;
            ShowViewManager: boolean;
            ExportCurrentViewUri: string;
            ExportFileName: string;
        };
    }
}
