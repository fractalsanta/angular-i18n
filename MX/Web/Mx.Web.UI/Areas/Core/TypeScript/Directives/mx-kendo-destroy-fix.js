var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxKendoDestroyFix = (function () {
            function MxKendoDestroyFix() {
                return {
                    restrict: "A",
                    link: function (scope, element) {
                        scope.$on("$destroy", function () {
                            var chart = element.data("kendoChart");
                            if (chart != null) {
                                chart.destroy = angular.noop;
                            }
                        });
                    }
                };
            }
            return MxKendoDestroyFix;
        }());
        NG.CoreModule.RegisterDirective("mxKendoDestroyFix", MxKendoDestroyFix);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
