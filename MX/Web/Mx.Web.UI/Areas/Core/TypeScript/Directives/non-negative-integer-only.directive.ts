module Core.NG {
    "use strict";

    interface INonNegativeIntegerOnlyDirectiveAttributes extends ng.IAttributes {
        skipSelectOnFocus: string;
    }

    class NonNegativeIntegerOnlyDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                require: "ngModel",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: INonNegativeIntegerOnlyDirectiveAttributes, modelController: ng.INgModelController): void => {
                    element.on("blur", (e: Event): void => {
                        var input = <HTMLInputElement>e.target;
                        if (input && !input.value.trim()) {
                            input.value = "0";
                        }
                    });

                    // Fix to click bug in chrome deselecting content.
                    element.on("mouseup", (e: Event): void => {
                        e.preventDefault();
                    });

                    element.on("keydown", (e: JQueryEventObject): void => {
                        if (e.which === KeyCodes.Space) {
                            e.preventDefault();
                        }
                    });

                    if (attrs.skipSelectOnFocus === undefined) {
                        element.on("focus", (e: Event): void => {
                            (<HTMLInputElement>element[0]).setSelectionRange(0, 9999);
                        });
                    }

                    // Set pattern to enforce iOS keypad format.
                    attrs.$set("pattern", "\\d*");

                    modelController.$parsers.push((inputValue: string): number => {
                        if (!inputValue) {
                            return 0;
                        }

                        var transformedInput = inputValue.toString().replace(/[^0-9]/g, "");

                        if (transformedInput !== inputValue.toString()) {
                            modelController.$setViewValue(Number(transformedInput));
                            modelController.$render();
                        }

                        return Number(transformedInput);
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("nonNegativeIntegerOnly", NonNegativeIntegerOnlyDirective);
}