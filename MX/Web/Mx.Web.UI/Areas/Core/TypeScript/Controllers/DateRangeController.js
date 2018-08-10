var Core;
(function (Core) {
    "use strict";
    var DateRangeController = (function () {
        function DateRangeController($scope, $modalInstance, dateRange, minMaxDateRange, translationService, dateRangeOptions) {
            if (dateRangeOptions && dateRangeOptions.SetDefaultDates) {
                $scope.EndDate = (dateRange && dateRange.EndDate) || moment().toDate();
                $scope.StartDate = (dateRange && dateRange.StartDate) || moment().add("d", -14).toDate();
            }
            else {
                $scope.EndDate = (dateRange && dateRange.EndDate);
                $scope.StartDate = (dateRange && dateRange.StartDate);
            }
            $scope.MinDate = (minMaxDateRange && minMaxDateRange.StartDate);
            $scope.MaxDate = (minMaxDateRange && minMaxDateRange.EndDate);
            $scope.Translations = {};
            $scope.Cancel = function () {
                $modalInstance.dismiss();
            };
            $scope.Confirm = function (startDate, endDate) {
                $modalInstance.close({ StartDate: startDate, EndDate: endDate });
            };
            $scope.DisableStartDate = function () {
                return dateRangeOptions && dateRangeOptions.DisableStartDate;
            };
            translationService.GetTranslations().then(function (result) {
                $scope.Translations = result.Core;
            });
        }
        return DateRangeController;
    }());
    Core.NG.CoreModule.RegisterNamedController("DateRangeController", DateRangeController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$typedCustomResolve("dateRange"), Core.NG.$typedCustomResolve("minMaxDateRange"), Core.$translation, Core.NG.$typedCustomResolve("dateRangeOptions"));
})(Core || (Core = {}));
