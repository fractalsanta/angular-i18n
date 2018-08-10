using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Areas.Core.Api.Services
{
    [TestClass]
    public class CountNotificationAreaServiceTests
    {
        private const int EntityId = 555;
        private readonly EntityLocationResponse[] _responses =
        {
            new EntityLocationResponse
            {
                LocationType = Mx.Web.UI.Areas.Inventory.Count.Api.Constants.NewLocationType,
                LocationItems = new EntityLocationItemResponse[3]
            },
            new EntityLocationResponse
            {
                LocationType = Mx.Web.UI.Areas.Inventory.Count.Api.Constants.NewLocationType,
                LocationItems = new EntityLocationItemResponse[2]
            },
            new EntityLocationResponse {LocationType = "Regular Location"}
        };


        [TestMethod]
        public void TestReturnEmptyWithoutPermissions()
        {
            // 1. Setup
            var service = new CountNotificationAreaService(
                GetAuthenticationServiceMock(Task.Operations_StoreSummary_CanAccess).Object, // Setup an unrelated permission
                GetLocationQueryServiceMock(_responses).Object,
                GetTranslationServiceMock().Object);

            // 2. Act
            var areas = service.GetNotificationAreas();

            // 3. Assert
            Assert.AreEqual(0, areas.Count());
        }

        [TestMethod]
        public void TestReturnsLocationsWithPermissions()
        {
            // 1. Setup
            var service = new CountNotificationAreaService(
                GetAuthenticationServiceMock(Task.Inventory_TravelPath_PeriodicFrequency_CanView).Object, // Setup a related permission
                GetLocationQueryServiceMock(_responses).Object,
                GetTranslationServiceMock().Object);

            // 2. Act
            var areas = service.GetNotificationAreas().ToList();

            // 3. Assert
            Assert.AreEqual(1, areas.Count(), " Expecting one area");
            Assert.AreEqual(new UI.Areas.Core.Api.Models.Notifications.L10N().InventoryCount, areas.First().Name);
        }

        [TestMethod]
        public void TestReturnsEmptyWithPermissionsButNoLocations()
        {
            // 1. Setup
            var service = new CountNotificationAreaService(
                GetAuthenticationServiceMock(Task.Inventory_TravelPath_PeriodicFrequency_CanView).Object, // Setup a related permission
                GetLocationQueryServiceMock().Object,
                GetTranslationServiceMock().Object);

            // 2. Act
            var areas = service.GetNotificationAreas();

            // 3. Assert
            Assert.AreEqual(0, areas.Count());
        }

        private static Mock<IAuthenticationService> GetAuthenticationServiceMock(params Task[] allowedTasks)
        {
            var authenticationServiceMock = new Mock<IAuthenticationService>(MockBehavior.Strict);
            var user = new BusinessUser
            {
                Culture = "Test",
                MobileSettings = new MobileSettings {EntityId = EntityId},
                Permission = new Permissions {AllowedTasks = new List<Task>(allowedTasks)}
            };

            authenticationServiceMock
                .Setup(s => s.User)
                .Returns(user);
            return authenticationServiceMock;
        }

        private static Mock<ITranslationService> GetTranslationServiceMock()
        {
            var translationServiceMock = new Mock<ITranslationService>(MockBehavior.Strict);
            translationServiceMock
                .Setup(s => s.Translate<UI.Areas.Core.Api.Models.Notifications.L10N>("Test"))
                .Returns(new UI.Areas.Core.Api.Models.Notifications.L10N());
            return translationServiceMock;
        }

        private static Mock<IInventoryLocationQueryService> GetLocationQueryServiceMock(params EntityLocationResponse[] locationResponses)
        {
            var locationQueryServiceMock = new Mock<IInventoryLocationQueryService>(MockBehavior.Strict);
            locationQueryServiceMock
                .Setup(s => s.GetLocationsByEntity(EntityId))
                .Returns(locationResponses);
            locationQueryServiceMock
                .Setup(s => s.DoesNewItemLocationHaveItems(EntityId))
                .Returns(locationResponses.Any());
            return locationQueryServiceMock;
        }
    }
}
