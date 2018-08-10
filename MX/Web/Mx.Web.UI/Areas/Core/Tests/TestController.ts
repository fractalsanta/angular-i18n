module Core.Tests {
    export class TestController {
        constructor(private http: ng.IHttpService, private test: ITestService) {
            test.RequestStuff();
        }
    }

    var r = TestModule;
    r.RegisterRouteController("/Test/:id", "myTemplate.html", TestController, NG.$http, $testService);
}

