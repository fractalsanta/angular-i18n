using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Enums;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Services;
using Mx.Web.UI.Config.Translations;
using System;

namespace Mx.Web.UI.Tests.Areas.Workforce.Deliveries
{
    [TestClass]
    public class DeliveryNotificationAreaServiceTest
    {
        private ITranslationService _translationService;
        private IEntityTimeQueryService _entityTimeQueryService;
        private ITransactionDeliveryQueryService _transactionDeliveryQueryService;
        private BusinessUser _businessUser;
        private int _entityId;

        [TestInitialize]
        public void Initialize()
        {
            _translationService = GetTranslationServiceMock().Object;
            _transactionDeliveryQueryService = GetTransactionDeliveryQueryServiceMock().Object;
            _entityTimeQueryService = GetEntityTimeQueryServiceMock().Object;
            _entityId = 1;
            _businessUser = new BusinessUser
            {
                Culture = "Test",
                MobileSettings = new MobileSettings { EntityId = _entityId }
           };

        }

        [TestMethod]
        public void Given_delivery_notification_service_When_user_has_permissions_Then_notifications_returned()
        {
            _businessUser.Permission = new Permissions { AllowedTasks = new List<Task>(GetDeliveriesPermissions()) };
            var authenticationService = GetAuthenticationServiceMock().Object;

            var service = new DeliveryNotificationService(authenticationService, _translationService,
                _entityTimeQueryService, _transactionDeliveryQueryService);
            var notifications = service.GetNotificationAreas().ToList();

            Assert.IsTrue(notifications.Any(), "User supposed to see delivery notifications");            
        }


        [TestMethod]
        public void Given_delivery_notification_service_When_user_has_no_permissions_Then_notifications_are_empty()
        {
            _businessUser.Permission = new Permissions { AllowedTasks = new List<Task>() };
            var authenticationService = GetAuthenticationServiceMock().Object;

            var service = new DeliveryNotificationService(authenticationService, _translationService,
                _entityTimeQueryService, _transactionDeliveryQueryService);
            var notifications = service.GetNotificationAreas().ToList();

            Assert.IsTrue(!notifications.Any(), "User doesn't have permissions to see deliveries");
        }

        private IEnumerable<Task> GetDeliveriesPermissions()
        {
            yield return Task.Labor_EmployeePortal_Deliveries_CanView;
            yield return Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries;
            yield return Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise;
        }

        private Mock<IEntityTimeQueryService> GetEntityTimeQueryServiceMock()
        {
            var entityTimeQueryService = new Mock<IEntityTimeQueryService>(MockBehavior.Strict);
            entityTimeQueryService
                .Setup(s => s.GetCurrentStoreTime(It.IsAny<long>()))
                .Returns(DateTime.Parse("2015-03-20"));
            return entityTimeQueryService;
        }

        private Mock<ITransactionDeliveryQueryService> GetTransactionDeliveryQueryServiceMock()
        {
            var transactionDeliveryQueryService = new Mock<ITransactionDeliveryQueryService>(MockBehavior.Strict);
            transactionDeliveryQueryService
                .Setup(s => s.GetByEntityAndDateRange(It.IsAny<long>(), It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .Returns(new[]
                {
                    new TransactionDeliveryResponse
                    {
                        Id = 0,
                        Comment = "Test",
                        DeliveryType = TransactionDeliveryType.Extra,
                        Status = TransactionDeliveryStatus.Pending
                    }
                });
            return transactionDeliveryQueryService;
        }

        private Mock<ITranslationService> GetTranslationServiceMock()
        {
            var translationServiceMock = new Mock<ITranslationService>(MockBehavior.Strict);
            translationServiceMock
                .Setup(s => s.Translate<UI.Areas.Core.Api.Models.Notifications.L10N>("Test"))
                .Returns(new UI.Areas.Core.Api.Models.Notifications.L10N());
            return translationServiceMock;
        }

        private Mock<IAuthenticationService> GetAuthenticationServiceMock()
        {
            var authenticationServiceMock = new Mock<IAuthenticationService>(MockBehavior.Strict);

            authenticationServiceMock
                .Setup(s => s.User)
                .Returns(_businessUser);
            return authenticationServiceMock;
        }

    }
}
