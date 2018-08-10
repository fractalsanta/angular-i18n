module Core.NG {
    "use strict";

    class MxKendoDestroyFix implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery): void => {
                    scope.$on("$destroy", (): void => {
                        var chart = element.data("kendoChart");
                        if (chart != null) {
                            chart.destroy = angular.noop;
                        }
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxKendoDestroyFix", MxKendoDestroyFix);
}