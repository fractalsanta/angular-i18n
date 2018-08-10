describe("@ts Navigation Service", function () {
    var testService;
    var rootScope;
    var authServiceMock;
    var settingServiceMock;
    beforeEach(function () {
        inject(function ($rootScope, $q) {
            rootScope = $rootScope;
            authServiceMock = new Core.Tests.AuthServiceMock();
            settingServiceMock = new Core.Tests.SettingServiceMock($q);
            testService = new Core.NavigationService(authServiceMock.Object, {
                Get: function () {
                    var status = [
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
            }, {
                HubExists: function () {
                    return true;
                },
                SetSignalREventListener: function (name, handler) { },
                SetConnectedListener: function (listener, scope) { },
                SetReconnectedListener: function (listener) { },
                SetDisconnectedListener: function (listener) { }
            }, new Core.Tests.TranslationServiceMock($q).Object, settingServiceMock.Object, rootScope, {});
        });
    });
    it("should define public methods.", function () {
        expect(testService.NavItems).toBeDefined();
        expect(testService.NavState).toBeDefined();
    });
    it("should return a valid collection of nav items before setup resolution.", function () {
        var results = testService.NavItems();
        expect(results).not.toBeNull();
        expect(results.length).toBe(0);
    });
    it("should return a valid nav state object before setup resolution.", function () {
        var result = testService.NavState();
        expect(result).not.toBeNull();
        expect(result.Expanded).toBeDefined();
    });
    it("should provide a single collection reference for nav items, and not a copy, for proper view tracking.", function () {
        var results = testService.NavItems();
        results.push({});
        var nextResults = testService.NavItems();
        expect(results).toBe(nextResults);
        expect(results.length).toBe(nextResults.length);
        expect(results[0]).toBe(nextResults[0]);
    });
    it("should update the nav items collection after receiving translations.", function () {
        var results = testService.NavItems();
        expect(results).not.toBeNull();
        expect(results.length).toBe(0);
        rootScope.$digest();
        expect(results.length).not.toBe(0);
    });
    it("should have navs with subnav collections that have a length, as having a subnav collection can affect rendering.", function () {
        rootScope.$digest();
        var results = testService.NavItems();
        expect(_.all(results, function (navItem) {
            return (!navItem.SubNavs || (navItem.SubNavs.length > 0));
        })).toBeTruthy();
    });
    it("should be able to remove nav items based on permissions.", function () {
        var navItems = testService.NavItems(), privateMethodName = "ProcessMenuPermissions";
        navItems.push({ Title: "Test", Permissions: [1] });
        var results = testService[privateMethodName](navItems);
        expect(results).not.toBeNull();
        expect(results.length).toBe(1);
        authServiceMock.GrantAllPermissions(false);
        results = testService[privateMethodName](navItems);
        expect(results).not.toBeNull();
        expect(results.length).toBe(0);
    });
});
