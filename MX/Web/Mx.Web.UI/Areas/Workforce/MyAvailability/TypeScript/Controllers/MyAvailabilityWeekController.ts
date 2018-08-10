module Workforce.MyAvailability {

    interface IMyAvailabilityWeekControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;

        GetAvailability(): Api.Models.IAvailability;
        GetDayAvailability(): Api.Models.IDayAvailability[];
        GetColorCode(day: Api.Models.IDayAvailability): string;
        SelectMyAvailabilityDay(myAvailablityDay: Api.Models.IDayAvailability): void;        
    }

    class MyAvailabilityWeekController {

        private _availability: Api.Models.IAvailability;

        constructor(
            private scope: IMyAvailabilityWeekControllerScope,
            private authService: Core.Auth.IAuthService,
            private myAvailablityService: IMyAvailabilityService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private modal: ng.ui.bootstrap.IModalService
        ) {

            translationService.GetTranslations().then((l10NData) => {
                scope.L10N = l10NData.WorkforceMyAvailability;                
            });

            myAvailablityService.GetAvailabilityPromise().then(result => {
                this._availability = result.data;
            });

            scope.GetAvailability = () => {
                return this._availability;
            }

            scope.GetColorCode = (day: Api.Models.IDayAvailability) => {
                if (day != null && day.Times != null) {
                    if (day.Times.length > 0) {
                        return "green";
                    }
                }
                return "red";
            }

            scope.SelectMyAvailabilityDay = (myAvailablityDay: Api.Models.IDayAvailability) => {
                myAvailablityService.SelectMyAvailabilityDay(myAvailablityDay);
            }

            scope.GetDayAvailability = () => {
                if (myAvailablityService.GetAvailability() != null && myAvailablityService.GetAvailability().AvailableDays != null) {
                    return myAvailablityService.GetAvailability().AvailableDays;
                }
                return null;
            }
        }
    }

    Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityWeekController", MyAvailabilityWeekController,
        Core.NG.$typedScope<IMyAvailabilityWeekControllerScope>(),
        Core.Auth.$authService,
        myAvailabilityService,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$modal
        );
}
