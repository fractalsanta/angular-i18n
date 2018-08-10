using System;
using System.Collections.Generic;
using System.Linq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Services
{
    public class DriverDistanceNotificationAreaService : INotificationAreaService
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IDriverDistanceQueryService _driverDistanceQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ITranslationService _translationService;

        private BusinessUser _user;
        private Core.Api.Models.Notifications.L10N _translations;

        internal const String DriverDistanceUrl = "#/Workforce/DriverDistance/{0}";

        internal static readonly IEnumerable<Task> RequiredPermissions = new[]
        {
            Task.Labor_EmployeePortal_DriverDistance_CanAuthorise,
            Task.Labor_EmployeePortal_DriverDistance_CanView,
            Task.Labor_EmployeePortal_DriverDistance_CanViewOthersEntries
        };

        private static IEnumerable<NotificationArea> EmptyResult = Enumerable.Empty<NotificationArea>();
        
        public DriverDistanceNotificationAreaService(
            IAuthenticationService authenticationService,
            IDriverDistanceQueryService driverDistanceQueryService,
            IEntityTimeQueryService entityTimeQueryService,
            ITranslationService translationService)
        {
            _authenticationService = authenticationService;
            _driverDistanceQueryService = driverDistanceQueryService;
            _entityTimeQueryService = entityTimeQueryService;
            _translationService = translationService;
        }

        public IEnumerable<NotificationArea> GetNotificationAreas()
        {
            _user = _authenticationService.User;

            if (!CanReceiveNotifications(_user))
            {
                return EmptyResult;
            }

            var actionableDriverDistanceRecords = GetActionableDriverDistanceRecords();
            if (!actionableDriverDistanceRecords.Any())
            {
                return EmptyResult;
            }

            var groupedActionableDriverDistanceRecords =
                GroupActionableDriverDistanceRecordsByDay(actionableDriverDistanceRecords);
            
            _translations = _translationService.Translate<Core.Api.Models.Notifications.L10N>(_user.Culture);

            return new [] { GetDriverDistanceAreaNotification(groupedActionableDriverDistanceRecords) };
        }

        private NotificationArea GetDriverDistanceAreaNotification(
            IEnumerable<IGrouping<DateTime, DriverDistanceResponse>> groupedActionableDriverDistanceRecords)
        { 
            var driverDistanceAreaNotification = new NotificationArea
            {
                Name = _translations.DriverDistanceArea,
                Notifications = CreateNotificationPerDay(groupedActionableDriverDistanceRecords)
            };

            return driverDistanceAreaNotification;
        }

        private IEnumerable<Notification> CreateNotificationPerDay(
            IEnumerable<IGrouping<DateTime, DriverDistanceResponse>> groupedActionableDriverDistanceRecords)
        {
            foreach (var actionableDriverDistanceRecordsByDay in groupedActionableDriverDistanceRecords)
            {
                var numberOfRecordsRequiringAction = actionableDriverDistanceRecordsByDay.Count();
                var dateRouteParameter = actionableDriverDistanceRecordsByDay.Key.DateStr();
                var localizedDateString = actionableDriverDistanceRecordsByDay.Key.DateStr(_user.Culture);
                var title = numberOfRecordsRequiringAction == 1
                    ? String.Format(
                        "1 {0} {1}", _translations.DriverDistanceRecordAwaitingApproval, localizedDateString)
                    : String.Format(
                        "{0} {1} {2}",
                        numberOfRecordsRequiringAction,
                        _translations.DriverDistanceRecordsAwaitingApproval,
                        localizedDateString);

                yield return new Notification { Title = title, Url = String.Format(DriverDistanceUrl, dateRouteParameter) };
            }
        }

        private IEnumerable<DriverDistanceResponse> GetActionableDriverDistanceRecords()
        {
            var entityId = _user.MobileSettings.EntityId;
            var currentDate = _entityTimeQueryService.GetCurrentStoreTime(entityId).Date;
            var startDate = currentDate.AddDays(-6);
            var endDate = currentDate;

            var result = _driverDistanceQueryService.GetActionableByEntityIdForDateRange(entityId, startDate, endDate);
            return result;
        }

        private static Boolean CanReceiveNotifications(BusinessUser user)
        {
            Boolean canViewNotifications = !RequiredPermissions.Except(user.Permission.AllowedTasks).Any();
            return canViewNotifications;
        }

        private static IEnumerable<IGrouping<DateTime, DriverDistanceResponse>> GroupActionableDriverDistanceRecordsByDay(
            IEnumerable<DriverDistanceResponse> actionableDriverDistanceRecords)
        {
            var query =
                from driverDistanceRecord in actionableDriverDistanceRecords
                group driverDistanceRecord by driverDistanceRecord.TripBusinessDay into g
                orderby g.Key
                select g;
            return query;
        }
    }
}