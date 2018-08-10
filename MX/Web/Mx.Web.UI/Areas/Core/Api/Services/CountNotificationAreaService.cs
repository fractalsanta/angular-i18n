using System.Collections.Generic;
using System.Linq;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public class CountNotificationAreaService : INotificationAreaService
    {
        private readonly IInventoryLocationQueryService _locationQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITranslationService _translationService;

        public CountNotificationAreaService(
            IAuthenticationService authenticationService,
            IInventoryLocationQueryService locationQueryService,
            ITranslationService translationService) 
        {
            _authenticationService = authenticationService;
            _locationQueryService = locationQueryService;
            _translationService = translationService;
        }

        public IEnumerable<NotificationArea> GetNotificationAreas()
        {
            var user = _authenticationService.User;
            return GetTravelPathNotifications(user);
        }

        private IEnumerable<NotificationArea> GetTravelPathNotifications(BusinessUser user)
        {
            var l10N = _translationService.Translate<Models.Notifications.L10N>(user.Culture);

            var requiredTasks = new[]
            {
                Task.Inventory_TravelPath_CanDeleteItem,
                Task.Inventory_TravelPath_CanDeleteLocation,
                Task.Inventory_TravelPath_SpotFrequency_CanView,
                Task.Inventory_TravelPath_DailyFrequency_CanView,
                Task.Inventory_TravelPath_PeriodicFrequency_CanView,
                Task.Inventory_TravelPath_MonthlyFrequency_CanView
            };

            if (!requiredTasks.Intersect(user.Permission.AllowedTasks).Any())
            {
                yield break;
            }

            if (_locationQueryService.DoesNewItemLocationHaveItems(user.MobileSettings.EntityId))
            {
                yield return new NotificationArea
                {
                    Name = l10N.InventoryCount,
                    Notifications = new[]
                    {
                        new Notification
                        {
                            Title = l10N.InventoryTravelPathItemsToAdd,
                            Url = "#/Inventory/Count/TravelPath"
                        }
                    }
                };
            }
        }
    }
}