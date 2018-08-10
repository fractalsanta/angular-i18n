using System;
using System.Collections.Generic;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class EventWeekDayInfo
    {
        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime Date { get; set; }
        public bool IsClosed { get; set; }
        public IEnumerable<EventProfileTag> EventProfileTags { get; set; }
    }
}