/// <reference path="../../../../core/tests/testframework.ts" />
/// <reference path="../../../../core/tests/mocks/translationservicemock.ts" />
/// <reference path="../../../../core/tests/mocks/popupmessageservicemock.ts" />
/// <reference path="../../../../Forecasting/Typescript/Tests/ForecastFilterServiceMock.ts"/>
/// <reference path="../../../../Forecasting/Typescript/Tests/ForecastFilterAssignServiceMock.ts"/>

/// <reference path="../../typescript/controllers/ForecastFilterUsageSettingsController.ts" />

module Core.Tests {
    "use strict";

    import FApi = Forecasting.Api;

    describe("@ts forecast filter usage setting Controller", (): void => {
        var q: ng.IQService,
            rootScope: Administration.Settings.IForecastFilterUsageSettingsControllerScope,
            translationServiceMock: TranslationServiceMock,
            popupMessageServiceMock: PopupMessageServiceMock,
            authenticationServiceMock: Core.Tests.AuthServiceMock,
            locationService: ng.ILocationService,
            forecastFilterServiceMock: Forecasting.Tests.ForecastFilterServiceMock,
            forecastFilterAssignServiceMock: Forecasting.Tests.ForecastFilterAssignServiceMock;

        var createTestController = (): Administration.Settings.ForecastFilterUsageSettingsController => {
            return new Administration.Settings.ForecastFilterUsageSettingsController(
                rootScope,
                translationServiceMock.Object,
                popupMessageServiceMock,
                authenticationServiceMock.Object,
                locationService,
                forecastFilterServiceMock.Object,
                forecastFilterAssignServiceMock.Object
                );
        };

        beforeEach(() => {
            inject(($rootScope: Administration.Settings.IForecastFilterUsageSettingsControllerScope, $q: ng.IQService, $location: ng.ILocationService): void => {
                q = $q;
                rootScope = $rootScope;
                translationServiceMock = new TranslationServiceMock(q);
                locationService = $location;
                forecastFilterServiceMock = new Forecasting.Tests.ForecastFilterServiceMock($q);                
                forecastFilterAssignServiceMock = new Forecasting.Tests.ForecastFilterAssignServiceMock($q);                
            });

            popupMessageServiceMock = new PopupMessageServiceMock();
            authenticationServiceMock = new AuthServiceMock();
        });

        it("requires proper authorization to access", (): void => {
            authenticationServiceMock.GrantAllPermissions(false);

            createTestController();

            expect(locationService.path()).toBe("/Core/Forbidden");
            expect(rootScope.Vm).toBeUndefined();
        });

        it("defines all scope methods and non-promise models upon initialization", (): void => {
            createTestController();

            expect(rootScope.Vm).toBeDefined();
            expect(rootScope.Vm.Functions).toBeDefined();
            expect(rootScope.Vm.ForecastFilters).toBeDefined();
            expect(rootScope.Vm.IsDirty).toBe(false);
        });

        it("loads translations correctly.", (): void => {
            spyOn(translationServiceMock.Object, "GetTranslations").and.callThrough();
            spyOn(popupMessageServiceMock, "SetPageTitle").and.callThrough();

            var forecastFilterUsageSettingsController = createTestController();

            rootScope.$digest();
            rootScope.$digest();

            expect(popupMessageServiceMock.SetPageTitle).toHaveBeenCalled();
            rootScope.$digest();
            expect(rootScope.Translations.Save).toBe("Save");
        });

        it("retrieves site settings from Web API.", (): void => {
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

        it("persists site settings to Web API.", (): void => {
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
} 