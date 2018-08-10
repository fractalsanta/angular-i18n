var Forecasting;
(function (Forecasting) {
    Core.NG.ForecastingModule.RegisterMasterPublicDetailPage("Promotions", "Promotions", "/:Id", { controller: Forecasting.promotionContainerController, templateUrl: "Templates/PromotionContainer.html" }, { controller: Forecasting.promotionListController, templateUrl: "Templates/PromotionList.html" }, { controller: Forecasting.promotionDetailsController, templateUrl: "Templates/PromotionDetails.html" }, "List", "Details");
})(Forecasting || (Forecasting = {}));
