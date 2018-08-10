using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public interface IReportColumnNameLocalisationService
    {
        IDictionary<short, string> GetColumnLocalisationMap(Models.ReportType reportType);
    }
}