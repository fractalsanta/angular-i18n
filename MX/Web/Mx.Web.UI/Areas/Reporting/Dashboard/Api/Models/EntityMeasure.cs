using System;
using System.Collections.Generic;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models
{
    [MapFrom(typeof(EntityMeasureResponse))]
    public class EntityMeasure
    {
        public long Id { get; set; }
        public long TypeId { get; set; }
        public long ParentId { get; set; }
        public string Name { get; set; }
        public DateTime LastUpdated { get; set; }
        public IEnumerable<Measure> Measures { get; set; }
    }
}