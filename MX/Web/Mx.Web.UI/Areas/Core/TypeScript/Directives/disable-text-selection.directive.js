var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var DisableTextSelection = (function () {
            function DisableTextSelection() {
                return {
                    restrict: "A",
                    link: function (scope, element, attrs, modelController) {
                        element.on("mousedown", function (e) {
                            return false;
                        });
                    }
                };
            }
            return DisableTextSelection;
        }());
        NG.CoreModule.RegisterDirective("disableTextSelection", DisableTextSelection);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
