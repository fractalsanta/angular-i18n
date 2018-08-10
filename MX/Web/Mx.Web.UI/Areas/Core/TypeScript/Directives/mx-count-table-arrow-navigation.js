var Core;
(function (Core) {
    "use strict";
    var KeyCodes;
    (function (KeyCodes) {
        KeyCodes[KeyCodes["Left"] = 37] = "Left";
        KeyCodes[KeyCodes["Up"] = 38] = "Up";
        KeyCodes[KeyCodes["Right"] = 39] = "Right";
        KeyCodes[KeyCodes["Down"] = 40] = "Down";
        KeyCodes[KeyCodes["Enter"] = 13] = "Enter";
        KeyCodes[KeyCodes["Tab"] = 9] = "Tab";
    })(KeyCodes || (KeyCodes = {}));
    var CountTableArrowNavigation = (function () {
        function CountTableArrowNavigation() {
            return {
                restrict: "A",
                link: function ($scope, element) {
                    var selectedInput = null;
                    var targetInput = null;
                    var nextDataRowCells = function (row, isUp, minimumCells) {
                        var targetRow = isUp ? row.prev() : row.next();
                        while (targetRow.length > 0) {
                            var cells = targetRow.children();
                            if (cells.length > minimumCells) {
                                return cells;
                            }
                            targetRow = isUp ? targetRow.prev() : targetRow.next();
                        }
                        return null;
                    };
                    var navigateVertical = function (isUp) {
                        if (selectedInput.tagName !== "INPUT") {
                            return;
                        }
                        var cell = $(selectedInput).closest("td");
                        var cellIndex = cell.index();
                        var row = cell.closest("tr");
                        var cells = nextDataRowCells(row, isUp, cellIndex);
                        if (cells && cells.length > 0) {
                            if (cells.eq(cellIndex).find("input") != null && cells.eq(cellIndex).find("input").is(":visible")) {
                                targetInput = cells.eq(cellIndex).find("input");
                            }
                            else {
                                for (var i = cellIndex + 1; i <= cells.length; i++) {
                                    if (cells.eq(i).find("input") != null && cells.eq(i).find("input").is(":visible")) {
                                        targetInput = cells.eq(i).find("input");
                                        break;
                                    }
                                }
                            }
                        }
                        if (targetInput != null) {
                            targetInput.focus();
                        }
                    };
                    element.on("focus", "input, select", function (e) {
                        selectedInput = e.target;
                    });
                    element.on("keydown", function (e) {
                        if (selectedInput) {
                            switch (e.which) {
                                case KeyCodes.Up: {
                                    navigateVertical(true);
                                    break;
                                }
                                case KeyCodes.Down: {
                                    navigateVertical(false);
                                    break;
                                }
                            }
                        }
                    });
                }
            };
        }
        return CountTableArrowNavigation;
    }());
    Core.NG.CoreModule.RegisterDirective("countTableArrowNavigation", CountTableArrowNavigation);
})(Core || (Core = {}));
