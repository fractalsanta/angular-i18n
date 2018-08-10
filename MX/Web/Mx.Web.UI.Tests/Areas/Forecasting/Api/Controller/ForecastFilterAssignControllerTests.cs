using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Mx.Forecasting.Services.Contracts;

namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class ForecastFilterAssignControllerTests
    {
        private ForecastFilterAssignController _controllerUnderTest;
        private Mock<IForecastFilterAssignQueryService> _forecastFilterAssignQueryServiceMock;
        private Mock<IForecastFilterAssignCommandService> _forecastFilterAssignCommandServiceMock;

        [TestInitialize]
        public void InitializeTest()
        {
            ForecastFilterAssignRecord.ConfigureAutoMapping();

            _forecastFilterAssignQueryServiceMock = new Mock<IForecastFilterAssignQueryService>();
            _forecastFilterAssignCommandServiceMock = new Mock<IForecastFilterAssignCommandService>();

            _controllerUnderTest = new ForecastFilterAssignController(Mapper.Engine,
                _forecastFilterAssignQueryServiceMock.Object,
                _forecastFilterAssignCommandServiceMock.Object);
        }

        [TestMethod]
        public void Given_request_for_forecast_filters_assign_When_request_made_Then_call_is_made_to_get_forecast_filters_assign_once()
        {
            _controllerUnderTest.GetForecastFilterAssigns();

            _forecastFilterAssignQueryServiceMock.Verify(x => x.GetForecastFilterAssigns(), Times.Once(),
                "Call to query service should be made once.");
        }

        [TestMethod]
        public void Given_forecast_filter_assign_query_request_When_request_made_Then_the_query_service_result_should_be_mapped_and_returned()
        {
            for (var i = 0; i <= 3; i++)
            {
                var forecastFilterAssignRecords = CreateForecastFilterAssignResponses(i);

                _forecastFilterAssignQueryServiceMock.Setup(x => x.GetForecastFilterAssigns())
                    .Returns(() => forecastFilterAssignRecords);

                var results = _controllerUnderTest.GetForecastFilterAssigns().ToList();

                Assert.AreEqual(i, results.Count());

                results.ForEach(mappedRecord =>
                {
                    var matchingRecord = forecastFilterAssignRecords.ElementAt(mappedRecord.Id);

                    AssertForecastFilterAssignMappedCorrectlyResponseToRecord(matchingRecord, mappedRecord);
                });
            }
        }

        private static IList<ForecastFilterAssignResponse> CreateForecastFilterAssignResponses(Int32 numberToCreate)
        {
            return Enumerable.Range(0, numberToCreate)
                    .Select(i => new ForecastFilterAssignResponse
                    {
                        Id = i,
                        FunctionId = (ForecastFilterFunction)i,
                        ServiceGroupId = i * 16,
                        IsActive = i % 2 == 0
                    }).ToList();
        }

        private void AssertForecastFilterAssignMappedCorrectlyResponseToRecord(ForecastFilterAssignResponse originalRecord, ForecastFilterAssignRecord mappedResponse)
        {
            Assert.AreEqual(mappedResponse.Id, originalRecord.Id);
            Assert.AreEqual(mappedResponse.FunctionId, originalRecord.FunctionId);
            Assert.AreEqual(mappedResponse.ServiceGroupId, originalRecord.ServiceGroupId);
            Assert.AreEqual(mappedResponse.IsActive, originalRecord.IsActive);
        }
    }
}
