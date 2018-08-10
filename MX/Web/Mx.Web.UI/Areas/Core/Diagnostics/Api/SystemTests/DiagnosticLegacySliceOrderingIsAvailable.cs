using Mx.Services.Shared.Diagnostic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.SystemTests
{
    public class DiagnosticLegacySliceOrderingIsAvailable : IDiagnosticTest
    {
        private readonly IUrlDiagnostic _urlDiagnostic;

        public DiagnosticLegacySliceOrderingIsAvailable(IUrlDiagnostic urlDiagnostic)
        {
            _urlDiagnostic = urlDiagnostic;

        }
        public DiagnosticMessage Test()
        {
            const string url = "/Legacy/CommandServices/LegacyElectronicOrderCommandService.svc";
            return _urlDiagnostic.TestLegacySliceUrl(url);
        }
    }
}