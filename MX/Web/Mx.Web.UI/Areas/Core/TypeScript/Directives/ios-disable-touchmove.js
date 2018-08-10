var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var IosDisableTouchmove = (function () {
            function IosDisableTouchmove() {
                return {
                    restrict: "A",
                    link: function (scope, element) {
                        if (window.isIOSDevice()) {
                            element.on("touchmove", function (e) {
                                return false;
                            });
                        }
                    }
                };
            }
            return IosDisableTouchmove;
        }());
        NG.CoreModule.RegisterDirective("iosDisableTouchmove", IosDisableTouchmove);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
