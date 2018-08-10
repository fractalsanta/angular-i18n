var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxSideNavDirective = (function () {
            function MxSideNavDirective() {
                return {
                    restrict: "E",
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-sidenav.html",
                    scope: {},
                    controller: "Core.mxSidebarController"
                };
            }
            return MxSideNavDirective;
        }());
        Core.NG.CoreModule.RegisterDirective("mxSideNav", MxSideNavDirective);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
