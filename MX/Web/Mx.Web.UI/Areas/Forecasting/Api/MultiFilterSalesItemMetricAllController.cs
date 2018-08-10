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
    public class MultiFilterSalesItemMetricAllController : MultiFilterRESTController
    {
        private readonly SalesItemMetricAllController _salesItemMetricAllController;
        private readonly IMappingEngine _mappingEngine;

        public MultiFilterSalesItemMetricAllController(SalesItemMetricAllController salesItemMetricAllController, 
            IMappingEngine mappingEngine,
            IForecastFilterQueryService forecastFilterQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(forecastFilterQueryService, userAuthenticationQueryService)
        {
            _salesItemMetricAllController = salesItemMetricAllController;
            _mappingEngine = mappingEngine;
        }

        public IEnumerable<Filtered<Object>> GetForecastingSalesItemMetricAlls(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [ModelBinder(typeof(CommaDelimitedCollectionModelBinder))] IEnumerable<Int32> filterIds = null,
            [FromUri] Boolean includeActuals = false,
            [FromUri] Boolean aggregate = false)
        {
            filterIds = PopulateFilterList(filterIds);

            return MultiFilter(filterIds, (filterId) =>
            {
                return CondenseResult(filterId,
                    _salesItemMetricAllController.GetForecastingSalesItemMetricAlls(entityId, forecastId, filterId, includeActuals, aggregate));
            });
        }

        public IEnumerable<Filtered<Object>> GetSalesItemMetrics(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 id,
            [ModelBinder(typeof(CommaDelimitedCollectionModelBinder))] IEnumerable<Int32> filterIds = null,
            [FromUri] Boolean includeActuals = false,
            [FromUri] Boolean aggregate = false)
        {
            filterIds = PopulateFilterList(filterIds);

            return MultiFilter(filterIds, (filterId) =>
            {
                return CondenseResult(filterId,
                    _salesItemMetricAllController.GetSalesItemMetrics(entityId, forecastId, id, filterId, includeActuals, aggregate));
            });
        }

        public IEnumerable<Filtered<Object>> GetSalesItemMetricDetailsById(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] String ids,
            [ModelBinder(typeof(CommaDelimitedCollectionModelBinder))] IEnumerable<Int32> filterIds = null,
            [FromUri] Boolean aggregate = false)
        {
            filterIds = PopulateFilterList(filterIds);

            return MultiFilter(filterIds, (filterId) =>
            {
                return CondenseResult(filterId, 
                    _salesItemMetricAllController.GetSalesItemMetricDetailsById(entityId, forecastId, ids, filterId, aggregate));
            });
        }

        private Object CondenseResult(Int32? filterId, ForecastingSalesItemMetricAlls result)
        {
            return filterId.HasValue ? _mappingEngine.Map<ForecastingSalesItemMetricAllsCondensed>(result) : (Object)result;
        }
    }
}