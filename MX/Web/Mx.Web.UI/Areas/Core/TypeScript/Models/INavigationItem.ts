module Core {
    export interface INavigationItem {
        Title: string;
        Url?: string;
        Icon?: string;
        SubNavs?: INavigationItem[];
        IsExpanded?: boolean;
        Permissions?: Core.Api.Models.Task[];
        OpenLinkInNewTab?: boolean;
    }
}