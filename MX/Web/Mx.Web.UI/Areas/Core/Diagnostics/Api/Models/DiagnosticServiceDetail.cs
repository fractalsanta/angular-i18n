using Mx.Web.UI.Config.Mapping;


namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.Models
{
    [MapFrom(typeof(Mx.Services.Shared.Diagnostic.DiagnosticMessage))]
    public class DiagnosticServiceDetail
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Component { get; set; }
    }
}