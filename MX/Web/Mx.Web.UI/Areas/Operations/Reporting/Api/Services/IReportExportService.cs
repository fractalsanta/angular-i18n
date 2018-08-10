using System;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using System.Collections.Generic;
using Mx.OperationalReporting.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public interface IReportExportService
    {
        string ExportToCsv(ProductData data, BusinessUser user, long entityId, ReportType report);
        string ExportToCsv(ReportData report, BusinessUser user, long entityId, ReportType reportType);
        string ExportToCsv(ReportData report, BusinessUser user, IEnumerable<EntityModel> entityIds, ReportType reportType);
        string GenerateExportFileName(long? entityId, string viewName, ReportType reportType);
    }
}
