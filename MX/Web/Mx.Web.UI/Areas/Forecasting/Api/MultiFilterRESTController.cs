using System;
using System.Collections.Generic;
using System.Linq;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public abstract class MultiFilterRESTController : RESTController
    {
        private readonly IForecastFilterQueryService _forecastFilterQueryService;

        public MultiFilterRESTController(
            IForecastFilterQueryService forecastFilterQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(userAuthenticationQueryService)
		{
            _forecastFilterQueryService = forecastFilterQueryService;
        }

        protected IEnumerable<Int32> PopulateFilterList(IEnumerable<Int32> filterIds)
        {
            return (filterIds != null && filterIds.Any()) ? filterIds : _forecastFilterQueryService.GetForecastFilters().Select(x => x.Id).ToList();
        }

        protected IEnumerable<Filtered<T>> MultiFilter<T>(IEnumerable<Int32> filterIds, Func<Int32?, T> datafn)
        {
            var result = new List<Filtered<T>>();

            var total = new Filtered<T>
            {
                FilterId = null,
                Data = datafn(null),
            };
            result.Add(total);

            if (filterIds != null)
            {
                var filteredResults = filterIds.Select(filterId => new Filtered<T>
                {
                    FilterId = filterId,
                    Data = datafn(filterId),
                });
                result.AddRange(filteredResults);
            }

            return result;
        }
    }
}
