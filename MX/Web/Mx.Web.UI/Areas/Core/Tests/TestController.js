var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var TestController = (function () {
            function TestController(http, test) {
                this.http = http;
                this.test = test;
                test.RequestStuff();
            }
            return TestController;
        }());
        Tests.TestController = TestController;
        var r = Tests.TestModule;
        r.RegisterRouteController("/Test/:id", "myTemplate.html", TestController, Core.NG.$http, Tests.$testService);
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
