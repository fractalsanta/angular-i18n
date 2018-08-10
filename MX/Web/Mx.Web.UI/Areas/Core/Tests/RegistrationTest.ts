/// <reference path="TestFramework.ts" />

/// <reference path="itestservice.ts" />
/// <reference path="testmodule.ts" />
/// <reference path="testservice.ts" />

describe("Service Registration", ()=> {
    var injector: ng.auto.IInjectorService;
    var httpMock: ng.IHttpBackendService;

    beforeEach(angular.mock.module("Test"));

    beforeEach(inject(($httpBackend, $injector) => {
        httpMock = $httpBackend;
        injector = $injector;
    }));

    it("should resolve the service", () => {
        var service = injector.get(Core.Tests.$testService.name);
        expect(service).not.toBeNull();
    });

    it("should request the http dependency", () => {
        httpMock.expectGET("/something").respond("string result!");
        var service: Core.Tests.ITestService = <any>injector.get(Core.Tests.$testService.name);
        var test = "";
        service.RequestStuff().then(result => test = result);
        httpMock.flush();
        expect(test).toEqual("string result!");
    });
});
