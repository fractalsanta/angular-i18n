declare module Workforce.MyTimeCard {
    export interface IMyTimeCardControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Vm: {
            Days: IDayEntry[];
            WeekStart: number;
            WeekEnd: number;
            WeekStartString: string;
            WeekEndString: string;
        }

        GetDescription(b: IBreak): string;
        FormatHours(d: IDayEntry): string;
        GetTotalHours(days: IDayEntry[]): string;
        ChangeDates: Core.IChangeWeekCallback;
    }
}