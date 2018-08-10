using System;
using System.Reflection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Config.Translations
{
    [TestClass]
    public class VirtualProxyTests
    {
        [TestMethod]
        public void EnsureVirtualProxyReplacesPropertyTest()
        {
            const string result = "New Foo";

            var proxy = new VirtualProxyFactory(Assembly.GetExecutingAssembly(), type => type.Name == "TestModel");
            var model = proxy.Create<TestModel>();
            model.GetType().GetProperty("Foo").SetValue(model, result, BindingFlags.Instance | BindingFlags.Public, null, new object[0], null);

            Assert.AreEqual(result, model.Foo);
        }

        [TestMethod]
        public void EnsureVirtualProxyPassesThroughPropertylTest()
        {
            const string result = "New Foo";
            var proxy = new VirtualProxyFactory(Assembly.GetExecutingAssembly(), type => type.Name == "TestModelNoSet");
            var model = proxy.Create<TestModelNoSet>();
            model.GetType().GetProperty("Foo").SetValue(model, result, BindingFlags.Instance | BindingFlags.Public, null, new object[0], null);

            Assert.IsNull(model.Bar, "Bar is null because we have not overloaded it, default is done by translation service");
        }
    }
}
