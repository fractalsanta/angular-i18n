var Core;
(function (Core) {
    "use strict";
    var mxLoginPinKeypad = (function () {
        function mxLoginPinKeypad() {
            return {
                restrict: "A",
                scope: {
                    PIN: "=pin",
                    LogonWithPIN: "&logonwithpin",
                    Logout: "&logout"
                },
                link: function ($scope, element, attrs) {
                    $scope.Keypad = function (event) {
                        var $target = $(event.target), pin = $scope.PIN;
                        if ($target.closest(".logout-link").length) {
                            pin = "";
                            $scope.Logout();
                        }
                        else if ($target.closest(".pin-back").length) {
                            if (pin.length > 0) {
                                pin = pin.substring(0, pin.length - 1);
                            }
                        }
                        else if ($target.hasClass("pin-circle-text")) {
                            if (pin.length < 4) {
                                pin += $target.html();
                            }
                        }
                        $scope.PIN = pin;
                        $scope.$apply();
                    };
                    $scope.Keydown = function (event) {
                        var pin = $scope.PIN;
                        if (event.which === Core.KeyCodes.Backspace) {
                            if (pin.length > 0) {
                                pin = pin.substring(0, pin.length - 1);
                            }
                            event.preventDefault();
                        }
                        else if (event.which >= Core.KeyCodes.Num0 && event.which <= Core.KeyCodes.Num9) {
                            pin += String.fromCharCode(event.keyCode);
                        }
                        else if (event.which >= Core.KeyCodes.KeyPad0 && event.which <= Core.KeyCodes.KepPad9) {
                            pin += String.fromCharCode(event.keyCode - Core.KeyCodes.KeyPad0 + Core.KeyCodes.Num0);
                        }
                        $scope.PIN = pin;
                        $scope.$apply();
                    };
                    $scope.$watch("PIN", function (newValue) {
                        if (newValue.length === 4) {
                            $scope.LogonWithPIN();
                        }
                    }, true);
                    element.on("click", $scope.Keypad);
                    $("body").on("keydown", $scope.Keydown);
                    $scope.$on("$destroy", function () {
                        element.off("click", $scope.Keypad);
                        $("body").off("keydown", $scope.Keydown);
                    });
                }
            };
        }
        return mxLoginPinKeypad;
    }());
    Core.NG.CoreModule.RegisterDirective("mxLoginPinKeypad", mxLoginPinKeypad);
})(Core || (Core = {}));
