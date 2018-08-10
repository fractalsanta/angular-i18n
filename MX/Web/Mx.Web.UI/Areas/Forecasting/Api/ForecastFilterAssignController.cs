using AutoMapper;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.Exceptions;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastFilterAssignController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IForecastFilterAssignQueryService _forecastFilterAssignQueryService;
        private readonly IForecastFilterAssignCommandService _forecastFilterAssignCommandService;

        public ForecastFilterAssignController(
            IMappingEngine mappingEngine,
            IForecastFilterAssignQueryService forecastFilterQueryService,
            IForecastFilterAssignCommandService forecastFilterAssignCommandService)
        {
            _mappingEngine = mappingEngine;
            _forecastFilterAssignQueryService = forecastFilterQueryService;
            _forecastFilterAssignCommandService = forecastFilterAssignCommandService;
        }

        public IEnumerable<ForecastFilterAssignRecord> GetForecastFilterAssigns()
        {
            var results = _forecastFilterAssignQueryService.GetForecastFilterAssigns();

            var forecastFilterAssigns = _mappingEngine.Map<IEnumerable<ForecastFilterAssignRecord>>(results);

            forecastFilterAssigns.All(x => { x.Name = x.FunctionId.ToString(); return true; });
            forecastFilterAssigns = forecastFilterAssigns.OrderBy(x => x.FunctionId);

            return forecastFilterAssigns;
        }

        [Permission(Task.Administration_Settings_ForecastUsage_CanAccess)]
        public void PostForecastFilterAssign([FromBody] IList<ForecastFilterAssignRecord> forecastFilterAssignRecords)
        {
            foreach(var record in forecastFilterAssignRecords)
            {
                var request = _mappingEngine.Map<ForecastFilterAssignRequest>(record);
                _forecastFilterAssignCommandService.UpdateForecastFilterAssign(request);
            }
        }
    }
}