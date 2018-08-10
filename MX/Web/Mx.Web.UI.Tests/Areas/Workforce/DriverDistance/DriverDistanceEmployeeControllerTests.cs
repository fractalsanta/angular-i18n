using System;
using System.Linq;
using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.CommandServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models;

namespace Mx.Web.UI.Tests.Areas.Workforce.DriverDistance
{
    [TestClass]
    public class DriverDistanceEmployeeControllerTests
    {
        const Int64 ExpectedEntityId = 105;

        private DriverDistanceEmployeeController _apiControllerUnderTest;

        private Mock<IDriverDistanceQueryService> _driverDistanceQueryServiceMock;
        private Mock<IAuthenticationService> _authenticationServiceMock;
        private Mock<IDriverDistanceCommandService> _driverDistanceCommandServiceMock;
        private Mock<IEntityTimeQueryService> _entityTimeQueryServiceMock;

        [TestInitialize]
        public void Initialize()
        {
            CreateDriverDistanceRequest.ConfigureAutoMapping();
            DriverDistanceRecord.ConfigureAutoMapping();

            _driverDistanceQueryServiceMock = new Mock<IDriverDistanceQueryService>();
            _authenticationServiceMock = new Mock<IAuthenticationService>();
            _driverDistanceCommandServiceMock = new Mock<IDriverDistanceCommandService>();
            _entityTimeQueryServiceMock = new Mock<IEntityTimeQueryService>();

            _authenticationServiceMock
                .Setup(x => x.User)
                .Returns(new BusinessUser { MobileSettings = new MobileSettings() });

            _apiControllerUnderTest = new DriverDistanceEmployeeController(
                Mapper.Engine,
                _driverDistanceQueryServiceMock.Object,
                _driverDistanceCommandServiceMock.Object,
                _entityTimeQueryServiceMock.Object);
        }

        [TestMethod]
        public void When_getting_records_for_employee_and_entity_by_date_Then_the_query_returned_results_should_be_mapped_and_returned()
        {
            const Int32 expectedRecordTotal = 15;

            var responses = DriverDistanceTestHelper.CreateDriverDistanceResponse(expectedRecordTotal).ToList();

            _driverDistanceQueryServiceMock
                .Setup(x => x.GetByEmployeeAndEntityForDate(It.IsAny<Int64>(), It.IsAny<Int64>(), It.IsAny<DateTime>()))
                .Returns(responses);

            var results = _apiControllerUnderTest.GetRecordsForEmployeeByEntityAndDate(1, 1, new DateTime(2015, 12, 5)).ToList();

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
        public void Given_a_create_record_request_When_attempting_to_create_the_record_Then_the_entity_should_be_set_to_current_user_entity()
        {

            _authenticationServiceMock
                .Setup(x => x.User)
                .Returns(new BusinessUser { MobileSettings = new MobileSettings { EntityId = ExpectedEntityId } });

            _apiControllerUnderTest.Post( ExpectedEntityId, new CreateDriverDistanceRequest());

            _driverDistanceCommandServiceMock
                .Verify(x => x.CreateDriverDistance(It.Is<AddDriverDistanceRequest>(y =>
                    y.EntityId == ExpectedEntityId)), Times.Once());
        }

        [TestMethod]
        public void Given_a_create_record_request_When_attempting_to_create_the_record_Then_the_submit_time_of_record_should_be_set_to_current_entity_time()
        {
            var expectedDateTime = new DateTime(2015, 12, 5, 16, 30, 0);

            _entityTimeQueryServiceMock
                .Setup(x => x.GetCurrentStoreTime(It.IsAny<Int64>()))
                .Returns(expectedDateTime);

            _apiControllerUnderTest.Post(ExpectedEntityId, new CreateDriverDistanceRequest());

            _driverDistanceCommandServiceMock
                .Verify(x => x.CreateDriverDistance(It.Is<AddDriverDistanceRequest>(y =>
                    y.SubmitTime == expectedDateTime)), Times.Once());
        }
    }
}
