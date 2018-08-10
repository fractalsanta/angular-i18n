var Forecasting;
(function (Forecasting) {
    "use strict";
    var EditTypes = (function () {
        function EditTypes() {
        }
        EditTypes.Override = "override";
        EditTypes.Percentage = "percentage";
        return EditTypes;
    }());
    var EditForecastController = (function () {
        function EditForecastController($scope, $modalInstance, $filter, $translation, $timeout, $locale, targetPropertyValue, metric, isCurrency) {
            var currencySymbol = metric === Forecasting.Services.MetricType.Sales ? $locale.NUMBER_FORMATS.CURRENCY_SYM : "";
            $translation.GetTranslations().then(function (result) {
                $scope.Translations = result.Forecasting;
                switch (metric) {
                    case Forecasting.Services.MetricType.Sales: {
                        $scope.Title = $scope.Translations.EditSalesTitle;
                        break;
                    }
                    case Forecasting.Services.MetricType.Transactions: {
                        $scope.Title = $scope.Translations.EditTransactionCountTitle;
                        break;
                    }
                    case Forecasting.Services.MetricType.SalesItems: {
                        $scope.Title = $scope.Translations.SalesitemEditTitle;
                        break;
                    }
                    case Forecasting.Services.MetricType.Events: {
                        $scope.Title = $scope.Translations.EditEventManuallyTitle;
                        break;
                    }
                    default: {
                        $scope.Title = $scope.Translations.ForecastEditTitle;
                        break;
                    }
                }
            });
            targetPropertyValue = parseInt(targetPropertyValue, 10);
            $scope.Metric = metric;
            $scope.FormData = {
                OriginalValue: targetPropertyValue,
                NewValue: (isCurrency ? $filter("currencyNoDecimalOrComma")(targetPropertyValue) : targetPropertyValue),
                PercentChange: 0,
                IsCurrency: isCurrency,
                EditType: EditTypes.Override
            };
            if ($scope.Metric == Forecasting.Services.MetricType.Events) {
                $scope.FormData.EditType = EditTypes.Percentage;
            }
            $scope.IsEmpty = function () {
                var stringValue = "" + $scope.FormData.NewValue, stringPercentChange = "" + $scope.FormData.PercentChange;
                if (stringValue === currencySymbol) {
                    return true;
                }
                if ($scope.FormData.EditType === EditTypes.Percentage && stringPercentChange === '%') {
                    return true;
                }
                return false;
            };
            $scope.UpdatePercent = function () {
                var newValue = Number(String($scope.FormData.NewValue).replace(/[^0-9,.]/g, ""));
                var percDelta = ((newValue - $scope.FormData.OriginalValue) / $scope.FormData.OriginalValue) * 100;
                percDelta = ($filter("number")(percDelta, 2));
                if (percDelta !== $scope.FormData.PercentChange) {
                    $scope.FormData.PercentChange = percDelta;
                }
            };
            $scope.UpdateValue = function () {
                var percentChange = Number(String($scope.FormData.PercentChange).replace(/(?!^-)[^0-9,.]/g, "")) / 100;
                var newValue = Math.round($scope.FormData.OriginalValue + ($scope.FormData.OriginalValue * percentChange));
                if (isNaN(newValue)) {
                    newValue = $scope.FormData.OriginalValue;
                }
                if ($scope.FormData.IsCurrency) {
                    $scope.FormData.NewValue = $filter('currencyNoDecimalOrComma')(newValue);
                }
                else {
                    $scope.FormData.NewValue = newValue;
                }
            };
            $scope.FormatPercentage = function () {
                var newValue = Math.round($scope.FormData.OriginalValue + ($scope.FormData.OriginalValue * ($scope.FormData.PercentChange / 100)));
                if (newValue !== $scope.FormData.OriginalValue) {
                    var percDelta = (($scope.FormData.NewValue - $scope.FormData.OriginalValue) / $scope.FormData.OriginalValue) * 100;
                    $scope.FormData.PercentChange = $filter("number")(percDelta, 2);
                }
            };
            $scope.Confirm = function () {
                var newValue = Number(String($scope.FormData.NewValue).replace(/[^0-9,.]/g, ""));
                $modalInstance.close(newValue || 0);
            };
            $scope.Cancel = function () {
                $modalInstance.dismiss("cancel");
            };
            $scope.Submit = function () {
                var newValue = Number(String($scope.FormData.NewValue).replace(/[^0-9,.]/g, ""));
                if (newValue !== $scope.FormData.OriginalValue ||
                    $scope.Metric === Forecasting.Services.MetricType.Events) {
                    $modalInstance.close(newValue || 0);
                }
                else {
                    $modalInstance.dismiss("cancel");
                }
            };
            $scope.InputFocus = function (e) {
                var input = $(e.target).parent()
                    .next()
                    .find("input");
                $(e.target).click();
                input[0].focus();
            };
            if (window.isIOSDevice()) {
                var onorientationchange = function () {
                    var act = document.activeElement;
                    if (act && act.tagName === "INPUT") {
                        act.blur();
                    }
                    window.scrollTo(0, 0);
                };
                angular.element(window).on("orientationchange", onorientationchange);
                $modalInstance.result.finally(function () {
                    angular.element(window).off("orientationchange", onorientationchange);
                });
            }
        }
        return EditForecastController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("EditForecastController", EditForecastController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$filter, Core.$translation, Core.NG.$timeout, Core.NG.$locale, Core.NG.$typedCustomResolve("targetPropertyValue"), Core.NG.$typedCustomResolve("metric"), Core.NG.$typedCustomResolve("isCurrency"));
})(Forecasting || (Forecasting = {}));
