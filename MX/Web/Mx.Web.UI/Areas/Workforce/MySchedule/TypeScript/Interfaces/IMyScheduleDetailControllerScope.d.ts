declare module Workforce.MySchedule {
    export interface IMyScheduleDetailControllerScope extends ng.IScope {
        GetShift(): Api.Models.ICalendarEntry;
        GetManagerShifts(): Api.Models.ICalendarEntry[];
        ShareScheduleShift(): void;
        GetTeamShifts(): Api.Models.ICalendarEntry[];
        GetTimeOffStatus(calEntry: Api.Models.ICalendarEntry): { Status: string; Icon: string };
        GetManagerPhoneNumber(manager: Api.Models.ICalendarEntry): string;
        L10N: Api.Models.IL10N;
    }
}  