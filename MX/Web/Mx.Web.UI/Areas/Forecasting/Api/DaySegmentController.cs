using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using AutoMapper;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class DaySegmentController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IDaySegmentQueryService _daySegmentQueryService;
        private readonly IEntityQueryService _entityQueryService;

        public DaySegmentController(
            IMappingEngine mappingEngine,
            IDaySegmentQueryService daysegmentQueryService,
            IEntityQueryService entityQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _daySegmentQueryService = daysegmentQueryService;
            _entityQueryService = entityQueryService;
        }

        // GET api/Entity/{entityId}/<controller>
        public IEnumerable<DaySegment> GetDaysegments(
            [FromUri] Int64 entityId
            )
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var results = _daySegmentQueryService.GetForEntity(entityId);
            return _mappingEngine.Map<IEnumerable<DaySegment>>(results);
        }
    }
}