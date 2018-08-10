module Core {
    "use strict";

    export enum KeyCodes {
        Space = 32,
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,
        Enter = 13,
        Tab = 9,
        Esc = 27,
        Backspace = 8,
        Delete = 46,
        Num0 = 48,
        Num9 = 57,
        KeyPad0 = 96,
        KepPad9 = 105
    }

    interface IInputArrowNavigationScope extends ng.IScope {
        NavigateVertical(isUp: boolean): void;
        NavigateHorizontal(isLeft: boolean): void;
    }

    class InputArrowNavigation implements ng.IDirective {
        constructor($timeout: ng.ITimeoutService) {
            return <ng.IDirective>{
                restrict: "A",
                link: ($scope: IInputArrowNavigationScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
                    var selectedInput: HTMLInputElement = null;

                    $scope.NavigateVertical = (isUp: boolean): void => {
                        var cell = $(selectedInput).closest("td"),
                            row = cell.closest("tr"),
                            index = cell.index(),
                            targetRows: JQuery = row[(isUp) ? "prevAll" : "nextAll"](),
                            length = targetRows.length,
                            targetInput: JQuery,
                            i: number;

                        for (i = 0; i < length; i += 1) {
                            targetInput = targetRows.eq(i).children().eq(index).find("input:visible:not([disabled])");

                            if (targetInput.length) {
                                $timeout((): void => {
                                    targetInput.eq(0).focus();
                                }, 0);

                                break;
                            }
                        }
                    };

                    $scope.NavigateHorizontal = (isLeft: boolean): void => {
                        var cell = $(selectedInput).closest("td"),
                            adjacentCells = cell[(isLeft) ? "prevAll" : "nextAll"](),
                            length = adjacentCells.length,
                            current, i;

                        for (i = 0; i < length; i += 1) {
                            current = adjacentCells.eq(i).find("input:visible:not([disabled])");

                            if (current.length) {
                                $timeout((): void => {
                                    current.focus();
                                }, 0);
                                break;
                            }
                        }
                    };

                    element.on("focus", "input", (e: JQueryEventObject): void => {
                        selectedInput = <HTMLInputElement>e.target;
                    });

                    element.on("keydown", (e: JQueryEventObject): void => {
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
    }

    NG.CoreModule.RegisterDirective("inputArrowNavigation", InputArrowNavigation, NG.$timeout);
}