declare module Inventory.Order {
    export interface IBaseApplyDateControllerScope extends ng.IScope {
        Model: {
            ApplyDate: Date;
            MaxDate: Date;
            ShowApplyDate: boolean;
            PeriodClosed: boolean;
            PeriodCheckInProgress: boolean;
        };
        Translations: Api.Models.IL10N;
        IsApplyDateValid(value: Date): boolean;
        OpenApplyDate($event: Event): void;
        Cancel(): void;
        Confirm(): void;
    }
}
