var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastingViewController = (function () {
        function ForecastingViewController($scope, $stateParams) {
            this.$scope = $scope;
            this.$stateParams = $stateParams;
            this.Initialize();
        }
        ForecastingViewController.prototype.Initialize = function () {
            this.$scope.SelectFilter();
        };
        return ForecastingViewController;
    }());
    Forecasting.ForecastingViewController = ForecastingViewController;
    Forecasting.forecastingViewController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingViewController", ForecastingViewController, Core.NG.$typedScope(), Core.NG.$typedStateParams());
})(Forecasting || (Forecasting = {}));
