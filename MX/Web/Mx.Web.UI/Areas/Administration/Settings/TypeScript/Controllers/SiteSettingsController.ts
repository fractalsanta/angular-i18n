module Administration.Settings {

    import Task = Core.Api.Models.Task;

    export interface ISiteSettingsControllerScope extends ng.IScope {
        Translations: Administration.Settings.Api.Models.IL10N;
        IsDirty(): boolean;
        GetLoginColorSchemes(): string[];
        SaveSiteSettings(): void;
        GetSchemeClassName(schemeIndex: number): string;
        SetSelectedSchemeName(scheme: string): void;
        SelectedSchemeName: string;
    }

    // colour schemes must be in sync with the classes declared in logon.less
    export enum LoginPageColorSchemes {
        theme0 = 0,
        theme1 = 1,
        theme2 = 2,
        theme3 = 3,
        theme4 = 4,
        theme5 = 5,
        theme6 = 6,
        theme7 = 7,
        theme8 = 8
    }

    export class SiteSettingsController {

        constructor(
            private $scope: ISiteSettingsControllerScope,
            private translationService: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            private siteSettingService: Administration.Settings.Api.ISiteSettingsService,
            $authService: Core.Auth.IAuthService,
            $systemSettingsService: Core.ISystemSettingsService
            ) {
            
            this.siteSettingService.GetSiteSettings().then((result) => {
                $scope.SelectedSchemeName = LoginPageColorSchemes[result.data.LoginColorScheme];
            });
            
            translationService.GetTranslations().then((result) => {
                $scope.Translations = result.Settings;
                popupMessageService.SetPageTitle($scope.Translations.Site + " " +  $scope.Translations.Settings);
            });

            $scope.GetLoginColorSchemes = () => {
                var allSchemes: string[] = [];
                for (var scheme in LoginPageColorSchemes) {
                    var isValueProperty = parseInt(scheme, 10) >= 0;
                    if (isValueProperty) {
                        allSchemes.push(LoginPageColorSchemes[scheme]);
                    }
                }
                return allSchemes;
            }

            $scope.SetSelectedSchemeName = (scheme) => {
                $scope.SelectedSchemeName = scheme;
            };
            
            $scope.SaveSiteSettings = () => {
                var scheme: number = Number(LoginPageColorSchemes[$scope.SelectedSchemeName]);
                var settings: Administration.Settings.Api.Models.ISiteSettings = {
                    LoginColorScheme: scheme
                };
                siteSettingService.PostSiteSettings(settings).then(() => {
                    $systemSettingsService.UpdateLoginPageColorScheme(settings.LoginColorScheme);
                    popupMessageService.ShowSuccess($scope.Translations.SiteSettingsSaved);
                });
            };

        }
    }

    export var siteSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("SiteSettingsController", SiteSettingsController
        , Core.NG.$typedScope<ISiteSettingsControllerScope>()
        , Core.$translation
        , Core.$popupMessageService
        , Administration.Settings.Api.$siteSettingsService
        , Core.Auth.$authService
        , Core.$systemSettingsService
        );

} 