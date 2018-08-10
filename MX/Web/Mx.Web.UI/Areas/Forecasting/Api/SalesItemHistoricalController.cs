using System;
using System.Collections.Generic;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using AutoMapper;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class SalesItemHistoricalController : RESTController
    {
        private readonly IForecastBasisQueryService _forecastBasisQueryService;
        private readonly IMappingEngine _mappingEngine;

        public SalesItemHistoricalController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IForecastBasisQueryService forecastBasisQueryService,
            IMappingEngine mappingEngine)
            : base(userAuthenticationQueryService)
        {
            _forecastBasisQueryService = forecastBasisQueryService;
            _mappingEngine = mappingEngine;
        }

        public IEnumerable<HistoricalSalesItem> GetForecastSalesItemHistory(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 salesItemId,
            [FromUri] Int32? filterId = null)
        {
            var basis = _forecastBasisQueryService.GetForecastSalesItemHistory(entityId, forecastId, salesItemId, filterId);

            if (basis == null)
                throw new MissingResourceException("Forecast historical data not found.");

            return _mappingEngine.Map<IEnumerable<HistoricalSalesItem>>(basis);
        }
    }
}
