using System;
using System.Linq;
using System.Collections.Generic;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class InventoryItemMetricController : RESTController
    {
        private readonly IForecastInventoryItemMetricQueryService _forecastInventoryItemMetricQueryService;
        private readonly IEntityQueryService _entityQueryService;

        public InventoryItemMetricController(
            IForecastInventoryItemMetricQueryService forecastInventoryItemMetricQueryService,
            IEntityQueryService entityQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService) : base(userAuthenticationQueryService)
        {
            _forecastInventoryItemMetricQueryService = forecastInventoryItemMetricQueryService;
            _entityQueryService = entityQueryService;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastInventoryItemMetricResponse Get(Int64 entityId, Int64 forecastId, Int32? filterId = null, Boolean includeActuals = false, Boolean aggregate = false)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var forecastDetailResponse = _forecastInventoryItemMetricQueryService.GetForecastInventoryItemMetrics<ForecastInventoryItemMetricResponseByInterval>(forecastId, filterId);
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

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastInventoryItemMetricResponse Get(Int64 entityId, Int64 forecastId, Int64 id, Int32? filterId = null, Boolean includeActuals = false, Boolean aggregate = false)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var forecastDetailResponse = _forecastInventoryItemMetricQueryService.GetForecastInventoryItemMetrics<ForecastInventoryItemMetricResponseByInterval>(forecastId, id, filterId, includeActuals);
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

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastInventoryItemMetricResponse Get(Int64 entityId, Int64 forecastId, String ids, Int32? filterId = null, Boolean aggregate = false)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var idValues = ids.Split(',').Select(Int64.Parse);
            
            var response = _forecastInventoryItemMetricQueryService.GetForecastInventoryItemMetrics<ForecastInventoryItemMetricResponseByInterval>(forecastId, idValues, filterId);

            if (aggregate)
            {
                Aggregate(response);
            }

            return response;
        }

        private static void Aggregate(ForecastInventoryItemMetricResponse response)
        {
            if (!response.InventoryItemMetricDetails.Any())
                return;

            var result = new List<InventoryItemMetricDetailResponse>();
            foreach (var g in response.InventoryItemMetricDetails.GroupBy(x => x.InventoryItemId))
            {
                var aggregated = new InventoryItemMetricDetailResponse();
                var prototype = g.FirstOrDefault();
                if (prototype != null)
                {
                    aggregated.InventoryItemId = prototype.InventoryItemId;
                    aggregated.IntervalStart = prototype.IntervalStart;
                    foreach (var x in g)
                    {
                        aggregated.ActualQuantity += x.ActualQuantity;
                        aggregated.LastYearTransactionCount += x.LastYearTransactionCount;
                        aggregated.ManagerTransactionCount += x.ManagerTransactionCount;
                        aggregated.RawTransactionCount += x.RawTransactionCount;
                        aggregated.SystemTransactionCount += x.SystemTransactionCount;
                    }
                }
                result.Add(aggregated);
            }
            response.InventoryItemMetricDetails = result;
        }
    }
}
