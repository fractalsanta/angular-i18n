var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        "use strict";
        var ViewManagerDetailController = (function () {
            function ViewManagerDetailController(scope, routeParams, stateService, translationService, popupMessageService, $authService, viewService) {
                var _this = this;
                this.scope = scope;
                this.stateService = stateService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.$authService = $authService;
                this.viewService = viewService;
                this._entityId = this.$authService.GetUser().BusinessUser.MobileSettings.EntityId;
                this._viewId = Number(routeParams.ViewId);
                this._reportTypeId = Number(routeParams.ReportTypeId);
                this.Initialize();
                this.scope.Back = function () {
                    _this.stateService.go("^");
                };
                this.scope.Save = function () {
                    var view = _this.scope.Vm.View;
                    if (_this.scope.Vm.IsGlobalShared) {
                        view.EntityId = 0;
                        view.UserId = 0;
                    }
                    else {
                        view.EntityId = _this._entityId;
                        view.UserId = _this.$authService.GetUser().BusinessUser.Id;
                    }
                    view.ColumnIds = _.map(_.filter(_this.scope.Vm.ActiveColumns, function (y) { return y.ColumnId != 0; }), function (x) { return x.ColumnId; });
                    if (view.ColumnIds.length < 1) {
                        return;
                    }
                    if (_this.scope.Vm.NewView) {
                        if (!_this.scope.Vm.IsGlobalShared) {
                            view.EntityId = _this._entityId;
                        }
                        _this.viewService.CreateView(view);
                    }
                    else {
                        _this.viewService.UpdateView(view);
                    }
                    _this.stateService.go('^');
                };
                this.scope.Delete = function () {
                    if (!_this.scope.Vm.NewView) {
                        _this.viewService.DeleteView(_this.scope.Vm.View);
                        _this.stateService.go('^');
                    }
                };
            }
            ViewManagerDetailController.prototype.Initialize = function () {
                var _this = this;
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
                this.viewService.GetColumns(this._reportTypeId).then(function (response) {
                    _this._columns = response.Columns;
                    if (_this.scope.Vm.NewView) {
                        _this.scope.Vm.View.ColumnIds = response.DefaultColumnIds;
                    }
                    _this.LoadColumns();
                });
                this.translationService.GetTranslations().then(function (l10N) {
                    _this.scope.L10N = l10N.OperationsReporting;
                });
                if (this.scope.Vm.NewView) {
                    this.scope.Vm.Loaded = true;
                }
                else {
                    this.viewService.GetView(this._viewId, this._reportTypeId).then(function (v) {
                        _this.scope.Vm.View = v;
                        _this.scope.Vm.Loaded = true;
                        _this.scope.Vm.IsGlobalShared = _this.viewService.IsGlobalShared(v);
                        _this.LoadColumns();
                    });
                }
                this.scope.SortingOptions = {
                    ConnectWith: ".mx-column-container",
                    Stop: function () {
                        _this.AddDropPoints();
                    }
                };
            };
            ViewManagerDetailController.prototype.AddDropPoints = function () {
                this.scope.Vm.ActiveColumns = _.filter(this.scope.Vm.ActiveColumns, function (x) { return x.ColumnId != 0; });
                if (this.scope.Vm.ActiveColumns.length == 0) {
                    this.scope.Vm.ActiveColumns.push({ ColumnId: 0, ColumnName: this.scope.L10N.VmAddColumns });
                }
                this.scope.Vm.InactiveColumns = _.filter(this.scope.Vm.InactiveColumns, function (x) { return x.ColumnId != 0; });
                if (this.scope.Vm.InactiveColumns.length == 0) {
                    this.scope.Vm.InactiveColumns.push({ ColumnId: 0, ColumnName: this.scope.L10N.VmNoAvailableColumns });
                }
            };
            ViewManagerDetailController.prototype.LoadColumns = function () {
                var _this = this;
                if (this._columns) {
                    var columnIds = this.scope.Vm.View.ColumnIds;
                    this.scope.Vm.ActiveColumns = [];
                    _.each(columnIds, function (x) {
                        _this.scope.Vm.ActiveColumns.push(_.find(_this._columns, function (y) {
                            return x == y.ColumnId;
                        }));
                    });
                    this.scope.Vm.InactiveColumns = _.filter(this._columns, function (x) {
                        return _.filter(columnIds, function (y) {
                            return x.ColumnId == y;
                        }).length <= 0;
                    });
                    this.AddDropPoints();
                }
                else {
                    this.scope.Vm.ActiveColumns = [];
                    this.scope.Vm.InactiveColumns = [];
                }
            };
            return ViewManagerDetailController;
        }());
        Reporting.viewManagerDetailController = Core.NG.InventoryOrderModule.RegisterNamedController("ViewManagerDetailController", ViewManagerDetailController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$state, Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Reporting.viewService);
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
