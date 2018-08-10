using Mx.OperationalReporting.Services.Contracts.Responses;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    public class ProductData
    {
        public IEnumerable<ReportColumnData> Columns { get; set; }
        public IEnumerable<ProductDetails> Products { get; set; }
        public IEnumerable<ProductGroupDetails> Groups { get; set; }
        public string ViewName { get; set; }
        public EntityModel CurrentEntity { get; set; }
        public string ExportFileName { get; set; }
    }
}