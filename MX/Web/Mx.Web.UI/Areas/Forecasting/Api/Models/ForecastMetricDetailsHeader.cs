using System;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.Requests;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class ForecastMetricDetailsHeader
    {
        public IList<MetricDetailRequest> MetricDetails { get; set; }
        public Int32? FilterId { get; set; }
    }
}