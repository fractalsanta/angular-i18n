$(function () {
    window["FastClick"].attach(document.body);
});
Core.NG.CoreModule.Module().config([Core.NG.$httpProvider.name, Core.NG.$urlRouterProvider.name, function (httpProvider, routerProvider) {
        httpProvider.defaults.headers.common["Cache-Control"] = "no-cache, no-store, must-revalidate";
        httpProvider.defaults.headers.common["Pragma"] = "no-cache";
        httpProvider.defaults.headers.common["Expires"] = 0;
        routerProvider.otherwise("/");
    }]);
Core.NG.CoreModule.Module().config([Core.NG.$provide.name, function ($provide) {
        $provide.decorator("$exceptionHandler", ["$delegate", function ($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    if (window.isIOSDevice()) {
                        if (/Attempted to assign to readonly property/.test(exception)) {
                            window.location.reload();
                        }
                    }
                };
            }]);
    }]);
