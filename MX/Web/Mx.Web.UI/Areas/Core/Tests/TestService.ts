module Core.Tests {
    // Service implementation, depends on couple of Angular services
    class TestService implements ITestService {
        constructor(private httpService: ng.IHttpService, private q: ng.IQService) { }
        RequestStuff() {
            var defer = this.q.defer<string>();
            this.httpService.get("/something").then(h=> defer.resolve(<string>h.data));
            return defer.promise;
        }
    }

    var r = TestModule;
    $testService = r.RegisterService("test", TestService, NG.$http, NG.$q);
    //$testService = r.RegisterService("test", TestService, NG.$http, NG.$q, NG.$filterProvider); // wrong, but harmless (extra parameters are acceptable in JS)
    //$testService = r.RegisterService("test", TestService, NG.$http); // OK, does not compile
    //$testService = r.RegisterService("test", TestService, NG.$location, NG.$anchorScroll); // OK, does not compile
} 