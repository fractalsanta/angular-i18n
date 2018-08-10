var Core;
(function (Core) {
    var ForbiddenController = (function () {
        function ForbiddenController() {
        }
        return ForbiddenController;
    }());
    Core.NG.CoreModule.RegisterRouteController("Forbidden", "Forbidden.html", ForbiddenController);
})(Core || (Core = {}));
