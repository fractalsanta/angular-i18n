using Mx.Services.Shared.Diagnostic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.SystemTests
{
    public class DiagnosticLegacySliceIsAvailable : IDiagnosticTest
    {
        private readonly IUrlDiagnostic _urlDiagnostic;

        public DiagnosticLegacySliceIsAvailable(IUrlDiagnostic urlDiagnostic)
        {
            _urlDiagnostic = urlDiagnostic;

        }
        public DiagnosticMessage Test()
        {
            const string url = "/Legacy/QueryServices/LegacyForecastingQueryService.svc";
            return _urlDiagnostic.TestLegacySliceUrl(url);
        }
    }
}