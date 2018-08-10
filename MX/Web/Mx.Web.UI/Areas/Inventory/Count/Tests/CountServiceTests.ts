/// <reference path="../../../Core/Tests/Testframework.ts" />
/// <reference path="../../../Core/Tests/TestframeworkSignalR.ts" />
/// <reference path="../../../Core/TypeScript/Events.ts" />
/// <reference path="../../TypeScript/Interfaces/IUpdateNoCostItemService.d.ts" />

/// <reference path="../typescript/services/countservice.ts" />


describe("@ts Count Service Tests", () => {
    var injector;

    beforeEach(angular.mock.module('Inventory.Count'));

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.value('Core.LocalStorage.LocalStorageService', new Core.Tests.LocalStorageServiceMock());
        });
        angular.mock.module($provide => {
            $provide.value('Core.LocalStorage', new Core.Tests.LocalStorageServiceMock());
        });
        angular.module("ui.validate", []);
        angular.module(Core.NG.CoreModule.Module().name).constant(Core.Constants.name, {});
        angular.module('Core.$signalR', []);
        angular.module('Core.ISignalRService', []);
        angular.module('LocalStorageModule', []);

        beforeEach(inject(($httpBackend, $injector) => {
            //    httpMock = $httpBackend;
            injector = $injector;
        }));

        return angular.module('Core');
    });

    //it('should return value from mock dependency', () => {
    //    var service = createCountService();
    //    var result = service.CheckAndUpdateItemsStatuses(<Inventory.Count.Api.Models.ICountItem>{
    //            Id: 1,
    //            Status: Inventory.Count.Api.Models.CountStatus.Variance
    //        },
    //        true);
    //    expect(result).toEqual(true);
    //});

    //it('should return value from mock dependency', () => {
    //    var service = injector.get("Inventory.Count.CountService");
    //    var result = service.GetCssItemStatusClass("t1");
    //    expect(result).toEqual("test");
    //});


    function createCountService(): Inventory.Count.CountService {
        var svc = new Inventory.Count.CountService(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        svc.InitializeModel();
        return svc;
    }

});
