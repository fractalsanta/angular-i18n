module Forecasting {
    "use strict";

    class PromotionContainerController {
        constructor(private scope: IPromotionContainerControllerScope
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            , private stateService: ng.ui.IStateService
        ) {
            this.Initialize();
        }

        private Initialize(): void {
            this.translationService.GetTranslations().then((l10NData: Core.Api.Models.ITranslations): void => {
                this.scope.L10N = l10NData.ForecastingPromotions;
                this.popupMessageService.SetPageTitle(this.scope.L10N.PageTitle);
            });

            this.scope.IsDetailsView = (): boolean => {
                return this.stateService.current.name === Core.UiRouterState.PromotionStates.Details;
            };
        }
    }

    export var promotionContainerController = Core.NG.ForecastingModule.RegisterNamedController("PromotionContainerController"
        , PromotionContainerController
        , Core.NG.$typedScope<IPromotionContainerControllerScope>()
        , Core.$translation
        , Core.$popupMessageService
        , Core.NG.$state
        );
} 