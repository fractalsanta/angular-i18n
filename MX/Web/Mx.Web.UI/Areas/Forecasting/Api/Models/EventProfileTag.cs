using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Converters;
using Mx.Web.UI.Config.Mapping;
using System;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(EventProfileTagResponse))]
    public class EventProfileTag
    {
        public Int64 Id { get; set; }
        public Int64 EventProfileId { get; set; }

        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime Date { get; set; }

        public String Note { get; set; }

        public EventProfile EventProfile { get; set; }
    }
}