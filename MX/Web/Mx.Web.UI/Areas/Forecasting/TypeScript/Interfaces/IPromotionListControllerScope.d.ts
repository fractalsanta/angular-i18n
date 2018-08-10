declare module Forecasting {
    export interface IPromotionListControllerScope extends Core.Directives.IMxGridHeaderScope {
        L10N: Api.Models.IPromotionTranslations;
        RequiresPaging(): boolean;
        ChangePage(page: number): void;
        OpenDateRange(): void;
        Vm: {
            FilterText: string;
            DateRange: Core.IDateRange;

            Promotions: Api.Models.IPromotionListItem[];
            FilteredPromotions: Api.Models.IPromotionListItem[];
            CurrentPagePromotions: Api.Models.IPromotionListItem[];

            PagingOptions: ng.ui.bootstrap.IPaginationConfig;
            CurrentPage: number;
        }
    }
}    