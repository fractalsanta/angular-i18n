module Forecasting {

    Core.NG.ForecastingModule.RegisterMasterPublicDetailPage("Promotions", "Promotions", "/:Id"
        , { controller: promotionContainerController, templateUrl: "Templates/PromotionContainer.html" }
        , { controller: promotionListController, templateUrl: "Templates/PromotionList.html" }
        , { controller: promotionDetailsController, templateUrl: "Templates/PromotionDetails.html" }
        , "List", "Details"
        );
}  