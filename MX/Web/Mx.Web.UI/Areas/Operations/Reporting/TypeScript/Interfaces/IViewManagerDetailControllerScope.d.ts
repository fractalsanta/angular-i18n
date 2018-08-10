declare module Operations.Reporting {
    export interface IViewManagerDetailControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;

        // Actions
        Save(): void;
        Delete(): void;
        Back(): void;
        GlobalShareClick(): void;
        SortingOptions: Core.Directives.IMxSortableOptions;

        Vm: {
            IsGlobalShared: boolean;
            IsAllowedGlobalShared: boolean;
            NewView: boolean;
            Loaded: boolean;
            View: Api.Models.IViewModel;
            InactiveColumns: Api.Models.IReportColumnName[];
            ActiveColumns: Api.Models.IReportColumnName[];
        };
    }
}
