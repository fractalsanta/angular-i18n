using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    [Permission(Task.Forecasting_SalesItemMirroring_CanAccess)]
    public class SalesItemMirrorIntervalsController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly ISalesItemMirrorIntervalQueryService _salesItemMirrorIntervalQueryService;
        private readonly ISalesItemMirrorIntervalCommandService _salesItemMirrorIntervalCommandService;

        public SalesItemMirrorIntervalsController(IMappingEngine mappingEngine,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            ISalesItemMirrorIntervalQueryService salesItemMirrorIntervalQueryService,
            ISalesItemMirrorIntervalCommandService salesItemMirrorIntervalCommandService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _salesItemMirrorIntervalQueryService = salesItemMirrorIntervalQueryService;
            _salesItemMirrorIntervalCommandService = salesItemMirrorIntervalCommandService;
        }


        // GET api/SalesItemMirrorInterval/{id}
        public SalesItemMirrorInterval GetSalesItemMirrorInterval([FromUri] Int64 id)
        {
            var interval = _salesItemMirrorIntervalQueryService.GetById(id);
            return _mappingEngine.Map<SalesItemMirrorInterval>(interval);
        }
        
        // GET api/ForecastApi
        public IEnumerable<SalesItemMirrorInterval> GetSalesItemMirrorIntervals([FromUri] DateTime startDate, [FromUri] DateTime endDate)
        {
            var intervals = _salesItemMirrorIntervalQueryService.GetByTargetDateRange(startDate, endDate);
            var result = _mappingEngine.Map<IEnumerable<SalesItemMirrorInterval>>(intervals);
            return result;
        }

        // POST api/ForecastApi
        public void PostSalesItemMirrorIntervals([FromBody] SalesItemMirrorInterval salesItemMirrorInterval)
        {
            if (!_salesItemMirrorIntervalCommandService.InsertOrUpdate(_mappingEngine.Map<SalesItemMirrorIntervalRequest>(salesItemMirrorInterval)))
            {
                throw new HttpResponseException(HttpStatusCode.Conflict);
            }
        }

        //DELETE api/ForecastApi
        public void DeleteSalesItemMirrorIntervals([FromUri] Int64 intervalId, Boolean resetManagerForecast)
        {
            _salesItemMirrorIntervalCommandService.DeleteById(intervalId, resetManagerForecast);
        }
    }
}