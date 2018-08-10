var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxHeaderDirective = (function () {
            function MxHeaderDirective() {
                return {
                    restrict: "E",
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-header.html",
                    controller: "Core.mxHeaderController",
                    controllerAs: "vm"
                };
            }
            return MxHeaderDirective;
        }());
        Core.NG.CoreModule.RegisterDirective("mxHeader", MxHeaderDirective);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
