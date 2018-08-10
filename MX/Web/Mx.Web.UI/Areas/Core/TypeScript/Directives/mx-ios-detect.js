var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxIosDetect = (function () {
            function MxIosDetect() {
                return {
                    restrict: "A",
                    link: function (scope, element) {
                        if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
                            element.addClass("mx-ios");
                            element.on("focus", "input,textarea", function (e) {
                                element.addClass("mx-ios-keyboard-open");
                            }).on("blur", "input,textarea", function (e) {
                                element.removeClass("mx-ios-keyboard-open");
                                setTimeout(update, 500);
                            });
                            var update = function () {
                                $("html,document,body").css("width", $(window).width()).css("height", $(window).height());
                                if (!element.hasClass("mx-ios-keyboard-open")) {
                                    window.scrollTo(0, 0);
                                }
                            };
                            $(window).on("orientationchange", function () {
                                setTimeout(update, 500);
                            });
                        }
                    }
                };
            }
            return MxIosDetect;
        }());
        NG.CoreModule.RegisterDirective("mxIosDetect", MxIosDetect);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
