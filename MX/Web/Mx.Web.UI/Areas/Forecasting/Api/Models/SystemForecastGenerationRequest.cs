using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class SystemForecastGenerationRequest
    {
        public DateTime ForecastDate { get; set; }
        public Int64? ForecastId { get; set; }
        public Int64? SalesItemId { get; set; }
    }
}