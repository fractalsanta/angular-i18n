var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        (function (LoginPageColorSchemes) {
            LoginPageColorSchemes[LoginPageColorSchemes["theme0"] = 0] = "theme0";
            LoginPageColorSchemes[LoginPageColorSchemes["theme1"] = 1] = "theme1";
            LoginPageColorSchemes[LoginPageColorSchemes["theme2"] = 2] = "theme2";
            LoginPageColorSchemes[LoginPageColorSchemes["theme3"] = 3] = "theme3";
            LoginPageColorSchemes[LoginPageColorSchemes["theme4"] = 4] = "theme4";
            LoginPageColorSchemes[LoginPageColorSchemes["theme5"] = 5] = "theme5";
            LoginPageColorSchemes[LoginPageColorSchemes["theme6"] = 6] = "theme6";
            LoginPageColorSchemes[LoginPageColorSchemes["theme7"] = 7] = "theme7";
            LoginPageColorSchemes[LoginPageColorSchemes["theme8"] = 8] = "theme8";
        })(Settings.LoginPageColorSchemes || (Settings.LoginPageColorSchemes = {}));
        var LoginPageColorSchemes = Settings.LoginPageColorSchemes;
        var SiteSettingsController = (function () {
            function SiteSettingsController($scope, translationService, popupMessageService, siteSettingService, $authService, $systemSettingsService) {
                this.$scope = $scope;
                this.translationService = translationService;
                this.siteSettingService = siteSettingService;
                this.siteSettingService.GetSiteSettings().then(function (result) {
                    $scope.SelectedSchemeName = LoginPageColorSchemes[result.data.LoginColorScheme];
                });
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.Settings;
                    popupMessageService.SetPageTitle($scope.Translations.Site + " " + $scope.Translations.Settings);
                });
                $scope.GetLoginColorSchemes = function () {
                    var allSchemes = [];
                    for (var scheme in LoginPageColorSchemes) {
                        var isValueProperty = parseInt(scheme, 10) >= 0;
                        if (isValueProperty) {
                            allSchemes.push(LoginPageColorSchemes[scheme]);
                        }
                    }
                    return allSchemes;
                };
                $scope.SetSelectedSchemeName = function (scheme) {
                    $scope.SelectedSchemeName = scheme;
                };
                $scope.SaveSiteSettings = function () {
                    var scheme = Number(LoginPageColorSchemes[$scope.SelectedSchemeName]);
                    var settings = {
                        LoginColorScheme: scheme
                    };
                    siteSettingService.PostSiteSettings(settings).then(function () {
                        $systemSettingsService.UpdateLoginPageColorScheme(settings.LoginColorScheme);
                        popupMessageService.ShowSuccess($scope.Translations.SiteSettingsSaved);
                    });
                };
            }
            return SiteSettingsController;
        }());
        Settings.SiteSettingsController = SiteSettingsController;
        Settings.siteSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("SiteSettingsController", SiteSettingsController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Administration.Settings.Api.$siteSettingsService, Core.Auth.$authService, Core.$systemSettingsService);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
