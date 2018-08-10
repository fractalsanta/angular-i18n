var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var NonNegativeIntegerOnlyDirective = (function () {
            function NonNegativeIntegerOnlyDirective() {
                return {
                    restrict: "A",
                    require: "ngModel",
                    link: function (scope, element, attrs, modelController) {
                        element.on("blur", function (e) {
                            var input = e.target;
                            if (input && !input.value.trim()) {
                                input.value = "0";
                            }
                        });
                        element.on("mouseup", function (e) {
                            e.preventDefault();
                        });
                        element.on("keydown", function (e) {
                            if (e.which === Core.KeyCodes.Space) {
                                e.preventDefault();
                            }
                        });
                        if (attrs.skipSelectOnFocus === undefined) {
                            element.on("focus", function (e) {
                                element[0].setSelectionRange(0, 9999);
                            });
                        }
                        attrs.$set("pattern", "\\d*");
                        modelController.$parsers.push(function (inputValue) {
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
            return NonNegativeIntegerOnlyDirective;
        }());
        NG.CoreModule.RegisterDirective("nonNegativeIntegerOnly", NonNegativeIntegerOnlyDirective);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
