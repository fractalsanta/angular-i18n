using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Labor.Services.Contracts.CommandServices;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.MyAvailability.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.MyAvailability.Api
{
    [Permission(Task.Labor_EmployeePortal_Availability_CanView)]
    public class MyAvailabilityController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly ILaborAvailabilityQueryService _laborAvailabilityQueryService;
        private readonly ILaborAvailabilityCommandService _laborAvailabilityCommandService;

        public MyAvailabilityController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            ILaborAvailabilityCommandService laborAvailabilityCommandService,
            ILaborAvailabilityQueryService laborAvailabilityQueryService

            )
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _laborAvailabilityQueryService = laborAvailabilityQueryService;
            _laborAvailabilityCommandService = laborAvailabilityCommandService;

        }

        public Availability Get()
        {
            var user = _authenticationService.User;
            var availabilityDb = _laborAvailabilityQueryService.GetEmployeeAvailabilitySortedByDateAndStartTime(user.EmployeeId);
            var availabilityMapped = _mapper.Map<Availability>(availabilityDb);

            var availability = new Availability
            {
                AvailableDays = new List<DayAvailability>()
            };
            Enum.GetValues(typeof(DayOfWeek)).Cast<DayOfWeek>()
                .ToList()
                .ForEach(d =>
                {
                    var day = new DayAvailability
                    {
                        DayOfWeek = d,
                        Times = new List<TimeRange>()
                    };

                    if (availabilityMapped != null)
                    {
                        if (availabilityMapped.AvailableDays.Any(x => x.DayOfWeek == d))
                        {
                            day.Times =
                                availabilityMapped.AvailableDays.Where(x => x.DayOfWeek == d).ToList()[0].Times ??
                                new List<TimeRange>();
                        }
                    }
                    availability.AvailableDays.Add(day);
                });

            return availability;
        }

        [Permission(Task.Labor_EmployeePortal_Availability_CanUpdate)]
        public void PutAvailability([FromBody] DayAvailability availability)
        {
            var user = _authenticationService.User;

            var labourReq = new LaborAvailabilityRequest
            {
                AvailableDays = new List<LaborAvailabilityRequest.DayAvailability> {_mapper.Map<LaborAvailabilityRequest.DayAvailability>(availability)}
            };

            _laborAvailabilityCommandService.SetEmployeeAvailability(user.EmployeeId, labourReq);
        }

        [Permission(Task.Labor_EmployeePortal_Availability_CanUpdate)]
        public void Delete(int dayOfWeek, string start, string end, bool isAllDay)
        {
            var user = _authenticationService.User;

            var labourReq = new LaborAvailabilityDeleteRequest
            {
                DayOfWeek = (DayOfWeek) dayOfWeek,
                End = DateTime.Parse(end),
                Start = DateTime.Parse(start)
            };

            _laborAvailabilityCommandService.DeleteEmployeeAvailability(user.EmployeeId, labourReq);
        }
    }
}