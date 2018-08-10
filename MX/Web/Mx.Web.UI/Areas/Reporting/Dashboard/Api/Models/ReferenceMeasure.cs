using Mx.Reporting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models
{
    [MapFrom(typeof(ReferenceDataMeasures))]
    public class ReferenceMeasure
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Chart { get; set; }
        public string ChartSubtitle { get; set; }
    }
}