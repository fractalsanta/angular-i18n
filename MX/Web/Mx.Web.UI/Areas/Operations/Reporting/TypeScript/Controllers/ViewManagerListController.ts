module Operations.Reporting {
    "use strict";

    class ViewManagerListController {

        private _reportTypeId: Api.Models.ReportType;

        constructor(private scope: IViewManagerListControllerScope
            , private stateService: ng.ui.IStateService
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            , private $authService: Core.Auth.IAuthService
            , private location: ng.ILocationService
            , private viewService: IViewService
            , private routeParams: IViewManagerRouteParams
            ) {
            if (routeParams.ReportTypeId != null) {
                this._reportTypeId = <Api.Models.ReportType>Number(routeParams.ReportTypeId);
            }
            this.viewService.GetViews(this._reportTypeId);
            this.Initialize();
        }


        private Initialize() {

            this.translationService.GetTranslations().then((l10N) => {
                this.scope.L10N = l10N.OperationsReporting;

            });

            this.scope.GetViews = () => this.viewService.GetCachedViews(this._reportTypeId);
            this.scope.IsGlobalShared = (view) => this.viewService.IsGlobalShared(view);
            this.scope.IsAuthorised = (view) => { return !this.viewService.IsGlobalShared(view) || this.viewService.IsAllowedGlobalShared(this._reportTypeId) };

            this.scope.SetDefault = (view: Api.Models.IViewModel) => {
                view.IsDefault = !view.IsDefault;
                this.viewService.SetViewDefaultFlag(view).then(() => {
                    this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: this._reportTypeId }, { reload: true}); 
                });
            };

            this.scope.Back = () => {
                this.location.path("/Operations/Reporting/" + Api.Models.ReportType[this._reportTypeId]);
            }
        }
    }

    export var viewManagerListController = Core.NG.InventoryOrderModule.RegisterNamedController("ViewManagerListController", ViewManagerListController,
        Core.NG.$typedScope<IViewManagerListControllerScope>()
        , Core.NG.$state
        , Core.$translation
        , Core.$popupMessageService
        , Core.Auth.$authService
        , Core.NG.$location
        , viewService
        , Core.NG.$typedStateParams<IViewManagerRouteParams>()
        );
}
