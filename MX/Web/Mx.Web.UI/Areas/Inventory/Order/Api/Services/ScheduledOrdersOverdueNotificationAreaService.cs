using System;
using System.Collections.Generic;
using System.Linq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Services
{
    public class ScheduledOrdersOverdueNotificationAreaService : INotificationAreaService
    {
        private readonly IOrderQueryService _orderQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ITranslationService _translationService;

        public ScheduledOrdersOverdueNotificationAreaService(
            IAuthenticationService authenticationService,
            IOrderQueryService orderQueryService,
            IEntityTimeQueryService entityTimeQueryService,
            ITranslationService translationService) 
        {
            _authenticationService = authenticationService;
            _orderQueryService = orderQueryService;
            _entityTimeQueryService = entityTimeQueryService;
            _translationService = translationService;
        }

        public IEnumerable<NotificationArea> GetNotificationAreas()
        {
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Core.Api.Models.Notifications.L10N>(user.Culture);

            var requiredTasks = new[]
            {
                Task.Inventory_Ordering_CanView,
                Task.Inventory_Ordering_CanCreate,
                Task.Inventory_Ordering_Place_CanView
            };

            if (!requiredTasks.All(t => user.Permission.AllowedTasks.Contains(t)))
            {
                yield break;
            }

            var entityId = user.MobileSettings.EntityId;
            var now = _entityTimeQueryService.GetCurrentStoreTime(entityId);
            var fromDate = now.Date.AddDays(-Models.Constants.OverdueScheduledOrdersNumDaysToShow);
            var toDate = now.Date.AddDays(1);
            var scheduledOrdersPast2Days =
                _orderQueryService.GetOverdueScheduledOrdersByDateRange(entityId, fromDate, toDate).ToList();

            if (scheduledOrdersPast2Days.Any())
            {
                yield return new NotificationArea
                {
                    Name = l10N.ScheduledOrders,
                    Notifications = new[]
                    {
                        new Notification
                        {
                            Title = String.Format(l10N.ScheduledOrdersDueToBePlaced, scheduledOrdersPast2Days.Count()),
                            Url = "#/Inventory/Order/ScheduledOverdue"
                        }
                    }
                };
            }
        }
    }
}