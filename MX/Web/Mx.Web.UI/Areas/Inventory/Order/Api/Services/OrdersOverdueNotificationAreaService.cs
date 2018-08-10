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
    public class OrdersOverdueNotificationAreaService : INotificationAreaService
    {
        private const int DaysToCheck = 14;
        private const int MaxIndividualNotifications = 3;

        private readonly IOrderQueryService _orderQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ITranslationService _translationService;

        public OrdersOverdueNotificationAreaService(
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
            return GetOutstandingOrders(user);
        }

        private IEnumerable<NotificationArea> GetOutstandingOrders(BusinessUser user)
        {
            var l10N = _translationService.Translate<Core.Api.Models.Notifications.L10N>(user.Culture);

            var requiredTasks = new[]
            {
                Task.Inventory_Ordering_CanView,
                Task.Inventory_Ordering_Receive_CanView,
                Task.Inventory_Receiving_CanReceive
            };

            if (requiredTasks.Intersect(user.Permission.AllowedTasks).Count() != requiredTasks.Length)
            {
                yield break;
            }

            var entityId = user.MobileSettings.EntityId;
            var now = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            // orders are time based so the following will pick up all orders due until now (not by date).
            var orders = _orderQueryService.GetPlacedOrders(entityId, now.Date.AddDays(-DaysToCheck), now).ToList();

            if (orders.Any())
            {
                var list = orders.OrderBy(x => x.DeliveryDate)
                    .Take(MaxIndividualNotifications)
                    .Select(order => new Notification
                    {
                        Title = String.Format(l10N.OverdueOrderLayout, order.DisplayId, order.VendorName),
                        Url = "#/Inventory/Order/Receive/Details/" + order.DisplayId
                    })
                    .ToList();

                if (orders.Count() > MaxIndividualNotifications)
                {
                    list.Add(new Notification
                    {
                        Title = l10N.ClickForMore,
                        Url = "#/Inventory/Order/Receive"
                    });
                }

                yield return new NotificationArea
                {
                    Name = l10N.OverdueOrderReceipts,
                    Notifications = list.ToArray()
                };
            }

        }
    }
}