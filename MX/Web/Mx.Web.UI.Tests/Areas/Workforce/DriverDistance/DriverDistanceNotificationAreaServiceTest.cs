using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Services;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Areas.Workforce.DriverDistance
{
    [TestClass]
    public class DriverDistanceNotificationAreaServiceTest
    {
        #region Test Data

        private static readonly Mock<IDriverDistanceQueryService> _driverDistanceQueryServiceMock;
        private static readonly Mock<IEntityTimeQueryService> _entityTimeQueryServiceMock;
        private static readonly Mock<ITranslationService> _translationServiceMock;

        private const Int64 EntityIdWithActionableDriverDistanceRecords = 1;
        private const Int64 EntityIdWithoutActionableDriverDistanceRecords = 2;
       
        private static readonly Permissions _requiredPermissionsToReceiveDriverDistanceAreaNotifications;

        private static readonly IEnumerable<DriverDistanceResponse> _actionableDriverDistanceRecords;

        private static readonly DateTime _currentDate = DateTime.Today;

        private static readonly DateTime _dateWithOneRecord;
        private static readonly DateTime _dateWithTwoRecords;
        private static readonly DateTime _dateWithFiveRecords;

        static DriverDistanceNotificationAreaServiceTest()
        {
            _requiredPermissionsToReceiveDriverDistanceAreaNotifications =
                new Permissions
                {
                    AllowedTasks = new List<Task>(DriverDistanceNotificationAreaService.RequiredPermissions)
                };

            _dateWithOneRecord = _currentDate.AddDays(-6);
            _dateWithTwoRecords = _currentDate;
            _dateWithFiveRecords = _currentDate.AddDays(-3);

            _actionableDriverDistanceRecords =
                Enumerable.Repeat(new DriverDistanceResponse { TripBusinessDay = _dateWithTwoRecords }, 2)
                .Concat(Enumerable.Repeat(new DriverDistanceResponse { TripBusinessDay = _dateWithFiveRecords }, 5))
                .Concat(Enumerable.Repeat(new DriverDistanceResponse { TripBusinessDay = _dateWithOneRecord }, 1));

            _driverDistanceQueryServiceMock = GetDriverDistanceQueryServiceMock();
            _entityTimeQueryServiceMock = GetEntityTimeQueryServiceMock();
            _translationServiceMock = GetTranslationServiceMock();
        }

        #endregion

        [TestMethod]
        public void Given_the_current_user_does_not_have_the_required_permissions_and_the_entity_does_not_have_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_there_are_no_driver_distance_area_notifications()
        {
            var businessUser = CreateUserWithoutPermissionsLoggedInToStoreWithoutActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            Assert.IsFalse(
                areaNotifications.Any(),
                "The current user should not see any driver distance area notifications if they lack sufficient permissions.");
        }

        [TestMethod]
        public void Given_the_current_user_does_not_have_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_there_are_no_driver_distance_area_notifications()
        {
            var businessUser = CreateUserWithoutPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            Assert.IsFalse(
                areaNotifications.Any(),
                "The current user should not see any driver distance area notifications if they lack sufficient permissions, even if the entity has actionable driver distance records.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_does_not_have_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_there_are_no_driver_distance_area_notifications()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithoutActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            Assert.IsFalse(
                areaNotifications.Any(),
                "The current user should not see any driver distance area notifications if they have permissions but the entity has no actionable driver distance records.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_there_are_driver_distance_area_notifications()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            Assert.IsTrue(
                areaNotifications.Any(),
                "The current user should see driver distance area notifications if they have permissions and the entity has actionable driver distance records.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_should_contain_only_one_notification()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            Assert.AreEqual(
                1,
                areaNotifications.Count(),
                "An authorized user should see one driver distance area notification if there are actionable driver distance records.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_notifications_should_have_no_more_than_one_notification_per_day()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            var expectedNotifications = _actionableDriverDistanceRecords.Select(x => x.TripBusinessDay).Distinct().Count();
            var uniqueDaysBasedOnUrl = areaNotifications.First().Notifications.Select(x => x.Url).Distinct().Count();

            Assert.AreEqual(
                expectedNotifications,
                uniqueDaysBasedOnUrl,
                "There should be one driver distance area per day notification regardless of how many records exist for each day.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_across_multiple_days_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_notifications_should_be_sorted_by_day_from_oldest_to_newest()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            var notifications = areaNotifications.First().Notifications;

            var expectedOrderOfNotifications = notifications.OrderBy(x => x.Url).Select(x => x.Url);

            Assert.IsTrue(
                expectedOrderOfNotifications.SequenceEqual(notifications.Select(x => x.Url)),
                "The list of driver distance area per day notifications should be in descending order by date.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_notification_area_name_should_be_set_correctly()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceNotificationAreaService = CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            var translations = new Mx.Web.UI.Areas.Core.Api.Models.Notifications.L10N();

            var notificationArea = areaNotifications.First().Name;

            Assert.AreEqual(
                translations.DriverDistanceArea,
                notificationArea,
                "The notification area name should be a localizable translation.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_notification_url_should_be_set_correctly()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords();

            var driverDistanceQueryServiceMock = new Mock<IDriverDistanceQueryService>(MockBehavior.Strict);

            driverDistanceQueryServiceMock
                .Setup(x => x.GetActionableByEntityIdForDateRange(
                    EntityIdWithActionableDriverDistanceRecords,
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>()))
                .Returns(new [] { new DriverDistanceResponse { TripBusinessDay = _currentDate } });

            var driverDistanceNotificationAreaService =
                CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser, driverDistanceQueryServiceMock);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            string expectedUrl = String.Format(DriverDistanceNotificationAreaService.DriverDistanceUrl, _currentDate.DateStr());
            var notificationUrl = areaNotifications.First().Notifications.First().Url;

            Assert.AreEqual(
                expectedUrl,
                notificationUrl,
                "The notification url should map to the Driver Distance controller with the date as a route parameter.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_an_actionable_driver_distance_record_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_notification_title_should_be_set_correctly()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords("en-AU");

            var driverDistanceQueryServiceMock = new Mock<IDriverDistanceQueryService>(MockBehavior.Strict);

            driverDistanceQueryServiceMock
                .Setup(x => x.GetActionableByEntityIdForDateRange(
                    EntityIdWithActionableDriverDistanceRecords,
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>()))
                .Returns(new[] { new DriverDistanceResponse { TripBusinessDay = _currentDate } });

            var driverDistanceNotificationAreaService =
                CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser, driverDistanceQueryServiceMock);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            var translations = new Mx.Web.UI.Areas.Core.Api.Models.Notifications.L10N();

            string expectedTitle =
                String.Format(
                    "1 {0} {1}",
                    translations.DriverDistanceRecordAwaitingApproval,
                    _currentDate.DateStr(businessUser.Culture));
            var notificationTitle = areaNotifications.First().Notifications.First().Title;

            Assert.AreEqual(
                expectedTitle,
                notificationTitle,
                "The notification title should include the number of records and the date, with proper localization.");
        }

        [TestMethod]
        public void Given_the_current_user_has_the_required_permissions_and_the_entity_has_multiple_actionable_driver_distance_records_When_getting_driver_distance_notification_area_notifications_Then_the_driver_distance_notification_area_list_notification_title_should_be_set_correctly()
        {
            var businessUser = CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords("en-GB");

            var driverDistanceQueryServiceMock = new Mock<IDriverDistanceQueryService>(MockBehavior.Strict);

            driverDistanceQueryServiceMock
                .Setup(x => x.GetActionableByEntityIdForDateRange(
                    EntityIdWithActionableDriverDistanceRecords,
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>()))
                .Returns(Enumerable.Repeat(new DriverDistanceResponse { TripBusinessDay = _currentDate }, 3));

            var driverDistanceNotificationAreaService =
                CreateDriverDistanceNotificationAreaServiceUnderTest(businessUser, driverDistanceQueryServiceMock);

            var areaNotifications = driverDistanceNotificationAreaService.GetNotificationAreas();

            var translations = new Mx.Web.UI.Areas.Core.Api.Models.Notifications.L10N();

            string expectedTitle =
                String.Format(
                    "{0} {1} {2}",
                    3,
                    translations.DriverDistanceRecordsAwaitingApproval,
                    _currentDate.DateStr(businessUser.Culture));
            var notificationTitle = areaNotifications.First().Notifications.First().Title;

            Assert.AreEqual(
                expectedTitle,
                notificationTitle,
                "The notification title should include the number of records and the date, with proper localization.");
        }

        #region User Scenarios

        private static BusinessUser CreateUserWithoutPermissionsLoggedInToStoreWithoutActionableDriverDistanceRecords()
        {
            return new BusinessUser
            {
                MobileSettings = new MobileSettings { EntityId = EntityIdWithoutActionableDriverDistanceRecords },
                Permission = new Permissions { AllowedTasks = new List<Task>() }
            };
        }

        private static BusinessUser CreateUserWithoutPermissionsLoggedInToStoreWithActionableDriverDistanceRecords()
        {
            return new BusinessUser
            {
                MobileSettings = new MobileSettings { EntityId = EntityIdWithActionableDriverDistanceRecords },
                Permission = new Permissions { AllowedTasks = new List<Task>() }
            };
        }

        private static BusinessUser CreateUserWithRequiredPermissionsLoggedInToStoreWithoutActionableDriverDistanceRecords()
        {
            return new BusinessUser
            {
                MobileSettings = new MobileSettings { EntityId = EntityIdWithoutActionableDriverDistanceRecords },
                Permission = _requiredPermissionsToReceiveDriverDistanceAreaNotifications
            };
        }

        private static BusinessUser CreateUserWithRequiredPermissionsLoggedInToStoreWithActionableDriverDistanceRecords(
            String culture = null)
        {
            return new BusinessUser
            {
                Culture = culture ?? CultureInfo.InvariantCulture.Name,
                MobileSettings = new MobileSettings { EntityId = EntityIdWithActionableDriverDistanceRecords },
                Permission = _requiredPermissionsToReceiveDriverDistanceAreaNotifications
            };
        }

        #endregion

        private static DriverDistanceNotificationAreaService CreateDriverDistanceNotificationAreaServiceUnderTest(
            BusinessUser businessUser,
            Mock<IDriverDistanceQueryService> driverDistanceQueryServiceMock = null)
        {
            driverDistanceQueryServiceMock = driverDistanceQueryServiceMock ?? _driverDistanceQueryServiceMock;

            return new DriverDistanceNotificationAreaService(
                GetAuthenticationServiceMock(businessUser).Object,
                driverDistanceQueryServiceMock.Object,
                _entityTimeQueryServiceMock.Object,
                _translationServiceMock.Object);
        }

        #region Mocks

        private static Mock<IAuthenticationService> GetAuthenticationServiceMock(BusinessUser businessUser)
        {
            var authenticationServiceMock = new Mock<IAuthenticationService>(MockBehavior.Strict);

            authenticationServiceMock
                .Setup(s => s.User)
                .Returns(businessUser);

            return authenticationServiceMock;
        }

        private static Mock<IDriverDistanceQueryService> GetDriverDistanceQueryServiceMock()
        {
            var driverDistanceQueryServiceMock = new Mock<IDriverDistanceQueryService>(MockBehavior.Strict);

            driverDistanceQueryServiceMock
                .Setup(x => x.GetActionableByEntityIdForDateRange(
                    EntityIdWithoutActionableDriverDistanceRecords,
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>()))
                .Returns(Enumerable.Empty<DriverDistanceResponse>());

            driverDistanceQueryServiceMock
                .Setup(x => x.GetActionableByEntityIdForDateRange(
                    EntityIdWithActionableDriverDistanceRecords,
                    It.IsAny<DateTime>(),
                    It.IsAny<DateTime>()))
                .Returns(_actionableDriverDistanceRecords);

            return driverDistanceQueryServiceMock;
        }

        private static Mock<IEntityTimeQueryService> GetEntityTimeQueryServiceMock()
        {
            var entityTimeQueryService = new Mock<IEntityTimeQueryService>(MockBehavior.Strict);

            entityTimeQueryService
                .Setup(s => s.GetCurrentStoreTime(It.IsAny<Int64>()))
                .Returns(_currentDate);

            return entityTimeQueryService;
        }

        private static Mock<ITranslationService> GetTranslationServiceMock()
        {
            var translationServiceMock = new Mock<ITranslationService>(MockBehavior.Strict);

            translationServiceMock
                .Setup(s => s.Translate<UI.Areas.Core.Api.Models.Notifications.L10N>(It.IsAny<String>()))
                .Returns(new UI.Areas.Core.Api.Models.Notifications.L10N());

            return translationServiceMock;
        }

        #endregion
    }
}