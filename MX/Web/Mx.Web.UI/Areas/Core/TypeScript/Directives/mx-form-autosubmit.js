var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxFormAutoSubmit = (function () {
            function MxFormAutoSubmit($window, timeout) {
                return {
                    restrict: "A",
                    link: function (scope, element) {
                        timeout(function () {
                            $(element).submit();
                            if ($(element).attr("target") === "_blank") {
                                timeout(function () { return $window.history.back(); }, 10);
                            }
                        }, 10);
                    }
                };
            }
            return MxFormAutoSubmit;
        }());
        Core.NG.CoreModule.RegisterDirective("mxFormAutosubmit", MxFormAutoSubmit, Core.NG.$window, Core.NG.$timeout);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
