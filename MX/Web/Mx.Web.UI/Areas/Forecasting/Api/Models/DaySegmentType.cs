using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(DaySegmentTypeResponse))]
    public class DaySegmentType
    {
        public Int64 Id { get; set; }
        public String Description { get; set; }
        public Int16 SortOrder { get; set; }
    }
}