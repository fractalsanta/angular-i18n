using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Reporting.Services.Contracts.QueryServices;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api
{
    [Permission(Task.Reporting_Dashboard_CanView)]
    public class ReferenceDataController : ApiController
    {
        private readonly IDashboardReportQueryService _dashboardQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

        public ReferenceDataController(
            IDashboardReportQueryService dashboardQueryService, 
            IAuthenticationService authenticationService,
            IEntityTimeQueryService entityTimeQueryService)
        {
            _dashboardQueryService = dashboardQueryService;
            _authenticationService = authenticationService;
            _entityTimeQueryService = entityTimeQueryService;
        }

        public ReferenceData Get()
        {
            var userId = _authenticationService.User.Id;
            var referenceData = _dashboardQueryService.GetReferenceData(userId);
            var groups = referenceData.Data["Groups"].Cast<ReferenceDataGroups>();
            var intervals = referenceData.Data["Intervals"].Cast<ReferenceDataIntervals>();
            var today = _entityTimeQueryService.GetCurrentStoreTime(_authenticationService.User.MobileSettings.EntityId);

            return new ReferenceData
            {
                Today = today,
                Groups = Mapper.Map<IEnumerable<ReferenceDataGroups>, IEnumerable<ReferenceGroup>>(groups).ToArray(),
                Intervals = intervals.Select(i => (ReferenceInterval) i.Id).ToArray()
            };
        }
    }
}