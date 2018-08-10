module Forecasting {
    "use strict";

    export interface IForecastingEditControllerScope extends IForecastingControllerScope {
        ShowForecastFilters: boolean;
        ShowSelectEditableFilterWarning(): boolean;

        Model: {
            FilterId?: number;
        }
    }

    export class ForecastingEditController {
        constructor(
            private $scope: IForecastingEditControllerScope,
            private $rootScope: ng.IRootScopeService,
            private $stateParams: IForecastingStateParams,
            private $modal: ng.ui.bootstrap.IModalService
            ) {

            $scope.ShowSelectEditableFilterWarning = (): boolean => {
                var fo = $scope.GetForecastObject(),
                    options: Services.IForecastingOptions = this.$scope.GetForecastingOptions(),
                    show = false;

                show = $scope.ShowForecastFilters
                    && !($scope.Vm.Filters && $scope.Vm.Filters.length && $scope.Vm.Filters[0].IsForecastEditableViaGroup)
                    && (!options.Filter || !options.Filter.IsForecastEditableViaGroup)
                    && !(this.$scope.IsSalesItems && !this.$scope.GetSalesItems().SelectedSalesItem);

                if (show && fo) {
                    fo.IsLocked = true;
                }

                return show;
            };

            $scope.$watch("GetForecastObject()", ( newValue: Services.IForecastObject ): void => {
                if (newValue && $scope.ShowSelectEditableFilterWarning()) {
                    newValue.IsLocked = true;
                }
            }, false);

            $scope.$watch("GetForecastingOptions()", (
                    newValue: Services.IForecastingOptions, oldValue: Services.IForecastingOptions): void => {
                this.$scope.ShowForecastFilters = newValue && newValue.Filters && newValue.Filters.length !== 0;

                if (newValue && newValue.Filter) {
                    this.$scope.Model.FilterId = newValue.Filter.Id;
                }
            }, true);

            this.Initialize();
        }

        Initialize(): void {
            this.$scope.ShowForecastFilters = false;

            this.$scope.Model = {};
        }
    }

    export var forecastingEditController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingEditController", ForecastingEditController,
        Core.NG.$typedScope<IForecastingEditControllerScope>(),
        Core.NG.$rootScope,
        Core.NG.$typedStateParams<IForecastingStateParams>(),
        Core.NG.$modal
        );
}
