using System;
using System.Linq;
using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.CommandServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Tests.Areas.Workforce.DriverDistance
{
    [TestClass]
    public class DriverDistanceManagerControllerTests
    {
        private const Int64 EntitydId = 105;
        private DriverDistanceManagerController _apiControllerUnderTest;

        private Mock<IDriverDistanceQueryService> _driverDistanceQueryServiceMock;
        private Mock<ISupervisorAuthorizationService> _supervisorAuthorizationServiceMock;
        private Mock<IAuthenticationService> _authenticationServiceMock;
        private Mock<IDriverDistanceCommandService> _driverDistanceCommandServiceMock;
        private Mock<IEntityTimeQueryService> _entityTimeQueryServiceMock;
        private Mock<ITranslationService> _translationServiceMock;
        private Mock<IUserQueryService> _userQueryServiceMock;

        [TestInitialize]
        public void Initialize()
        {
            DriverDistanceRecord.ConfigureAutoMapping();
            BusinessUser.ConfigureAutoMapping();
            CreateDriverDistanceRequest.ConfigureAutoMapping();

            _driverDistanceQueryServiceMock = new Mock<IDriverDistanceQueryService>();
            _supervisorAuthorizationServiceMock = new Mock<ISupervisorAuthorizationService>();
            _authenticationServiceMock = new Mock<IAuthenticationService>();
            _driverDistanceCommandServiceMock = new Mock<IDriverDistanceCommandService>();
            _entityTimeQueryServiceMock = new Mock<IEntityTimeQueryService>();
            _translationServiceMock = new Mock<ITranslationService>();
            _userQueryServiceMock = new Mock<IUserQueryService>();

            var defaultUser = new BusinessUser { MobileSettings = new MobileSettings() };

            _authenticationServiceMock
                .Setup(x => x.User)
                .Returns(defaultUser);

            _translationServiceMock
                .Setup(x => x.Translate<UI.Areas.Workforce.DriverDistance.Api.Models.L10N>(It.IsAny<String>()))
                .Returns(new UI.Areas.Workforce.DriverDistance.Api.Models.L10N());

            _supervisorAuthorizationServiceMock
                .Setup(x => x.Authorize(It.IsAny<SupervisorAuthorization>(), It.IsAny<Task[]>()))
                .Returns(new SupervisorAuthorizationResponse { Authorized = true, User = defaultUser });

            _apiControllerUnderTest = new DriverDistanceManagerController(
                Mapper.Engine,
                _driverDistanceQueryServiceMock.Object,
                _supervisorAuthorizationServiceMock.Object,
                _authenticationServiceMock.Object,
                _driverDistanceCommandServiceMock.Object,
                _entityTimeQueryServiceMock.Object,
                _translationServiceMock.Object,
                _userQueryServiceMock.Object);
        }

        [TestMethod]
        public void When_getting_records_for_entity_by_date_Then_the_query_returned_results_should_be_mapped_and_returned()
        {
            const Int32 expectedRecordTotal = 15;

            var responses = DriverDistanceTestHelper.CreateDriverDistanceResponse(expectedRecordTotal).ToList();

            _driverDistanceQueryServiceMock
                .Setup(x => x.GetByEntityForDate(It.IsAny<Int64>(), It.IsAny<DateTime>()))
                .Returns(responses);

            var results = _apiControllerUnderTest.GetRecordsForEntityByDate(1, new DateTime(2015, 12, 5)).ToList();

            Assert.AreEqual(expectedRecordTotal, results.Count(),
                "ApiController method should return the same number of items provided by the query service.");

            results.ForEach(x =>
            {
                var matchingResponse = responses.ElementAt((Int32)x.Id - 1);

                DriverDistanceTestHelper
                    .AssureMappingIsValidForDriverDistanceResponseToDriverDistanceViewModel(matchingResponse, x);
            });
        }

        [TestMethod]
        [ExpectedException(typeof(CustomErrorMessageException), "Should throw exception on authorization failure.")]
        public void Given_an_action_record_request_that_fails_authorization_When_attempting_to_action_the_record_Then_method_should_throw_exception()
        {
            _supervisorAuthorizationServiceMock
                .Setup(x => x.Authorize(It.IsAny<SupervisorAuthorization>(), It.IsAny<Task[]>()))
                .Returns(new SupervisorAuthorizationResponse { Authorized = false });

            _apiControllerUnderTest.PutActionDriverDistanceRecord(EntitydId, new ActionDriverDistanceRequest());
        }

        [TestMethod]
        public void Given_an_action_record_request_that_fails_authorization_When_attempting_to_action_the_record_Then_message_of_thrown_exception_should_be_localized_value()
        {
            var translations = new UI.Areas.Workforce.DriverDistance.Api.Models.L10N();

            var capturedExceptionMessage = String.Empty;

            _supervisorAuthorizationServiceMock
                .Setup(x => x.Authorize(It.IsAny<SupervisorAuthorization>(), It.IsAny<Task[]>()))
                .Returns(new SupervisorAuthorizationResponse { Authorized = false });

            try
            {
                _apiControllerUnderTest.PutActionDriverDistanceRecord(EntitydId, new ActionDriverDistanceRequest());
            }
            catch (CustomErrorMessageException ex)
            {
                capturedExceptionMessage = ex.CustomMessage.Message;
            }

            Assert.AreEqual(translations.InvalidCredentials, capturedExceptionMessage);
        }

        [TestMethod]
        public void Given_an_action_record_for_approval_When_attempting_to_action_the_record_Then_the_command_service_action_is_called()
        {
            var approvalRequest = new ActionDriverDistanceRequest
            {
                DriverDistanceId = 505,
                Status = UI.Areas.Workforce.DriverDistance.Api.Models.Enums.DriverDistanceStatus.Approved
            };

            _apiControllerUnderTest.PutActionDriverDistanceRecord(EntitydId, approvalRequest);

            _driverDistanceCommandServiceMock
                .Verify(x => x.ApproveDriverDistance(approvalRequest.DriverDistanceId, It.IsAny<AuditUser>(), It.IsAny<DateTime>()), Times.Once());
        }

        [TestMethod]
        public void Given_an_action_record_for_denial_When_attempting_to_action_the_record_Then_the_command_service_action_is_called()
        {
            var denialRequest = new ActionDriverDistanceRequest
            {
                DriverDistanceId = 505,
                Status = UI.Areas.Workforce.DriverDistance.Api.Models.Enums.DriverDistanceStatus.Denied
            };

            _apiControllerUnderTest.PutActionDriverDistanceRecord(EntitydId, denialRequest);

            _driverDistanceCommandServiceMock
                .Verify(x => x.DenyDriverDistance(denialRequest.DriverDistanceId, It.IsAny<AuditUser>(), It.IsAny<DateTime>()), Times.Once());
        }

        [TestMethod]
        [ExpectedException(typeof(CustomErrorMessageException), "Should throw exception on authorization failure.")]
        public void Given_a_create_record_request_that_fails_authorization_When_attempting_to_create_and_authorize_the_record_Then_the_method_should_throw_exception()
        {
            _supervisorAuthorizationServiceMock
                .Setup(x => x.Authorize(It.IsAny<SupervisorAuthorization>(), It.IsAny<Task[]>()))
                .Returns(new SupervisorAuthorizationResponse { Authorized = false });

            _apiControllerUnderTest.Post(EntitydId, NewCreateAuthorizedDriverDistanceRequest());
        }

        [TestMethod]
        public void Given_a_create_record_request_that_fails_authorization_When_attempting_to_create_and_authorize_the_record_Then_message_of_thrown_exception_should_be_localized_value()
        {
            var translations = new UI.Areas.Workforce.DriverDistance.Api.Models.L10N();

            var capturedExceptionMessage = String.Empty;

            _supervisorAuthorizationServiceMock
                .Setup(x => x.Authorize(It.IsAny<SupervisorAuthorization>(), It.IsAny<Task[]>()))
                .Returns(new SupervisorAuthorizationResponse { Authorized = false });

            try
            {
                _apiControllerUnderTest.Post(EntitydId, NewCreateAuthorizedDriverDistanceRequest());
            }
            catch (CustomErrorMessageException ex)
            {
                capturedExceptionMessage = ex.CustomMessage.Message;
            }

            Assert.AreEqual(translations.InvalidCredentials, capturedExceptionMessage);
        }

        [TestMethod]
        public void Given_a_create_record_request_When_attempting_to_create_and_authorize_the_record_Then_entity_of_record_is_set_to_current_user_entity()
        {
            const Int64 expectedEntityId = 101;

            _authenticationServiceMock
                .Setup(x => x.User)
                .Returns(new BusinessUser { MobileSettings = new MobileSettings { EntityId = expectedEntityId } });

            _apiControllerUnderTest.Post(expectedEntityId, new CreateAuthorizedDriverDistanceRequest
            {
                Authorization = NewAuthorization(),
                CreateDriverDistanceRequest = new CreateDriverDistanceRequest()
            });

            _driverDistanceCommandServiceMock
                .Verify(x => x.CreateDriverDistance(It.Is<AddDriverDistanceRequest>(y =>
                    y.EntityId == expectedEntityId)), Times.Once());
        }

        [TestMethod]
        public void Given_a_create_record_request_When_attempting_to_create_and_authorize_the_record_Then_submit_time_of_record_should_be_set_to_current_entity_time()
        {
            var expectedDateTime = new DateTime(2015, 12, 5, 16, 30, 0);

            _entityTimeQueryServiceMock
                .Setup(x => x.GetCurrentStoreTime(It.IsAny<Int64>()))
                .Returns(expectedDateTime);

            _apiControllerUnderTest.Post(EntitydId, new CreateAuthorizedDriverDistanceRequest
            {
                Authorization = NewAuthorization(),
                CreateDriverDistanceRequest = new CreateDriverDistanceRequest()
            });

            _driverDistanceCommandServiceMock
                .Verify(x => x.CreateDriverDistance(It.Is<AddDriverDistanceRequest>(y =>
                    y.SubmitTime == expectedDateTime)), Times.Once());
        }

        [TestMethod]
        public void Given_a_create_record_request_When_attempting_to_create_and_authorize_the_record_Then_the_record_should_be_approved_after_created()
        {
            const Int64 createdDriverDistanceId = 15;

            var expectedActionTime = new DateTime(2015, 12, 5, 16, 30, 0);

            _entityTimeQueryServiceMock
                .Setup(x => x.GetCurrentStoreTime(It.IsAny<Int64>()))
                .Returns(expectedActionTime);

            _driverDistanceCommandServiceMock
                .Setup(x => x.CreateDriverDistance(It.IsAny<AddDriverDistanceRequest>()))
                .Returns(createdDriverDistanceId);

            _apiControllerUnderTest.Post(EntitydId, new CreateAuthorizedDriverDistanceRequest
            {
                Authorization = NewAuthorization(),
                CreateDriverDistanceRequest = new CreateDriverDistanceRequest()
            });

            _driverDistanceCommandServiceMock
                .Verify(x => x.ApproveDriverDistance(createdDriverDistanceId, It.IsAny<AuditUser>(), expectedActionTime), Times.Once());
        }

        private CreateAuthorizedDriverDistanceRequest NewCreateAuthorizedDriverDistanceRequest()
        {
            return new CreateAuthorizedDriverDistanceRequest
            {
                Authorization = NewAuthorization()
            };
        }

        private SupervisorAuthorization NewAuthorization()
        {
            return new SupervisorAuthorization
            {
                Password = "test",
                UserName = "test"
            };
        }
    }
}