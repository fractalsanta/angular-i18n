using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Services;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class SalesItemMetricController : ForecastControllerBase
    {
        private readonly IForecastSalesItemMetricQueryService _forecastMetricQueryService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly ISalesItemMetricDetailCommandService _salesItemMetricDetailCommandService;

        public SalesItemMetricController(
            IForecastSalesItemMetricQueryService forecastSalesItemMetricQueryService,
            ISalesItemMetricDetailCommandService salesItemMetricDetailCommandService,
            IEntityQueryService entityQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService)
            : base(userAuthenticationQueryService, authorizationService, authenticationService)
        {
            _forecastMetricQueryService = forecastSalesItemMetricQueryService;
            _entityQueryService = entityQueryService;
            _salesItemMetricDetailCommandService = salesItemMetricDetailCommandService;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastSalesItemMetricResponse GetForecastSalesItemMetric(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean includeActuals = false,
            [FromUri] Boolean aggregate = false
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            var forecastDetailResponse = _forecastMetricQueryService.GetForecastSalesItemMetrics<ForecastSalesItemMetricResponseByInterval>(forecastId, filterId, includeActuals);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            if (aggregate)
            {
                Aggregate(forecastDetailResponse);
            }

            return forecastDetailResponse;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>/{salesItemId}
        public ForecastSalesItemMetricResponse GetForecastSalesItemMetric(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 id, 
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean includeActuals = false,
            [FromUri] Boolean aggregate = false
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            var forecastDetailResponse = _forecastMetricQueryService.GetForecastSalesItemMetrics<ForecastSalesItemMetricResponseByInterval>(forecastId, id, filterId, includeActuals);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            if (aggregate)
            {
                Aggregate(forecastDetailResponse);
            }

            return forecastDetailResponse;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>/{salesItemId}
        public ForecastSalesItemMetricResponse GetForecastSalesItemMetric(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] String ids,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean aggregate = false
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            var idValues = ids.Split(',').Select(Int64.Parse);

            var forecastDetailResponse = _forecastMetricQueryService.GetForecastSalesItemMetrics<ForecastSalesItemMetricResponseByInterval>(forecastId, idValues, filterId);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            if (aggregate)
            {
                Aggregate(forecastDetailResponse);
            }

            return forecastDetailResponse;
        }

        private static void Aggregate(ForecastSalesItemMetricResponse response)
        {
            if (!response.SalesItemMetricDetails.Any())
                return;

            var result = new List<SalesItemMetricDetailResponse>();
            foreach (var g in response.SalesItemMetricDetails.GroupBy(x => x.SalesItemId))
            {
                var aggregated = new SalesItemMetricDetailResponse();
                var prototype = g.FirstOrDefault();
                if (prototype != null)
                {
                    aggregated.BusinessDay = prototype.BusinessDay;
                    aggregated.IntervalStart = prototype.IntervalStart;
                    aggregated.SalesItemId = prototype.SalesItemId;
                    foreach (var x in g)
                    {
                        aggregated.ActualQuantity += x.ActualQuantity;
                        aggregated.LastYearTransactionCount += x.LastYearTransactionCount;
                        aggregated.ManagerTransactionCount += x.ManagerTransactionCount;
                        aggregated.SystemTransactionCount += x.SystemTransactionCount;
                    }
                }
                result.Add(aggregated);
            }
            response.SalesItemMetricDetails = result;
        }

        // GET api/Entity/{entityId}/ForecastEvaluation/{forecastEvaluationId}/<controller>
        public IEnumerable<String> Get(
            [FromUri] Int64 entityId,
            [FromUri] String forecastEvaluationId
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            return new[] { "Evaluation " + forecastEvaluationId + " Sales Item Metric 1", "Evaluation " + forecastEvaluationId + " Metric 2" };
        }

        // GET api/Entity/{entityId}/ForecastEvaluation/{forecastEvaluationId}/<controller>/5
        public String GetEvaluationSalesItemMetricId(
            [FromUri] Int64 entityId,
            [FromUri] String forecastEvaluationId,
            [FromUri] Int64 id
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            return "Evaluation Sales Item Metric " + id;
        }

        [Permission(Task.Forecasting_CanEdit)]
        public ForecastUpdateHeader PatchSalesItemMetricDetails(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 version,
            [FromBody] IEnumerable<ForecastSalesItemMetricDetailsHeader> salesItemMetricDetailRequests
            )
        {
            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));
            var forecast = EnsureResource("Forecast", _forecastMetricQueryService.GetById(forecastId));

            if (IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            var updatedVersion = version;

            foreach (var salesItemMetricDetailRequest in salesItemMetricDetailRequests)
            {
                var request = new ForecastSalesItemMetricDetailsRequest()
                {
                    ForecastId = forecastId,
                    Version = updatedVersion,
                    SalesItemMetricDetails = salesItemMetricDetailRequest.SalesItemMetricDetails,
                    FilterId = salesItemMetricDetailRequest.FilterId
                };

                updatedVersion = _salesItemMetricDetailCommandService.UpdateSalesItemMetricDetails(entityId, request);
            }

            return new ForecastUpdateHeader
            {
                Id = forecastId,
                EntityId = entityId,
                Version = updatedVersion
            };
        }
    }
}