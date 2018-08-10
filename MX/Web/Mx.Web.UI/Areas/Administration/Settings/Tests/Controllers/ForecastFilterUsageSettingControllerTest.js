var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts forecast filter usage setting Controller", function () {
            var q, rootScope, translationServiceMock, popupMessageServiceMock, authenticationServiceMock, locationService, forecastFilterServiceMock, forecastFilterAssignServiceMock;
            var createTestController = function () {
                return new Administration.Settings.ForecastFilterUsageSettingsController(rootScope, translationServiceMock.Object, popupMessageServiceMock, authenticationServiceMock.Object, locationService, forecastFilterServiceMock.Object, forecastFilterAssignServiceMock.Object);
            };
            beforeEach(function () {
                inject(function ($rootScope, $q, $location) {
                    q = $q;
                    rootScope = $rootScope;
                    translationServiceMock = new Tests.TranslationServiceMock(q);
                    locationService = $location;
                    forecastFilterServiceMock = new Forecasting.Tests.ForecastFilterServiceMock($q);
                    forecastFilterAssignServiceMock = new Forecasting.Tests.ForecastFilterAssignServiceMock($q);
                });
                popupMessageServiceMock = new Tests.PopupMessageServiceMock();
                authenticationServiceMock = new Tests.AuthServiceMock();
            });
            it("requires proper authorization to access", function () {
                authenticationServiceMock.GrantAllPermissions(false);
                createTestController();
                expect(locationService.path()).toBe("/Core/Forbidden");
                expect(rootScope.Vm).toBeUndefined();
            });
            it("defines all scope methods and non-promise models upon initialization", function () {
                createTestController();
                expect(rootScope.Vm).toBeDefined();
                expect(rootScope.Vm.Functions).toBeDefined();
                expect(rootScope.Vm.ForecastFilters).toBeDefined();
                expect(rootScope.Vm.IsDirty).toBe(false);
            });
            it("loads translations correctly.", function () {
                spyOn(translationServiceMock.Object, "GetTranslations").and.callThrough();
                spyOn(popupMessageServiceMock, "SetPageTitle").and.callThrough();
                var forecastFilterUsageSettingsController = createTestController();
                rootScope.$digest();
                rootScope.$digest();
                expect(popupMessageServiceMock.SetPageTitle).toHaveBeenCalled();
                rootScope.$digest();
                expect(rootScope.Translations.Save).toBe("Save");
            });
            it("retrieves site settings from Web API.", function () {
                spyOn(forecastFilterServiceMock.Object, "GetForecastFilters").and.callThrough();
                spyOn(forecastFilterAssignServiceMock.Object, "GetForecastFilterAssigns").and.callThrough();
                var forecastFilterUsageSettingsController = createTestController();
                spyOn(forecastFilterUsageSettingsController, "LoadData").and.callThrough();
                rootScope.$digest();
                rootScope.$digest();
                expect(forecastFilterUsageSettingsController.LoadData).toHaveBeenCalled();
                expect(forecastFilterServiceMock.Object.GetForecastFilters).toHaveBeenCalled();
                expect(forecastFilterAssignServiceMock.Object.GetForecastFilterAssigns).toHaveBeenCalled();
            });
            it("persists site settings to Web API.", function () {
                spyOn(forecastFilterAssignServiceMock.Object, "PostForecastFilterAssign").and.callThrough();
                spyOn(popupMessageServiceMock, "ShowSuccess").and.callThrough();
                var forecastFilterUsageSettingsController = createTestController();
                rootScope.FilterChanged();
                expect(rootScope.Vm.IsDirty).toBe(true);
                rootScope.SaveForecastFilterUsageSettings();
                rootScope.$digest();
                rootScope.$digest();
                expect(forecastFilterAssignServiceMock.Object.PostForecastFilterAssign).toHaveBeenCalled();
                expect(rootScope.Vm.IsDirty).toBe(false);
                expect(popupMessageServiceMock.ShowSuccess).toHaveBeenCalled();
            });
        });
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
