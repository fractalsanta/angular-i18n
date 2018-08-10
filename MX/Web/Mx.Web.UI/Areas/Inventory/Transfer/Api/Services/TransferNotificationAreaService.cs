using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Translations;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Services
{
    public class TransferNotificationAreaService : INotificationAreaService
    {
        private readonly ITransferQueryService _transferQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITranslationService _translationService;

        private const String TransferOutURL = "#/Inventory/Transfer/OpenTransfers";

        public TransferNotificationAreaService(
            IAuthenticationService authenticationService,
            ITransferQueryService transferQueryService,
            ITranslationService translationService) 
        {
            _authenticationService = authenticationService;
            _transferQueryService = transferQueryService;
            _translationService = translationService;
        }

        public IEnumerable<NotificationArea> GetNotificationAreas()
        {
            var user = _authenticationService.User;
            return GetTransferNotifications(user);
        }

        private IEnumerable<NotificationArea> GetTransferNotifications(BusinessUser user)
        {
            Boolean userHasPermissionToRequestTransferIn = UserHasPermissionToPerformTransferIn(user);
            Boolean userHasPermissionToCreateTransferOut = UserHasPermissionToPerformTransferOut(user);
            Boolean hasTransfersToReceive = false;
            Boolean hasTransfersToApprove = false;

            if (!(userHasPermissionToRequestTransferIn || userHasPermissionToCreateTransferOut))
            {
                yield break;
            }

            NotificationArea transferNotificationArea;

            if (userHasPermissionToRequestTransferIn)
            {
                hasTransfersToApprove = StoreHasTransfersToApprove(user.MobileSettings.EntityId);
            }
            if (userHasPermissionToCreateTransferOut)
            {
                hasTransfersToReceive = StoreHasTransfersToReceive(user.MobileSettings.EntityId);
            }

            if (hasTransfersToApprove || hasTransfersToReceive)
            {
                transferNotificationArea = GetTransferNotificationArea(user, hasTransfersToApprove, hasTransfersToReceive);

                yield return transferNotificationArea;
            }
        }

        private Boolean UserHasPermissionToPerformTransferIn(BusinessUser user)
        {
            var requiredPermissions = new[] { Task.Inventory_Transfers_CanRequestTransferIn };

            var userHasRequiredPermissions = requiredPermissions.Intersect(user.Permission.AllowedTasks).Any();

            return userHasRequiredPermissions;
        }

        private Boolean UserHasPermissionToPerformTransferOut(BusinessUser user)
        {
            var requiredPermissions = new[] { Task.Inventory_Transfers_CanCreateTransferOut };

            var userHasRequiredPermissions = requiredPermissions.Intersect(user.Permission.AllowedTasks).Any();

            return userHasRequiredPermissions;
        }


        private Boolean StoreHasTransfersToApprove(Int64 entityId)
        {
            var transfersExist = _transferQueryService.DoesStoreHaveTransferRequestsToApprove(entityId);

            return transfersExist;                
        }

        private Boolean StoreHasTransfersToReceive(Int64 entityId)
        {
            var transfersExist = _transferQueryService.DoesStoreHaveTransfersToReceive(entityId);

            return transfersExist;
        }

        private NotificationArea GetTransferNotificationArea(BusinessUser user, Boolean hasTransfersToApprove,
            Boolean hasTransfersToReceive)
        {
            var translate = _translationService.Translate<Core.Api.Models.Notifications.L10N>(user.Culture);

            String title = String.Empty;
            if (hasTransfersToApprove && hasTransfersToReceive)
            {
                title = translate.InventoryTransferNeedsAction;
            }
            else if (hasTransfersToApprove)
            {
                title = translate.InventoryTransferNeedsApproval;
            }
            else if (hasTransfersToReceive)
            {
                title = translate.InventoryTransferNeedsToBeReceived;
            }

            var transferNotificationArea = new NotificationArea
            {
                Name = translate.InventoryTransfer,
                Notifications = new[]
                    {
                        new Notification
                        {
                            Title = title,
                            Url = TransferOutURL
                        }
                    }
            };

            return transferNotificationArea;
        }
    }
}