module Core.NG {
    "use strict";

    interface INumberOnlyInputDirectiveAttributes extends ng.IAttributes {
        BackspaceKey: boolean;
        DeleteKey: boolean;
        iscurrency: string;
        ispercent: string;
        precision: number;
        maxlength: number;
        maxvalue: number;
        minvalue: number;
        isphonenumber: string;
    }

    class NumberOnlyInput implements ng.IDirective {
        constructor(
            $filter: ng.IFilterService,
            $timeout: ng.ITimeoutService,
            $locale: ng.ILocaleService
            ) {
            return <ng.IDirective>{
                restrict: "A",
                require: "ngModel",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: INumberOnlyInputDirectiveAttributes, modelController: ng.INgModelController): void => {
                    var currencySymbol: string = $locale.NUMBER_FORMATS.CURRENCY_SYM,
                        decimalSymbol: string = $locale.NUMBER_FORMATS.DECIMAL_SEP,
                        elem = <HTMLInputElement>element[0],
                        transformedInput: string;

                    element.on("keydown", (e: JQueryEventObject): void => {
                        attrs.BackspaceKey = false;
                        attrs.DeleteKey = false;
                        switch (e.which) {
                            case Core.KeyCodes.Backspace: {
                                attrs.BackspaceKey = true;
                                break;
                            } case Core.KeyCodes.Delete: {
                                attrs.DeleteKey = true;
                                break;
                            }
                        }
                    });

                    modelController.$parsers.push((inputValue: string): string => {
                        if (inputValue === undefined) { return "0"; }

                        transformedInput = inputValue;

                        HandleNonNumerics();
                        HandlePrecision(decimalSymbol);
                        HandleLength();
                        HandleMinMaxValue();
                        HandleCurrency(currencySymbol);
                        HandlePercent(inputValue);

                        if (transformedInput !== inputValue) {
                            modelController.$setViewValue(transformedInput);
                            modelController.$render();
                        }

                        if (window.isIOSDevice()) {
                            MoveCursorToEndIOSOnly();
                        }

                        MoveCursorToJustBeforePercent();
                        return transformedInput;
                    });

                    var HandleNonNumerics = (): void => {                        
                        if (attrs.isphonenumber === "true") {
                            transformedInput = transformedInput.replace(/[^0-9,(,),*,\-,#,+,\,\s,.]/g, "");
                        } else {
                            transformedInput = transformedInput.replace(/(?!^-)[^0-9.]/g, "");
                        }
                    };

                    var HandlePrecision = (decimalSymbol:string): void => {
                        if (attrs.precision > 0 && transformedInput) {
                            var decimalIndex = transformedInput.indexOf(decimalSymbol);

                            if (transformedInput.indexOf(decimalSymbol) !== transformedInput.lastIndexOf(decimalSymbol)) {
                                transformedInput = transformedInput.substring(0, decimalIndex + 1).concat(
                                    transformedInput.substring(
                                        decimalIndex + 1, transformedInput.length).replace(decimalSymbol, ""));
                            }

                            if (decimalIndex >= 0) {
                                var decimal = transformedInput.substring(decimalIndex);
                                if (decimal.length > attrs.precision) {
                                    var percisionoffset = Number(transformedInput.lastIndexOf(decimalSymbol)) + Number(attrs.precision);
                                    transformedInput = transformedInput.substring(0, percisionoffset + 1);
                                }
                            }
                        }
                        else if (transformedInput) {
                            transformedInput = transformedInput.replace(decimalSymbol, "");
                        }
                    };

                    var HandleLength = (): void => {
                        if (transformedInput.length > attrs.maxlength) {
                            transformedInput = transformedInput.substring(attrs.maxlength, 0);
                        }
                    };

                    var HandleMinMaxValue = (): void => {
                        if (attrs.minvalue >= 0 && !attrs.isphonenumber) {
                            transformedInput = transformedInput.replace("-", "");
                        }

                        if (Number(transformedInput) > Number(attrs.maxvalue)) {
                            transformedInput = attrs.maxvalue.toString();
                        }

                        if (Number(transformedInput) < Number(attrs.minvalue)) {
                            transformedInput = attrs.minvalue.toString();
                        }
                    };

                    var HandleCurrency = (currencySymbol: string): void => {
                        if (attrs.iscurrency === "true") {
                            var setToStart = false;

                            if (attrs.DeleteKey) {
                                if (elem.selectionStart === 0) {
                                    transformedInput = transformedInput.slice(1);
                                    attrs.DeleteKey = false;
                                    setToStart = true;
                                }
                            }

                            if (transformedInput === "") {
                                transformedInput = transformedInput.replace("", currencySymbol);
                            } else {
                                transformedInput = $filter<ng.IFilterNumber>("currencyNoDecimalOrComma")(transformedInput);
                            }

                            if (setToStart) {
                                setTimeout((): void => {
                                    elem.setSelectionRange(0, 0);
                                }, 1);
                            }
                        }
                    };

                    var HandlePercent = (inputValue: string): void => {
                        if (attrs.ispercent === "true") {
                            if (attrs.BackspaceKey) {
                                var cursorPosition = elem.selectionStart;

                                if (cursorPosition >= inputValue.length) {
                                    transformedInput = transformedInput.slice(0, -1);
                                }
                            }

                            if (transformedInput === "") {
                                transformedInput = transformedInput.replace("", "%");
                            } else {
                                transformedInput = transformedInput + "%";
                            }
                        }
                    };

                    var MoveCursorToEndIOSOnly = (): void => {
                        var val = elem.value;
                        elem.value = "";
                        elem.value = val;
                    };
                    var MoveCursorToJustBeforePercent = (): void => {
                        if (attrs.ispercent === "true") {
                            elem.value = transformedInput;
                            var caretPos = elem.value.indexOf('%');

                            if (elem != null) {
                                //TODO: Review createTextRange usage
                                if ((<any>elem).createTextRange) {
                                    var range = (<any>elem).createTextRange();
                                    range.move('character', caretPos);
                                    range.select();
                                }
                                else {
                                    if (elem.selectionStart) {
                                        elem.focus();
                                        elem.setSelectionRange(caretPos, caretPos);
                                    }
                                    else
                                        elem.focus();
                                }
                            }
                        }
                    };
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("numberOnlyInput", NumberOnlyInput,
        Core.NG.$filter,
        Core.NG.$timeout,
        Core.NG.$locale);
}