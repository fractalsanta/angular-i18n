using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Http;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public class ReportAttributeService : IReportAttributeService
    {
        private readonly IAuthenticationService _authService;
        public ReportAttributeService(IAuthenticationService authenticationService)
        {
            _authService = authenticationService;
        }

        public void CheckUserCanAccess(ReportType reportType)
        {
            CheckPermission(GetReportAttributes(reportType).AccessPermission);
        }

        public void CheckUserCanAccessViewManager(ReportType reportType)
        {
            CheckPermission(GetReportAttributes(reportType).ViewManagerPermission);
        }

        public void CheckUserCanCreateSharedViews(ReportType reportType)
        {
            CheckPermission(GetReportAttributes(reportType).SharedViewsPermission);
        }

        public ReportViewType GetReportViewType(ReportType reportType){
            return GetReportAttributes(reportType).ViewType;
        }

        private ReportAttribute GetReportAttributes(ReportType reportType)
        {
            var t = typeof(ReportType);
            var info = t.GetField(Enum.GetName(t, reportType));
            return (ReportAttribute)Attribute.GetCustomAttribute(info, typeof(ReportAttribute));
        }

        private void CheckPermission(Task task)
        {
            if (!_authService.User.Permission.HasPermission(task))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }


    }
}
