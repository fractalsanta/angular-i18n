module Core.Directives {
    "use strict";

    class MxHeaderDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-header.html",
                controller: "Core.mxHeaderController",
                controllerAs: "vm"
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxHeader", MxHeaderDirective);
}