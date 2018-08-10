using System;
using AutoMapper;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using System.Linq;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
	public class EventCalendarController : RESTController
	{
        private readonly IMappingEngine _mappingEngine;
        private readonly IPeriodDetailQueryService _periodDetailQueryService;
        private readonly IEventProfileTagQueryService _eventProfileTagQueryService;

        public EventCalendarController(
            IMappingEngine mappingEngine,
            IUserAuthenticationQueryService userAuthQueryService,
            IPeriodDetailQueryService periodDetailQueryService,
            IEventProfileTagQueryService eventProfileTagQueryService)
            : base(userAuthQueryService)
        {
            _mappingEngine = mappingEngine;
            _periodDetailQueryService = periodDetailQueryService;
            _eventProfileTagQueryService = eventProfileTagQueryService;
        }

        private DateTime GetStartOfWeek(DateTime date, Int32 startOfWeekDay)
        {
            var currentDate = date;
            while ((int)currentDate.DayOfWeek != startOfWeekDay)
            {
                currentDate = currentDate.AddDays(-1);
            }
            return currentDate;
        }

        private DateTime GetEndOfWeek(DateTime date, Int32 endOfWeekDay)
        {
            var currentDate = date;
            while ((int)currentDate.AddDays(1).DayOfWeek != endOfWeekDay)
            {
                currentDate = currentDate.AddDays(1);
            }
            return currentDate;
        }

        private ISet<DateTime> GetClosedDays(Int64 entityId, DateTime startDate, DateTime endDate)
        {
            var closedDays = _periodDetailQueryService.GetClosedDaysForWeekDateRange(new GetClosedDaysForWeekDateRangeRequest
            {
                EntityId = entityId,
                StartDate = startDate,
                EndDate = endDate,
            }).ClosedDays.Select(x => x.DayDate);

            return new HashSet<DateTime>(closedDays);
        }

        private IDictionary<DateTime, List<EventProfileTagResponse>> GetEventProfileTags(Int64 entityId, DateTime startDate, DateTime endDate)
        {
            return _eventProfileTagQueryService.GetByEntityAndDateRange(entityId, startDate, endDate)
                .GroupBy(x => x.Date).ToDictionary(x => x.Key, x => x.ToList());
        }

        [Permission(Task.Forecasting_CanView)]
        public IEnumerable<EventWeekDayInfo> GetEventWeekDaysInfo(Int64 entityId, string fromDate, string toDate)
	    {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now;
            var endDate = toDate.AsDateTime() ?? DateTime.Now;
            var eventProfileTags = _eventProfileTagQueryService.GetByEntityAndDateRange(entityId, startDate, endDate);

            var closedDays = GetClosedDays(entityId, startDate, endDate);

            var eventWeekInfo = eventProfileTags
                .GroupBy(et => et.Date)
                .Select(et => new EventWeekDayInfo
                {
                    Date = et.Key,
                    IsClosed = closedDays.Contains(et.Key),
                    EventProfileTags = _mappingEngine.Map<IEnumerable<EventProfileTag>>(et).ToList()
                })
                .ToList();

            return eventWeekInfo;
	    }

        [Permission(Task.Forecasting_CanView)]
        public EventCalendarInfo GetCalendarInfo(Int64 entityId, Int32 year, Int32 month)
        {
            var startOfMonthCalendarDay = new DateTime(year, month, 1);
            var endOfMonthCalendarDay = startOfMonthCalendarDay.AddMonths(1).AddDays(-1);

            var startOfWeekDay = (Int32)_periodDetailQueryService.GetStartOfWeek(entityId, startOfMonthCalendarDay).DayOfWeek;

            var calendarStartDate = GetStartOfWeek(startOfMonthCalendarDay, startOfWeekDay);
            var calendarEndDate = GetEndOfWeek(endOfMonthCalendarDay, startOfWeekDay);
            var calendarNumberOfDays = 1 + (int)(calendarEndDate - calendarStartDate).TotalDays;
            var calendarDayRange = Enumerable.Range(0, calendarNumberOfDays).Select(x => calendarStartDate.AddDays(x));

            var closedDays = GetClosedDays(entityId, calendarStartDate, calendarEndDate);
            var eventProfileTags = GetEventProfileTags(entityId, calendarStartDate, calendarEndDate);

            var eventCalendarInfo = new EventCalendarInfo
            {
                FirstDayOnCalendar = calendarStartDate,
                FirstDayDayOfWeek = startOfWeekDay,
                NumberOfDays = calendarNumberOfDays,
                DayInfo = calendarDayRange.Select(x => new EventCalendarDayInfo
                {
                    IsClosed = closedDays.Contains(x),
                    EventTagNotes = eventProfileTags.ContainsKey(x) ? eventProfileTags[x].Select(y => y.Note) : Enumerable.Empty<String>(),
                    EventProfileIds = eventProfileTags.ContainsKey(x) ? eventProfileTags[x].Select(y => y.EventProfile.Id) : Enumerable.Empty<Int64>(),
                    EventProfileTagIds = eventProfileTags.ContainsKey(x) ? eventProfileTags[x].Select(y => y.Id) : Enumerable.Empty<Int64>()
                }),
            };

            return eventCalendarInfo;
        }
	}
}