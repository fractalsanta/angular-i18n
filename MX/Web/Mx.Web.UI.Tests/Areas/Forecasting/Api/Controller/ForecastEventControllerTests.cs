using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Services;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Tests.Mocks.Core;

namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class ForecastEventControllerTests
    {
        private Mock<IUserAuthenticationQueryService> _userAuthQryServiceMock;
        private Mock<IEventProfileQueryService> _eventProfileQryServiceMock;
        private Mock<IEventProfileCommandService> _eventProfileCommandServiceMock;
        private Mock<IAuthenticationService> _authenticationServiceMock;
        private Mock<IAuthorizationService> _authorizationServiceMock;
        private Mock<IEventProfileTagQueryService> _eventProfileTagQueryServiceMock;
        private Mock<IForecastRegenerator> _forecastGeneratorMock;
        private Mock<ITranslationService> _translationServiceMock;
        private Mock<IMxDayQueryService> _mxDayQueryServiceMock;
        private Mock<IForecastQueryService> _forecastQueryServiceMock;

        private EventController _eventController;

        private const int EntityId = 100;
        private const int EventProfileId = 105;
        private readonly DateTime _todayDay = new DateTime(2015, 3, 16);

        private readonly DateTime _pastDay1 = new DateTime(2014, 3, 1);
        private readonly DateTime _pastDay2 = new DateTime(2014, 3, 2);

        private readonly DateTime _futureDay1 = new DateTime(9999, 3, 1);
        private readonly DateTime _futureDay2 = new DateTime(9999, 3, 2);
        private readonly DateTime _futureDay3 = new DateTime(9999, 3, 10);
        private readonly DateTime _futureDay4 = new DateTime(9999, 3, 11);
        private readonly DateTime _futureDay5 = new DateTime(9999, 3, 12);

        private EventProfile _eventProfile;
        private List<EventProfileTagResponse> _futureEventTags;
        private List<EventProfileTagResponse> _pastEventTags;
        private List<EventProfileTagResponse> _mixedEventTags;

        [TestInitialize]
        public void SetupTest()
        {
            _userAuthQryServiceMock = new Mock<IUserAuthenticationQueryService>(MockBehavior.Strict);
            _eventProfileQryServiceMock = new Mock<IEventProfileQueryService>(MockBehavior.Strict);
            _eventProfileCommandServiceMock = new Mock<IEventProfileCommandService>(MockBehavior.Strict);
            _authenticationServiceMock = new AuthentificationServiceAuthorisedMock();
            _authorizationServiceMock = new Mock<IAuthorizationService>(MockBehavior.Strict);
            _eventProfileTagQueryServiceMock = new Mock<IEventProfileTagQueryService>(MockBehavior.Strict);
            _forecastGeneratorMock = new Mock<IForecastRegenerator>(MockBehavior.Strict);
            _translationServiceMock = new TranslationServiceMock();
            _mxDayQueryServiceMock = new Mock<IMxDayQueryService>(MockBehavior.Strict);
            _forecastQueryServiceMock = new Mock<IForecastQueryService>(MockBehavior.Strict);

            _mxDayQueryServiceMock.Setup(x => x.GetForTradingDate(It.IsAny<MxDayRequest>()))
                .Returns(new MxDayResponse
                {
                    CalendarDay = _todayDay,
                    EntityId = EntityId
                });

            _eventProfileCommandServiceMock.Setup(x => x.InsertOrUpdateEventProfile(It.IsAny<EventProfileRequest>()))
                .Returns(EventProfileId)
                .Verifiable();

            _eventController = new EventController(Mapper.Engine, _userAuthQryServiceMock.Object
                          , _eventProfileQryServiceMock.Object, _eventProfileCommandServiceMock.Object
                          , _authorizationServiceMock.Object
                          , _authenticationServiceMock.Object
                          , _eventProfileTagQueryServiceMock.Object
                          , _forecastGeneratorMock.Object
                          , _forecastQueryServiceMock.Object
                          , _translationServiceMock.Object
                          , _mxDayQueryServiceMock.Object);


            _eventProfile = new EventProfile
            {
                Id = EventProfileId,
                EntityId = 0,
                Name = "EventProfileName",
                Source = Mx.Web.UI.Areas.Forecasting.Api.Enums.EventProfileSource.Empirical,
                Adjustments = new List<Double>(),
                History = new List<EventProfileHistory>()
            };

            SetupEventTags();
        }

        private void SetupEventTags()
        {
            _futureEventTags = new List<EventProfileTagResponse>
            {
                new EventProfileTagResponse
                {
                    Id = 1,
                    Date = _futureDay1,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _futureDay2,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _futureDay3,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _futureDay4,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _futureDay5,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                }
            };

            _pastEventTags = new List<EventProfileTagResponse>
            {
                new EventProfileTagResponse
                {
                    Id = 1,
                    Date = _pastDay1,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _pastDay2,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                }
            };

            _mixedEventTags = new List<EventProfileTagResponse>
            {
                new EventProfileTagResponse
                {
                    Id = 1,
                    Date = _pastDay1,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _futureDay1,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                },
                new EventProfileTagResponse
                {
                    Id = 2,
                    Date = _futureDay2,
                    Note = "Event Profile Tag Note",
                    EventProfile = new EventProfileResponse
                    {
                        Id = _eventProfile.Id,
                        EntityId = EntityId
                    }
                }

            };
        }

        [TestMethod]
        public void Given_updated_event_profile_and_forecast_generated_When_event_profile_scheduled_in_future_Then_forecast_regeneration_triggered()
        {            
            _eventProfileTagQueryServiceMock.Setup(x => x.GetByEventProfileId(_eventProfile.Id))
                .Returns(_futureEventTags);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay1))
                .Returns(true);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay2))
                .Returns(true);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay3))
                .Returns(true);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay4))
                .Returns(true);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay5))
                .Returns(false);

            //---------There are 4 dates in future with generated forecast
            var futureDates = new List<DateTime>
            {
                _futureDay1,
                _futureDay2,
                _futureDay3,
                _futureDay4
            };

            _forecastGeneratorMock.Setup(
                x =>
                    x.RegenerateForecasts(EntityId,
                        It.Is<List<DateTime>>(d => d.TrueForAll(futureDates.Contains) && d.Count == futureDates.Count),
                        It.IsAny<string>()));

            _eventController.PostEventProfile(_eventProfile, EntityId);

            _forecastGeneratorMock.Verify(mock => mock.RegenerateForecasts(EntityId,
                It.Is<List<DateTime>>(d => d.TrueForAll(futureDates.Contains) && d.Count == futureDates.Count), 
                It.IsAny<string>()), Times.Once(), "There is future day and forecast is there, regeneration should be triggered.");
        }

        [TestMethod]
        public void Given_updated_event_profile_and_forecast_not_generated_When_event_profile_scheduled_in_future_Then_forecast_regeneration_triggered()
        {
            _eventProfileTagQueryServiceMock.Setup(x => x.GetByEventProfileId(_eventProfile.Id))
                .Returns(_futureEventTags);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay1))
                .Returns(false);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay2))
                .Returns(false);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay3))
                .Returns(false);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay4))
                .Returns(false);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay5))
                .Returns(false);

            //---------There are 4 dates in future with generated forecast
            var futureDates = new List<DateTime>();

            _forecastGeneratorMock.Setup(
                x =>
                    x.RegenerateForecasts(EntityId, It.Is<List<DateTime>>(d => d.TrueForAll(futureDates.Contains) && d.Count == futureDates.Count),
                        It.IsAny<string>()));


            _eventController.PostEventProfile(_eventProfile, EntityId);

            _forecastGeneratorMock.Verify(mock => mock.RegenerateForecasts(EntityId,
                It.Is<List<DateTime>>(d => d.TrueForAll(futureDates.Contains) && d.Count == futureDates.Count),
                It.IsAny<string>()), Times.Never(), "There are future days, but no Forecast generated - regeneration should not be triggered");
        }

        [TestMethod]
        public void Given_updated_event_profile_When_event_profile_not_scheduled_in_future_Then_forecast_regeneration_is_not_triggered()
        {
            _eventProfileTagQueryServiceMock.Setup(x => x.GetByEventProfileId(_eventProfile.Id))
                .Returns(_pastEventTags);

            _forecastGeneratorMock.Setup(x => x.RegenerateForecasts(EntityId, It.IsAny<List<DateTime>>(), It.IsAny<string>()));

            _eventController.PostEventProfile(_eventProfile, EntityId);

            _forecastGeneratorMock.Verify(mock => mock.RegenerateForecasts(EntityId, It.IsAny<List<DateTime>>(), It.IsAny<string>())
                , Times.Never(), "There are no future days, forecast generation shouldn't be triggered!");
        }

        [TestMethod]
        public void Given_updated_event_profile_When_event_profile_partially_scheduled_in_future_and_forecast_generated_Then_forecast_regeneration_is_triggered()
        {
            _eventProfileTagQueryServiceMock.Setup(x => x.GetByEventProfileId(_eventProfile.Id))
                .Returns(_mixedEventTags);


            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay1))
                 .Returns(true);

            _forecastQueryServiceMock.Setup(x => x.HasForecastByEntityIdByBusinessDay(EntityId, _futureDay2))
                .Returns(false);

            var futureDates = new List<DateTime>
            {
                _futureDay1
            };

            _forecastGeneratorMock.Setup(
                x =>
                    x.RegenerateForecasts(EntityId, It.Is<List<DateTime>>(d => d.TrueForAll(futureDates.Contains) && d.Count == futureDates.Count),
                        It.IsAny<string>()));

            _eventController.PostEventProfile(_eventProfile, EntityId);
           

            _forecastGeneratorMock.Verify(mock => mock.RegenerateForecasts(EntityId,
                It.Is<List<DateTime>>(d => d.TrueForAll(futureDates.Contains) && d.Count == futureDates.Count), It.IsAny<string>())
                , Times.Once(), "There 2 days in future to check, but there is only 1 day with forecast generated, therefore forecast generation should be triggered!");
        }
    }
}
