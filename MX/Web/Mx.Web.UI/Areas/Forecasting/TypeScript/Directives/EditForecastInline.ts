module Forecasting {
    "use strict";

    export interface IEditInline {
        OriginalValue?: number;
        NewValue?: string;
        EditedValue?: number;
        PercentChange?: any;
        IsCurrency?: boolean;
        HideValue?: boolean;
        $el?: any;
        NavigationKey?: Core.KeyCodes;
    }

    export interface IEditInlineOptions {
        IsByPercentage?: boolean;
    }

    interface IEditForecastInlineScope extends ng.IScope {
        $Element: any;
        $ParentEl: any;
        FormData: IEditInline;
        InlineOptions: IEditInlineOptions;

        UpdatePercent(): void;
        UpdateValue(): void;
        
        Submit(): void;
    }

    class EditForecastInlineController {
        constructor(
            private $scope: IEditForecastInlineScope,
            $filter: ng.IFilterService,
            private $timeout: ng.ITimeoutService
        ) {
            $scope.UpdatePercent = (): void => {
                var originalValue = $scope.FormData.OriginalValue,
                    newValue = this.ParseValueToNumber($scope.FormData.NewValue);

                if (newValue !== originalValue && (originalValue || originalValue === 0)) {
                    var percDelta = ((newValue - $scope.FormData.OriginalValue) / $scope.FormData.OriginalValue) * 100;
                    percDelta = (<any>$filter("number")(percDelta, 2));

                    if (percDelta !== $scope.FormData.PercentChange) {
                        $scope.FormData.PercentChange = percDelta;
                    }
                } else {
                    $scope.FormData.PercentChange = 0;
                }
            };

            $scope.UpdateValue = (): void => {
                var newValueString = String($scope.FormData.PercentChange).replace(/[^0-9,.,-]/g, "");
                var newValue = Number(newValueString);
                newValue = Math.round($scope.FormData.OriginalValue + ($scope.FormData.OriginalValue * (newValue / 100)));

                if (isNaN(newValue)) {
                    newValue = $scope.FormData.OriginalValue;
                }

                if ($scope.FormData.IsCurrency) {
                    $scope.FormData.NewValue = (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(newValue);
                } else {
                    $scope.FormData.NewValue = String(newValue);

                    if ($scope.InlineOptions.IsByPercentage) {
                        $scope.FormData.PercentChange = newValueString + "%";
                    }
                }
            };

            $scope.Submit = (): void => {
                if ($scope.FormData) {
                    var newValue = this.ParseValueToNumber($scope.FormData.NewValue);

                    $scope.FormData.EditedValue = Number(newValue);
                    $scope.FormData = null;
                }
            };

            $scope.$watch("FormData", (newValue: IEditInline): void => {
                if (newValue) {
                    newValue.NewValue = <any>(newValue.IsCurrency ? (<ng.IFilterCurrency>$filter("currencyNoDecimalOrComma"))(newValue.OriginalValue) : newValue.OriginalValue);
                } else {
                    $scope.$ParentEl.append($scope.$Element);
                }
            }, false);

            $scope.$watch("FormData.$el", ($el: any): void => {
                if ($el) {
                    if ($scope.InlineOptions.IsByPercentage) {
                        $scope.FormData.PercentChange = $scope.FormData.PercentChange + "%";
                    }

                    this.ScrollToElement($el);
                    $el.append($scope.$Element);

                    this.FocusInput();
                }
            }, false);

            if (window.isIOSDevice()) {
                $scope.$watch("InlineOptions.IsByPercentage", (): void => {
                    var $input = this.$scope.$Element.find("input"),
                        input = $input.get((this.$scope.InlineOptions.IsByPercentage) ? 1 : 0);

                    if (input) {
                        $input.click();
                        input.focus();
                    }
                }, false);
            }
        }

        private ParseValueToNumber(value: string): number {
            if (!value) {
                return 0;
            }
            var cleanValue = _.isNumber(value) ? value : value.replace(/[^0-9.-]/g, "");
            var newNumber = Number(cleanValue);

            return (!isNaN(newNumber)) ? newNumber : 0;
        }

        private ScrollToElement(element: ng.IAugmentedJQuery): void {
            var scrollingContainer = element.closest(".mx-fg-scrolling-grid"),
                scrollTop = scrollingContainer.scrollTop(),
                top = element.position().top + scrollTop - 10;

            scrollingContainer.scrollTop(top);
        }

        private FocusInput(): void {
            if (this.$scope.FormData) {
                var $input = this.$scope.FormData.$el.find("input"),
                    input;

                if ($input.length === 0) {
                    $input = this.$scope.$Element.find("input");
                }

                input = $input.get((this.$scope.InlineOptions.IsByPercentage) ? 1 : 0);

                if (input) {
                    var handler = (): void => {
                        $input.click();
                        input.focus();
                        input.setSelectionRange(0, 9999);
                    };

                    if (Core.BrowserDetection.BrowserIs(Core.BrowserDetection.Browsers.iOS)) {
                        handler();
                    } else {
                        this.$timeout(handler);
                    }
                }
            }
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("EditForecastInlineController", EditForecastInlineController,
        Core.NG.$typedScope<IEditForecastInlineScope>(),
        Core.NG.$filter,
        Core.NG.$timeout);

    class EditForecastInline implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    FormData: "=editing",
                    InlineOptions: "=options"
                },
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/EditForecastInlineDirective.html",
                controller: "Forecasting.EditForecastInlineController",
                link: ($scope: IEditForecastInlineScope, element: any): void => {
                    $scope.$Element = element;
                    $scope.$ParentEl = element.parent();

                    element.on("keydown", (e: JQueryEventObject): void => {
                        switch (e.which) {
                            case Core.KeyCodes.Tab: {
                                e.which = (e.shiftKey) ? Core.KeyCodes.Up : Core.KeyCodes.Down;
                            }
                            case Core.KeyCodes.Up:
                            case Core.KeyCodes.Down: {
                                if ($scope.FormData) {
                                    $scope.FormData.NavigationKey = e.which;
                                }
                            }
                            case Core.KeyCodes.Enter: {
                                e.preventDefault();
                                e.stopPropagation();

                                angular.element(e.target).blur();
                                break;
                            }
                        }
                    });

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

                        $scope.$on("$destroy", (): void => {
                            angular.element(window).off("orientationchange", onorientationchange);
                        });
                    }
                }
            };
        }
    }

    Core.NG.ForecastingModule.RegisterDirective("editForecastInline", EditForecastInline);
} 