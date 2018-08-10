declare module Workforce.Deliveries {
    export interface IDeliveriesControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        OnDatePickerChange(date: Date): void;
        AuthoriseExtraDelivery(ed: Api.Models.IExtraDeliveryRequest): void;
        DenyExtraDelivery(ed: Api.Models.IExtraDeliveryRequest): void;
        AddExtraDelivery(): void;
        GetStatusById(id: number): {Status: string; Icon: string;};
        Vm: {
            DatePickerOptions: Core.NG.IMxDayPickerOptions;
            SelectedDate: Moment;
            ShowDeliveriesGrid: boolean;
            CanAuthoriseExtraDeliveries: boolean;
            DeliveriesQty: number;
            TotalDeliveriesQty: number;
            ExtraDeliveriesQty: number;
            ExtraDeliveries: Api.Models.IExtraDeliveryRequest[];
        };
    }
}
