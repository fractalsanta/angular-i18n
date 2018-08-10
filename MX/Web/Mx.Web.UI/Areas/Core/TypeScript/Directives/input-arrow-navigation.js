var Core;
(function (Core) {
    "use strict";
    (function (KeyCodes) {
        KeyCodes[KeyCodes["Space"] = 32] = "Space";
        KeyCodes[KeyCodes["Left"] = 37] = "Left";
        KeyCodes[KeyCodes["Up"] = 38] = "Up";
        KeyCodes[KeyCodes["Right"] = 39] = "Right";
        KeyCodes[KeyCodes["Down"] = 40] = "Down";
        KeyCodes[KeyCodes["Enter"] = 13] = "Enter";
        KeyCodes[KeyCodes["Tab"] = 9] = "Tab";
        KeyCodes[KeyCodes["Esc"] = 27] = "Esc";
        KeyCodes[KeyCodes["Backspace"] = 8] = "Backspace";
        KeyCodes[KeyCodes["Delete"] = 46] = "Delete";
        KeyCodes[KeyCodes["Num0"] = 48] = "Num0";
        KeyCodes[KeyCodes["Num9"] = 57] = "Num9";
        KeyCodes[KeyCodes["KeyPad0"] = 96] = "KeyPad0";
        KeyCodes[KeyCodes["KepPad9"] = 105] = "KepPad9";
    })(Core.KeyCodes || (Core.KeyCodes = {}));
    var KeyCodes = Core.KeyCodes;
    var InputArrowNavigation = (function () {
        function InputArrowNavigation($timeout) {
            return {
                restrict: "A",
                link: function ($scope, element, attrs) {
                    var selectedInput = null;
                    $scope.NavigateVertical = function (isUp) {
                        var cell = $(selectedInput).closest("td"), row = cell.closest("tr"), index = cell.index(), targetRows = row[(isUp) ? "prevAll" : "nextAll"](), length = targetRows.length, targetInput, i;
                        for (i = 0; i < length; i += 1) {
                            targetInput = targetRows.eq(i).children().eq(index).find("input:visible:not([disabled])");
                            if (targetInput.length) {
                                $timeout(function () {
                                    targetInput.eq(0).focus();
                                }, 0);
                                break;
                            }
                        }
                    };
                    $scope.NavigateHorizontal = function (isLeft) {
                        var cell = $(selectedInput).closest("td"), adjacentCells = cell[(isLeft) ? "prevAll" : "nextAll"](), length = adjacentCells.length, current, i;
                        for (i = 0; i < length; i += 1) {
                            current = adjacentCells.eq(i).find("input:visible:not([disabled])");
                            if (current.length) {
                                $timeout(function () {
                                    current.focus();
                                }, 0);
                                break;
                            }
                        }
                    };
                    element.on("focus", "input", function (e) {
                        selectedInput = e.target;
                    });
                    element.on("keydown", function (e) {
                        if (selectedInput) {
                            switch (e.which) {
                                case KeyCodes.Up: {
                                    $scope.NavigateVertical(true);
                                    break;
                                }
                                case KeyCodes.Down: {
                                    $scope.NavigateVertical(false);
                                    break;
                                }
                                case KeyCodes.Left: {
                                    $scope.NavigateHorizontal(true);
                                    break;
                                }
                                case KeyCodes.Right: {
                                    $scope.NavigateHorizontal(false);
                                    break;
                                }
                            }
                        }
                    });
                }
            };
        }
        return InputArrowNavigation;
    }());
    Core.NG.CoreModule.RegisterDirective("inputArrowNavigation", InputArrowNavigation, Core.NG.$timeout);
})(Core || (Core = {}));
