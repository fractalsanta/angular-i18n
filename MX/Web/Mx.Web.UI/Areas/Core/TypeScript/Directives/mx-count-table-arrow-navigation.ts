module Core {
    "use strict";

    enum KeyCodes {
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,
        Enter = 13,
        Tab = 9
    }

    class CountTableArrowNavigation implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                link: ($scope: ng.IScope, element: ng.IAugmentedJQuery): void => {

                    var selectedInput: HTMLInputElement = null;
                    var targetInput: HTMLInputElement = null;

                    var nextDataRowCells = (row: JQuery, isUp: boolean, minimumCells: number) : any => {
                        var targetRow = isUp ? row.prev() : row.next();
                        while (targetRow.length > 0) {
                            var cells = targetRow.children();
                            if (cells.length > minimumCells) {
                                return cells;
                            }
                            targetRow = isUp ? targetRow.prev() : targetRow.next();
                        }
                        return null;
                    }

                    var navigateVertical = (isUp: boolean) => {
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
                            } else {
                                for (var i: number = cellIndex + 1; i <= cells.length; i++) {
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

                    element.on("focus", "input, select", (e: JQueryEventObject): void => {
                        selectedInput = <HTMLInputElement>e.target;
                    });

                    element.on("keydown", (e: JQueryEventObject): void => {
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
    }

    NG.CoreModule.RegisterDirective("countTableArrowNavigation", CountTableArrowNavigation);
}