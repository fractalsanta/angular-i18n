declare module Operations.Reporting {
    export interface IViewManagerListControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Back(): void;
        SetDefault(view:Api.Models.IViewModel): void;
        GetViews(): Api.Models.IViewModel[];
        IsGlobalShared(view: Api.Models.IViewModel): boolean;
        IsAuthorised(view: Api.Models.IViewModel): boolean;
    }
}
