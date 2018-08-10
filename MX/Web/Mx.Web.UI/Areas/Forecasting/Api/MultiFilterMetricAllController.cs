using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using AutoMapper;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Forecasting.Api.Models;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class MultiFilterMetricAllController : MultiFilterRESTController
    {
        private readonly MetricAllController _metricAllController;
        private readonly IMappingEngine _mappingEngine;

        public MultiFilterMetricAllController(MetricAllController metricAllController, 
            IMappingEngine mappingEngine,
            IForecastFilterQueryService forecastFilterQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(forecastFilterQueryService, userAuthenticationQueryService)
        {
            _metricAllController = metricAllController;
            _mappingEngine = mappingEngine;
        }

        public IEnumerable<Filtered<Object>> GetForecastMetricAlls(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [ModelBinder(typeof(CommaDelimitedCollectionModelBinder))] IEnumerable<Int32> filterIds = null,
            [FromUri] Boolean includeActuals = false)
        {
            filterIds = PopulateFilterList(filterIds);

            return MultiFilter(filterIds, (filterId) =>
            {
                return CondenseResult(filterId,
                    _metricAllController.GetForecastMetricAlls(entityId, forecastId, filterId, includeActuals));
            });
        }

        private Object CondenseResult(Int32? filterId, ForecastingMetricAlls result)
        {
            return filterId.HasValue ? _mappingEngine.Map<ForecastingMetricAllsCondensed>(result) : (Object)result;
        }
    }
}