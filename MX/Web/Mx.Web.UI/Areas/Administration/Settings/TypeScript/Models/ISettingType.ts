module Administration.Settings {

    export interface ISettingType {
        SettingDisplayName: () => string;
        SettingName: string;
        Url: string;
        TemplateUrl: string;
        Controller: Core.NG.INamedController;
        Permissions: Core.Api.Models.Task[]
    }

    export interface ISettingTypeContainer {
        L10N: Administration.Settings.Api.Models.IL10N;
        SettingTypes: ISettingType[];
        StateName: string;
        Template: string;
        Url: string;
    }
} 
 