using System;
using Mx.Forecasting.Services.Contracts;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class ForecastPipelineRequest
    {
        public ForecastPipelineRequest()
        {
            CalculateSalesItemMetrics = true;
            CalculateInventoryItemMetrics = true;
        }

        public ForecastingPipelineType PipelineType { get; set; }
        public ForecastingPipelineDecorators PipelineDecorators { get; set; }
        public Boolean CalculateSalesItemMetrics { get; set; }
        public Boolean CalculateInventoryItemMetrics { get; set; }
    }
}
