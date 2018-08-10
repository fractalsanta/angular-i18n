using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Services;
using Mx.Web.UI.Config.Translations;
using Mx.Inventory.Services.Contracts.QueryServices;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Services
{
    [TestClass]
    public class TransferNotificationAreaServiceTest
    {
        private Mock<ITranslationService> _translationService;
        private Mock<ITransferQueryService> _transferQueryService;
        private BusinessUser _businessUserWithTransfer;
        private BusinessUser _businessUserWithoutTransfer;
        private const int EntityWithTransferRequestToApprove = 1;
        private const int EntityWithoutTransferRequestToApprove = 2;
        private const int EntityWithTransferToReceive = 3;
        private const int EntityWithoutTransferToReceive = 4;
        

        [TestInitialize]
        public void Initialize()
        {
            _translationService = GetTranslationServiceMock();
            _transferQueryService = GetTransferQueryServiceMock();

            var transferPermissions = GetTransferPermissions().ToList();

            _businessUserWithTransfer = new BusinessUser
            {
                MobileSettings = new MobileSettings { EntityId = EntityWithTransferRequestToApprove },
                Permission = new Permissions { AllowedTasks = transferPermissions }
            };
            _businessUserWithoutTransfer = new BusinessUser
            {
                MobileSettings = new MobileSettings { EntityId = EntityWithoutTransferRequestToApprove },
                Permission = new Permissions { AllowedTasks = transferPermissions }
            };
        }

        [TestMethod]
        public void Given_user_has_transfer_permission_When_entity_has_pending_transfer_Then_notifications_are_populated()
        {
            var service = GetNotificationAreaServiceForBusinessUser(_businessUserWithTransfer);
            var notifications = service.GetNotificationAreas().ToList();

            Assert.IsTrue(notifications.Any(), "User supposed to see transfer notifications");
        }

        [TestMethod]
        public void Given_user_does_not_have_transfer_permission_When_entity_has_pending_transfer_Then_notifications_are_empty()
        {
            _businessUserWithTransfer.Permission = new Permissions { AllowedTasks = new List<Task>() };
            var service = GetNotificationAreaServiceForBusinessUser(_businessUserWithTransfer);
            var notifications = service.GetNotificationAreas().ToList();

            Assert.IsFalse(notifications.Any(), "User doesn't have permissions to see transfers");
        }

        [TestMethod]
        public void Given_user_has_transfer_permission_When_entity_has_no_transfers_Then_notifications_are_empty()
        {
            var service = GetNotificationAreaServiceForBusinessUser(_businessUserWithoutTransfer);
            var notifications = service.GetNotificationAreas().ToList();

            Assert.IsFalse(notifications.Any(), "User has no transfers and doesn't see notifications");
        }

        private IEnumerable<Task> GetTransferPermissions()
        {
            yield return Task.Inventory_Transfers_CanRequestTransferIn;
        }
        
        private Mock<ITranslationService> GetTranslationServiceMock()
        {
            var translationServiceMock = new Mock<ITranslationService>(MockBehavior.Strict);

            translationServiceMock
                .Setup(s => s.Translate<UI.Areas.Core.Api.Models.Notifications.L10N>(It.IsAny<string>()))
                .Returns(new UI.Areas.Core.Api.Models.Notifications.L10N());
            return translationServiceMock;
        }

        private Mock<IAuthenticationService> GetAuthenticationServiceMock(BusinessUser businessUser)
        {
            var authenticationServiceMock = new Mock<IAuthenticationService>(MockBehavior.Strict);

            authenticationServiceMock
                .Setup(s => s.User)
                .Returns(businessUser);
            return authenticationServiceMock;
        }

        private Mock<ITransferQueryService> GetTransferQueryServiceMock()
        {
            var transferQueryServiceMock = new Mock<ITransferQueryService>(MockBehavior.Strict);

            transferQueryServiceMock
                .Setup(s => s.DoesStoreHaveTransferRequestsToApprove(EntityWithTransferRequestToApprove))
                .Returns(true);
            transferQueryServiceMock
                .Setup(s => s.DoesStoreHaveTransferRequestsToApprove(EntityWithoutTransferRequestToApprove))
                .Returns(false);
            transferQueryServiceMock
                .Setup(s => s.DoesStoreHaveTransfersToReceive(EntityWithTransferToReceive))
                .Returns(true);
            transferQueryServiceMock
                .Setup(s => s.DoesStoreHaveTransfersToReceive(EntityWithoutTransferToReceive))
                .Returns(false);
            return transferQueryServiceMock;
        }

        private INotificationAreaService GetNotificationAreaServiceForBusinessUser(BusinessUser businessUser)
        {
            var authenticationService = GetAuthenticationServiceMock(businessUser).Object;

            var service = new TransferNotificationAreaService(
                authenticationService, 
                _transferQueryService.Object, 
                _translationService.Object);

            return service;
        }
    }
}
