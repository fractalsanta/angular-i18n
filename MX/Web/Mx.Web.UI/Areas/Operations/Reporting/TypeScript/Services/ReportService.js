var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var ReportType = Reporting.Api.Models.ReportType;
        var ReportService = (function () {
            function ReportService(reportApiService, productApiService, viewService, authService, constants) {
                this.reportApiService = reportApiService;
                this.productApiService = productApiService;
                this.viewService = viewService;
                this.authService = authService;
                this.constants = constants;
                this._exportUriPrefix = "/Operations/Reporting/Api/ReportExport?";
                this._exportProductUriPrefix = "/Operations/Reporting/Api/ProductExport?";
            }
            ReportService.prototype.GetViews = function (reportType) {
                return this.viewService.GetViews(reportType).then(function (data) {
                    return data;
                });
            };
            ReportService.prototype.GetReportData = function (viewId, dateFrom, dateTo, reportType) {
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                return this.GetReportDataForEntity(entityId, viewId, dateFrom, dateTo, reportType);
            };
            ReportService.prototype.GetReportDataForEntity = function (entityId, viewId, dateFrom, dateTo, reportType) {
                var from = moment(dateFrom).format(this.constants.InternalDateFormat);
                var to = moment(dateTo).format(this.constants.InternalDateFormat);
                return this.reportApiService.Get(from, to, reportType, entityId, viewId).then(function (d) {
                    return d.data;
                });
            };
            ReportService.prototype.GetProductData = function (viewId, dateFrom, dateTo, reportType, searchText) {
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var from = moment(dateFrom).format(this.constants.InternalDateFormat);
                var to = moment(dateTo).format(this.constants.InternalDateFormat);
                return this.productApiService.Get(entityId, from, to, reportType, viewId, searchText).then(function (d) {
                    return d.data;
                });
            };
            ReportService.prototype.GetExportUriForEntity = function (entityId, viewId, dateFrom, dateTo, reportType) {
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
            };
            ReportService.prototype.GetExportUri = function (viewId, dateFrom, dateTo, reportType) {
                return this.GetExportUriForEntity(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, viewId, dateFrom, dateTo, reportType);
            };
            return ReportService;
        }());
        Reporting.reportService = Core.NG.OperationsReportingModule.RegisterService("ReportService", ReportService, Reporting.Api.$reportService, Reporting.Api.$productService, Reporting.viewService, Core.Auth.$authService, Core.Constants);
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
