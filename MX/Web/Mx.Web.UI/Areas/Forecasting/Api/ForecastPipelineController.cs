using System;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastPipelineController : RESTController
    {
        private readonly IForecastPipelineCommandService _forecastPipelineCommandService;

        public ForecastPipelineController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IForecastPipelineCommandService forecastPipelineCommandService) : base(userAuthenticationQueryService)
        {
            _forecastPipelineCommandService = forecastPipelineCommandService;
        }

        public void PostPipeline([FromUri] Int64 entityId, [FromUri] Int64 forecastId, [FromBody] ForecastPipelineRequest request)
        {
            switch (request.PipelineType)
            {
                case ForecastingPipelineType.GenerateRaw:
                case ForecastingPipelineType.GenerateSystem:
                case ForecastingPipelineType.GenerateManager:
                case ForecastingPipelineType.RoundSystemForecast:
                case ForecastingPipelineType.RoundSystemAndManagerForecast:
                    break;

                default:
                    throw new NotSupportedException("The pipeline type '" + request.PipelineType + "' cannot be invoked through the REST API.");
            }

            var type = request.PipelineType;
            var decorators = request.PipelineDecorators;
            var calculateSalesItems = request.CalculateSalesItemMetrics;
            var calculateInventoryItems = request.CalculateInventoryItemMetrics;

            if (!_forecastPipelineCommandService.ProcessPipelineForForecast(entityId, forecastId, type, decorators, calculateSalesItems, calculateInventoryItems))
                throw new InvalidOperationException("Pipeline processing failed.");
        }
    }
}