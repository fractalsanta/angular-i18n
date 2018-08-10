// fast click init for removing 300ms touch device tap delay (Fastclick.js)
$(() => {
    window["FastClick"].attach(document.body);
});

Core.NG.CoreModule.Module().config([Core.NG.$httpProvider.name, Core.NG.$urlRouterProvider.name, (httpProvider: ng.IHttpProvider, routerProvider: ng.ui.IUrlRouterProvider) => {
    httpProvider.defaults.headers.common["Cache-Control"] = "no-cache, no-store, must-revalidate";
    httpProvider.defaults.headers.common["Pragma"] = "no-cache";
    httpProvider.defaults.headers.common["Expires"] = 0;
    routerProvider.otherwise("/");
}]);

// fix for JIT bug in iOS 8.4.1 that causes object.property notation to be readonly
// mx-17250
Core.NG.CoreModule.Module().config([Core.NG.$provide.name, ($provide: ng.auto.IProvideService) => {
    $provide.decorator("$exceptionHandler", ["$delegate", ($delegate: Function) => {
        return function (exception, cause) {
            $delegate(exception, cause);
            if (window.isIOSDevice()) {
                // todo localized error messages?
                if (/Attempted to assign to readonly property/.test(exception)) {
                    window.location.reload();
                }
            }
        }
    }]);
}]);
