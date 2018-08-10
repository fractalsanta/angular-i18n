module Core.NG {
    "use strict";

    class SelectOnFocusInput implements ng.IDirective {
        constructor(
            $timeout: ng.ITimeoutService
            ) {
            return <ng.IDirective>{
                restrict: "A",
                require: "ngModel",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery): void => {

                    var firstClick = false;
                    element.bind('click', function () {
                        var input = this;

                        if (firstClick) {
                            firstClick = false;
                            input.focus();
                            setTimeout(function () {
                                input.setSelectionRange(0, input.value.length);
                            }, 1);
                        }
                    });

                    element.bind('focus', function () {
                        firstClick = true;
                        var input = this;
                        input.focus();
                        setTimeout(function () {
                            input.setSelectionRange(0, input.value.length);
                        }, 1);
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("selectOnFocusInput", SelectOnFocusInput,
        Core.NG.$timeout);
}