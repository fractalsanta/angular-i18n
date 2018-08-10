module Operations.Reporting {
    "use strict";

    class ViewManagerDetailController {

        private _viewId: number;
        private _reportTypeId: number;
        private _entityId: number;
        private _columns: Api.Models.IReportColumnName[];

        private Initialize() {
            this.scope.Vm = {
                NewView: this._viewId == 0,
                Loaded: false,
                View: {
                    EntityId: 0,
                    UserId: 0,
                    IsDefault: false,
                    ReportType: this._reportTypeId,
                    ViewName: "",
                    ViewId: 0,
                    ColumnIds: []
                },
                ActiveColumns: [],
                InactiveColumns: [],
                IsGlobalShared: false,
                IsAllowedGlobalShared: this.viewService.IsAllowedGlobalShared(this._reportTypeId)
        };

            this.viewService.GetColumns(this._reportTypeId).then((response) => {
                this._columns = response.Columns;
                if (this.scope.Vm.NewView) {
                    this.scope.Vm.View.ColumnIds = response.DefaultColumnIds;
                }
                this.LoadColumns();
            });

            this.translationService.GetTranslations().then((l10N) => {
                this.scope.L10N = l10N.OperationsReporting;
            });

            if (this.scope.Vm.NewView) {
                this.scope.Vm.Loaded = true;
            } else {
                this.viewService.GetView(this._viewId, this._reportTypeId).then(v => {
                    this.scope.Vm.View = v;
                    this.scope.Vm.Loaded = true;
                    this.scope.Vm.IsGlobalShared = this.viewService.IsGlobalShared(v);
                    this.LoadColumns();
                });
            }

            this.scope.SortingOptions = <Core.Directives.IMxSortableOptions>{
                ConnectWith: ".mx-column-container",

                // Check whether a column is empty, if so create a drag point.
                Stop: () => {
                    this.AddDropPoints();
                }
            };
        }

        private AddDropPoints() {
            this.scope.Vm.ActiveColumns = _.filter(this.scope.Vm.ActiveColumns, (x) => { return x.ColumnId != 0; });
            if (this.scope.Vm.ActiveColumns.length == 0) {
                this.scope.Vm.ActiveColumns.push({ ColumnId: 0, ColumnName: this.scope.L10N.VmAddColumns });
            }

            this.scope.Vm.InactiveColumns = _.filter(this.scope.Vm.InactiveColumns, (x) => { return x.ColumnId != 0; });
            if (this.scope.Vm.InactiveColumns.length == 0) {
                this.scope.Vm.InactiveColumns.push({ ColumnId: 0, ColumnName: this.scope.L10N.VmNoAvailableColumns });
            }
        }

        private LoadColumns() {
            if (this._columns) {
                var columnIds = this.scope.Vm.View.ColumnIds;
                this.scope.Vm.ActiveColumns = [];
                _.each(columnIds, (x) => {
                    this.scope.Vm.ActiveColumns.push(_.find(this._columns, (y) => {
                        return x == y.ColumnId;
                    }));
                });

                this.scope.Vm.InactiveColumns = _.filter(this._columns, (x) => {
                    return _.filter(columnIds, (y) => {
                        return x.ColumnId == y;
                    }).length <= 0;
                });
                this.AddDropPoints();
            } else {
                this.scope.Vm.ActiveColumns = [];
                this.scope.Vm.InactiveColumns = [];
            }
        }

        constructor(private scope: IViewManagerDetailControllerScope
            , routeParams: IViewManagerRouteParams
            , private stateService: ng.ui.IStateService
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            , private $authService: Core.Auth.IAuthService
            , private viewService: IViewService
            ) {

            this._entityId = this.$authService.GetUser().BusinessUser.MobileSettings.EntityId;
            this._viewId = Number(routeParams.ViewId);
            this._reportTypeId = Number(routeParams.ReportTypeId);

            this.Initialize();

            this.scope.Back = () => {
                this.stateService.go("^");
            };
            this.scope.Save = () => {
                var view = this.scope.Vm.View;
                if (this.scope.Vm.IsGlobalShared) {
                    view.EntityId = 0;
                    view.UserId = 0;
                }
                else {
                    view.EntityId = this._entityId;
                    view.UserId = this.$authService.GetUser().BusinessUser.Id;
                }

                view.ColumnIds = _.map(_.filter(this.scope.Vm.ActiveColumns, (y) => { return y.ColumnId != 0; }), (x) => { return x.ColumnId; });
                if (view.ColumnIds.length < 1) {
                    return;
                }

                if (this.scope.Vm.NewView) {
                    if (! this.scope.Vm.IsGlobalShared) {
                        view.EntityId = this._entityId;
                    }

                    this.viewService.CreateView(view);
                }
                else {
                    this.viewService.UpdateView(view);
                }
                this.stateService.go('^');
            };

            this.scope.Delete = () => {
                if (! this.scope.Vm.NewView) {
                    this.viewService.DeleteView(this.scope.Vm.View);
                    this.stateService.go('^');
                }
            };
        }
    }

    export var viewManagerDetailController = Core.NG.InventoryOrderModule.RegisterNamedController("ViewManagerDetailController", ViewManagerDetailController
        , Core.NG.$typedScope<IViewManagerDetailControllerScope>()
        , Core.NG.$typedStateParams<IViewManagerRouteParams>()
        , Core.NG.$state
        , Core.$translation
        , Core.$popupMessageService
        , Core.Auth.$authService
        , viewService
        );
}