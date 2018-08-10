using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Services;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class MetricController : ForecastControllerBase
    {
        private IForecastCommandService _forecastCommandService;
        private IForecastQueryService _forecastQueryService;
        private IForecastMetricQueryService _forecastMetricQueryService;
        private IEntityQueryService _entityQueryService;

        public MetricController(IForecastMetricQueryService forecastMetricQueryService,
                                IForecastCommandService forecastCommandService,
                                IForecastQueryService forecastQueryService,
                                IEntityQueryService entityQueryService,
                                IUserAuthenticationQueryService userAuthenticationQueryService,
                                IAuthorizationService authorizationService,
                                IAuthenticationService authenticationService)
            : base(userAuthenticationQueryService, authorizationService, authenticationService)
        {
            _forecastCommandService = forecastCommandService;
            _forecastQueryService = forecastQueryService;
            _forecastMetricQueryService = forecastMetricQueryService;
            _entityQueryService = entityQueryService;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastMetricResponse GetForecastMetrics(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean includeActuals = false
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));
           
            var forecastDetailResponse = _forecastMetricQueryService.GetForecastMetrics(forecastId, filterId, includeActuals);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            return forecastDetailResponse;
        }

        public ForecastMetricResponse GetForecastMetricsByServiceType(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int32 serviceType, 
            [FromUri] Boolean includeActuals = false
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            var forecastDetailResponse = _forecastMetricQueryService.GetForecastMetrics(forecastId, new List<PosServiceType>() { (PosServiceType)serviceType }, includeActuals);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            return forecastDetailResponse;
        }

        // GET api/Entity/{entityId}/ForecastEvaluation/{forecastEvaluationId}/<controller>
        public IEnumerable<String> GetForecastEvaluationById(
            [FromUri] Int64 entityId,
            [FromUri] String forecastEvaluationId
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            return new string[] { "Evaluation " + forecastEvaluationId + " Metric 1", "Evaluation " + forecastEvaluationId + " Metric 2" };
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>/5
        public string GetForecastMetricId(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 id
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            return "Forecast Metric " + id;
        }

        // GET api/Entity/{entityId}/ForecastEvaluation/{forecastEvaluationId}/<controller>/5
        public string GetEvaluationMetricId(
            [FromUri] Int64 entityId,
            [FromUri] String forecastEvaluationId,
            [FromUri] Int64 id
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            return "Evaluation Metric " + id;
        }

        [Permission(Task.Forecasting_CanEdit)]
        public ForecastUpdateHeader PatchForecastMetricDetails(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 version,
            [FromBody] IEnumerable<ForecastMetricDetailsHeader> metricDetailRequests
            )
        {
            var forecast = EnsureResource("Forecast", _forecastQueryService.GetById(forecastId));
            var entity = EnsureResource("Entity", _entityQueryService.GetById(forecast.EntityId));

            if (IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            var updatedVersion = version;

            foreach (var metricDetailRequest in metricDetailRequests)
            {
                var request = new ForecastMetricDetailsRequest
                {
                    ForecastId = forecastId,
                    Version = updatedVersion,
                    MetricDetails = metricDetailRequest.MetricDetails,
                    FilterId = metricDetailRequest.FilterId
                };

                updatedVersion = _forecastCommandService.UpdateForecastMetricDetails(forecast.EntityId, request);
            }

            return new ForecastUpdateHeader()
            {
                Id = forecastId,
                EntityId = forecast.EntityId,
                Version = updatedVersion
            };
        }
    }
}