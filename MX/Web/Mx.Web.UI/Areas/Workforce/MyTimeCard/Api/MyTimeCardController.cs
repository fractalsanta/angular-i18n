using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.MyTimeCard.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.MyTimeCard.Api
{
    public class MyTimeCardController : ApiController
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ITimeAndAttendanceQueryService _timeAndAttendanceQueryService;
        private readonly IMappingEngine _mappingEngine;

        public MyTimeCardController(
            IAuthenticationService authenticationService,
            ITimeAndAttendanceQueryService timeAndAttendanceQueryService,
            IMappingEngine mappingEngine
            )
        {
            _authenticationService = authenticationService;
            _timeAndAttendanceQueryService = timeAndAttendanceQueryService;
            _mappingEngine = mappingEngine;
        }

        [Permission(Task.Labor_EmployeePortal_TimeCard_CanView)]
        public TimeCardEntry[] GetTimeCards(string start, string end)
        {
            var startTime = start.AsDateTime().GetValueOrDefault();
            var endTime = end.AsDateTime().GetValueOrDefault();
            var employeeId = _authenticationService.User.EmployeeId;
            var workedShifts = _timeAndAttendanceQueryService.GetWorkedShiftByEmployeeAndDateRange(employeeId, startTime, endTime).ToList();
            var result = _mappingEngine.Map<IEnumerable<TimeCardEntry>>(workedShifts).ToArray();
            return result;
        }
    }
}
