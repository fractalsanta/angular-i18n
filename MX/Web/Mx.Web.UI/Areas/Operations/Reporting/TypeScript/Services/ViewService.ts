module Operations.Reporting {

    class ViewService implements IViewService {

        private _views: IReportViews[];
        private _columns: ng.IPromise<Api.Models.IColumnResponse>[];
        private _reportViewRequestDeferred: ng.IDeferred<Api.Models.IViewModel[]>;
        private _currentReportType: Api.Models.ReportType;
        private _l10n : Api.Models.IL10N;

        constructor(
            private viewApiService: Api.IViewService
            , private columnApiService: Api.IColumnsService
            , private authService: Core.Auth.IAuthService
            , private constants: Core.IConstants
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            ) {
            this.Initialise();
        }

        Initialise() {
            this._views = [];
            this._columns = [];
            this.translationService.GetTranslations().then((x) => {
                this._l10n = x.OperationsReporting;
            });
        }

        GetCachedViews(reportType: Api.Models.ReportType) {

            var reportViews = _.find(this._views, v => v.ReportType == reportType);
            return reportViews != null ? reportViews.Views : null;
        }

        GetColumns(reportType: Api.Models.ReportType) {
            if (! this._columns[reportType]) {
                this._columns[reportType] = this.columnApiService.Get(reportType).then(result => result.data);
            }
            return this._columns[reportType];
        }

        GetViews(reportType: Api.Models.ReportType) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var promise = this.viewApiService.GetReportViews(entityId, reportType).then(result => {

                var reportViews = _.find(this._views, v => v.ReportType == reportType);
                if (reportViews != null) {
                    reportViews.Views = result.data;
                    return reportViews.Views;
                } else {
                    reportViews = <IReportViews>{
                        ReportType: reportType,
                        Views: result.data
                    }
                    this._views.push(reportViews);
                    return reportViews.Views;
                }
            });
            return promise;
        }

        GetCachedView(viewId: number) {
            var views = _.flatten(this._views, v => v.Views);
            return _.find(views, v => v.ViewId == viewId);
        }

        GetView(viewId: number, reportType: Api.Models.ReportType) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var promise = this.viewApiService.GetView(entityId, viewId, reportType).then(result => result.data);
            return promise;
        }


        CreateView(view: Api.Models.IViewModel) {
            // First view inserted should be default.
            var views = this.GetCachedViews(view.ReportType);
            if ( views == null || views.length == 0 ) {
                view.IsDefault = true;
            }

            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var promise = this.viewApiService.PostCreateView(entityId, view);
            promise.then((result) => {
                this.popupMessageService.ShowSuccess(this._l10n.VmCreated.format(view.ViewName));
                var reportViews = _.find(this._views, v => v.ReportType == view.ReportType);
                view.ViewId = result.data;
                reportViews.Views.push(view);
            });
            return promise;
        }

        UpdateView(view: Api.Models.IViewModel) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var promise = this.viewApiService.PutUpdateView(entityId, view);
            promise.then(() => {
                this.popupMessageService.ShowSuccess(this._l10n.VmUpdated.format(view.ViewName));
                this.GetViews(view.ReportType);
            });
            return promise;
        }

        DeleteView(view: Api.Models.IViewModel) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var promise = this.viewApiService.DeleteView(entityId, view.ViewId, view.ReportType);

            promise.then(() => {
                this.GetViews(view.ReportType);
                this.popupMessageService.ShowSuccess(this._l10n.VmDeleted.format(view.ViewName));
            });

            return promise;
        }

        SetViewDefaultFlag(view: Api.Models.IViewModel) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            var promise = this.viewApiService.PutUpdateView(entityId, view);
            promise.then(() => {
                this.GetViews(view.ReportType);
            });
            return promise;
        }

        IsGlobalShared(view: Api.Models.IViewModel) {
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
            return view.EntityId != entityId && view.UserId === 0;
        }

        IsAllowedGlobalShared(reportType: Api.Models.ReportType): boolean {
            switch (reportType) {
                case Api.Models.ReportType.StoreSummary:
                    return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_StoreSummary_CanCreateSharedViews);

                case Api.Models.ReportType.AreaSummary:
                    return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_AreaSummary_CanCreateSharedViews);

                case Api.Models.ReportType.InventoryMovement:
                    return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_InventoryMovement_CanAccess);

                case Api.Models.ReportType.ProductMix:
                    return this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_ProductMix_CanCreateSharedViews);
            }
            return false;
        }

    }

    viewService = Core.NG.OperationsReportingModule.RegisterService("ViewService", ViewService
        , Api.$viewService
        , Api.$columnsService
        , Core.Auth.$authService
        , Core.Constants
        , Core.$translation
        , Core.$popupMessageService
        );
}