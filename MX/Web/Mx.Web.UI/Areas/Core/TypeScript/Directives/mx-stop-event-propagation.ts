module Core.NG {
    "use strict";
    
    class MxStopEventPropagation implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                scope: {},

                link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attr: any): void => {
                    var handler = e => {
                        e.stopPropagation();
                    };

                    if (attr.mxStopEventPropagation) {
                        element.on(attr.mxStopEventPropagation, handler);
                        scope.$on("$destroy", () => {
                            element.off(attr.MxStopEventPropagation, handler);
                        });
                    }
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxStopEventPropagation", MxStopEventPropagation);
}