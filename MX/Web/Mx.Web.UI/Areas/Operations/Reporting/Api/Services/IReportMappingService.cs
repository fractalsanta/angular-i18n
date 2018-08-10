using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.OperationalReporting.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public interface IReportMappingService
    {
        ReportData Map(ReportResponse source, ReportRequest req);
        ProductData Map(ProductResponse source, ReportRequest req);
    }
}