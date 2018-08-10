var Forecasting;
(function (Forecasting) {
    "use strict";
    var EvaluatorGridController = (function () {
        function EvaluatorGridController($scope, $translation) {
            $translation.GetTranslations().then(function (results) {
                $scope.Translations = results.Forecasting;
            });
            $scope.$watch("Options.SeriesEvaluationData", function (newValue) {
                if (newValue) {
                    $scope.Evaluations = newValue[0].data;
                }
            }, false);
        }
        return EvaluatorGridController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("EvaluatorGridController", EvaluatorGridController, Core.NG.$typedScope(), Core.$translation);
    var EvaluatorGrid = (function () {
        function EvaluatorGrid() {
            return {
                restrict: "E",
                scope: {
                    Options: "=options"
                },
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/EvaluatorGridDirective.html",
                controller: "Forecasting.EvaluatorGridController"
            };
        }
        return EvaluatorGrid;
    }());
    Core.NG.ForecastingModule.RegisterDirective("evaluatorGrid", EvaluatorGrid);
})(Forecasting || (Forecasting = {}));
