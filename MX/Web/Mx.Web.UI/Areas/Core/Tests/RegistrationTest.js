describe("Service Registration", function () {
    var injector;
    var httpMock;
    beforeEach(angular.mock.module("Test"));
    beforeEach(inject(function ($httpBackend, $injector) {
        httpMock = $httpBackend;
        injector = $injector;
    }));
    it("should resolve the service", function () {
        var service = injector.get(Core.Tests.$testService.name);
        expect(service).not.toBeNull();
    });
    it("should request the http dependency", function () {
        httpMock.expectGET("/something").respond("string result!");
        var service = injector.get(Core.Tests.$testService.name);
        var test = "";
        service.RequestStuff().then(function (result) { return test = result; });
        httpMock.flush();
        expect(test).toEqual("string result!");
    });
});
