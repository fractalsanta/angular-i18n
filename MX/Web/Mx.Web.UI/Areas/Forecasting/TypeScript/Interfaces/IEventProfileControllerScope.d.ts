declare module Forecasting {
    export interface IEventProfileControllerScope extends ng.IScope {
        Cancel(): void;
        EnterAdjustments(): void;
        NavigateToManualAdjustmentsGrid(): void;
        SaveProfileModalClick(): void;
        SaveProfileFromGrid(): void;
        MarkInvalidProfileName(): void;
        AlertInvalidProfileNameFromGrid(): void;
        InputFocus(e: Event): void;
        UpdateMethod(): void;
        UpdateName(): void;
        OnDatePickerChange(selectedDate: Date): void;
        AddPastOccurrence(date: Date): void;
        RemovePastOccurrence(date: Date): void;
        MarkPageAsDirty(): void;
        MarkPageAsClean(): void;
        SelectEventProfile(): void;

        Translation: Forecasting.Api.Models.ITranslations;
        NoteMaxLength: number;
        DatePickerOptions: Core.NG.IMxDayPickerOptions;
        PastOccurrences: Forecasting.Api.Models.IEventProfileHistory[];
        Profile: Forecasting.Api.Models.IEventProfile;
        Profiles: Forecasting.Api.Models.IEventProfile[];
        SelectedDate: Date;
        Yesterday: Date;
        EditMode: boolean;
        ProfileIdWrapper: { Id: number };
        EventProfileSourceSelected: { Source: number };
        InvalidProfileName: boolean;
        ErrorMessage: string;
    }
} 