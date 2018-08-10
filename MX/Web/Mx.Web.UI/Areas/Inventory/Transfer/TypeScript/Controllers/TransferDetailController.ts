module Inventory.Transfer {
    "use strict";

    export interface ITransferDetailControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
    }

    export class TransferDetailController {
        constructor(
            $scope: IInitiateTransferControllerScope,
            authService: Core.Auth.IAuthService,
            translationService: Core.ITranslationService,
            notification: Core.IPopupMessageService
            ) {

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var translations = $scope.Translations = result.InventoryTransfer;
                notification.SetPageTitle(translations.TransferDetail);
            });
        }
    }
    Core.NG.InventoryTransferModule.RegisterRouteController("History/:Id", "Templates/TransferDetail.html", TransferDetailController,
        Core.NG.$typedScope<IInitiateTransferControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        Core.$popupMessageService);
}
