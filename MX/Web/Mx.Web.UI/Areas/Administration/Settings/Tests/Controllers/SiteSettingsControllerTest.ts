/// <reference path="../../../../core/tests/testframework.ts" />
/// <reference path="../../../../core/tests/mocks/translationservicemock.ts" />
/// <reference path="../../../../core/tests/mocks/popupmessageservicemock.ts" />
/// <reference path="../mocks/sitesettingsservicemock.ts" />
/// <reference path="../../../../core/tests/mocks/systemsettingsservicemock.ts" />

/// <reference path="../../typescript/controllers/sitesettingscontroller.ts" />

module Core.Tests {
    describe("@ts Site Settings Controller", (): void => {

        var rootScope: Administration.Settings.ISiteSettingsControllerScope;
        var q: ng.IQService;
        var popupMessageServiceMock: PopupMessageServiceMock;
        var translationServiceMock: TranslationServiceMock;
        var siteSettingsServiceMock: Administration.Settings.Tests.SiteSettingsServiceMock;
        var authenticationServiceMock: Core.Tests.AuthServiceMock;
        var systemSettingsServiceMock: Core.Tests.SystemSettingsServiceMock;

        beforeEach(() => {
            inject(($rootScope: Administration.Settings.ISiteSettingsControllerScope, $q: ng.IQService): void => {
                rootScope = $rootScope;
                q = $q;
                popupMessageServiceMock = new PopupMessageServiceMock();
                translationServiceMock = new TranslationServiceMock(q);
                siteSettingsServiceMock = new Administration.Settings.Tests.SiteSettingsServiceMock(q);
                authenticationServiceMock = new AuthServiceMock();
                systemSettingsServiceMock = new SystemSettingsServiceMock();

                siteSettingsServiceMock.SetSiteSettingsTest({
                    LoginColorScheme: 0
                });
            });
        });

        it("loads translations correctly.", (): void => {

            spyOn(translationServiceMock.Object, "GetTranslations").and.callThrough();
            spyOn(popupMessageServiceMock, "SetPageTitle").and.callThrough();

            var settingsController = new Administration.Settings.SiteSettingsController(
                rootScope,
                translationServiceMock.Object,
                popupMessageServiceMock,
                siteSettingsServiceMock,
                authenticationServiceMock.Object,
                systemSettingsServiceMock.Object);

            rootScope.$digest();
            rootScope.$digest();

            expect(popupMessageServiceMock.SetPageTitle).toHaveBeenCalled();
            rootScope.$digest();
            expect(rootScope.Translations.Save).toBe("Save");
        });

        it("persists site settings to Web API and typescript system settings service.", (): void => {

            var testThemeName = "theme1";
            var testThemeId = 1;

            spyOn(systemSettingsServiceMock.Object, "UpdateLoginPageColorScheme").and.callThrough();
            spyOn(siteSettingsServiceMock, "PostSiteSettings").and.callThrough();

            var settingsController = new Administration.Settings.SiteSettingsController(
                rootScope,
                translationServiceMock.Object,
                popupMessageServiceMock,
                siteSettingsServiceMock,
                authenticationServiceMock.Object,
                systemSettingsServiceMock.Object);

            rootScope.$digest();

            rootScope.SetSelectedSchemeName(testThemeName);

            expect(rootScope.SelectedSchemeName).toBe(testThemeName);

            rootScope.SaveSiteSettings();

            rootScope.$digest();

            expect(systemSettingsServiceMock.Object.UpdateLoginPageColorScheme).toHaveBeenCalled();
            expect(systemSettingsServiceMock.Object.GetLoginPageColorScheme()).toBe(testThemeId);

            expect(siteSettingsServiceMock.PostSiteSettings).toHaveBeenCalled();
            expect(siteSettingsServiceMock.GetSiteSettingsTest().LoginColorScheme).toBe(testThemeId);
        });

        it("retrieves site settings from Web API.", (): void => {

            var testThemeName = "theme3";
            var testThemeId = 3;

            spyOn(siteSettingsServiceMock, "GetSiteSettings").and.callThrough();

            siteSettingsServiceMock.SetSiteSettingsTest({ LoginColorScheme: testThemeId });

            var settingsController = new Administration.Settings.SiteSettingsController(
                rootScope,
                translationServiceMock.Object,
                popupMessageServiceMock,
                siteSettingsServiceMock,
                authenticationServiceMock.Object,
                systemSettingsServiceMock.Object);

            rootScope.$digest();

            expect(siteSettingsServiceMock.GetSiteSettings).toHaveBeenCalled();
            expect(rootScope.SelectedSchemeName).toBe(testThemeName);
        });
    });
}