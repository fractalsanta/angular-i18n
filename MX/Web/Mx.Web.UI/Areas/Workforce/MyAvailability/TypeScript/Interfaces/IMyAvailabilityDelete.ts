module Workforce.MyAvailability {

    export interface IMyAvailabilityDelete {

         DayOfWeek: number;
         Start: string;
         End: string;
         IsAllDay: boolean;
    }
}