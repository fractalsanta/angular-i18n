declare module Forecasting {
    export interface IPromotionContainerControllerScope extends ng.IScope {
        L10N: Api.Models.IPromotionTranslations;
        IsDetailsView(): boolean;
        SetDetailsView(flag: boolean): void;
        Vm: {
            DetailsView: boolean;
        }
    }
}  