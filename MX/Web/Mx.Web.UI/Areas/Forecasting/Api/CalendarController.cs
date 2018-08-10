using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
	public class CalendarController : RESTController
	{
		 private readonly IPeriodDetailQueryService _periodDetailQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

		public CalendarController(IPeriodDetailQueryService periodDetailQueryService, IEntityTimeQueryService entityTimeQueryService, IUserAuthenticationQueryService userAuthQueryService)
			: base(userAuthQueryService)
		{
            _periodDetailQueryService = periodDetailQueryService;
            _entityTimeQueryService = entityTimeQueryService;
		}

		[Permission(Task.Forecasting_CanView)]
		public object GetDaysOfWorkWeek(String startOfWeek, Int64 entityId)
		{
			DateTime date = DateTime.Parse(startOfWeek).Date;
				var response = GetOpenDays(date, entityId);
				var startOfWeekHasChanged = false;
				var isSuccess = true;
				String message = null;
				IList<String> daysOfWeek = null;

				if (response.OpenDays == null)
				{
					isSuccess = false;
					message = "A fiscal period does not exist for the selected date. Please make a new selection.";
				}
				else
				{
					daysOfWeek = (from d in response.OpenDays select d.DayDate.ToShortDateString()).ToList();

					if (!daysOfWeek.Contains(date.ToShortDateString()))
					{
						var newDate = FindClosestOpenDay(response.OpenDays, date);
						startOfWeekHasChanged = !(date == newDate);
						date = newDate;
					}
				}

				return new
				{
					Success = isSuccess,
					Message = message,
					DaysOfWeek = response.OpenDays,
					PreviousWeekEnd = (response.PrevWorkWeekEnd.HasValue ? response.PrevWorkWeekEnd.Value.ToShortDateString() : null),
					NextWeekStart = (response.NextWorkWeekStart.HasValue ? response.NextWorkWeekStart.Value.ToShortDateString() : null),
					ReassignDate = (startOfWeekHasChanged ? date.Date.ToString("yyyy-MM-dd") : null)
				};
		}

		GetOpenDaysForWeekDateResponse GetOpenDays(DateTime givenDate, Int64 entityId)
		{
			var periodRequest = new GetOpenDaysForWeekDateRequest { GivenDate = givenDate, EntityId = entityId };
			var response = _periodDetailQueryService.GetOpenDaysForWeekDate(periodRequest);
			return response;
		}

		static DateTime FindClosestOpenDay(IList<PeriodDayResponse> openDays, DateTime date)
		{
			var newDate = date;

			foreach (PeriodDayResponse period in openDays)
			{
				if (period != null)
				{
					openDays.OrderBy(d => (date - d.DayDate).Days).First();
				}
			}

			return newDate;
		}
	}
}