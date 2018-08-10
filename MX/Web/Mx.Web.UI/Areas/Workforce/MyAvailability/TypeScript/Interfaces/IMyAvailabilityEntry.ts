module Workforce.MyAvailability {

    export interface IMyAvailabilityEntry {
        IsAllDay: boolean;
        StartTime: Moment;
        EndTime: Moment;
    }
} 