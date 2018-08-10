declare module Forecasting {
    export interface IEventControllerScope extends ng.IScope {
        L10N: Api.Models.ITranslations;
        SetDetailedView(flag: boolean);
        Vm: {
            DetailedView: boolean;
        }
    }
} 