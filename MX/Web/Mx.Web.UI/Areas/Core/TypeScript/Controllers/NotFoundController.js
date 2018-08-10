var Core;
(function (Core) {
    var NotFoundController = (function () {
        function NotFoundController() {
        }
        return NotFoundController;
    }());
    Core.NG.CoreModule.RegisterRouteController("404", "404.html", NotFoundController);
})(Core || (Core = {}));
