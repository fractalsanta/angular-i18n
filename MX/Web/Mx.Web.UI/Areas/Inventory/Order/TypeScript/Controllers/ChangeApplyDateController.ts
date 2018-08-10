module Inventory.Order {
    "use strict";

    export class ChangeApplyDateController extends BaseApplyDateController {

        constructor(
            $scope: IChangeApplyDateControllerScope,
            instance: ng.ui.bootstrap.IModalServiceInstance,
            translationService: Core.ITranslationService,
            periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService,
            authService: Core.Auth.IAuthService,
            receiveOrderService: IReceiveOrderService,
            constants: Core.IConstants
            ) {
            super($scope, instance, translationService, periodCloseService, authService, receiveOrderService, constants);
        }
    }

    Core.NG.InventoryOrderModule.RegisterNamedController("ChangeApplyDate", ChangeApplyDateController,
        Core.NG.$typedScope<IChangeApplyDateControllerScope>()
        , Core.NG.$modalInstance
        , Core.$translation
        , Workforce.PeriodClose.Api.$periodCloseService
        , Core.Auth.$authService
        , $receiveOrderService
        , Core.Constants
        );
}