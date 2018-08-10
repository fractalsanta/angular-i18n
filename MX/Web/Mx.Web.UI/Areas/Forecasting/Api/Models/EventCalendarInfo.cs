using System;
using System.Collections.Generic;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class EventCalendarInfo
    {
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime FirstDayOnCalendar { get; set; }
        public Int32 FirstDayDayOfWeek { get; set; }
        public Int32 NumberOfDays { get; set; }
        public IEnumerable<EventCalendarDayInfo> DayInfo { get; set; }
    }
}