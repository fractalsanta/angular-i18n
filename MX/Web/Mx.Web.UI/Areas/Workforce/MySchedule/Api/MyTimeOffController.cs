using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.CommandServices;
using Mx.Labor.Services.Contracts.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using Mx.Web.UI.Areas.Workforce.MyTimeOff.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using Task = Mx.Web.UI.Areas.Core.Api.Models.Task;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api
{
    [Permission(Task.Labor_EmployeePortal_MyTimeOff_CanView)]
    public class MyTimeOffController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITimeOffRequestQueryService _timeOffQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ITimeOffRequestCommandService _timeOffRequestCommandService;

        public MyTimeOffController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            ITimeOffRequestQueryService timeOffQueryService,
            IEntityTimeQueryService entityTimeQueryService,
            ITimeOffRequestCommandService timeOffRequestCommandService)
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _timeOffQueryService = timeOffQueryService;
            _entityTimeQueryService = entityTimeQueryService;
            _timeOffRequestCommandService = timeOffRequestCommandService;
        }

        public IEnumerable<TimeOffRequest> Get(string selectedDate)
        {
            var user = _authenticationService.User;
            var startDate = selectedDate.AsDateTime() ?? DateTime.Now;

            var result = _timeOffQueryService.GetEmployeeTimeOffByDateRange(user.EmployeeId, startDate, startDate.AddDays(7), true).ToList();

            var timeOffRequests = _mapper.Map<IEnumerable<TimeOffRequest>>(result);

            return timeOffRequests;
        }

        public IEnumerable<TimeOffRequest> GetFutureTimeOffRequests()
        {
            var user = _authenticationService.User;

            var currentStoreTime = _entityTimeQueryService.GetCurrentStoreTime(user.MobileSettings.EntityId);

            var requests = _timeOffQueryService.GetEmployeeTimeOffByStartDate(user.EmployeeId, currentStoreTime, false);

            var mappedRequests = _mapper.Map<IEnumerable<TimeOffRequest>>(requests).OrderBy(x => x.StartDateTime);

            return mappedRequests;
        }

        public void PostCancelRequest([FromUri] Int32 requestId)
        {
            var user = _authenticationService.User;

            _timeOffRequestCommandService.CancelRequest(requestId, user.EmployeeId);
        }

        public NewTimeOffResult PostNewRequest([FromBody] NewTimeOffRequest request)
        {
            var user = _authenticationService.User;

            var newRequest = _mapper.Map<Labor.Services.Contracts.Requests.NewTimeOffRequest>(request);

            newRequest.EmployeeId = user.EmployeeId;
            newRequest.EntityId = user.MobileSettings.EntityId;
            newRequest.RequestTime = _entityTimeQueryService.GetCurrentStoreTime(newRequest.EntityId);

            var result = new NewTimeOffResult();

            try
            {
                result.Id = _timeOffRequestCommandService.AddRequest(newRequest);
                result.Successful = true;
            }
            catch (TimeOffValidationException ex)
            {
                var overlapException = ex.Errors.FirstOrDefault(x => (x as TimeOffRequestOverlapsAnother) != null);

                if (overlapException != null)
                {
                    result.Message = "TimeOffRequestOverlaps";
                }

                result.Successful = false;
            }

            return result;
        }
    }
}