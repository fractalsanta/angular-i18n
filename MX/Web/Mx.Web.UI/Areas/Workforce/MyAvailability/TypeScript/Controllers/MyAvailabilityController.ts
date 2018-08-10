module Workforce.MyAvailability {

    class MyAvailabilityController {

        constructor(
            private scope: IMyAvailabilityControllerScope,
            private myAvailabilityService: IMyAvailabilityService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService

            ) {

            scope.Vm = { DetailedView: false };

            translationService.GetTranslations().then((l10NData) => {
                scope.L10N = l10NData.WorkforceMyAvailability;
                popupMessageService.SetPageTitle(scope.L10N.MyAvailability);
            });

            myAvailabilityService.ResetMyAvailabilityDaySelection();

            scope.GetSelectedMyAvailabilityDay = () => {
                return myAvailabilityService.GetSelectedMyAvailabilityDay();
            }

            scope.SetDetailedView = (flag: boolean) => {
                scope.Vm.DetailedView = flag;
            }           
        }
    }

    Core.NG.WorkforceMyAvailabilityModule.RegisterRouteController("", "Templates/MyAvailability.html", MyAvailabilityController,
        Core.NG.$typedScope<IMyAvailabilityControllerScope>(),
        myAvailabilityService,
        Core.$translation,
        Core.$popupMessageService
        );

}