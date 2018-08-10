module Administration.Settings {

    interface ISettingsScope extends ng.IScope {
        GetSettingsType(): ISettingType[];
        L10N: Api.Models.IL10N;
    }

    class SettingsController {

        private _user: Core.Auth.IUser;
        private _currentSettingType: ISettingType;
        private _settings: ISettingType[];

        private Initialize() {
            this._user = this.$authService.GetUser();

            this.translationService.GetTranslations().then((l10NData) => {
                this.$scope.L10N = l10NData.Settings;
                this.settingsContainer.L10N = this.$scope.L10N;
            });

            this._settings = _.filter(this.settingsContainer.SettingTypes, settingType => this.$authService.CheckPermissionsAllowance(settingType.Permissions));

            this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, () => {
                if (this.$state.current.name === this.settingsContainer.StateName) {
                    this.SelectFirstUiRouterState();
                }                
            });
        }

        constructor(
            private $scope: ISettingsScope,
            private $state: ng.ui.IStateService,
            private $authService: Core.Auth.IAuthService,
            private popupMessageService: Core.IPopupMessageService,
            private translationService: Core.ITranslationService,
            private settingsContainer: ISettingTypeContainer
            ) {
            this.Initialize();
            this.SelectFirstUiRouterState();

            this.$scope.GetSettingsType = () => {
                return this._settings;
            };
        }

        private SelectFirstUiRouterState() {
            if (this._settings.length > 0) {
                this.$state.go(this.settingsContainer.StateName + "." + this._settings[0].SettingName);
            }
        }
    }

    export var settingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("SettingsController", SettingsController,
        Core.NG.$typedScope<ISettingsScope>(),
        Core.NG.$state,
        Core.Auth.$authService,
        Core.$popupMessageService,
        Core.$translation,
        AdministrationSettings
        );
}
