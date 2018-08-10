var Core;
(function (Core) {
    (function (Tests) {
        // Service implementation, depends on couple of Angular services
        var TestService = (function () {
            function TestService(httpService, q) {
                this.httpService = httpService;
                this.q = q;
            }
            TestService.prototype.RequestStuff = function () {
                var defer = this.q.defer();
                this.httpService.get("/something").then(function (h) {
                    return defer.resolve(h.data);
                });
                return defer.promise;
            };
            return TestService;
        })();

        var r = Tests.TestModule;
        Tests.$testService = r.RegisterService("test", TestService, Core.NG.$http, Core.NG.$q);
    })(Core.Tests || (Core.Tests = {}));
    var Tests = Core.Tests;
})(Core || (Core = {}));
