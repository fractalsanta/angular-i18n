using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Order.Api.Services;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Areas.Inventory.Order.Api.Services
{
    [TestClass]
    public class OverdueOrdersNotificationAreaServiceTests
    {
        private const long EntityId = 555;

        private static DateTime _entityTime;

        private readonly OrderHeaderResponse[] _responses =
        {
            new OrderHeaderResponse
            {
                DisplayId = 1,
                VendorName = "test1",
            },
            new OrderHeaderResponse
            {
                DisplayId = 12,
                VendorName = "test2222",
            },
            new OrderHeaderResponse
            {
                DisplayId = 123,
                VendorName = "test3333",
            }
        };

        private OrderHeaderResponse[] _returnedResponse;


        [TestMethod]
        public void TestReturnEmptyWithoutPermissions()
        {
            SetEntityTime();
            var service = new OrdersOverdueNotificationAreaService(
                GetAuthenticationServiceMock(Task.Inventory_Transfers_CanRequestTransferIn).Object, // Setup an unrelated permission
                GetOrderQueryServiceMock().Object,
                GetTimeServiceMock().Object,
                GetTranslationServiceMock().Object);

            var areas = service.GetNotificationAreas();

            Assert.AreEqual(0, areas.Count());
        }

        [TestMethod]
        public void TestReturnsLocationsWithPermissions()
        {
            SetEntityTime();
            var service = new OrdersOverdueNotificationAreaService(
                GetAuthenticationServiceMock(
                    Task.Inventory_Ordering_CanView,
                    Task.Inventory_Ordering_Receive_CanView,
                    Task.Inventory_Receiving_CanReceive).Object, // Setup a related permissions
                GetOrderQueryServiceMock().Object,
                GetTimeServiceMock().Object,
                GetTranslationServiceMock().Object);

            var areas = service.GetNotificationAreas().ToList();

            Assert.AreEqual(1, areas.Count(), " Expecting one area");
            Assert.AreEqual(new UI.Areas.Core.Api.Models.Notifications.L10N().OverdueOrderReceipts, areas.First().Name);
        }

        [TestMethod]
        public void TestReturnsEmptyWithPermissionsButNoneOverDue()
        {
            SetEntityTime();
            var service = new OrdersOverdueNotificationAreaService(
                GetAuthenticationServiceMock(Task.Inventory_Receiving_CanReceive).Object, // Setup a related permission
                GetOrderQueryServiceMock(new OrderHeaderResponse[0]).Object,
                GetTimeServiceMock().Object,
                GetTranslationServiceMock().Object);

            var areas = service.GetNotificationAreas();

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

        private static void SetEntityTime(DateTime? result = null)
        {
            _entityTime = result.HasValue ? result.Value : new DateTime(2014,4,14,12,31,14);
        }

        private static Mock<IEntityTimeQueryService> GetTimeServiceMock()
        {
            
            var timeServiceMock = new Mock<IEntityTimeQueryService>(MockBehavior.Strict);
            timeServiceMock
                .Setup(s => s.GetCurrentStoreTime(EntityId))
                .Returns(_entityTime);
            return timeServiceMock;
        }

        private Mock<IOrderQueryService> GetOrderQueryServiceMock(OrderHeaderResponse[] result = null)
        {
            if (result == null)
            {
                _returnedResponse = _responses;
            }
            else
            {
                _returnedResponse = result;
            }
            var orderQueryServiceMock = new Mock<IOrderQueryService>(MockBehavior.Strict);
            orderQueryServiceMock
                .Setup(s => s.GetPlacedOrders(EntityId, _entityTime.Date.AddDays(-14), _entityTime))
                .Returns(() => _returnedResponse);
            return orderQueryServiceMock;
        }
    }
}
