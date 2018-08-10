module Core.Directives {
    "use strict";

    class MxPopupMessage implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-popup-message.html"
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxPopupMessage", MxPopupMessage);
} 