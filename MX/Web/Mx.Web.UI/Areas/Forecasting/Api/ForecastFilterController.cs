using AutoMapper;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastFilterController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IForecastFilterQueryService _forecastFilterQueryService;
        private readonly IForecastFilterCommandService _forecastFilterCommandService;

        public ForecastFilterController(
            IMappingEngine mappingEngine,
            IForecastFilterQueryService forecastFilterQueryService,
            IForecastFilterCommandService forecastFilterCommandService)
        {
            _mappingEngine = mappingEngine;
            _forecastFilterQueryService = forecastFilterQueryService;
            _forecastFilterCommandService = forecastFilterCommandService;
        }

        public IEnumerable<ForecastFilterRecord> GetForecastFilters()
        {
            var results = _forecastFilterQueryService.GetForecastFilters();

            var forecastFilters = _mappingEngine.Map<IEnumerable<ForecastFilterRecord>>(results);

            forecastFilters = forecastFilters.OrderBy(x => x.Name);

            return forecastFilters;
        }

        [Permission(Task.Administration_Settings_ForecastFilter_CanAccess)]
        public void DeleteFilterById(int id)
        {
            _forecastFilterCommandService.Delete(id);
        }
    }
}