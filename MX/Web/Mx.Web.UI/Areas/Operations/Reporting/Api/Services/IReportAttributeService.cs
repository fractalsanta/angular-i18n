using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public interface IReportAttributeService
    {
        void CheckUserCanAccess(ReportType reportType);
        void CheckUserCanAccessViewManager(ReportType reportType);
        void CheckUserCanCreateSharedViews(ReportType reportType);
        ReportViewType GetReportViewType(ReportType reportType);
    }
}
