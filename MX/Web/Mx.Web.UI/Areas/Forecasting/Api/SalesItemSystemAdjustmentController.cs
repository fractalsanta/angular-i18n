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
    public class SalesItemSystemAdjustmentController : RESTController
    {
        private readonly IEntityQueryService _entityQueryService;
        private readonly ISalesItemMetricDetailCommandService _salesItemCommandService;
        private readonly IForecastQueryService _forecastQueryService;

        public SalesItemSystemAdjustmentController(
            IEntityQueryService entityQueryService,
            ISalesItemMetricDetailCommandService salesItemCommandService,
            IForecastQueryService forecastQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(userAuthenticationQueryService)
        {
            _entityQueryService = entityQueryService;
            _salesItemCommandService = salesItemCommandService;
            _forecastQueryService = forecastQueryService;
        }

        [HttpPost]
        public ForecastUpdateHeader PostSalesItemSystemAdjustments(
            [FromUri] Int64 entityId,
            [FromUri] DateTime businessDay,
            [FromBody] List<SalesItemSystemAdjustmentRequest> salesItemSystemAdjustmentRequest
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

            var version = _salesItemCommandService.AdjustSystemForecast(forecast.Id, salesItemSystemAdjustmentRequest);

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