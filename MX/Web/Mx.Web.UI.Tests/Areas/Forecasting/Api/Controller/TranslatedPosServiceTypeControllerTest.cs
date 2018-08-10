using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mx.Web.UI.Tests.Areas.Forecasting.Api.Controller
{
    [TestClass]
    public class TranslatedPosServiceTypeControllerTest
    {
        private Mock<ILocalisationQueryService> _localisationQueryServiceMock;
        private Mock<IAuthenticationService> _authenticationServiceMock;
        private TranslatedPosServiceTypeController _controllerUnderTest;

        [TestInitialize]
        public void InitializeTest()
        {
            _localisationQueryServiceMock = new Mock<ILocalisationQueryService>();
            _authenticationServiceMock = new Mock<IAuthenticationService>();

            _controllerUnderTest = new TranslatedPosServiceTypeController(_localisationQueryServiceMock.Object,
                _authenticationServiceMock.Object);
        }

        [TestMethod]
        public void Given_call_to_get_translations_When_call_is_made_Then_correct_list_of_objects_with_translations_is_returned()
        {
            var translationDictionary = GetTranslationDictionary();

            _localisationQueryServiceMock.Setup(x => x.GetPageTranslation(It.IsAny<String>(), It.IsAny<String>()))
                .Returns(() => translationDictionary);

            _authenticationServiceMock.Setup(x => x.User).Returns(() => new BusinessUser());

            var listOfTranslatedEnum = _controllerUnderTest.GetPosServiceTypeEnumTranslations().ToList();

            AssertTranslations(translationDictionary, listOfTranslatedEnum);
        }

        [TestMethod]
        public void Given_call_to_get_translations_When_call_is_made_Then_list_of_objects_with_order_by_translations_is_returned()
        {
            var translationDictionary = GetTranslationDictionary();

            _localisationQueryServiceMock.Setup(x => x.GetPageTranslation(It.IsAny<String>(), It.IsAny<String>()))
                .Returns(() => translationDictionary);

            _authenticationServiceMock.Setup(x => x.User).Returns(() => new BusinessUser());

            var listOfTranslatedEnum = _controllerUnderTest.GetPosServiceTypeEnumTranslations().ToList();

            AssertOrder(listOfTranslatedEnum);
        }

        private void AssertOrder(List<TranslatedEnum> translatedEnums)
        {
            for (var i = 0; i < translatedEnums.Count() - 1; i++)
            {
                var preEnum = translatedEnums[i];
                var postEnum = translatedEnums[i + 1];

                if(preEnum.Translation.CompareTo(postEnum.Translation) > 0 &&
                    !(postEnum.Name.StartsWith("Custom") && postEnum.Translation.Equals(postEnum.Name)))
                {
                    Assert.Fail("Order of Translated enums is not as expected.");
                }
            }
        }

        private static Dictionary<String, String> GetTranslationDictionary()
        {
            var dictionary = new Dictionary<String, String>();

            foreach (PosServiceType enumValue in Enum.GetValues(typeof(PosServiceType)))
            {
                dictionary.Add(Enum.GetName(typeof(PosServiceType), enumValue),
                    "Translated " + Enum.GetName(typeof(PosServiceType), enumValue));
            }

            return dictionary;
        }

        private void AssertTranslations(Dictionary<String, String> translationDictionary, List<TranslatedEnum> translatedEnums)
        {
            foreach (var translatedEnum in translatedEnums)
            {
                Assert.AreEqual(translatedEnum.Translation, translationDictionary[translatedEnum.Name]);
            }
        }
    }
}
