declare module Operations.Reporting {

    export interface IViewService {
        GetView(viewId: number, reportType: Api.Models.ReportType): ng.IPromise<Api.Models.IViewModel>;
        GetCachedView(viewId: number): Api.Models.IViewModel;
        GetCachedViews(reportType: Api.Models.ReportType): Api.Models.IViewModel[];
        GetViews(reportType: Api.Models.ReportType): ng.IPromise<Api.Models.IViewModel[]>;
        GetColumns(reportType: Api.Models.ReportType): ng.IPromise<Api.Models.IColumnResponse>;

        CreateView(view: Api.Models.IViewModel): ng.IHttpPromise<{}>;
        UpdateView(view: Api.Models.IViewModel): ng.IHttpPromise<{}>;
        DeleteView(view: Api.Models.IViewModel): ng.IHttpPromise<{}>;
        SetViewDefaultFlag(view: Api.Models.IViewModel): ng.IHttpPromise<{}>;
        IsGlobalShared(view: Api.Models.IViewModel): boolean;
        IsAllowedGlobalShared(reportType: Api.Models.ReportType): boolean;
    }

    export var viewService: Core.NG.INamedService<IViewService>;
} 