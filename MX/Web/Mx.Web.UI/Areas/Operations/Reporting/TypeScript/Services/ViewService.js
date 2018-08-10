var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var ViewService = (function () {
            function ViewService(viewApiService, columnApiService, authService, constants, translationService, popupMessageService) {
                this.viewApiService = viewApiService;
                this.columnApiService = columnApiService;
                this.authService = authService;
                this.constants = constants;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.Initialise();
            }
            ViewService.prototype.Initialise = function () {
                var _this = this;
                this._views = [];
                this._columns = [];
                this.translationService.GetTranslations().then(function (x) {
                    _this._l10n = x.OperationsReporting;
                });
            };
            ViewService.prototype.GetCachedViews = function (reportType) {
                var reportViews = _.find(this._views, function (v) { return v.ReportType == reportType; });
                return reportViews != null ? reportViews.Views : null;
            };
            ViewService.prototype.GetColumns = function (reportType) {
                if (!this._columns[reportType]) {
                    this._columns[reportType] = this.columnApiService.Get(reportType).then(function (result) { return result.data; });
                }
                return this._columns[reportType];
            };
            ViewService.prototype.GetViews = function (reportType) {
                var _this = this;
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var promise = this.viewApiService.GetReportViews(entityId, reportType).then(function (result) {
                    var reportViews = _.find(_this._views, function (v) { return v.ReportType == reportType; });
                    if (reportViews != null) {
                        reportViews.Views = result.data;
                        return reportViews.Views;
                    }
                    else {
                        reportViews = {
                            ReportType: reportType,
                            Views: result.data
                        };
                        _this._views.push(reportViews);
                        return reportViews.Views;
                    }
                });
                return promise;
            };
            ViewService.prototype.GetCachedView = function (viewId) {
                var views = _.flatten(this._views, function (v) { return v.Views; });
                return _.find(views, function (v) { return v.ViewId == viewId; });
            };
            ViewService.prototype.GetView = function (viewId, reportType) {
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var promise = this.viewApiService.GetView(entityId, viewId, reportType).then(function (result) { return result.data; });
                return promise;
            };
            ViewService.prototype.CreateView = function (view) {
                var _this = this;
                var views = this.GetCachedViews(view.ReportType);
                if (views == null || views.length == 0) {
                    view.IsDefault = true;
                }
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var promise = this.viewApiService.PostCreateView(entityId, view);
                promise.then(function (result) {
                    _this.popupMessageService.ShowSuccess(_this._l10n.VmCreated.format(view.ViewName));
                    var reportViews = _.find(_this._views, function (v) { return v.ReportType == view.ReportType; });
                    view.ViewId = result.data;
                    reportViews.Views.push(view);
                });
                return promise;
            };
            ViewService.prototype.UpdateView = function (view) {
                var _this = this;
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var promise = this.viewApiService.PutUpdateView(entityId, view);
                promise.then(function () {
                    _this.popupMessageService.ShowSuccess(_this._l10n.VmUpdated.format(view.ViewName));
                    _this.GetViews(view.ReportType);
                });
                return promise;
            };
            ViewService.prototype.DeleteView = function (view) {
                var _this = this;
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var promise = this.viewApiService.DeleteView(entityId, view.ViewId, view.ReportType);
                promise.then(function () {
                    _this.GetViews(view.ReportType);
                    _this.popupMessageService.ShowSuccess(_this._l10n.VmDeleted.format(view.ViewName));
                });
                return promise;
            };
            ViewService.prototype.SetViewDefaultFlag = function (view) {
                var _this = this;
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var promise = this.viewApiService.PutUpdateView(entityId, view);
                promise.then(function () {
                    _this.GetViews(view.ReportType);
                });
                return promise;
            };
            ViewService.prototype.IsGlobalShared = function (view) {
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                return view.EntityId != entityId && view.UserId === 0;
            };
            ViewService.prototype.IsAllowedGlobalShared = function (reportType) {
                switch (reportType) {
                    case Reporting.Api.Models.ReportType.StoreSummary:
                        return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_StoreSummary_CanCreateSharedViews);
                    case Reporting.Api.Models.ReportType.AreaSummary:
                        return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_AreaSummary_CanCreateSharedViews);
                    case Reporting.Api.Models.ReportType.InventoryMovement:
                        return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_InventoryMovement_CanAccess);
                    case Reporting.Api.Models.ReportType.ProductMix:
                        return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_ProductMix_CanCreateSharedViews);
                }
                return false;
            };
            return ViewService;
        }());
        Reporting.viewService = Core.NG.OperationsReportingModule.RegisterService("ViewService", ViewService, Reporting.Api.$viewService, Reporting.Api.$columnsService, Core.Auth.$authService, Core.Constants, Core.$translation, Core.$popupMessageService);
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
