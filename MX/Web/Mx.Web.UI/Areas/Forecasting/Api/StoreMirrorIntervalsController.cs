using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Forecasting.Services.Contracts;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    [Permission(Task.Forecasting_StoreMirroring_CanAccess)]
    public class StoreMirrorIntervalsController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IStoreMirrorIntervalQueryService _storeMirrorIntervalQueryService;
        private readonly IStoreMirrorIntervalCommandService _storeMirrorIntervalCommandService;

        public StoreMirrorIntervalsController(IMappingEngine mappingEngine,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IStoreMirrorIntervalQueryService storeMirrorIntervalQueryService,
            IStoreMirrorIntervalCommandService storeMirrorIntervalCommandService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _storeMirrorIntervalQueryService = storeMirrorIntervalQueryService;
            _storeMirrorIntervalCommandService = storeMirrorIntervalCommandService;
        }

        // GET api/StoreMirrorInterval/{id}
        public StoreMirrorInterval GetStoreMirrorInterval([FromUri] Int64 id)
        {
            var interval = _storeMirrorIntervalQueryService.GetById(id);
            return _mappingEngine.Map<StoreMirrorInterval>(interval);
        }
        
        // GET api/ForecastApi
        public IEnumerable<StoreMirrorIntervalGroup> GetStoreMirrorIntervals(
            [FromUri] Int64 entityId,
            [FromUri] StoreMirrorStatusGroup group,
            [FromUri] StoreMirrorTypes? types = null)
        {
            var intervals = _storeMirrorIntervalQueryService.GetGroupedByEntityAndStatus(entityId, group, types ?? StoreMirrorTypes.All);
            var result = _mappingEngine.Map<IEnumerable<StoreMirrorIntervalGroup>>(intervals);

            return result.OrderBy(x => x.OverallStatus).ThenBy(x => x.TargetDateStart);
        }

        // POST api/ForecastApi
        public Guid PostStoreMirrorIntervals([FromBody] StoreMirrorIntervalGroup storeMirrorIntervalGroup)
        {
            var guidForMirror = _storeMirrorIntervalCommandService.InsertOrUpdate(
                _mappingEngine.Map<StoreMirrorIntervalGroupRequest>(storeMirrorIntervalGroup));

            if (guidForMirror.HasValue)
                return guidForMirror.Value;

            throw new HttpResponseException(HttpStatusCode.Conflict);
        }

        // DELETE api/ForecastApi
        public void DeleteStoreMirrorInterval(
            [FromUri] Int64 entityId,
            [FromUri] String userName,
            [FromUri] Guid groupId,
            [FromUri] Boolean resetManagerForecasts)
        {
            _storeMirrorIntervalCommandService.Cancel(entityId, userName, groupId, resetManagerForecasts);
        }
    }
}