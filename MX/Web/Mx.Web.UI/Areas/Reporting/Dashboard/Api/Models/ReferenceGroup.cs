using Mx.Reporting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models
{
    [MapFrom(typeof(ReferenceDataGroups))]
    public class ReferenceGroup
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public ReferenceMeasure[] Measures { get; set; }
    }
}