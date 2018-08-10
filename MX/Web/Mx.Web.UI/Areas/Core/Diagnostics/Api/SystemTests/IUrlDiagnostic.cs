using Mx.Services.Shared.Diagnostic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.SystemTests
{
    public interface IUrlDiagnostic
    {
        DiagnosticMessage TestSliceUrl(string url);
        DiagnosticMessage TestLegacySliceUrl(string url);
        DiagnosticMessage TestUrl(string url);
    }
}
