/// <reference path="../TestFramework.ts" />
/// <reference path="../../TypeScript/Models/INavigationItem.ts"/>
/// <reference path="../../TypeScript/Models/ICountNavigationItem.ts"/>
/// <reference path="../../TypeScript/Models/ISignalR.ts"/>
/// <reference path="../../TypeScript/Services/SignalREvents.ts"/>
/// <reference path="../../TypeScript/Services/SignalRHub.ts"/>
/// <reference path="../../TypeScript/Services/SignalRService.ts"/>
/// <reference path="../Mocks/SettingServiceMock.ts" />
/// <reference path="../../TypeScript/Services/NavigationService.ts"/>

describe("@ts Navigation Service", (): void => {
    var testService: Core.INavigationService;
    var rootScope: ng.IScope;
    var authServiceMock: Core.Tests.AuthServiceMock;
    var settingServiceMock: Core.Tests.SettingServiceMock;

    beforeEach((): void => {
        inject(($rootScope: ng.IScope, $q: ng.IQService): void => {
            rootScope = $rootScope;

            authServiceMock = new Core.Tests.AuthServiceMock();
            settingServiceMock = new Core.Tests.SettingServiceMock($q);

            testService = new Core.NavigationService(
                authServiceMock.Object,
                <Inventory.Count.Api.ICountTypeService>{
                    Get(): ng.IHttpPromise<Inventory.Count.Api.Models.ICountStatusResponse[]> {
                        var status: Inventory.Count.Api.Models.ICountStatusResponse[] =
                            [
                                {
                                    CountOf: 1,
                                    IsActive: true
                                },
                                {
                                    CountOf: 2,
                                    IsActive: true
                                },
                                {
                                    CountOf: 3,
                                    IsActive: true
                                }
                            ];

                        return new PromiseHelper($q).CreateHttpPromise(status);
                    }
                },
                <Core.ISignalRService>{
                    HubExists(): boolean {
                        return true;
                    },
                    SetSignalREventListener(name: any, handler: any): void { },
                    SetConnectedListener(listener: () => any, scope?: ng.IScope): void { },
                    SetReconnectedListener(listener: () => any): void { },
                    SetDisconnectedListener(listener: () => any): void { }
                },
                new Core.Tests.TranslationServiceMock($q).Object,
                settingServiceMock.Object,
                rootScope,
                <ng.ui.bootstrap.IModalStackService>{}
                );
        });
    });

    it("should define public methods.", (): void => {
        expect(testService.NavItems).toBeDefined();
        expect(testService.NavState).toBeDefined();
    });

    it("should return a valid collection of nav items before setup resolution.", (): void => {
        var results = testService.NavItems();

        expect(results).not.toBeNull();
        expect(results.length).toBe(0);
    });

    it("should return a valid nav state object before setup resolution.", (): void => {
        var result = testService.NavState();

        expect(result).not.toBeNull();
        expect(result.Expanded).toBeDefined();
    });

    it("should provide a single collection reference for nav items, and not a copy, for proper view tracking.", (): void => {
        var results = testService.NavItems();

        results.push(<Core.INavigationItem>{});

        var nextResults = testService.NavItems();

        expect(results).toBe(nextResults);
        expect(results.length).toBe(nextResults.length);
        expect(results[0]).toBe(nextResults[0]);
    });

    it("should update the nav items collection after receiving translations.", (): void => {
        var results = testService.NavItems();

        expect(results).not.toBeNull();
        expect(results.length).toBe(0);

        rootScope.$digest();

        expect(results.length).not.toBe(0);
    });

    it("should have navs with subnav collections that have a length, as having a subnav collection can affect rendering.", (): void => {
        // This test serves as a sanity check against the currently defined navigation object graph with full permissions.
        // Should catch any nav items with empty subnavs, which should only occur after possible permission restriction.
        // Empty subnavs result in the nav item not rendering due to being considered only a container nav item.
        rootScope.$digest();

        var results = testService.NavItems();

        expect(_.all(results, (navItem: Core.INavigationItem): boolean => {
            return (!navItem.SubNavs || (navItem.SubNavs.length > 0));
        })).toBeTruthy();
    });

    it("should be able to remove nav items based on permissions.", (): void => {
        var navItems = testService.NavItems(),
            privateMethodName = "ProcessMenuPermissions";

        navItems.push(<Core.INavigationItem>{ Title: "Test", Permissions: [1] });

        var results = testService[privateMethodName](navItems);

        expect(results).not.toBeNull();
        expect(results.length).toBe(1);

        authServiceMock.GrantAllPermissions(false);

        results = testService[privateMethodName](navItems);

        expect(results).not.toBeNull();
        expect(results.length).toBe(0);
    });
});