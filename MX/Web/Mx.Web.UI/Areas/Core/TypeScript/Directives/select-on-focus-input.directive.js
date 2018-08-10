var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var SelectOnFocusInput = (function () {
            function SelectOnFocusInput($timeout) {
                return {
                    restrict: "A",
                    require: "ngModel",
                    link: function (scope, element) {
                        var firstClick = false;
                        element.bind('click', function () {
                            var input = this;
                            if (firstClick) {
                                firstClick = false;
                                input.focus();
                                setTimeout(function () {
                                    input.setSelectionRange(0, input.value.length);
                                }, 1);
                            }
                        });
                        element.bind('focus', function () {
                            firstClick = true;
                            var input = this;
                            input.focus();
                            setTimeout(function () {
                                input.setSelectionRange(0, input.value.length);
                            }, 1);
                        });
                    }
                };
            }
            return SelectOnFocusInput;
        }());
        NG.CoreModule.RegisterDirective("selectOnFocusInput", SelectOnFocusInput, Core.NG.$timeout);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
