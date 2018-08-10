module Core.NG {
    "use strict";

    class MxKendoChartResize implements ng.IDirective {
        constructor($timeout: ng.ITimeoutService) {
            return <ng.IDirective>{
                restrict: "A",
                scope: {},
                link: (scope: any, element: ng.IAugmentedJQuery): void => {
                    
                    var getDimensions = ()=> {
                        return {
                            'h': element.height(),
                            'w': element.width()
                        };
                    };

                    var redraw = ()=> {
                        var chart = element.data("kendoChart");
                        if (chart != null) {
                            chart.redraw();
                        }
                    };

                    var resizeHandler = ()=> {
                        if (timer) {
                            $timeout.cancel(timer);
                            timer = null;
                        }

                        timer = $timeout(()=> {
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
                    scope.$destroy(()=> {
                        $(window).unbind("resize", resizeHandler);

                        if (timer) {
                            $timeout.cancel(timer);
                        }
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxKendoChartResize", MxKendoChartResize, Core.NG.$timeout);
} 