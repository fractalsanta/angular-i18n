using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.Translations;
using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class ForecastFilterDialogControllerTests
    {
        private ForecastFilterDialogController _controllerUnderTest;
        private Mock<IForecastFilterCommandService> _forecastFilterCommandServiceMock;
        private Mock<ITranslationService> _localisationQueryService;
        private Mock<IAuthenticationService> _authenticationService;


        [TestInitialize]
        public void InitializeTest()
        {
            ForecastFilterRecord.ConfigureAutoMapping();

            _forecastFilterCommandServiceMock = new Mock<IForecastFilterCommandService>();
            _localisationQueryService = new Mock<ITranslationService>();
            _authenticationService = new Mock<IAuthenticationService>();

            _controllerUnderTest = new ForecastFilterDialogController(Mapper.Engine,
                _forecastFilterCommandServiceMock.Object, _localisationQueryService.Object, _authenticationService.Object);
        }

        [TestMethod]
        public void Given_request_to_insert_or_update_forecast_filters_When_request_made_Then_call_is_made_to_insert_or_update_filter_once()
        {
            _controllerUnderTest.PostInsertOrUpdateForecastFilter(new ForecastFilterRecord());

            _forecastFilterCommandServiceMock.Verify(x => x.InsertOrUpdateForecastFilter(It.IsAny<ForecastFilterRequest>()),
                Times.Once(),
                "Insert or update call to command service should be made once.");
        }

        [TestMethod]
        public void Given_forecast_filter_record_When_mapping_request_is_made_for_forecast_filter_request_Then_mapping_is_correct()
        {
            var forecastFilterRecord = CreateForecastFilterRecord();
            var forecastFilterRequest = Mapper.Map<ForecastFilterRequest>(forecastFilterRecord);

            AssertForecastFilterMappedCorrectlyRecordToRequest(forecastFilterRecord, forecastFilterRequest);
        }

        private static ForecastFilterRecord CreateForecastFilterRecord()
        {
            var forecastFilterRecord = new ForecastFilterRecord()
            {
                Id = 101,
                IsForecastEditableViaGroup = true,
                Name = "Test Name",
                ForecastFilterGroupTypes = CreateForecastFilterGroupType(101)
            };

            return forecastFilterRecord;
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

        private void AssertForecastFilterMappedCorrectlyRecordToRequest(ForecastFilterRecord originalRecord, ForecastFilterRequest mappedResponse)
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
