var Forecasting;
(function (Forecasting) {
    var EventController = (function () {
        function EventController(scope, translationService, popupMessageService) {
            this.scope = scope;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.Initialize();
            scope.SetDetailedView = function (flag) {
                scope.Vm.DetailedView = flag;
            };
        }
        EventController.prototype.Initialize = function () {
            var _this = this;
            this.scope.Vm = { DetailedView: false };
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.scope.L10N = l10NData.Forecasting;
                _this.popupMessageService.SetPageTitle(_this.scope.L10N.EventProfile);
            });
        };
        return EventController;
    }());
    Forecasting.eventsController = Core.NG.ForecastingModule.RegisterNamedController("Events", EventController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService);
})(Forecasting || (Forecasting = {}));
