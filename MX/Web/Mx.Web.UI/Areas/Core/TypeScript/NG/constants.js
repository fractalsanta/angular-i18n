var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        NG.$anchorScroll = { name: "$anchorScroll" };
        NG.$cacheFactory = { name: "$cacheFactory" };
        NG.$cookieStore = { name: "$cookieStore" };
        NG.$document = { name: "$document" };
        NG.$filter = { name: "$filter" };
        NG.$filterProvider = { name: "$filterProvider" };
        NG.$http = { name: "$http" };
        NG.$httpBackend = { name: "$httpBackend" };
        NG.$httpProvider = { name: "$httpProvider" };
        NG.$interval = { name: "$interval" };
        NG.$locale = { name: "$locale" };
        NG.$location = { name: "$location" };
        NG.$locationProvider = { name: "$locationProvider" };
        NG.$log = { name: "$log" };
        NG.$parse = { name: "$parse" };
        NG.$parseProvider = { name: "$parseProvider" };
        NG.$provide = { name: "$provide" };
        NG.$q = { name: "$q" };
        NG.$rootElement = { name: "$rootElement" };
        NG.$rootScope = { name: "$rootScope" };
        NG.$scope = { name: "$scope" };
        NG.$templateCache = { name: "$templateCache" };
        NG.$timeout = { name: "$timeout" };
        NG.$window = { name: "$window" };
        NG.$modal = { name: "$modal" };
        NG.$modalStack = { name: "$modalStack" };
        NG.$modalInstance = { name: "$modalInstance" };
        NG.$upload = { name: "$upload" };
        NG.$sce = { name: "$sce" };
        NG.$state = { name: "$state" };
        NG.$stateProvider = { name: "$stateProvider" };
        NG.$urlRouterProvider = { name: "$urlRouterProvider" };
        NG.$mxlocalStorage = { name: "localStorageService" };
        NG.$sanitize = { name: "$sanitize" };
        function $typedScope() {
            return { name: "$scope" };
        }
        NG.$typedScope = $typedScope;
        function $typedStateParams() {
            return { name: "$stateParams" };
        }
        NG.$typedStateParams = $typedStateParams;
        function $typedCustomResolve(resolveName) {
            return { name: resolveName };
        }
        NG.$typedCustomResolve = $typedCustomResolve;
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
