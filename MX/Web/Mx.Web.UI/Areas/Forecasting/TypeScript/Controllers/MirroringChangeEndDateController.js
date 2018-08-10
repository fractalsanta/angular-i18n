var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringChangeEndDateController = (function () {
        function MirroringChangeEndDateController($scope, modalInstance, translationService, mirroringService, interval) {
            this.$scope = $scope;
            this.modalInstance = modalInstance;
            this.translationService = translationService;
            this.mirroringService = mirroringService;
            this.interval = interval;
            $scope.Cancel = function () { return modalInstance.dismiss(); };
            $scope.OK = function () {
                interval.TargetDateEndDate = $scope.Model.DatePickerOptions.Date;
                interval.OverwriteManager = $scope.Model.Interval.OverwriteManager;
                mirroringService.CalculateDates(interval);
                var result = { Interval: interval };
                modalInstance.close(result);
            };
            var CheckDatesEqual = function (d1, d2) {
                return (d1.getFullYear() === d2.getFullYear()) && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
            };
            this.$scope.CanSave = function () {
                return !CheckDatesEqual($scope.Model.DatePickerOptions.Date, interval.TargetDateEndDate) ||
                    $scope.Model.Interval.OverwriteManager !== interval.OverwriteManager;
            };
            this.$scope.EndDateChanged = function (d) {
                $scope.Model.Interval.TargetDateEndDate = d;
                mirroringService.CalculateDates($scope.Model.Interval);
            };
            this.$scope.SourceDateRangeBeforeTarget = function () {
                if ($scope.Model.Interval.SourceDateEndDate < moment($scope.Model.Interval.TargetDateStartDate).toDate()) {
                    return true;
                }
                return false;
            };
            this.Initialize();
        }
        MirroringChangeEndDateController.prototype.Initialize = function () {
            this.$scope.Model = {
                L10N: null,
                EndDate: this.interval.TargetDateEndDate,
                DatePickerOptions: {
                    Date: this.interval.TargetDateEndDate,
                    DayOffset: 1,
                    MonthOffset: 0,
                    Min: this.interval.TargetDateStartDate
                },
                Interval: _.cloneDeep(this.interval)
            };
            this.GetL10N();
        };
        MirroringChangeEndDateController.prototype.GetL10N = function () {
            var model = this.$scope.Model;
            this.translationService.GetTranslations().then(function (l10NData) {
                model.L10N = l10NData.Forecasting;
            });
        };
        return MirroringChangeEndDateController;
    }());
    Forecasting.MirroringChangeEndDateController = MirroringChangeEndDateController;
    Forecasting.mirroringChangeEndDateController = Core.NG.ForecastingModule.RegisterNamedController("MirroringChangeEndDateController", MirroringChangeEndDateController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Forecasting.Services.$mirroringService, Core.NG.$typedCustomResolve("Interval"));
})(Forecasting || (Forecasting = {}));
