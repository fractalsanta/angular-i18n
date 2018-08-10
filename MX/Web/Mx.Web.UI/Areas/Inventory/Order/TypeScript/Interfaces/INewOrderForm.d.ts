declare module Inventory.Order {

    interface INewOrderForm {
        Vendors: Api.Models.IVendor[];
        SelectedVendor: Api.Models.IVendor;
        DeliveryMinimumDate: Date;
        DeliveryDate: Date;
        CoverUntilDate: Date;
        CoverMinimumDate: Date;
        PreferredVendorId: number;
        ShowDeliveryDate: boolean;
        ShowCoverDate: boolean;
        PeriodClosed: boolean;
    }
}