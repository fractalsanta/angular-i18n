using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Administration.Settings.Api;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.CommandServices;
using Mx.Web.UI.Areas.Administration.Settings.Api.Models;

namespace Mx.Web.UI.Tests.Areas.Core.Api.Services
{
    [TestClass]
    public class SiteSettingsControllerTests
    {
        private const short colorScheme = 999;
        private SystemSettingsRequest updateSystemSettingsRequest;

        [TestMethod]
        public void TestQueryingSiteSettings()
        {
            var controller = new SiteSettingsController(
                GetSystemSettingsQueryServiceMock().Object,
                GetSystemSettingsCommandServiceMock().Object);

            var settings = controller.GetSiteSettings();

            Assert.AreEqual(settings.LoginColorScheme, colorScheme);
        }

        [TestMethod]
        public void TestPostingSiteSettings()
        {
            var controller = new SiteSettingsController(
                GetSystemSettingsQueryServiceMock().Object,
                GetSystemSettingsCommandServiceMock().Object);

            controller.PostSiteSettings(new SiteSettings(){LoginColorScheme = colorScheme});

            Assert.AreEqual(updateSystemSettingsRequest.LoginColorScheme, colorScheme);
        }

        private Mock<ISystemSettingsQueryService> GetSystemSettingsQueryServiceMock()
        {
            var systemsettingsQueryServiceMock = new Mock<ISystemSettingsQueryService>(MockBehavior.Strict);

            systemsettingsQueryServiceMock
                .Setup(s => s.GetSystemSettings())
                .Returns(new SystemSettingsResponse() {LoginColorScheme = colorScheme});

            return systemsettingsQueryServiceMock;
        }

        private Mock<ISystemSettingsCommandService> GetSystemSettingsCommandServiceMock()
        {
            var systemsettingsCommandServiceMock = new Mock<ISystemSettingsCommandService>(MockBehavior.Strict);

            systemsettingsCommandServiceMock
                .Setup(s => s.UpdateSystemSettings(It.IsAny<SystemSettingsRequest>()))
                .Callback<SystemSettingsRequest>(req => updateSystemSettingsRequest = req);

            return systemsettingsCommandServiceMock;
        }
    }
}
