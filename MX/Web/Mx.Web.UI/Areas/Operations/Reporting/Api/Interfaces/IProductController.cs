using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Interfaces
{
    public interface IProductController
    {
        ProductData Get(long entityId, string dateFrom, string dateTo, ReportType reportType, int? viewId, string searchText);
    }
}
