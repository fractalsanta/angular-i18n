using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(EventProfileResponse))]
    public class EventProfile
    {
        public Int64 Id { get; set; }
        public Int64 EntityId { get; set; }
        public String Name{ get; set; }
        public Enums.EventProfileSource Source { get; set; }
        public IEnumerable<EventProfileHistory> History { get; set; }
        public IEnumerable<Double> Adjustments { get; set; }
    }
}