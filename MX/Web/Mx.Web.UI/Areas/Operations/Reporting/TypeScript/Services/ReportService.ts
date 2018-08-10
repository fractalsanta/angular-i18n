module Operations.Reporting {

    import ReportType = Reporting.Api.Models.ReportType;
    
    class ReportService implements IReportService {
    
        private _exportUriPrefix = "/Operations/Reporting/Api/ReportExport?";
        private _exportProductUriPrefix = "/Operations/Reporting/Api/ProductExport?";
        DateFrom: Date;
        DateTo: Date;
            
        constructor(
            private reportApiService: Api.IReportService
            , private productApiService: Api.IProductService
            , private viewService: IViewService
            , private authService: Core.Auth.IAuthService
            , private constants: Core.IConstants
            ) {

        }

        GetViews(reportType: Api.Models.ReportType) {
            return this.viewService.GetViews(reportType).then((data) => {
                return data;
            });
        }

        GetReportData(viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            return this.GetReportDataForEntity(entityId, viewId, dateFrom, dateTo, reportType);
        }

        GetReportDataForEntity(entityId: number, viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType) {
            var from = moment(dateFrom).format(this.constants.InternalDateFormat);
            var to = moment(dateTo).format(this.constants.InternalDateFormat);
            return this.reportApiService.Get(from, to, reportType, entityId, viewId).then(d => {
                return d.data;
            });
        }

        GetProductData(viewId: number, dateFrom: Date, dateTo: Date, reportType: Api.Models.ReportType, searchText: string) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var from = moment(dateFrom).format(this.constants.InternalDateFormat);
            var to = moment(dateTo).format(this.constants.InternalDateFormat);
            return this.productApiService.Get(entityId, from, to, reportType, viewId, searchText).then(d => {
                return d.data;
            });
        }

        GetExportUriForEntity(entityId: number, viewId: number, dateFrom: Date, dateTo: Date, reportType: ReportType): string {
            var uri = this._exportUriPrefix;
            if ((reportType === ReportType.InventoryMovement) || (reportType === ReportType.ProductMix)) {
                uri = this._exportProductUriPrefix;
            }

            return uri +
                "entityId=" + entityId +
                "&dateFrom=" + moment(dateFrom).format(this.constants.InternalDateFormat) +
                "&dateTo=" + moment(dateTo).format(this.constants.InternalDateFormat) +
                "&reportType=" + reportType +
                "&viewId=" + viewId;
        }

        GetExportUri(viewId: number, dateFrom: Date, dateTo: Date, reportType: ReportType): string {
            return this.GetExportUriForEntity(this.authService.GetUser().BusinessUser.MobileSettings.EntityId,
                viewId,
                dateFrom,
                dateTo,
                reportType);
        }
    }

    reportService = Core.NG.OperationsReportingModule.RegisterService("ReportService", ReportService
        , Api.$reportService
        , Api.$productService
        , viewService
        , Core.Auth.$authService
        , Core.Constants
    );
}