using System;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class SystemAdjustmentController : RESTController
    {
        private readonly IEntityQueryService _entityQueryService;
        private readonly IForecastCommandService _commandService;
        private readonly IForecastQueryService _forecastQueryService;

        public SystemAdjustmentController(
            IEntityQueryService entityQueryService,
            IForecastCommandService commandService,
            IForecastQueryService forecastQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(userAuthenticationQueryService)
        {
            _entityQueryService = entityQueryService;
            _commandService = commandService;
            _forecastQueryService = forecastQueryService;
        }

        [HttpPost]
        public ForecastUpdateHeader PostSystemAdjustments(
            [FromUri] Int64 entityId,
            [FromUri] DateTime businessDay,
            [FromBody] List<SystemAdjustmentRequest> systemAdjustmentRequest
            )
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var forecast = _forecastQueryService.GetMostRecentGeneratedForecastForBusinessDay(entityId, businessDay);
            if(forecast == null){
                throw new MissingResourceException("No forecast for entity and date.");
            }

            var version = _commandService.AdjustSystemForecast(forecast.Id, systemAdjustmentRequest);

            var forecastUpdate = new ForecastUpdateHeader
            {
                Id = forecast.Id,
                EntityId = entityId,
                Version = version
            };

            return forecastUpdate;
        }

    }
}