using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class ForecastFilterControllerTests
    {
        private ForecastFilterController _controllerUnderTest;
        private Mock<IForecastFilterQueryService> _forecastFilterQueryServiceMock;
        private Mock<IForecastFilterCommandService> _forecastFilterCommandServiceMock;

        [TestInitialize]
        public void InitializeTest()
        {
            ForecastFilterRecord.ConfigureAutoMapping();

            _forecastFilterQueryServiceMock = new Mock<IForecastFilterQueryService>();
            _forecastFilterCommandServiceMock = new Mock<IForecastFilterCommandService>();
            _controllerUnderTest = new ForecastFilterController(Mapper.Engine,
                _forecastFilterQueryServiceMock.Object,
                _forecastFilterCommandServiceMock.Object);
        }

        [TestMethod]
        public void Given_request_for_forecast_filters_When_request_made_Then_call_is_made_to_get_forecast_filters_once()
        {
            _controllerUnderTest.GetForecastFilters();

            _forecastFilterQueryServiceMock.Verify(x => x.GetForecastFilters(), Times.Once(), 
                "Call to query service should be made once.");
        }

        [TestMethod]
        public void Given_forecast_filter_query_request_When_request_made_Then_the_query_service_result_should_be_mapped_and_returned()
        {
            for (var i = 0; i <= 100; i += 25)
            {
                var forecastFilterRecords = CreateForecastFilterResponses(i);

                _forecastFilterQueryServiceMock.Setup(x => x.GetForecastFilters())
                    .Returns(() => forecastFilterRecords);

                var results = _controllerUnderTest.GetForecastFilters().ToList();

                Assert.AreEqual(i, results.Count());

                results.ForEach(mappedRecord =>
                {
                    var matchingRecord = forecastFilterRecords.ElementAt(mappedRecord.Id);

                    AssertForecastFilterMappedCorrectlyResponseToRecord(matchingRecord, mappedRecord);
                });
            }
        }

        private static IList<ForecastFilterResponse> CreateForecastFilterResponses(Int32 numberToCreate)
        {
            return Enumerable.Range(0, numberToCreate)
                    .Select(i => new ForecastFilterResponse
                    {
                        Id = i,
                        Name = "Name of: " + i,
                        IsForecastEditableViaGroup = i % 2 == 0,
                        ForecastFilterGroupTypes = CreateForecastFilterGroupType(i)
                    }).ToList();
        }

        private static IList<PosServiceType> CreateForecastFilterGroupType(Int32 serviceGroupId)
        {
            var results = new List<PosServiceType>();

            results.Add(PosServiceType.KioskDineIn);
            results.Add(PosServiceType.Delivery);
            results.Add(PosServiceType.FullService);
            results.Add(PosServiceType.MobileDelivery);

            return results;
        }

        private void AssertForecastFilterMappedCorrectlyResponseToRecord(ForecastFilterResponse originalRecord, ForecastFilterRecord mappedResponse)
        {
            Assert.AreEqual(mappedResponse.Id, originalRecord.Id);
            Assert.AreEqual(mappedResponse.Name, originalRecord.Name);
            Assert.AreEqual(mappedResponse.IsForecastEditableViaGroup, originalRecord.IsForecastEditableViaGroup);

            Assert.AreEqual(mappedResponse.ForecastFilterGroupTypes[0], originalRecord.ForecastFilterGroupTypes[0]);
            Assert.AreEqual(mappedResponse.ForecastFilterGroupTypes[1], originalRecord.ForecastFilterGroupTypes[1]);
            Assert.AreEqual(mappedResponse.ForecastFilterGroupTypes[2], originalRecord.ForecastFilterGroupTypes[2]);
            Assert.AreEqual(mappedResponse.ForecastFilterGroupTypes[3], originalRecord.ForecastFilterGroupTypes[3]);
        }
    }
}
