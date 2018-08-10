var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        "use strict";
        var ViewManagerContainerController = (function () {
            function ViewManagerContainerController(scope, stateService, translationService, popupMessageService) {
                this.scope = scope;
                this.stateService = stateService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.Initialize();
            }
            ViewManagerContainerController.prototype.Initialize = function () {
                var _this = this;
                this.translationService.GetTranslations().then(function (l10N) {
                    _this.scope.L10N = l10N.OperationsReporting;
                    _this.popupMessageService.SetPageTitle(_this.scope.L10N.ViewManager);
                });
                this.scope.IsDetailedState = function () {
                    return (_this.stateService.current.name === Core.UiRouterState.ViewManagerStates.Details);
                };
            };
            return ViewManagerContainerController;
        }());
        Reporting.viewManagerContainerController = Core.NG.InventoryOrderModule.RegisterNamedController("ViewManagerContainerController", ViewManagerContainerController, Core.NG.$typedScope(), Core.NG.$state, Core.$translation, Core.$popupMessageService);
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
