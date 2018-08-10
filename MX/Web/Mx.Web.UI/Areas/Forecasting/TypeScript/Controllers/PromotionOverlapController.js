var Forecasting;
(function (Forecasting) {
    "use strict";
    var PromotionOverlapController = (function () {
        function PromotionOverlapController(scope, modalInstance, l10N, overlaps, promotionName) {
            scope.L10N = l10N;
            scope.Overlaps = overlaps;
            scope.PromotionName = promotionName;
            scope.Close = function () { return modalInstance.close(); };
            scope.Cancel = function () { return modalInstance.dismiss(); };
        }
        return PromotionOverlapController;
    }());
    Forecasting.PromotionOverlapController = PromotionOverlapController;
    Core.NG.ForecastingModule.RegisterNamedController("PromotionOverlapController", PromotionOverlapController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$typedCustomResolve("L10N"), Core.NG.$typedCustomResolve("Overlaps"), Core.NG.$typedCustomResolve("PromotionName"));
})(Forecasting || (Forecasting = {}));
