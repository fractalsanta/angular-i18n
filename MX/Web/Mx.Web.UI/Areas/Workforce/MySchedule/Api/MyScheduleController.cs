using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api
{
    [Permission(Task.Labor_EmployeePortal_MySchedule_CanView)]
    public class MyScheduleController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly IScheduleQueryService _scheduleQueryService;
        private readonly ITimeOffRequestQueryService _timeOffQueryService;
        private readonly IAuthorizationService _authorizationService;

        public MyScheduleController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            IScheduleQueryService scheduleQueryService,
            ITimeOffRequestQueryService timeOffQueryService,
            IAuthorizationService authorizationService)
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _scheduleQueryService = scheduleQueryService;
            _timeOffQueryService = timeOffQueryService;
            _authorizationService = authorizationService;
        }

        public IEnumerable<CalendarEntry> Get(string startDate, string endDate)
        {
            var user = _authenticationService.User;
            var start = startDate.AsDateTime() ?? DateTime.Now;
            var requestedRange = start.Until(endDate.AsDateTime() ?? start.AddDays(7));

            var result = _scheduleQueryService
                .GetConfirmedEmployeeScheduleByDateRange(user.EmployeeId, requestedRange.Start, requestedRange.End)
                .ToList();

            var scheduledShifts = _mapper.Map<IEnumerable<CalendarEntry>>(result).ToList();

            scheduledShifts.ForEach(s => s.Breaks.ForEach(b =>
            {
                b.StartDateTime = s.StartDateTime.AddMinutes(b.OffSetFromStart);
                b.EndDateTime = b.StartDateTime.AddMinutes(b.Duration);
            }));

            if (_authorizationService.HasAuthorization(Task.Labor_EmployeePortal_MySchedule_CanViewTeamMembers) &&
                scheduledShifts.Any())
            {
                var teamScheduledShifts = new List<CalendarEntry>();
                var minStartDate = scheduledShifts.Min(s => s.StartDateTime).Date;
                var maxEndDate = scheduledShifts.Max(s => s.EndDateTime).Date.AddDays(1).AddMinutes(-1);

                // Get all shifts for the selected period (minStartDate - maxEndDate) and all entities.
                scheduledShifts
                    .Select(s => s.EntityId)
                    .Distinct()
                    .ToList()
                    .ForEach(entityId =>
                    {
                        //TODO: Confirm Date Range
                        var teamResult =
                            _mapper.Map<IEnumerable<CalendarEntry>>(
                                _scheduleQueryService.GetConfirmedScheduleByEntityAndDateRange(entityId, minStartDate,
                                    maxEndDate)).ToList();
                        teamResult.ForEach(tr => tr.EntityId = entityId);
                        teamScheduledShifts.AddRange(teamResult);
                    });

                scheduledShifts.ForEach(s =>
                {

                    s.TeamShifts = teamScheduledShifts
                        .Where(
                            ts =>
                                ts.EmployeeId != s.EmployeeId &&
                                ts.EntityId == s.EntityId &&
                                ts.StartDateTime.Until(ts.EndDateTime).Overlaps(s.StartDateTime.Until(s.EndDateTime))
                        )
                        .OrderBy(ts => ts.StartDateTime)
                        .ToList();
                });

            }

            if (_authorizationService.HasAuthorization(Task.Labor_EmployeePortal_MyTimeOff_CanView))
            {
                var timeOffResponses = _timeOffQueryService.GetEmployeeTimeOffByDateRange(user.EmployeeId, requestedRange.Start, requestedRange.End, true);
                var timeOffRequests = _mapper.Map<IEnumerable<TimeOffRequest>>(timeOffResponses).ToList();

                timeOffRequests.ForEach(tor =>
                {
                    var dateRange = tor.StartDateTime.Until(tor.EndDateTime);
                    var calendarEntries = dateRange
                        .SplitByDate()
                        .Where(range => range.Overlaps(requestedRange))
                        .Select(
                            range => new CalendarEntry
                            {
                                IsTimeOffRequest = true,
                                EntityId = tor.EntityId,
                                EntityName = tor.EntityName,
                                StartDateTime = range.Start,
                                EndDateTime = range.End,
                                TimeOffRequestSubmitted = tor.SubmitDateTime,
                                TimeOffRequestMessage = tor.Comments,
                                TimeOffRequestManagerComment = tor.ManagerActionComment,
                                TimeOffRequestStatus = (Int32)tor.Status

                            });
                    scheduledShifts.AddRange(calendarEntries);
                });
            }

            return scheduledShifts;
        }
    }
}