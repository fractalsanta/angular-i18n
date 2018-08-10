using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.CommandServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api
{
    [Permission(Task.Labor_EmployeePortal_DriverDistance_CanView)]
    public class DriverDistanceEmployeeController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IDriverDistanceQueryService _driverDistanceQueryService;
        private readonly IDriverDistanceCommandService _driverDistanceCommandService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

        public DriverDistanceEmployeeController(
            IMappingEngine mappingEngine,
            IDriverDistanceQueryService driverDistanceQueryService,
            IDriverDistanceCommandService driverDistanceCommandService,
            IEntityTimeQueryService entityTimeQueryService)
        {
            _mappingEngine = mappingEngine;
            _driverDistanceQueryService = driverDistanceQueryService;
            _driverDistanceCommandService = driverDistanceCommandService;
            _entityTimeQueryService = entityTimeQueryService;
        }

        public IEnumerable<DriverDistanceRecord> GetRecordsForEmployeeByEntityAndDate(
            Int64 employeeId,
            Int64 entityId,
            DateTime date)
        {
            var results = _driverDistanceQueryService.GetByEmployeeAndEntityForDate(employeeId, entityId, date);

            var mappedResults = _mappingEngine.Map<IEnumerable<DriverDistanceRecord>>(results);

            return mappedResults;
        }

        public Int64 Post( [FromUri] Int64 entityId, [FromBody] CreateDriverDistanceRequest request)
        {
            var newDriverDistanceRequest = _mappingEngine.Map<AddDriverDistanceRequest>(request);

            newDriverDistanceRequest.EntityId = entityId;
            newDriverDistanceRequest.SubmitTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            var response = _driverDistanceCommandService.CreateDriverDistance(newDriverDistanceRequest);

            ApplicationHub.RefreshNotifications(entityId);

            return response;
        }
    }
}