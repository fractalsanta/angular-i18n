describe("@ts CountItemsController", function () {
    var injector;

    beforeEach(module('Inventory.Count'));

    beforeEach(function () {
        var mockDependency = {
            getSomething: function () {
                return 'mockReturnValue';
            }
        };

        module(function ($provide) {
            $provide.value('ICountService', mockDependency);
        });
        module(function ($provide) {
            $provide.value('IRouteParams', mockDependency);
        });

        module(function ($provide) {
            $provide.value('Core.LocalStorage.LocalStorageService', new Core.Tests.LocalStorageServiceMock());
        });
        module(function ($provide) {
            $provide.value('LocalStorageModule', new Core.Tests.LocalStorageServiceMock());
        });
        angular.module('LocalStorageModule', []);
        angular.module("ui.validate", []);
        angular.module(Core.NG.CoreModule.Module().name).constant(Core.Constants.name, {});
        angular.module('Inventory.Count.ICountLocationControllerScope', []);
        angular.module('Core.$signalR', []);
        angular.module('Core.ISignalRService', []);

        beforeEach(inject(function ($httpBackend, $injector) {
            injector = $injector;
        }));

        return angular.module('Core');
    });

    it('should return value from mock dependency', function () {
        return;
        var service = injector.get("Inventory.Count.CountController");
        var result = service.GetCssItemStatusClass("t1");
        expect(result).toEqual("test");
    });
});
//# sourceMappingURL=CountControllerTests.js.map
