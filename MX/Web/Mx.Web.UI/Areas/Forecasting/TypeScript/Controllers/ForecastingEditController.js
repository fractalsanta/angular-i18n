var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastingEditController = (function () {
        function ForecastingEditController($scope, $rootScope, $stateParams, $modal) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$stateParams = $stateParams;
            this.$modal = $modal;
            $scope.ShowSelectEditableFilterWarning = function () {
                var fo = $scope.GetForecastObject(), options = _this.$scope.GetForecastingOptions(), show = false;
                show = $scope.ShowForecastFilters
                    && !($scope.Vm.Filters && $scope.Vm.Filters.length && $scope.Vm.Filters[0].IsForecastEditableViaGroup)
                    && (!options.Filter || !options.Filter.IsForecastEditableViaGroup)
                    && !(_this.$scope.IsSalesItems && !_this.$scope.GetSalesItems().SelectedSalesItem);
                if (show && fo) {
                    fo.IsLocked = true;
                }
                return show;
            };
            $scope.$watch("GetForecastObject()", function (newValue) {
                if (newValue && $scope.ShowSelectEditableFilterWarning()) {
                    newValue.IsLocked = true;
                }
            }, false);
            $scope.$watch("GetForecastingOptions()", function (newValue, oldValue) {
                _this.$scope.ShowForecastFilters = newValue && newValue.Filters && newValue.Filters.length !== 0;
                if (newValue && newValue.Filter) {
                    _this.$scope.Model.FilterId = newValue.Filter.Id;
                }
            }, true);
            this.Initialize();
        }
        ForecastingEditController.prototype.Initialize = function () {
            this.$scope.ShowForecastFilters = false;
            this.$scope.Model = {};
        };
        return ForecastingEditController;
    }());
    Forecasting.ForecastingEditController = ForecastingEditController;
    Forecasting.forecastingEditController = Core.NG.ForecastingModule.RegisterNamedController("ForecastingEditController", ForecastingEditController, Core.NG.$typedScope(), Core.NG.$rootScope, Core.NG.$typedStateParams(), Core.NG.$modal);
})(Forecasting || (Forecasting = {}));
