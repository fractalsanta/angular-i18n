module Operations.Reporting {
    "use strict";

    class ViewManagerContainerController {

        private Initialize() {
            this.translationService.GetTranslations().then((l10N) => {
                this.scope.L10N = l10N.OperationsReporting;
                this.popupMessageService.SetPageTitle(this.scope.L10N.ViewManager);
            });

            this.scope.IsDetailedState = () => {
                return (this.stateService.current.name === Core.UiRouterState.ViewManagerStates.Details);
            }
        }

        constructor(private scope: IViewManagerControllerScope
            , private stateService: ng.ui.IStateService
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
        ) {
            this.Initialize();
        }
    }

    export var viewManagerContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("ViewManagerContainerController", ViewManagerContainerController,
        Core.NG.$typedScope<IViewManagerControllerScope>()
        , Core.NG.$state
        , Core.$translation
        , Core.$popupMessageService
        );
}