declare module Operations.Reporting {

    export interface IReportService {
        DateFrom: Date;
        DateTo: Date;
        GetViews(reportType: Api.Models.ReportType): ng.IPromise<Api.Models.IViewModel[]>;
        GetReportDataForEntity(entityId: number, viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType): ng.IPromise<Api.Models.IReportData>;
        GetReportData(viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType): ng.IPromise<Api.Models.IReportData>;
        GetExportUriForEntity(entityId: number, viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType): string;
        GetExportUri(viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType): string;

        GetProductData(viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType, searchText: string): ng.IPromise<Api.Models.IProductData>;
    }

    export var reportService: Core.NG.INamedService<IReportService>;
}