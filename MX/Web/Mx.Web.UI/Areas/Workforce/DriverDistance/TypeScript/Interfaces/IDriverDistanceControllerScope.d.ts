 declare module Workforce.DriverDistance {
     export interface  IDriverDistanceControllerScope extends ng.IScope {
         L10N: Workforce.DriverDistance.Api.Models.IL10N;

         Vm: {
             DatePickerOptions: Core.NG.IMxDayPickerOptions;
             CanViewOthersRecords: boolean;
             CanAuthoriseRecords: boolean;
             DriverDistanceRecords: Object[];
         };

         OnDatePickerChange(selectedDate: Date): void;

         CanActionRecord(record: Api.Models.IDriverDistanceRecord): boolean;
         DoRecordsExist(): boolean;

         GetTotalDistance(record: Api.Models.IDriverDistanceRecord): number;
         GetStatusIconClass(record: Api.Models.IDriverDistanceRecord): string;
         GetDisplayStatus(record: Api.Models.IDriverDistanceRecord): string;

         AddDriveRecord(): void;
         Approve(record: Api.Models.IDriverDistanceRecord): void;
         Deny(record: Api.Models.IDriverDistanceRecord): void;
     }
 }