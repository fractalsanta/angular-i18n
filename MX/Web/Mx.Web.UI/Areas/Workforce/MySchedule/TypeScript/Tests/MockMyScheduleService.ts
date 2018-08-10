/// <reference path="../../../../core/tests/interfaces/imock.d.ts" />

module Workforce.MySchedule {

    export interface IMyScheduleServiceMock extends Core.Tests.IMock<Workforce.MySchedule.IMyScheduleService> {
    }

    export class MyScheduleServiceMock implements IMyScheduleServiceMock {

        private _shifts: Api.Models.ICalendarEntry[];
        private _shift: Api.Models.ICalendarEntry;
        private _timeOffRequests: Api.Models.ITimeOffRequest[];
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);

            this._shifts = ShiftsMock;
            this._timeOffRequests = TimeOffRequestsMock;

        }

        Object: Workforce.MySchedule.IMyScheduleService = {
         
            SetSelectedShift: (shift: Api.Models.ICalendarEntry) => {
                this._shift = shift;
            },

            GetSelectedShift: () => {
                return this._shift;
            },

            ResetShiftSelection: () => {
                this._shift = null;
            },

            GetShiftsByDateRange: (startDate: Moment, endDate: Moment) => {
                return this._helper.CreatePromise(this._shifts);
            },

            GetTimeOffRequestsByDateRange: (startDate: Moment, endDate: Moment) => {
                return this._helper.CreatePromise(this._timeOffRequests);
            },

            SortShiftsByStartDate: (shifts: Array<Workforce.MySchedule.Api.Models.ICalendarEntry>) => {
                
            },

            GetCachedShifts: () => {
                return this._shifts;
            },

            GenerateScheduleEmailBody: (shifts: Array<Api.Models.ICalendarEntry>, introMessage: string) => {
                return "";
            },

            GetTimeOffStatus: (calEntry: Api.Models.ICalendarEntry, L10N: Api.Models.IL10N) => {
                return {Status: "", Icon: ""};
            }
        }
    }
}
