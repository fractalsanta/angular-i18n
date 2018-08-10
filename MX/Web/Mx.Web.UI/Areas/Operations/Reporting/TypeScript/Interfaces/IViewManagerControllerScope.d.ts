declare module Operations.Reporting {
    export interface IViewManagerControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        IsDetailedState(): boolean
        Vm: {
            ShowViewManager: boolean;
        };
    }
}
