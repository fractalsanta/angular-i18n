using System;
using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Tests.Mocks.Core;
using Mx.Web.UI.Tests.MocksLibrary.Forecast;
using Mx.Web.UI.Tests.MocksLibrary.Administration;


namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class ForecastEventTagControllerTests
    {

        const int DefaultTagId = 20;
        const int DefaultEntityId = 88;
        const int EventProfileId1 = 30;
        const int EventProfileId2 = 31;

        readonly DateTime _workingDate = new DateTime(2014, 09, 10);

        private EventTagController _svc;

        private Mock<IEventProfileTagQueryService> _tagSvcMock;
        private AuthentificationServiceAuthorisedMock _authMock;
        private TranslationServiceMock _tranMock;
        private PeriodDetailQueryServiceMock _periodMock;
        private ForecastQueryServiceMock _forecastQueryServiceMock;
        private Mock<IEventProfileTagCommandService> _profileMock;
        private MxDayQueryServiceMock _dayMock;


        [TestInitialize]
        public void InitializeTest()
        {
            _authMock = new AuthentificationServiceAuthorisedMock();
            _tranMock = new TranslationServiceMock();
            _periodMock = new PeriodDetailQueryServiceMock();
            _forecastQueryServiceMock = new ForecastQueryServiceMock();
            _dayMock = new MxDayQueryServiceMock();
            _dayMock.SetBusinessDate(_workingDate);
            CreateProfileMock();
            CreateProfileQueryMock();

            _svc = new EventTagController(Mapper.Engine,
                null, _forecastQueryServiceMock.Object,
                null, _tagSvcMock.Object,
                _profileMock.Object, _periodMock.Object,
                _authMock.Object, _dayMock.Object,
                _tranMock.Object);
        }

        private void CreateProfileMock()
        {
            _profileMock = new Mock<IEventProfileTagCommandService>(MockBehavior.Strict);
        }

        private void CreateProfileQueryMock()
        {
            _tagSvcMock = new Mock<IEventProfileTagQueryService>(MockBehavior.Strict);
            _tagSvcMock
                .Setup(x => x.GetByEventTagId(It.IsAny<Int64>()))
                .Returns(new EventProfileTagResponse
                {
                    Id = DefaultTagId,
                    Date = _workingDate.AddDays(1),
                    EventProfile = new EventProfileResponse{Id = EventProfileId1},
                    Note = "Testing output"
                });

            _tagSvcMock
                .Setup(x => x.GetByEntityAndDateRange(It.IsAny<Int64>(), It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .Returns(new [] {
                    new EventProfileTagResponse
                    {
                        Id = DefaultTagId,
                        Date = _workingDate,
                        EventProfile = new EventProfileResponse{Id = EventProfileId2},
                        Note = "Testing output"
                    }
                });
        }

        private void ProfileAddInsertVerify()
        {
            _profileMock
                .Setup(x => x.InsertEventProfileTag(It.IsAny<EventProfileTagRequest>()))
                .Verifiable();

        }

        private EventProfileTag SetupForecastProfileUpdateRequest()
        {
            return new EventProfileTag
            {
                Date = _workingDate,
                Id = DefaultTagId,
                Note = "Test Update",
                EventProfileId = EventProfileId1,
                EventProfile = new EventProfile
                {
                    Id = EventProfileId1
                }
            };

        }

        [ExpectedException(typeof(CustomErrorMessageException))]
        [TestMethod]
        public void InsertShouldRejectClosedDays()
        {
            var request = SetupForecastProfileUpdateRequest();

            _periodMock
                .Setup(x => x.GetClosedDaysForWeekDateRange(It.IsAny<GetClosedDaysForWeekDateRangeRequest>()))
                .Returns(new GetClosedDaysForWeekDateRangeResponse
                {
                    ClosedDays = new[]
                    {
                        new PeriodDayResponse
                        {
                            DayDate = request.Date
                        }
                    }
                });

            _svc.PostEventProfileTag(request, DefaultEntityId);
        }

        [ExpectedException(typeof(CustomErrorMessageException))]
        [TestMethod]
        public void UpdateShouldRejectClosedDays()
        {
            var request = SetupForecastProfileUpdateRequest();

            _periodMock
                .Setup(x => x.GetClosedDaysForWeekDateRange(It.IsAny<GetClosedDaysForWeekDateRangeRequest>()))
                .Returns(new GetClosedDaysForWeekDateRangeResponse
                {
                    ClosedDays = new[]
                    {
                        new PeriodDayResponse
                        {
                            DayDate = request.Date
                        }
                    }
                });

            _svc.PutEventProfileTag(request, DefaultEntityId);
        }

        [TestMethod]
        public void InsertShouldAcceptOpenDays()
        {
            var request = SetupForecastProfileUpdateRequest();
            _profileMock
                .Setup(x => x.InsertEventProfileTag(It.Is<EventProfileTagRequest>(r => r.EntityId == DefaultEntityId
                                                                                       && r.Date == request.Date
                                                                                       && r.EventProfileId == request.EventProfileId
                                                                                       && r.Id == request.Id
                                                                                       && r.Note == request.Note)))
                .Verifiable();

            _svc.PostEventProfileTag(request, DefaultEntityId);
            _profileMock.VerifyAll();
        }

        [TestMethod]
        public void UpdateShouldAcceptOpenDays()
        {
            var request = SetupForecastProfileUpdateRequest();
            _profileMock
                .Setup(x => x.UpdateEventProfileTag(It.Is<EventProfileTagRequest>(r => r.EntityId == DefaultEntityId
                                                                                       && r.Date == request.Date
                                                                                       && r.EventProfileId == request.EventProfileId
                                                                                       && r.Id == request.Id
                                                                                       && r.Note == request.Note)))
                .Verifiable();

            _svc.PutEventProfileTag(request, DefaultEntityId);
            _profileMock.VerifyAll();
        }

        [ExpectedException(typeof(CustomErrorMessageException))]
        [TestMethod]
        public void ShouldRejectPastDate()
        {
            var request = SetupForecastProfileUpdateRequest();

            request.Date = _workingDate.AddDays(-1);
            ProfileAddInsertVerify();

            _svc.PostEventProfileTag(request, DefaultEntityId);
        }

        [TestMethod]
        public void ShouldAcceptToday()
        {
            var request = SetupForecastProfileUpdateRequest();

            ProfileAddInsertVerify();

            _svc.PostEventProfileTag(request, DefaultEntityId);

            _profileMock.VerifyAll();

        }

        [TestMethod]
        public void ShouldAcceptTomorrow()
        {
            var request = SetupForecastProfileUpdateRequest();
            request.Date = _workingDate.AddDays(1);

            ProfileAddInsertVerify();

            _svc.PostEventProfileTag(request, DefaultEntityId);

            _profileMock.VerifyAll();

        }

    }
}
