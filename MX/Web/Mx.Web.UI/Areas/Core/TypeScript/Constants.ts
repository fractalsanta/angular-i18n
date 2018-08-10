module Core {

    export interface IStringDictionary {
        [key: string]: string;
    };

    export interface IConstants extends Core.Api.Models.IConstants {
        GoogleAnalyticsAccounts: IStringDictionary;
    }

    export var Constants: NG.INamedDependency<Core.IConstants> = { name: "Core.Constants" };
} 