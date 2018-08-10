var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        Settings.SettingsState = new Core.NG.StateNode(Settings.AdmSettingsContainer.StateName, Settings.AdmSettingsContainer.Url, Settings.AdmSettingsContainer.Template, Settings.settingsController);
        _.forEach(Settings.AdmSettingsContainer.SettingTypes, function (setting) {
            var childState = new Core.NG.StateNode(setting.SettingName, setting.Url, setting.TemplateUrl, setting.Controller);
            Settings.SettingsState.AddChild(childState);
        });
        Core.NG.AdministrationSettingsModule.RegisterStateTree(Settings.SettingsState);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
