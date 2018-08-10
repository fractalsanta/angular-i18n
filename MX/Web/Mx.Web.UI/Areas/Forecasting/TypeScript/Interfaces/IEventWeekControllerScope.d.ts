declare module Forecasting {
    export interface IWeekDay {
        Date: Date;
        EventWeekDayInfo: Api.Models.IEventWeekDayInfo;
    }

    export interface IEventWeekControllerScope extends ng.IScope {
        Vm: {
            Days: IWeekDay[];
            InitialDate: Date;
        };

        ChangeDates: Core.IChangeWeekCallback;
        GetSelectedEventProfileTag(): Api.Models.IEventProfileTag;
        SetSelectedEventProfileTag(tag: Api.Models.IEventProfileTag);
        SelectDate(day: Date);

        CheckAnyEventsScheduled(day: Forecasting.IWeekDay): boolean;
        CheckDateIsEditable(day: Date): boolean;
        CheckEventTagIsEditable(): boolean;

        L10N: Api.Models.ITranslations;
        NoteMaxLength: number;

        CheckCanEditPermission(): boolean;

        NewEventProfile(): void;
        EditEventProfile(): void;

        AddEventTag(): void;

        UpdateNote(): void;

        Profiles: Api.Models.IEventProfile[];
    }
}