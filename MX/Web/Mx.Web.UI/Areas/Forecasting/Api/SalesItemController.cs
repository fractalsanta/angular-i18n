using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Forecasting.Api.Models;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class SalesItemController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IForecastQueryService _forecastQueryService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly ISalesItemQueryService _salesItemQueryService;

        public SalesItemController(IMappingEngine mappingEngine,
            IForecastQueryService forecastQueryService,
            IEntityQueryService entityQueryService,
            ISalesItemQueryService salesItemQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _forecastQueryService = forecastQueryService;
            _entityQueryService = entityQueryService;
            _salesItemQueryService = salesItemQueryService;
        }

        // GET api/<controller>
        public IEnumerable<SalesItem> GetSalesItemsForForecast(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId
            )
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            IEnumerable<SalesItem> results = null;
            var forecast = _forecastQueryService.GetById(forecastId);
            if (forecast != null && forecast.EntityId == entityId)
            {
                var salesItems = _forecastQueryService.GetSalesItemsForForecast(entityId);
                results = _mappingEngine.Map<IEnumerable<SalesItem>>(salesItems);
            }
            else
            {
                throw new MissingResourceException("Forecast not found.");
            }

            return results;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>/1
        public string Get(Int64 entityId, Int64 forecastId, Int64 id)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            return "Entity-" + entityId + " Forecast-" + forecastId + " SalesItem-" + id;
        }

        public IEnumerable<SalesItem> GetAll([FromUri] String searchText = "")
        {
            return _mappingEngine.Map<IEnumerable<SalesItem>>(_salesItemQueryService.GetAll(searchText));
        }
    }
}