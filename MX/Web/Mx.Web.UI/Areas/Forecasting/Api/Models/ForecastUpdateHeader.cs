using System;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class ForecastUpdateHeader
    {
        public Int64 EntityId { get; set; }
        public Int64 Id { get; set; }
        public Int64 Version { get; set; }
    }
}