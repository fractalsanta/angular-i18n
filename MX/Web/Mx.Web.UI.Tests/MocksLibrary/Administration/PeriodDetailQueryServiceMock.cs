using System;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;

namespace Mx.Web.UI.Tests.MocksLibrary.Administration
{
    internal class PeriodDetailQueryServiceMock : Mock<IPeriodDetailQueryService>
    {
        public PeriodDetailQueryServiceMock(): base(MockBehavior.Strict)
        {

            Setup(x => x.GetClosedDaysForWeekDateRange(It.IsAny<GetClosedDaysForWeekDateRangeRequest>())).Returns(new GetClosedDaysForWeekDateRangeResponse
            {
                ClosedDays = new PeriodDayResponse[0]
            });
        }

        public void AddDaysToResponse()
        {
             Setup(x => x.GetClosedDaysForWeekDateRange(It.IsAny<GetClosedDaysForWeekDateRangeRequest>())).Returns(new GetClosedDaysForWeekDateRangeResponse
            {
                ClosedDays = new []
                {
                    new PeriodDayResponse
                    {
                        CalendarMonth =  "October",
                        DayDate = new DateTime(2014,10,10),
                        DayName = "Tuesday",
                        DayString = "Tuesday"
                    },
                    new PeriodDayResponse
                    {
                        CalendarMonth =  "October",
                        DayDate = new DateTime(2014,10,17),
                        DayName = "Tuesday",
                        DayString = "Tuesday"
                    }
                }
            });
        }
    }
}
