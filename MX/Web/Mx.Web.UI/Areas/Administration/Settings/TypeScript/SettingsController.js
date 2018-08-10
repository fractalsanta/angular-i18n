var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var SettingsController = (function () {
            function SettingsController($scope, $state, $authService, popupMessageService, translationService, settingsContainer) {
                var _this = this;
                this.$scope = $scope;
                this.$state = $state;
                this.$authService = $authService;
                this.popupMessageService = popupMessageService;
                this.translationService = translationService;
                this.settingsContainer = settingsContainer;
                this.Initialize();
                this.SelectFirstUiRouterState();
                this.$scope.GetSettingsType = function () {
                    return _this._settings;
                };
            }
            SettingsController.prototype.Initialize = function () {
                var _this = this;
                this._user = this.$authService.GetUser();
                this.translationService.GetTranslations().then(function (l10NData) {
                    _this.$scope.L10N = l10NData.Settings;
                    _this.settingsContainer.L10N = _this.$scope.L10N;
                });
                this._settings = _.filter(this.settingsContainer.SettingTypes, function (settingType) { return _this.$authService.CheckPermissionsAllowance(settingType.Permissions); });
                this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, function () {
                    if (_this.$state.current.name === _this.settingsContainer.StateName) {
                        _this.SelectFirstUiRouterState();
                    }
                });
            };
            SettingsController.prototype.SelectFirstUiRouterState = function () {
                if (this._settings.length > 0) {
                    this.$state.go(this.settingsContainer.StateName + "." + this._settings[0].SettingName);
                }
            };
            return SettingsController;
        }());
        Settings.settingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("SettingsController", SettingsController, Core.NG.$typedScope(), Core.NG.$state, Core.Auth.$authService, Core.$popupMessageService, Core.$translation, Settings.AdministrationSettings);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
