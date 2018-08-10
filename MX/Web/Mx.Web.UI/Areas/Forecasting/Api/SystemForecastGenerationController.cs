using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Forecasting.Services.Interfaces.Services;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;


namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class SystemForecastGenerationController : RESTController
    {
        private readonly ISystemForecastGenerationCommandService _systemForecastGenerationCommandService;
        private readonly IForecastQueryService _forecastQueryService;

        public SystemForecastGenerationController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            ISystemForecastGenerationCommandService systemForecastGenerationCommandService,
            IForecastQueryService forecastQueryService)
            :base(userAuthenticationQueryService)
        {
            _systemForecastGenerationCommandService = systemForecastGenerationCommandService;
            _forecastQueryService = forecastQueryService;
        }

        // POST api/ForecastApi
        public void Post([FromUri] Int64 entityId, [FromBody] SystemForecastGenerationRequest request)
        {
            ForecastResponse forecast = null;

            if (request.ForecastId.HasValue)
            {
                forecast = _forecastQueryService.GetById(request.ForecastId.Value);
            } 
            else if (request.ForecastDate != null)
            {
                forecast = _forecastQueryService.GetMostRecentGeneratedForecastForBusinessDay(entityId, request.ForecastDate);
            }

            if (forecast == null)
            {
                throw new MissingResourceException("Forecast not found");
            }

            if (request.SalesItemId.HasValue)
            {
                _systemForecastGenerationCommandService.GenerateSalesItemSystemForecast(forecast.Id, request.SalesItemId.Value);
            }
            else
            {
                _systemForecastGenerationCommandService.GenerateSystemForecast(forecast.Id);
            }
            
        }
    }
}