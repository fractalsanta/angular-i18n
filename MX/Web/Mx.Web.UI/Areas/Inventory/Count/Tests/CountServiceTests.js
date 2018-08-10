describe("@ts Count Service Tests", function () {
    var injector;
    beforeEach(angular.mock.module('Inventory.Count'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.value('Core.LocalStorage.LocalStorageService', new Core.Tests.LocalStorageServiceMock());
        });
        angular.mock.module(function ($provide) {
            $provide.value('Core.LocalStorage', new Core.Tests.LocalStorageServiceMock());
        });
        angular.module("ui.validate", []);
        angular.module(Core.NG.CoreModule.Module().name).constant(Core.Constants.name, {});
        angular.module('Core.$signalR', []);
        angular.module('Core.ISignalRService', []);
        angular.module('LocalStorageModule', []);
        beforeEach(inject(function ($httpBackend, $injector) {
            injector = $injector;
        }));
        return angular.module('Core');
    });
    function createCountService() {
        var svc = new Inventory.Count.CountService(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        svc.InitializeModel();
        return svc;
    }
});
