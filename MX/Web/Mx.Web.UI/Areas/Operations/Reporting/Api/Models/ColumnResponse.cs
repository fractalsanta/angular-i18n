using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    public class ColumnResponse
    {
        public IEnumerable<ReportColumnName> Columns { get; set; }
        public IEnumerable<short> DefaultColumnIds { get; set; }
    }
}