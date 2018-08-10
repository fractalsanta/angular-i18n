var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        "use strict";
        var ViewManagerListController = (function () {
            function ViewManagerListController(scope, stateService, translationService, popupMessageService, $authService, location, viewService, routeParams) {
                this.scope = scope;
                this.stateService = stateService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.$authService = $authService;
                this.location = location;
                this.viewService = viewService;
                this.routeParams = routeParams;
                if (routeParams.ReportTypeId != null) {
                    this._reportTypeId = Number(routeParams.ReportTypeId);
                }
                this.viewService.GetViews(this._reportTypeId);
                this.Initialize();
            }
            ViewManagerListController.prototype.Initialize = function () {
                var _this = this;
                this.translationService.GetTranslations().then(function (l10N) {
                    _this.scope.L10N = l10N.OperationsReporting;
                });
                this.scope.GetViews = function () { return _this.viewService.GetCachedViews(_this._reportTypeId); };
                this.scope.IsGlobalShared = function (view) { return _this.viewService.IsGlobalShared(view); };
                this.scope.IsAuthorised = function (view) { return !_this.viewService.IsGlobalShared(view) || _this.viewService.IsAllowedGlobalShared(_this._reportTypeId); };
                this.scope.SetDefault = function (view) {
                    view.IsDefault = !view.IsDefault;
                    _this.viewService.SetViewDefaultFlag(view).then(function () {
                        _this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: _this._reportTypeId }, { reload: true });
                    });
                };
                this.scope.Back = function () {
                    _this.location.path("/Operations/Reporting/" + Reporting.Api.Models.ReportType[_this._reportTypeId]);
                };
            };
            return ViewManagerListController;
        }());
        Reporting.viewManagerListController = Core.NG.InventoryOrderModule.RegisterNamedController("ViewManagerListController", ViewManagerListController, Core.NG.$typedScope(), Core.NG.$state, Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Core.NG.$location, Reporting.viewService, Core.NG.$typedStateParams());
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
