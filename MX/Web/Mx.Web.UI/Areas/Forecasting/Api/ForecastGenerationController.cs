using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Auditing.Enums;
using Mx.Services.Shared.Auditing.Interfaces;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastGenerationController : RESTController
	{
        private IForecastQueryService _forecastQueryService;
        private IEntityQueryService _entityQueryService;
        private readonly IForecastGenerator _forecastGenerator;
        private IAuditService _auditService;

        public ForecastGenerationController(IForecastGenerator forecastGenerator, IForecastQueryService forecastQueryService,
                                  IEntityQueryService entityQueryService,
                                  IUserAuthenticationQueryService userAuthenticationQueryService,
                                  IAuditService auditService)
            : base(userAuthenticationQueryService)
		{
			_forecastGenerator = forecastGenerator;
            _forecastQueryService = forecastQueryService;
            _entityQueryService = entityQueryService;
            _auditService = auditService;
		}

        // GET api/ForecastApi
        public IEnumerable<ForecastResponse> Get(Int64 entityId)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                var errorDescription = String.Format("Entity {0} not found.", entityId);
                _auditService.AuditSystemEvent(AuditEvent.Forecasting_GenerationComplete, "ForecastGeneration Get", errorDescription, entityId);
                throw new MissingResourceException(errorDescription);
            }

            return _forecastQueryService.GetForecasts(entityId);
        }

        public HttpResponseMessage Post(Int64 entityId, [FromBody] ForecastGenerationRequest request)
        {
            ForecastGenerationDebugInfo debugInfo;
            if (request.GenerateInventoryOnly)
            {
                debugInfo = GenerateInventoryForecast(entityId, request);
                return Request.CreateResponse<ForecastGenerationDebugInfo>(HttpStatusCode.OK, debugInfo);
            }

            if (request.ForecastId == 0)
            {
                debugInfo = GenerateNewForecastForBusinessDate(entityId, request.BusinessDate, request.Dump);
                return Request.CreateResponse<ForecastGenerationDebugInfo>(HttpStatusCode.OK, debugInfo);
            }

            var forecast = _forecastQueryService.GetById(request.ForecastId);
            if (forecast == null || forecast.EntityId != entityId)
            {
                var errorDescription = String.Format("Forecast {0} for Entity {1} not found.", request.ForecastId, entityId);
                _auditService.AuditSystemEvent(AuditEvent.Forecasting_GenerationComplete, "ForecastGeneration Post", errorDescription, entityId);
                throw new MissingResourceException(errorDescription);
            }

            debugInfo = _forecastGenerator.GenerateForecast(request.ForecastId, request.Dump);
            return Request.CreateResponse<ForecastGenerationDebugInfo>(HttpStatusCode.OK, debugInfo);
        }

        private ForecastGenerationDebugInfo GenerateInventoryForecast(long entityId, ForecastGenerationRequest request)
        {
            if (request.ForecastId == 0)
            {
                var errorDescription = String.Format("Missing forecast for Entity {0}.", entityId);
                _auditService.AuditSystemEvent(AuditEvent.Forecasting_GenerationComplete, "ForecastInventoryGeneration Post", errorDescription, entityId);
                throw new MissingResourceException(errorDescription);
            }

            var forecast = _forecastQueryService.GetById(request.ForecastId);
            if (forecast == null || forecast.EntityId != entityId)
            {
                var errorDescription = String.Format("Forecast {0} for Entity {1} not found.", request.ForecastId, entityId);
                _auditService.AuditSystemEvent(AuditEvent.Forecasting_GenerationComplete, "ForecastInventoryGeneration Post", errorDescription, entityId);
                throw new MissingResourceException(errorDescription);
            }

            return _forecastGenerator.GenerateInventoryForecast(request.ForecastId);
        }

        private ForecastGenerationDebugInfo GenerateNewForecastForBusinessDate(long entityId, DateTime businessDate, Boolean dump)
        {
            if (businessDate.Equals(DateTime.MinValue))
            {
                var errorDescription = String.Format("Invalid BusinessDate {0} for ForecastGeneration for Entity {1}.", businessDate.ToShortDateString(), entityId);
                _auditService.AuditSystemEvent(AuditEvent.Forecasting_GenerationComplete, "ForecastGeneration Get", errorDescription, entityId);
                throw new InvalidQueryParameterException(errorDescription);                
            }
            
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                var errorDescription = String.Format("Entity {0} not found.", entityId);
                _auditService.AuditSystemEvent(AuditEvent.Forecasting_GenerationComplete, "ForecastGeneration Get", errorDescription, entityId);
                throw new MissingResourceException(errorDescription);
            }

            return _forecastGenerator.GenerateForecast(entity.Id, businessDate, dump);
        }
	}
}
