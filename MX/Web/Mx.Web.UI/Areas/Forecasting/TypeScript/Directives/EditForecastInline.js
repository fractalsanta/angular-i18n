var Forecasting;
(function (Forecasting) {
    "use strict";
    var EditForecastInlineController = (function () {
        function EditForecastInlineController($scope, $filter, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            $scope.UpdatePercent = function () {
                var originalValue = $scope.FormData.OriginalValue, newValue = _this.ParseValueToNumber($scope.FormData.NewValue);
                if (newValue !== originalValue && (originalValue || originalValue === 0)) {
                    var percDelta = ((newValue - $scope.FormData.OriginalValue) / $scope.FormData.OriginalValue) * 100;
                    percDelta = $filter("number")(percDelta, 2);
                    if (percDelta !== $scope.FormData.PercentChange) {
                        $scope.FormData.PercentChange = percDelta;
                    }
                }
                else {
                    $scope.FormData.PercentChange = 0;
                }
            };
            $scope.UpdateValue = function () {
                var newValueString = String($scope.FormData.PercentChange).replace(/[^0-9,.,-]/g, "");
                var newValue = Number(newValueString);
                newValue = Math.round($scope.FormData.OriginalValue + ($scope.FormData.OriginalValue * (newValue / 100)));
                if (isNaN(newValue)) {
                    newValue = $scope.FormData.OriginalValue;
                }
                if ($scope.FormData.IsCurrency) {
                    $scope.FormData.NewValue = $filter("currencyNoDecimalOrComma")(newValue);
                }
                else {
                    $scope.FormData.NewValue = String(newValue);
                    if ($scope.InlineOptions.IsByPercentage) {
                        $scope.FormData.PercentChange = newValueString + "%";
                    }
                }
            };
            $scope.Submit = function () {
                if ($scope.FormData) {
                    var newValue = _this.ParseValueToNumber($scope.FormData.NewValue);
                    $scope.FormData.EditedValue = Number(newValue);
                    $scope.FormData = null;
                }
            };
            $scope.$watch("FormData", function (newValue) {
                if (newValue) {
                    newValue.NewValue = (newValue.IsCurrency ? $filter("currencyNoDecimalOrComma")(newValue.OriginalValue) : newValue.OriginalValue);
                }
                else {
                    $scope.$ParentEl.append($scope.$Element);
                }
            }, false);
            $scope.$watch("FormData.$el", function ($el) {
                if ($el) {
                    if ($scope.InlineOptions.IsByPercentage) {
                        $scope.FormData.PercentChange = $scope.FormData.PercentChange + "%";
                    }
                    _this.ScrollToElement($el);
                    $el.append($scope.$Element);
                    _this.FocusInput();
                }
            }, false);
            if (window.isIOSDevice()) {
                $scope.$watch("InlineOptions.IsByPercentage", function () {
                    var $input = _this.$scope.$Element.find("input"), input = $input.get((_this.$scope.InlineOptions.IsByPercentage) ? 1 : 0);
                    if (input) {
                        $input.click();
                        input.focus();
                    }
                }, false);
            }
        }
        EditForecastInlineController.prototype.ParseValueToNumber = function (value) {
            if (!value) {
                return 0;
            }
            var cleanValue = _.isNumber(value) ? value : value.replace(/[^0-9.-]/g, "");
            var newNumber = Number(cleanValue);
            return (!isNaN(newNumber)) ? newNumber : 0;
        };
        EditForecastInlineController.prototype.ScrollToElement = function (element) {
            var scrollingContainer = element.closest(".mx-fg-scrolling-grid"), scrollTop = scrollingContainer.scrollTop(), top = element.position().top + scrollTop - 10;
            scrollingContainer.scrollTop(top);
        };
        EditForecastInlineController.prototype.FocusInput = function () {
            if (this.$scope.FormData) {
                var $input = this.$scope.FormData.$el.find("input"), input;
                if ($input.length === 0) {
                    $input = this.$scope.$Element.find("input");
                }
                input = $input.get((this.$scope.InlineOptions.IsByPercentage) ? 1 : 0);
                if (input) {
                    var handler = function () {
                        $input.click();
                        input.focus();
                        input.setSelectionRange(0, 9999);
                    };
                    if (Core.BrowserDetection.BrowserIs(Core.BrowserDetection.Browsers.iOS)) {
                        handler();
                    }
                    else {
                        this.$timeout(handler);
                    }
                }
            }
        };
        return EditForecastInlineController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("EditForecastInlineController", EditForecastInlineController, Core.NG.$typedScope(), Core.NG.$filter, Core.NG.$timeout);
    var EditForecastInline = (function () {
        function EditForecastInline() {
            return {
                restrict: "E",
                scope: {
                    FormData: "=editing",
                    InlineOptions: "=options"
                },
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/EditForecastInlineDirective.html",
                controller: "Forecasting.EditForecastInlineController",
                link: function ($scope, element) {
                    $scope.$Element = element;
                    $scope.$ParentEl = element.parent();
                    element.on("keydown", function (e) {
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
                    if (window.isIOSDevice()) {
                        var onorientationchange = function () {
                            var act = document.activeElement;
                            if (act && act.tagName === "INPUT") {
                                act.blur();
                            }
                            window.scrollTo(0, 0);
                        };
                        angular.element(window).on("orientationchange", onorientationchange);
                        $scope.$on("$destroy", function () {
                            angular.element(window).off("orientationchange", onorientationchange);
                        });
                    }
                }
            };
        }
        return EditForecastInline;
    }());
    Core.NG.ForecastingModule.RegisterDirective("editForecastInline", EditForecastInline);
})(Forecasting || (Forecasting = {}));
