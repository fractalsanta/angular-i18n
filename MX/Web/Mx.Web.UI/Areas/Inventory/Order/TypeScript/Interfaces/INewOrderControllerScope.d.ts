declare module Inventory.Order {

    interface INewOrderControllerScope extends ng.IScope {
        FormData: INewOrderForm;

        OpenDeliveryDate($event: Event): void;
        OpenCoverDate($event: Event): void;

        OnDeliveryChange(newDate: Date): void;
        OnCoverChange(newDate: Date): void;

        CollapseCalendars(): void;

        Cancel(): void;
        Confirm(): void;

        Translations: Api.Models.IL10N;
        SelectVendor(vendor: Api.Models.IVendor): void;
        SetPreferredVendor($event: Event, vendorId: number): void;
        UpdatePeriodClosedStatus(): void;        
    }
}