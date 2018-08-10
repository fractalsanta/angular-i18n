var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var NumberOnlyInput = (function () {
            function NumberOnlyInput($filter, $timeout, $locale) {
                return {
                    restrict: "A",
                    require: "ngModel",
                    link: function (scope, element, attrs, modelController) {
                        var currencySymbol = $locale.NUMBER_FORMATS.CURRENCY_SYM, decimalSymbol = $locale.NUMBER_FORMATS.DECIMAL_SEP, elem = element[0], transformedInput;
                        element.on("keydown", function (e) {
                            attrs.BackspaceKey = false;
                            attrs.DeleteKey = false;
                            switch (e.which) {
                                case Core.KeyCodes.Backspace: {
                                    attrs.BackspaceKey = true;
                                    break;
                                }
                                case Core.KeyCodes.Delete: {
                                    attrs.DeleteKey = true;
                                    break;
                                }
                            }
                        });
                        modelController.$parsers.push(function (inputValue) {
                            if (inputValue === undefined) {
                                return "0";
                            }
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
                        var HandleNonNumerics = function () {
                            if (attrs.isphonenumber === "true") {
                                transformedInput = transformedInput.replace(/[^0-9,(,),*,\-,#,+,\,\s,.]/g, "");
                            }
                            else {
                                transformedInput = transformedInput.replace(/(?!^-)[^0-9.]/g, "");
                            }
                        };
                        var HandlePrecision = function (decimalSymbol) {
                            if (attrs.precision > 0 && transformedInput) {
                                var decimalIndex = transformedInput.indexOf(decimalSymbol);
                                if (transformedInput.indexOf(decimalSymbol) !== transformedInput.lastIndexOf(decimalSymbol)) {
                                    transformedInput = transformedInput.substring(0, decimalIndex + 1).concat(transformedInput.substring(decimalIndex + 1, transformedInput.length).replace(decimalSymbol, ""));
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
                        var HandleLength = function () {
                            if (transformedInput.length > attrs.maxlength) {
                                transformedInput = transformedInput.substring(attrs.maxlength, 0);
                            }
                        };
                        var HandleMinMaxValue = function () {
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
                        var HandleCurrency = function (currencySymbol) {
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
                                }
                                else {
                                    transformedInput = $filter("currencyNoDecimalOrComma")(transformedInput);
                                }
                                if (setToStart) {
                                    setTimeout(function () {
                                        elem.setSelectionRange(0, 0);
                                    }, 1);
                                }
                            }
                        };
                        var HandlePercent = function (inputValue) {
                            if (attrs.ispercent === "true") {
                                if (attrs.BackspaceKey) {
                                    var cursorPosition = elem.selectionStart;
                                    if (cursorPosition >= inputValue.length) {
                                        transformedInput = transformedInput.slice(0, -1);
                                    }
                                }
                                if (transformedInput === "") {
                                    transformedInput = transformedInput.replace("", "%");
                                }
                                else {
                                    transformedInput = transformedInput + "%";
                                }
                            }
                        };
                        var MoveCursorToEndIOSOnly = function () {
                            var val = elem.value;
                            elem.value = "";
                            elem.value = val;
                        };
                        var MoveCursorToJustBeforePercent = function () {
                            if (attrs.ispercent === "true") {
                                elem.value = transformedInput;
                                var caretPos = elem.value.indexOf('%');
                                if (elem != null) {
                                    if (elem.createTextRange) {
                                        var range = elem.createTextRange();
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
            return NumberOnlyInput;
        }());
        NG.CoreModule.RegisterDirective("numberOnlyInput", NumberOnlyInput, Core.NG.$filter, Core.NG.$timeout, Core.NG.$locale);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
