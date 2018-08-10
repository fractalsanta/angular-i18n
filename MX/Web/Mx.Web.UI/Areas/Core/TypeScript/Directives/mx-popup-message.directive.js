var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxPopupMessage = (function () {
            function MxPopupMessage() {
                return {
                    restrict: "E",
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-popup-message.html"
                };
            }
            return MxPopupMessage;
        }());
        Core.NG.CoreModule.RegisterDirective("mxPopupMessage", MxPopupMessage);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
