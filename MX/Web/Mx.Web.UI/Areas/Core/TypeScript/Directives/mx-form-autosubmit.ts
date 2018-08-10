module Core.Directives {
    "use strict";

    class MxFormAutoSubmit implements ng.IDirective {
        constructor($window: ng.IWindowService, timeout: ng.ITimeoutService ) {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery): void => {
                    timeout(() => {
                        $(element).submit();
                        if ($(element).attr("target") === "_blank") {
                            timeout(() => $window.history.back(), 10);
                        }
                    }, 10);
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxFormAutosubmit", MxFormAutoSubmit, NG.$window, NG.$timeout);
}