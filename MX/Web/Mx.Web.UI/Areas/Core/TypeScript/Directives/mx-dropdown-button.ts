module Core.Directives {
    "use strict";

    class MxDropDownButtonDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-dropdown-button.html",
                scope: <any>{
                    DisplayValue: "=value"
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxDropdownButton", MxDropDownButtonDirective);
}