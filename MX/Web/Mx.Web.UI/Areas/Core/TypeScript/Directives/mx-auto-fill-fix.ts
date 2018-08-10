module Core.NG {
    "use strict";

    class MxAutoFillFix implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any): void => {
                    // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
                    element.prop("method", "POST");
                    // 2 way binding is not executed when browsers auto fill, this means that the scope does not have the populated password
                    if (attrs.ngSubmit) {
                        setTimeout((): void => {
                            element.unbind("submit").submit(e=> {
                                e.preventDefault();
                                element.find("input, textarea, select").trigger("input").trigger("change").trigger("keydown");

                                var textFields = element.find("input");
                                textFields.blur(); // hides the keyboard in iOS after using Go! on iOS keyboard

                                scope.$apply(attrs.ngSubmit);
                            });
                        }, 0);
                    }
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxAutoFillFix", MxAutoFillFix);
}