 declare module Workforce.MyTimeCard {
     export interface IDayEntry {
         Date: Moment;
         Shifts: IShift[];
         TotalHours: number;
     }

     export interface IShift {
         StartTime: Moment;
         EndTime: Moment;
         EntityName: string;
         ColorCode: string;
         JobName: string;
         Breaks: IBreak[];
     }

     export interface IBreak {
         Start: Moment;
         End: Moment;
         IsPaid: boolean;
         Type: Api.Models.BreakType;
     }
 }