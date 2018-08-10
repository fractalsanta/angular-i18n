module Core.NG {
    "use strict";

    class MxDisableButtonIfBusy implements ng.IDirective {
        constructor(
            $http: ng.IHttpService
            ) {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery): void => {
                    var elem = <HTMLInputElement>element[0];
                    scope.$watch((): boolean => {
                        return $http.pendingRequests.length > 0;
                    }, (hasPending: boolean): void => {
                            if (hasPending) {
                                elem.disabled = true;
                            } else {
                                elem.disabled = false;
                            }
                        });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxDisableButtonIfBusy", MxDisableButtonIfBusy,
        Core.NG.$http);
}