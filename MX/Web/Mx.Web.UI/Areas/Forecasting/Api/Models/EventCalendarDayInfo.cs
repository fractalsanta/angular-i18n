using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class EventCalendarDayInfo
    {
        public Boolean IsClosed { get; set; }
        public IEnumerable<String> EventTagNotes { get; set; }
        public IEnumerable<Int64> EventProfileIds { get; set; }
        public IEnumerable<Int64> EventProfileTagIds { get; set; }
    }
}