using System;
using Mx.Labor.Services.Contracts.Responses;
using Mx.Web.UI.Config.Converters;
using Mx.Web.UI.Config.Mapping;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.MyTimeCard.Api.Models
{
    [MapFrom(typeof(WorkedShiftResponse))]
    public class TimeCardEntry
    {
        public TimeCardEntry()
        {
            Breaks = new TimeCardBreak[0];
        }

        public long EntityId { get; set; }
        public string EntityName { get; set; }
        
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime StartTime { get; set; }
        
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime EndTime { get; set; }
        
        public string JobName { get; set; }
        
        public TimeCardBreak[] Breaks { get; set; }
    }
}