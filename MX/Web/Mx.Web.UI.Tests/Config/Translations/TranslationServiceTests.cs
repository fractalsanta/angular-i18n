using System.Collections.Generic;
using System.Reflection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Web.UI.Config.Translations;
using Mx.Foundation.Services.Contracts.QueryServices;

namespace Mx.Web.UI.Tests.Config.Translations
{
    [TestClass]
    public class TranslationServiceTests
    {
        
        /// <summary>
        /// Because we cannot add a setter using C# we have to create a slightly different structure
        /// with what we do in real production to test ONLY the translation service.
        /// </summary>
        [TestMethod]
        public void TestTranslate()
        {
            const string result = "Mock Foo";

            var translationSetup = new Mock<ILocalisationQueryService>();
            translationSetup.Setup(m => m.GetPageTranslation("TestModel", "en-en"))
                .Returns(new Dictionary<string, string> { { "Foo", result } });

            var factoryMock = new Mock<IVirtualProxyFactory>(MockBehavior.Strict);
            factoryMock.Setup(f => f.GetProxyType(typeof(TestModel))).Returns(typeof(DerivedTestModel));
            var service = new TranslationService(factoryMock.Object, translationSetup.Object);

            var translated = service.Translate<TestModel>("en-en");
            Assert.AreEqual(result, translated.Foo);
        }

        /// <summary>
        /// This test will run a more production realistic test where the C# class does not have a setter.
        /// The virtual proxy server will inject the setter into the class and run 'as per production'.
        /// </summary>
        [TestMethod]
        public void TestTranslateNoSet()
        {
            const string result = "Mock Foo";

            var translationSetup = new Mock<ILocalisationQueryService>();
            translationSetup.Setup(m => m.GetPageTranslation("TestModel", "en-en"))
                .Returns(new Dictionary<string, string> { { "Foo", result } });

            var factory = new VirtualProxyFactory(Assembly.GetExecutingAssembly(), type => type.Name == "TestModelNoSet");
            var service = new TranslationService(factory, translationSetup.Object);

            var translated = service.Translate<TestModelNoSet>("en-en");
            Assert.AreEqual(result, translated.Foo);
        }
    }
}
