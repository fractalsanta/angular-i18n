declare module Forecasting {
    export interface IPromotionDetailsControllerScope extends ng.IScope {
        L10N: Api.Models.IPromotionTranslations;

        IsNew(): boolean;
        IsLoaded(): boolean;
        CanSave(): boolean;
        CanDelete(): boolean;
        CanEditName(): boolean;
        CanEditStartDate(): boolean;
        CanEditEndDate(): boolean;
        CanEditLTO(): boolean;
        CanEditOverwrite(): boolean;
        CanEditItems(): boolean;
        CanEditZones(): boolean;
        CanEditStores(): boolean;
        CanSwitchToStores(): boolean;
        Save(): void;
        Delete(): void;
        Back(): void;
        ToggleZone(zoneId: number): void;
        AddItems(impacted: boolean): void;
        DeleteItem(item: Api.Models.IPromotionSalesItem): void;
        OpenDateRange(): void;

        Vm: {
            Promotion: Api.Models.IPromotion;
            Zones: Api.Models.IZone[];
            Form?: ng.IFormController;
            TreeConfig: ngJsTree.Configuration;
            TreeData: ngJsTree.Node[];
            TreeEvents: any;
            Tree?: any;
        };
    }
}   