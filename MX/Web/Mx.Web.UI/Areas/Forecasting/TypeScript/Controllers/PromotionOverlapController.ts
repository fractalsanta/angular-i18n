module Forecasting {
    "use strict";

    export interface IPromotionOverlapScope extends ng.IScope {
        L10N: Api.Models.IPromotionTranslations;
        Overlaps: Api.Models.IPromotionOverlap[];
        PromotionName: string;
        Close(): void;
        Cancel(): void;
    }

    export class PromotionOverlapController {
        constructor(
              scope: IPromotionOverlapScope
            , modalInstance: ng.ui.bootstrap.IModalServiceInstance
            , l10N: Api.Models.IPromotionTranslations
            , overlaps: Api.Models.IPromotionOverlap[]
            , promotionName: string
        ) {
            scope.L10N = l10N;
            scope.Overlaps = overlaps;
            scope.PromotionName = promotionName;

            scope.Close = () => modalInstance.close();
            scope.Cancel = () => modalInstance.dismiss();
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("PromotionOverlapController"
        , PromotionOverlapController
        , Core.NG.$typedScope<IPromotionOverlapScope>()
        , Core.NG.$modalInstance
        , Core.NG.$typedCustomResolve<Api.Models.IPromotionTranslations>("L10N")
        , Core.NG.$typedCustomResolve <Api.Models.IPromotionOverlap[]>("Overlaps")
        , Core.NG.$typedCustomResolve<string>("PromotionName")
    );
}