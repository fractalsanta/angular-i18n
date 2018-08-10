using System.Collections.Generic;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models
{
    [MapFrom(typeof(EntityMeasureResponse.MeasureResponse))]
    public class Measure
    {
        public string Id { get; set; }
        public IEnumerable<Interval> Intervals { get; set; }
    }
}
