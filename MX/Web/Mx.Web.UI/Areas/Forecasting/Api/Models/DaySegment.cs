using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(DaySegmentResponse))]
    public class DaySegment
    {
        public Int64 Id { get; set; }
        public DaySegmentType DaySegmentType { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal StartHour { get; set; }
        public decimal EndHour { get; set; }
    }
}