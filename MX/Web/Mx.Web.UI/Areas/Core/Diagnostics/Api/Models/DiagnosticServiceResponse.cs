using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.Models
{
    public class DiagnosticServiceResponse
    {
        public bool Success { get; set; }

        public List<DiagnosticServiceDetail> Errors { get; set; }

        public DiagnosticServiceResponse()
        {
            Errors = new List<DiagnosticServiceDetail>();
        }
    }
}