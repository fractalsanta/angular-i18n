declare module Workforce.MySchedule {

    export interface IMyScheduleService {
        SetSelectedShift(shift: Api.Models.ICalendarEntry): void;
        GetSelectedShift(): Api.Models.ICalendarEntry;
        ResetShiftSelection(): void;
        GetShiftsByDateRange(startDate: Moment, endDate: Moment): ng.IPromise<Api.Models.ICalendarEntry[]>;
        GetTimeOffRequestsByDateRange(startDate: Moment, endDate: Moment): ng.IPromise<Api.Models.ITimeOffRequest[]>;
        SortShiftsByStartDate(shifts: Array<Workforce.MySchedule.Api.Models.ICalendarEntry>): void;
        GetCachedShifts(): Array<Api.Models.ICalendarEntry>;
        GenerateScheduleEmailBody(shifts: Array<Api.Models.ICalendarEntry>, introMessage: string): string;
        GetTimeOffStatus(calEntry: Api.Models.ICalendarEntry, L10N: Api.Models.IL10N): { Status: string; Icon: string };
    }

    export var myScheduleService: Core.NG.INamedService<IMyScheduleService>;
}