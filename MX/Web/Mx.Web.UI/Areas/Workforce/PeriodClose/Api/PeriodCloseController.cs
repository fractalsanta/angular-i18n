using AutoMapper;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.Requests;
using System;
using System.Web.Http;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Areas.Workforce.PeriodClose.Api
{
    public class PeriodCloseController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IPeriodCloseQueryService _periodCloseQueryService;

        public PeriodCloseController(
            IMappingEngine mapper,
            IPeriodCloseQueryService periodCloseQueryService)
        {
            _mapper = mapper;
            _periodCloseQueryService = periodCloseQueryService;
        }

        public Models.PeriodClose GetPeriodLockStatus(long entityId, string calendarDay)
        {
            var request = new PeriodCloseRequest
            {
                EntityId = entityId,
                CalendarDay = calendarDay.AsDateTime().Value
            };

            var result = _periodCloseQueryService.GetForDate(request);

            var period = _mapper.Map<Models.PeriodClose>(result);

            return period;
        }
    }
}