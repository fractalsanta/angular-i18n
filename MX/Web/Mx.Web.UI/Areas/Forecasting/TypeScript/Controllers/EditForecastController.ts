module Forecasting {
    "use strict";

    class EditTypes {
        static Override = "override";
        static Percentage = "percentage";
    }

    interface IEditForm {
        OriginalValue: number;
        NewValue: number;
        PercentChange: number;
        IsCurrency: boolean;
        EditType: string;
    }

    interface IEditForecastControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        Title: string;
        FormData: IEditForm;
        Metric: string;

        IsEmpty(): boolean;
        UpdatePercent(): void;
        UpdateValue(): void;
        FormatPercentage(): void;
        InputFocus(e: Event): void;

        Confirm(): void;
        Cancel(): void;
        Submit(): void;
    }

    interface IOSWindow extends Window {
        onorientationchange(): void;
    }

    class EditForecastController {

        constructor(
            $scope: IEditForecastControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            $filter: ng.IFilterService,
            $translation: Core.ITranslationService,
            $timeout: ng.ITimeoutService,
            $locale: ng.ILocaleService,
            targetPropertyValue: any,
            metric: string,
            isCurrency: boolean) {

            var currencySymbol: string = metric === Forecasting.Services.MetricType.Sales ? $locale.NUMBER_FORMATS.CURRENCY_SYM : "";

            $translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
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
            $scope.FormData = <IEditForm>{
                OriginalValue: <number>targetPropertyValue,
                NewValue: (isCurrency ? (<ng.IFilterNumber>$filter("currencyNoDecimalOrComma"))(<number>targetPropertyValue) : <number>targetPropertyValue),
                PercentChange: 0,
                IsCurrency: isCurrency,
                EditType: EditTypes.Override
            };
            if ($scope.Metric == Forecasting.Services.MetricType.Events) {
                $scope.FormData.EditType = EditTypes.Percentage;
            }
            
            $scope.IsEmpty = (): boolean => {
                var stringValue: string = "" + $scope.FormData.NewValue,
                    stringPercentChange: string = "" + $scope.FormData.PercentChange;

                if (stringValue === currencySymbol) {
                    return true;
                }

                if ($scope.FormData.EditType === EditTypes.Percentage && stringPercentChange === '%') {
                    return true;
                }

                return false;
            };

            $scope.UpdatePercent = (): void => {
                var newValue = Number(String($scope.FormData.NewValue).replace(/[^0-9,.]/g, ""));

                var percDelta = ((newValue - $scope.FormData.OriginalValue) / $scope.FormData.OriginalValue) * 100;
                percDelta = <any>($filter("number")(percDelta, 2));

                if (percDelta !== $scope.FormData.PercentChange) {
                    $scope.FormData.PercentChange = percDelta;
                }
            };

            $scope.UpdateValue = (): void => {
                var percentChange = Number(String($scope.FormData.PercentChange).replace(/(?!^-)[^0-9,.]/g, "")) / 100;
                var newValue = Math.round($scope.FormData.OriginalValue + ($scope.FormData.OriginalValue * percentChange));

                if (isNaN(newValue)) {
                    newValue = $scope.FormData.OriginalValue;
                }          
 
                if ($scope.FormData.IsCurrency) {
                    $scope.FormData.NewValue = (<any>(<ng.IFilterNumber>$filter('currencyNoDecimalOrComma'))(newValue));
                } else {
                    $scope.FormData.NewValue = newValue;
                }
            };

            $scope.FormatPercentage = (): void => {
                var newValue = Math.round($scope.FormData.OriginalValue + ($scope.FormData.OriginalValue * ($scope.FormData.PercentChange / 100)));

                if (newValue !== $scope.FormData.OriginalValue) {
                    var percDelta = (($scope.FormData.NewValue - $scope.FormData.OriginalValue) / $scope.FormData.OriginalValue) * 100;
                    $scope.FormData.PercentChange = (<any>$filter("number")(percDelta, 2));
                }
            };

            $scope.Confirm = (): void => {
                var newValue = Number(String($scope.FormData.NewValue).replace(/[^0-9,.]/g, ""));

                $modalInstance.close(newValue || 0);
            };

            $scope.Cancel = (): void => {
                $modalInstance.dismiss("cancel");
            };

            $scope.Submit = (): void => {
                var newValue = Number(String($scope.FormData.NewValue).replace(/[^0-9,.]/g, ""));

                if (newValue !== $scope.FormData.OriginalValue ||
                    $scope.Metric === Forecasting.Services.MetricType.Events) {
                    $modalInstance.close(newValue || 0);
                } else {
                    $modalInstance.dismiss("cancel");
                }
            };

            $scope.InputFocus = (e: Event): void => {
                var input = $(e.target).parent()
                                       .next()
                                       .find("input");
                /**
                 * Hack to force focus without timeout
                 */
                $(e.target).click();
                input[0].focus();
            };

            /* IOS hide keyboard when rotating landscape to portrait for fewer redraw glitches */
            if (window.isIOSDevice()) {
                var onorientationchange = (): void => {
                    var act = (<HTMLInputElement>document.activeElement);

                    if (act && act.tagName === "INPUT") {
                        act.blur();
                    }

                    window.scrollTo(0, 0);
                };

                angular.element(window).on("orientationchange", onorientationchange);

                $modalInstance.result.finally(() => {
                    angular.element(window).off("orientationchange", onorientationchange);
                });
            }
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("EditForecastController", EditForecastController,
        Core.NG.$typedScope<IEditForecastControllerScope>(),
        Core.NG.$modalInstance,
        Core.NG.$filter,
        Core.$translation,
        Core.NG.$timeout,
        Core.NG.$locale,
        Core.NG.$typedCustomResolve<any>("targetPropertyValue"),
        Core.NG.$typedCustomResolve<string>("metric"),
        Core.NG.$typedCustomResolve<boolean>("isCurrency"));
}