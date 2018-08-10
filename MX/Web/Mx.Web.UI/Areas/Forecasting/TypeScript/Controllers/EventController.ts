module Forecasting {

    class EventController {
        constructor(
            private scope: IEventControllerScope,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService) {

            this.Initialize();

            scope.SetDetailedView = (flag: boolean) => {
                scope.Vm.DetailedView = flag;
            };       
        }

        private Initialize() {
            this.scope.Vm = { DetailedView: false };

            this.translationService.GetTranslations().then((l10NData) => {
                this.scope.L10N = l10NData.Forecasting;
                this.popupMessageService.SetPageTitle(this.scope.L10N.EventProfile);
            });
        }
    }

    export var eventsController = Core.NG.ForecastingModule.RegisterNamedController("Events", EventController,
        Core.NG.$typedScope<IEventControllerScope>(),
        Core.$translation,
        Core.$popupMessageService);
}