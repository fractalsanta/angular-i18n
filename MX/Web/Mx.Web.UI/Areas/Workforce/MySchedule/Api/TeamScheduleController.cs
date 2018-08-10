using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using Task = Mx.Web.UI.Areas.Core.Api.Models.Task;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api
{
    [Permission(Task.Labor_EmployeePortal_MySchedule_CanViewTeamMembers)]
    public class TeamScheduleController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IScheduleQueryService _scheduleQueryService;

        public TeamScheduleController(
            IMappingEngine mapper,
            IScheduleQueryService scheduleQueryService)
        {
            _mapper = mapper;
            _scheduleQueryService = scheduleQueryService;
        }

        public IEnumerable<CalendarEntry> Get(long entityId, string startDate, string stopDate)
        {
            var beginDate = startDate.AsDateTime() ?? DateTime.Now;
            var endDate = stopDate.AsDateTime() ?? beginDate.AddDays(7);

            var result = _scheduleQueryService.GetConfirmedScheduleByEntityAndDateRange(entityId, beginDate, endDate);
            
            var scheduledShifts = _mapper.Map<IEnumerable<CalendarEntry>>(result);
            
            return scheduledShifts;
        }
    }
}