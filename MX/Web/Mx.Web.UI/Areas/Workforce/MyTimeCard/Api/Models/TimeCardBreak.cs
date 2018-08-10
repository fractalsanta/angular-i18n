using System;
using Mx.Labor.Services.Contracts.Responses;
using Mx.Web.UI.Config.Converters;
using Mx.Web.UI.Config.Mapping;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.MyTimeCard.Api.Models
{
    [MapFrom(typeof(WorkedShiftResponse.Break))]
    public class TimeCardBreak
    {
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime Start { get; set; }
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime End { get; set; }
        public BreakType Type { get; set; }
        public bool IsPaid { get; set; }
    }
}