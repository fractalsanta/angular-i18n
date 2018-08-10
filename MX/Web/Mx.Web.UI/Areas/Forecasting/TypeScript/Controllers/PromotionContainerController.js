var Forecasting;
(function (Forecasting) {
    "use strict";
    var PromotionContainerController = (function () {
        function PromotionContainerController(scope, translationService, popupMessageService, stateService) {
            this.scope = scope;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.stateService = stateService;
            this.Initialize();
        }
        PromotionContainerController.prototype.Initialize = function () {
            var _this = this;
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.scope.L10N = l10NData.ForecastingPromotions;
                _this.popupMessageService.SetPageTitle(_this.scope.L10N.PageTitle);
            });
            this.scope.IsDetailsView = function () {
                return _this.stateService.current.name === Core.UiRouterState.PromotionStates.Details;
            };
        };
        return PromotionContainerController;
    }());
    Forecasting.promotionContainerController = Core.NG.ForecastingModule.RegisterNamedController("PromotionContainerController", PromotionContainerController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.NG.$state);
})(Forecasting || (Forecasting = {}));
