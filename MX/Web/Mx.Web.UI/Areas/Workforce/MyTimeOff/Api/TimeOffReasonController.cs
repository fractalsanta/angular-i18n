using System;
using System.Collections.Generic;
using System.Web.Http;
using Mx.Labor.Services.Contracts.QueryServices;

namespace Mx.Web.UI.Areas.Workforce.MyTimeOff.Api
{
    public class TimeOffReasonController : ApiController
    {
        private readonly ITimeOffReasonQueryService _timeOffReasonQueryService;

        public TimeOffReasonController(ITimeOffReasonQueryService timeOffReasonQueryService)
        {
            _timeOffReasonQueryService = timeOffReasonQueryService;
        }

        public IDictionary<Int32, String> GetReasons()
        {
            var reasons = _timeOffReasonQueryService.GetTimeOffReasons();

            return reasons;
        }
    }
}