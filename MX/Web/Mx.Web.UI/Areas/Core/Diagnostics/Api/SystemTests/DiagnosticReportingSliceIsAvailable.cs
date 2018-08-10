using Mx.Services.Shared.Diagnostic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.SystemTests
{
    public class DiagnosticReportingSliceIsAvailable : IDiagnosticTest
    {
        private readonly IUrlDiagnostic _urlDiagnostic;

        public DiagnosticReportingSliceIsAvailable(IUrlDiagnostic urlDiagnostic)
        {
            _urlDiagnostic = urlDiagnostic;
        }

        public DiagnosticMessage Test()
        {
            const string url = "/reporting/commandservices/DashboardReportCommandService.svc";
            return _urlDiagnostic.TestSliceUrl(url);
        }
    }
}