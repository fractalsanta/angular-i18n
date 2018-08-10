module Forecasting {
    "use strict";

    interface IEvaluatorGridScope extends ng.IScope {
        Options: IEvaluatorOptions;
        Translations: Api.Models.ITranslations;
        Evaluations: any;
    }

    class EvaluatorGridController {
        constructor(
            $scope: IEvaluatorGridScope,
            $translation: Core.ITranslationService
            ) {

            $translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.Forecasting;
            });

            $scope.$watch("Options.SeriesEvaluationData", (newValue: any): void => {
                if (newValue) {
                    $scope.Evaluations = newValue[0].data;
                }
            }, false); 
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("EvaluatorGridController", EvaluatorGridController,
        Core.NG.$typedScope<IEvaluatorGridScope>(),
        Core.$translation);

    class EvaluatorGrid implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    Options: "=options"
                },
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/EvaluatorGridDirective.html",
                controller: "Forecasting.EvaluatorGridController"
            };
        }
    }

    Core.NG.ForecastingModule.RegisterDirective("evaluatorGrid", EvaluatorGrid);
}