module Core.NG {
    "use strict";

    interface IDisableTextSelection extends ng.IAttributes { }

    class DisableTextSelection implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IDisableTextSelection, modelController: ng.INgModelController): void => {
                    element.on("mousedown", (e: Event): boolean => {
                        return false;
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("disableTextSelection", DisableTextSelection);
}