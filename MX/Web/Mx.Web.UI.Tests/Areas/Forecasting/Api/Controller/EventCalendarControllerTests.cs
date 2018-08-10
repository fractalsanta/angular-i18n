using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;


namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class EventCalendarControllerTests
    {
        private Mock<IUserAuthenticationQueryService> _userAuthQryServiceMock;
        private Mock<IEventProfileTagQueryService> _eventProfileTagQueryServiceMock;
        private Mock<IPeriodDetailQueryService> _periodDetailQueryServiceMock;
        private EventCalendarController _eventCalendarController;

        private int _entityId = 100;
        private DateTime _dateFrom = new DateTime(2015, 3, 2);
        private DateTime _dateTo = new DateTime(2015, 3, 8);

        [TestInitialize]
        public void SetupTest()
        {
            _userAuthQryServiceMock = new Mock<IUserAuthenticationQueryService>(MockBehavior.Strict);
            _eventProfileTagQueryServiceMock = new Mock<IEventProfileTagQueryService>(MockBehavior.Strict);
            _periodDetailQueryServiceMock = new Mock<IPeriodDetailQueryService>(MockBehavior.Strict);

            Mapper.CreateMap<EventProfileResponse, EventProfile>();
            Mapper.CreateMap<EventProfileTagResponse, EventProfileTag>();

            SetupEventProfileTagQueryService();
            SetupPeriodDetailQueryService();

            _eventCalendarController = new EventCalendarController(Mapper.Engine, _userAuthQryServiceMock.Object, _periodDetailQueryServiceMock.Object, _eventProfileTagQueryServiceMock.Object);
        }

        [TestMethod]
        public void Given_entity_and_daterange_provided_When_user_has_permissions_Then_proper_daterange_data_returned()
        {                    
            var weekDaysInfo = _eventCalendarController.GetEventWeekDaysInfo(_entityId, _dateFrom.ToString("yyyy-MM-dd"),
                _dateTo.ToString("yyyy-MM-dd")).ToList();

            Assert.IsTrue(weekDaysInfo.Any(), "Week Days Info supposed to be populated");
            Assert.IsTrue(weekDaysInfo.Any(x => x.IsClosed && x.Date == _dateFrom), "Week Days Info supposed to be populated and there should be one closed day");            

        }

        private void SetupEventProfileTagQueryService()
        {
            var eventTagsResponse = new List<EventProfileTagResponse>();

            var eventProfile = new EventProfileResponse
            {
                Id = 1,
                EntityId = _entityId,
                Name = "EventProfileName",
                Source = EventProfileSource.Empirical,
                Adjustments = new List<EventAdjustmentResponse>(),
                History = new List<EventProfileHistoryResponse>()
            };

            for (int i = 0; i <= (_dateTo - _dateFrom).TotalDays; i++)
            {
                if (i % 2 == 0)
                {
                    var eventProfileTagResponse = new EventProfileTagResponse
                    {
                        EventProfile = eventProfile,
                        Date = _dateFrom.AddDays(i),
                        Id = i,
                        Note = string.Format("Event Profile Tag Id: {0}", i)
                    };
                    eventTagsResponse.Add(eventProfileTagResponse);
                }
            }

            _eventProfileTagQueryServiceMock.Setup(x => x.GetByEntityAndDateRange(_entityId, _dateFrom, _dateTo))
                .Returns(eventTagsResponse);
        }

        private void SetupPeriodDetailQueryService()
        {
            var dateRangeRequest = new GetClosedDaysForWeekDateRangeRequest
            {
                EntityId = _entityId,
                StartDate = _dateFrom,
                EndDate = _dateTo,
            };

            var closedDay = new PeriodDayResponse
            {
                CalendarMonth = _dateFrom.Month.ToString(),
                DayName = _dateFrom.Day.ToString(),
                DayDate = _dateFrom,
                DayString = _dateFrom.Day.ToString()
            };

            var dateRangeResponse = new GetClosedDaysForWeekDateRangeResponse
            {
                ClosedDays = new List<PeriodDayResponse>
                {
                    closedDay
                }

            };

            _periodDetailQueryServiceMock.Setup(x => x.GetClosedDaysForWeekDateRange(It.IsAny<GetClosedDaysForWeekDateRangeRequest>()))
                .Returns(dateRangeResponse);
        }
    }
}
