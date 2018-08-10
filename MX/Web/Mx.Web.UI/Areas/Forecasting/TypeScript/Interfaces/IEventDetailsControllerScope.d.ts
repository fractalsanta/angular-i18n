declare module Forecasting {
    export interface IEventDetailsControllerScope extends IEventControllerScope {

        DisableEdit(): boolean;
        Back(): void;
        CheckCanEditPermission(): boolean;
        GetSelectedEventProfileTag(): Api.Models.IEventProfileTag;
        GetSelectedProfile(): Api.Models.IEventProfile;
        UpdateNote(): void;
        EditEventTag(): void;
        Edit(): void;
        EditCancel(): void;
        EditSave(): void;
        DeleteEventTag(): void;
        SelectEventProfile(): void;
        OnDatePickerChange(d: Date): void;
        IsManual(): boolean;
        IsPastEdit(): boolean;

        L10N: Api.Models.ITranslations;
        NoteMaxLength: number;
        DatePickerOptions: Core.NG.IMxDayPickerOptions;


        Model: {
            IsEdit: boolean;
            IsFullEdit: boolean;
            EditDate: Date;
            ProfileId: number;
            Note: string;
            Profile: Forecasting.Api.Models.IEventProfile;
            Profiles: Forecasting.Api.Models.IEventProfile[];
        }
    }
}