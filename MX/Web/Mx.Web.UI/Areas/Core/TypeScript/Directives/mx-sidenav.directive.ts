module Core.Directives {
    "use strict";

    class MxSideNavDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-sidenav.html",
                scope: {},
                controller: "Core.mxSidebarController"
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxSideNav", MxSideNavDirective);
}