module Administration.Settings {
    export var SettingsState = new Core.NG.StateNode(AdmSettingsContainer.StateName, AdmSettingsContainer.Url, AdmSettingsContainer.Template, settingsController);
    _.forEach(AdmSettingsContainer.SettingTypes, (setting) => {
        var childState = new Core.NG.StateNode(setting.SettingName, setting.Url, setting.TemplateUrl, setting.Controller);
        SettingsState.AddChild(childState);
    });
    Core.NG.AdministrationSettingsModule.RegisterStateTree(SettingsState);
}  