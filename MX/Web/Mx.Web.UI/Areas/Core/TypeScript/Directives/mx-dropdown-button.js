var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxDropDownButtonDirective = (function () {
            function MxDropDownButtonDirective() {
                return {
                    restrict: "E",
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-dropdown-button.html",
                    scope: {
                        DisplayValue: "=value"
                    }
                };
            }
            return MxDropDownButtonDirective;
        }());
        Core.NG.CoreModule.RegisterDirective("mxDropdownButton", MxDropDownButtonDirective);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
