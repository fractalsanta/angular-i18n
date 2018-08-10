using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class ForecastOperationCollection
    {
        public Int64 Version { get; set; }
        public IEnumerable<ForecastOperation> Operations { get; set; }
    }
}