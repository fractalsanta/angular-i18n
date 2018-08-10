declare module Workforce.MySchedule {
    export interface IMyScheduleControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        GetSelectedShift(): Api.Models.ICalendarEntry;
        SetDetailedView(flag: boolean);
        Vm: {
            DetailedView: boolean;
        }
    }
}
