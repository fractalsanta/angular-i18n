declare module Inventory.Order {
    export interface IFinishReceiveOrderScope extends IBaseApplyDateControllerScope {
        Model: {
            ReceiveWithoutInvoiceNumber: boolean;
            InvoiceNumber: string;
            ApplyDate: Date;
            MaxDate: Date;
            ShowApplyDate: boolean;
            PeriodClosed: boolean;
            PeriodCheckInProgress: boolean;
        };
    }
} 