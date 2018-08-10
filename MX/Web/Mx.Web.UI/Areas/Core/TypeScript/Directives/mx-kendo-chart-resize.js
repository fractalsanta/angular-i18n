var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxKendoChartResize = (function () {
            function MxKendoChartResize($timeout) {
                return {
                    restrict: "A",
                    scope: {},
                    link: function (scope, element) {
                        var getDimensions = function () {
                            return {
                                'h': element.height(),
                                'w': element.width()
                            };
                        };
                        var redraw = function () {
                            var chart = element.data("kendoChart");
                            if (chart != null) {
                                chart.redraw();
                            }
                        };
                        var resizeHandler = function () {
                            if (timer) {
                                $timeout.cancel(timer);
                                timer = null;
                            }
                            timer = $timeout(function () {
                                var currentDims = getDimensions();
                                if (currentDims.w != oldDims.w || currentDims.h != oldDims.h) {
                                    oldDims = currentDims;
                                    redraw();
                                }
                            }, 300);
                        };
                        var timer = null;
                        var oldDims = getDimensions();
                        $(window).bind("resize", resizeHandler);
                        scope.$destroy(function () {
                            $(window).unbind("resize", resizeHandler);
                            if (timer) {
                                $timeout.cancel(timer);
                            }
                        });
                    }
                };
            }
            return MxKendoChartResize;
        }());
        NG.CoreModule.RegisterDirective("mxKendoChartResize", MxKendoChartResize, Core.NG.$timeout);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
