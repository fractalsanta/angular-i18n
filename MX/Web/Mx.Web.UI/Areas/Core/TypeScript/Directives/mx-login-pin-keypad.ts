module Core {
    "use strict";

    interface ILoginPinKeypadScope extends ng.IScope {
        PIN: string;
        Keypad(event: JQueryEventObject): void;
        Keydown(event: JQueryEventObject): void;
        LogonWithPIN(): void;
        Logout(): void;
    }

    class mxLoginPinKeypad implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                scope: {
                    PIN: "=pin",
                    LogonWithPIN: "&logonwithpin",
                    Logout: "&logout"
                },
                link: ($scope: ILoginPinKeypadScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
                    $scope.Keypad = (event: JQueryEventObject): void => {
                        var $target = $(event.target), pin = $scope.PIN;

                        if ($target.closest(".logout-link").length) {
                            pin = "";
                            $scope.Logout();
                        } else if ($target.closest(".pin-back").length) {
                            if (pin.length > 0) {
                                pin = pin.substring(0, pin.length - 1);
                            }
                        } else if ($target.hasClass("pin-circle-text")) {
                            if (pin.length < 4) {
                                pin += $target.html();
                            }
                        }

                        $scope.PIN = pin;
                        $scope.$apply();
                    };

                    $scope.Keydown = (event: JQueryEventObject): void => {
                        var pin = $scope.PIN;

                        if (event.which === KeyCodes.Backspace) {
                            if (pin.length > 0) {
                                pin = pin.substring(0, pin.length - 1);
                            }
                            event.preventDefault();
                        } else if (event.which >= KeyCodes.Num0 && event.which <= KeyCodes.Num9) {
                            pin += String.fromCharCode(event.keyCode);
                        } else if (event.which >= KeyCodes.KeyPad0 && event.which <= KeyCodes.KepPad9) {
                            pin += String.fromCharCode(event.keyCode - KeyCodes.KeyPad0 + KeyCodes.Num0);
                        }

                        $scope.PIN = pin;
                        $scope.$apply();
                    };

                    $scope.$watch("PIN", (newValue: string): void => {
                        if (newValue.length === 4) {
                            $scope.LogonWithPIN();
                        }
                    }, true);


                    element.on("click", $scope.Keypad);
                    $("body").on("keydown", $scope.Keydown);

                    $scope.$on("$destroy", (): void => {
                        element.off("click", $scope.Keypad);
                        $("body").off("keydown", $scope.Keydown);
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxLoginPinKeypad", mxLoginPinKeypad);
}