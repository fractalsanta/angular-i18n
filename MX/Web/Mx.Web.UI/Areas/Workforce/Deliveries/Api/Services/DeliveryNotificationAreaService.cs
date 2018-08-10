using System.Collections.Generic;
using System.Linq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Translations;
using Mx.Deliveries.Services.Contracts.QueryServices;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api.Services
{
    public class DeliveryNotificationService : INotificationAreaService
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ITranslationService _translationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ITransactionDeliveryQueryService _deliveryService;

        public DeliveryNotificationService(
            IAuthenticationService authenticationService,
            ITranslationService translationService,
            IEntityTimeQueryService entityTimeQueryService,
            ITransactionDeliveryQueryService deliveryService)
        {
            _authenticationService = authenticationService;
            _translationService = translationService;
            _entityTimeQueryService = entityTimeQueryService;
            _deliveryService = deliveryService;
        }

        public IEnumerable<NotificationArea> GetNotificationAreas()
        {
            var user = _authenticationService.User;
            return GetExtraDeliveryNotifications(user).ToList();
        }

        private IEnumerable<NotificationArea> GetExtraDeliveryNotifications(BusinessUser user)
        {
            var l10N = _translationService.Translate<Core.Api.Models.Notifications.L10N>(user.Culture);
            var currentDate = _entityTimeQueryService.GetCurrentStoreTime(user.MobileSettings.EntityId).Date;
            var startDate = currentDate.AddDays(-7);

            var requiredTasks = new[]
            {
                Task.Labor_EmployeePortal_Deliveries_CanView,
                Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries,
                Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise
            };

            if (requiredTasks.Intersect(user.Permission.AllowedTasks).Count() != requiredTasks.Count())
            {
                yield break;
            }

            var needToNotify = _deliveryService.GetByEntityAndDateRange(user.MobileSettings.EntityId, startDate, currentDate)
                    .Any(tdr => tdr.DeliveryType == TransactionDeliveryType.Extra
                                && tdr.Status == TransactionDeliveryStatus.Pending);

            if (needToNotify)
            {
                yield return new NotificationArea
                {
                    Name = l10N.ExtraDelivery,
                    Notifications = new[]
                    {
                        new Notification
                        {
                            Title = l10N.ExtraDeliveriesAwaitingApproval,
                            Url = "#/Workforce/Deliveries"
                        }
                    }
                };
            }
        }

    }
}