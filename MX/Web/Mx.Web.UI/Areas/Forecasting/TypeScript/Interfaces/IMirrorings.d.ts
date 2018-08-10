declare module Forecasting {
    export interface IMirroringStateParams {
    }

    export interface IMirroringState {
        ViewName: string;
        Url: string;
        TemplateUrl: string;
        Controller: Core.NG.INamedController;
        GetTitle: () => string;
        Permissions?: Core.Api.Models.Task[]
    }

    export interface IMirroringStatesContainer {
        L10N: Api.Models.ITranslations;
        Views: IMirroringState[];
        StateName: string;
        Template: string;
        Url: string;
        GetState(name: string): IMirroringState;
    }

    export interface IMirrorInterval {
        SourceDateStart: string;
        TargetDateStart: string;
        TargetDateEnd: string;
        Adjustment: number;

        SourceDateStartDate?: Date;
        SourceDateEndDate?: Date;
        TargetDateStartDate?: Date;
        TargetDateEndDate?: Date;
        AdjustmentPercent?: string;
    }

    export interface IMySalesItemMirroringInterval extends Forecasting.Api.Models.ISalesItemMirrorInterval, IMirrorInterval {
    }

    export interface IMyStoreMirrorIntervalGroup extends Forecasting.Api.Models.IStoreMirrorIntervalGroup, IMirrorInterval {
        IsAllDay : boolean;
    }

    export interface IMyStoreMirrorInterval extends Forecasting.Api.Models.IStoreMirrorInterval, IMirrorInterval {
    }
}