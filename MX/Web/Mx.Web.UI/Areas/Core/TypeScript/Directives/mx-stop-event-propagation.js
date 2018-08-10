var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxStopEventPropagation = (function () {
            function MxStopEventPropagation() {
                return {
                    restrict: "A",
                    scope: {},
                    link: function (scope, element, attr) {
                        var handler = function (e) {
                            e.stopPropagation();
                        };
                        if (attr.mxStopEventPropagation) {
                            element.on(attr.mxStopEventPropagation, handler);
                            scope.$on("$destroy", function () {
                                element.off(attr.MxStopEventPropagation, handler);
                            });
                        }
                    }
                };
            }
            return MxStopEventPropagation;
        }());
        NG.CoreModule.RegisterDirective("mxStopEventPropagation", MxStopEventPropagation);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
