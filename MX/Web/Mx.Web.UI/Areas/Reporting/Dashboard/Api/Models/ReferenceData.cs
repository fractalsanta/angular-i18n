using System;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models
{
    public class ReferenceData
    {
        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime Today { get; set; }
        public ReferenceGroup[] Groups { get; set; }
        public ReferenceInterval[] Intervals { get; set; }
    }
}