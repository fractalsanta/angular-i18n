module Forecasting {
    "use strict";

    export interface IForecastingViewControllerScope extends IForecastingControllerScope {
    }

    export class ForecastingViewController {
        constructor(
            private $scope: IForecastingViewControllerScope,
            private $stateParams: IForecastingStateParams
            ) {

            this.Initialize();
        }

        Initialize(): void {
            this.$scope.SelectFilter();
        }
    }

    export var forecastingViewController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingViewController", ForecastingViewController,
        Core.NG.$typedScope<IForecastingViewControllerScope>(),
        Core.NG.$typedStateParams<IForecastingStateParams>()
        );
}