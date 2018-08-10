using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;
using AutoMapper;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Services;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api
{
    public class MyScheduleDownloadController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IScheduleQueryService _scheduleQueryService;
        private readonly IIcsGenerationService _icsGenerationService;
        private readonly IAuthenticationService _authenticationService;


        public MyScheduleDownloadController(
            IMappingEngine mapper,
            IScheduleQueryService scheduleQueryService,
            IIcsGenerationService icsGenerationService,
            IAuthenticationService authenticationService
            )
        {
            _mapper = mapper;
            _scheduleQueryService = scheduleQueryService;
            _icsGenerationService = icsGenerationService;
            _authenticationService = authenticationService;
        }

        [AllowAnonymous]
        [QueryStringAuthenticationFilter]
        public HttpResponseMessage Get(string beginDate, string endDate)
        {
            HttpResponseMessage result;

            var user = _authenticationService.User;
            var startDate = beginDate.AsDateTime() ?? DateTime.Now;
            var stopDate = endDate.AsDateTime() ?? startDate.AddDays(7);

            var calendarName = user.FirstName + " " + user.LastName + "'s Calendar";
            var schedule = _scheduleQueryService.GetConfirmedEmployeeScheduleByDateRange(user.EmployeeId, startDate, stopDate).ToList();
            var mappedSchedule = _mapper.Map<IEnumerable<CalendarEntry>>(schedule);

            var cal = _icsGenerationService.GetNewFile(calendarName);

            foreach (CalendarEntry shift in mappedSchedule)
            {
                var uid = shift.EmployeeId + "_" + shift.EntityId;
                _icsGenerationService.AddEventToIcsFile(ref cal, _icsGenerationService.GetNewEvent(shift.EntityName, shift.RoleName, shift.StartDateTime, shift.EndDateTime, uid));
            }

            result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_icsGenerationService.SerialiseIcsFile(cal), Encoding.UTF8)
            };

            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = calendarName + ".ics"
            };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/calendar");

            return result;
        }
    }
}