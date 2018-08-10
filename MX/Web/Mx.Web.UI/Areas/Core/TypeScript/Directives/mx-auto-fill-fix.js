var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxAutoFillFix = (function () {
            function MxAutoFillFix() {
                return {
                    restrict: "A",
                    link: function (scope, element, attrs) {
                        element.prop("method", "POST");
                        if (attrs.ngSubmit) {
                            setTimeout(function () {
                                element.unbind("submit").submit(function (e) {
                                    e.preventDefault();
                                    element.find("input, textarea, select").trigger("input").trigger("change").trigger("keydown");
                                    var textFields = element.find("input");
                                    textFields.blur();
                                    scope.$apply(attrs.ngSubmit);
                                });
                            }, 0);
                        }
                    }
                };
            }
            return MxAutoFillFix;
        }());
        NG.CoreModule.RegisterDirective("mxAutoFillFix", MxAutoFillFix);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
