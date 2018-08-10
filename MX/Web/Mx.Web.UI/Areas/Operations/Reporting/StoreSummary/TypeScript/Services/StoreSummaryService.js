var Operations;
(function (Operations) {
    (function (Reporting) {
        (function (StoreSummary) {
            var StoreSummaryService = (function () {
                function StoreSummaryService(storeSummaryApiService, constants) {
                    this.storeSummaryApiService = storeSummaryApiService;
                    this.constants = constants;
                }
                StoreSummaryService.prototype.Get = function (entityId, viewId, dateFrom, dateTo) {
                    var from = moment(dateFrom).format(this.constants.InternalDateFormat);
                    var to = moment(dateTo).format(this.constants.InternalDateFormat);
                    return this.storeSummaryApiService.Get(entityId, viewId, from, to).then(function (d) {
                        return d.data;
                    });
                };
                return StoreSummaryService;
            })();

            StoreSummary.storeSummaryService = Core.NG.OperationsReportingStoreSummaryModule.RegisterService("StoreSummaryService", StoreSummaryService, StoreSummary.Api.$storeSummaryService, Core.Constants);
        })(Reporting.StoreSummary || (Reporting.StoreSummary = {}));
        var StoreSummary = Reporting.StoreSummary;
    })(Operations.Reporting || (Operations.Reporting = {}));
    var Reporting = Operations.Reporting;
})(Operations || (Operations = {}));
//# sourceMappingURL=StoreSummaryService.js.map
