using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Reporting.Services.Contracts.QueryServices;
using Mx.Reporting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api
{
    [Permission(Task.Reporting_Dashboard_CanView)]
    public class MeasuresController : ApiController
    {
        private readonly IDashboardReportQueryService _dashboardQueryService;
        private readonly IAuthenticationService _authenticationService;

        public MeasuresController(IDashboardReportQueryService dashboardQueryService, IAuthenticationService authenticationService)
        {
            _dashboardQueryService = dashboardQueryService;
            _authenticationService = authenticationService;
        }

        public IEnumerable<EntityMeasure> GetMeasures(
            [FromUri]long entityId, 
            [FromUri]long typeId, 
            [FromUri]int groupId,
            [FromUri]string selectedDate)
        {
            var currentUser = _authenticationService.User;
            var businessDay = (selectedDate.AsDateTime() ?? DateTime.Now).Date;
            // No favourites in the 2014.2 Release, the logic is commented out for now
            //Only get favourites for region or company users.
            //var favouriteIds = (typeId < 3) ? currentUser.MobileSettings.FavouriteStores.ToArray() : new Int64[20];
            var favouriteIds = new long[0];
            if (typeId == 0)
            {
                typeId = currentUser.EntityTypeId;
            }
            var entityData = _dashboardQueryService.SelectForDate(currentUser.Id, entityId, typeId, groupId, businessDay, favouriteIds).ToList();
            return Mapper.Map<IEnumerable<EntityMeasure>>(entityData);
        }

        public DrillDownData GetMeasureDrilldown(
            [FromUri] long entityId,
            [FromUri] string date,
            [FromUri] string measureKey)
        {
            var businessDay = (date.AsDateTime() ?? DateTime.Now).Date;

            if (!measureKey.HasValue())
            {
                throw new ArgumentException("Missing parameter: Measure Key");
            }

            var drilldownRequest = new DrilldownMeasureRequest
            {
                EntityId = entityId,
                MeasureKey = measureKey,
                BusinessDate = businessDay,
                UserId = _authenticationService.UserId,
                Culture = null
            };

            var data = _dashboardQueryService.SelectDrillDownFor(drilldownRequest);
            return new DrillDownData
            {
                Points = data.Values
                    .Select(
                        item => new GraphPoint
                        {
                            Axis = item[0],
                            Label = item[1],
                            Value = item[1].ExtractNumber() ?? 0
                        })
                    .ToArray()
            };
        }
    }
}