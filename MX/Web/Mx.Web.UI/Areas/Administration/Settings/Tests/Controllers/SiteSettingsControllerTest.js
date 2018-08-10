var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        describe("@ts Site Settings Controller", function () {
            var rootScope;
            var q;
            var popupMessageServiceMock;
            var translationServiceMock;
            var siteSettingsServiceMock;
            var authenticationServiceMock;
            var systemSettingsServiceMock;
            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    rootScope = $rootScope;
                    q = $q;
                    popupMessageServiceMock = new Tests.PopupMessageServiceMock();
                    translationServiceMock = new Tests.TranslationServiceMock(q);
                    siteSettingsServiceMock = new Administration.Settings.Tests.SiteSettingsServiceMock(q);
                    authenticationServiceMock = new Tests.AuthServiceMock();
                    systemSettingsServiceMock = new Tests.SystemSettingsServiceMock();
                    siteSettingsServiceMock.SetSiteSettingsTest({
                        LoginColorScheme: 0
                    });
                });
            });
            it("loads translations correctly.", function () {
                spyOn(translationServiceMock.Object, "GetTranslations").and.callThrough();
                spyOn(popupMessageServiceMock, "SetPageTitle").and.callThrough();
                var settingsController = new Administration.Settings.SiteSettingsController(rootScope, translationServiceMock.Object, popupMessageServiceMock, siteSettingsServiceMock, authenticationServiceMock.Object, systemSettingsServiceMock.Object);
                rootScope.$digest();
                rootScope.$digest();
                expect(popupMessageServiceMock.SetPageTitle).toHaveBeenCalled();
                rootScope.$digest();
                expect(rootScope.Translations.Save).toBe("Save");
            });
            it("persists site settings to Web API and typescript system settings service.", function () {
                var testThemeName = "theme1";
                var testThemeId = 1;
                spyOn(systemSettingsServiceMock.Object, "UpdateLoginPageColorScheme").and.callThrough();
                spyOn(siteSettingsServiceMock, "PostSiteSettings").and.callThrough();
                var settingsController = new Administration.Settings.SiteSettingsController(rootScope, translationServiceMock.Object, popupMessageServiceMock, siteSettingsServiceMock, authenticationServiceMock.Object, systemSettingsServiceMock.Object);
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
            it("retrieves site settings from Web API.", function () {
                var testThemeName = "theme3";
                var testThemeId = 3;
                spyOn(siteSettingsServiceMock, "GetSiteSettings").and.callThrough();
                siteSettingsServiceMock.SetSiteSettingsTest({ LoginColorScheme: testThemeId });
                var settingsController = new Administration.Settings.SiteSettingsController(rootScope, translationServiceMock.Object, popupMessageServiceMock, siteSettingsServiceMock, authenticationServiceMock.Object, systemSettingsServiceMock.Object);
                rootScope.$digest();
                expect(siteSettingsServiceMock.GetSiteSettings).toHaveBeenCalled();
                expect(rootScope.SelectedSchemeName).toBe(testThemeName);
            });
        });
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
