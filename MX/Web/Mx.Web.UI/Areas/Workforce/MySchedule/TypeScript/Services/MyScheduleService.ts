module Workforce.MySchedule {
    "use strict";

    class MyScheduleService implements IMyScheduleService {

       
        private _selectedShift: Api.Models.ICalendarEntry;
        private _shiftsCache: Array<Api.Models.ICalendarEntry>;
        private _lastDataDeferred: ng.IDeferred<Api.Models.ICalendarEntry[]>;
        private _timerDataRequestPromise: ng.IPromise<any> = null;
        private _timerDataRequestDelay: number = 0;
        private _lastShiftsPromise: ng.IPromise<Api.Models.ICalendarEntry[]>;

        constructor(
            private authService: Core.Auth.IAuthService,
            private myScheduleApiService: Api.IMyScheduleService,
            private teamScheduleApiService: Api.ITeamScheduleService,
            private timeOffService: Api.IMyTimeOffService,
            private $q: ng.IQService,
            private $timeout: ng.ITimeoutService,
            private constants: Core.IConstants
            ) {

            this.InitializeModel();
        }

        InitializeModel() {
            this._selectedShift = null;
        }

        SetSelectedShift(shift: Api.Models.ICalendarEntry): void {
            this._selectedShift = shift;
        }

        GetSelectedShift() {
            return this._selectedShift;
        }

        ResetShiftSelection() {
            this._selectedShift = null;
        }

        GetShiftsByDateRange(startDate: Moment, endDate: Moment) {
            if (this._timerDataRequestPromise) {
                this.$timeout.cancel(this._timerDataRequestPromise);
            }
            var def = this._lastDataDeferred = this.$q.defer<Api.Models.ICalendarEntry[]>();
            this._timerDataRequestPromise = this.$timeout(() => {
                this._timerDataRequestPromise = null;
                this._timerDataRequestDelay = 500;
                this.myScheduleApiService.Get(startDate.format(this.constants.InternalDateFormat), endDate.format(this.constants.InternalDateFormat)).then(response => {
                    if (this._lastDataDeferred === def) {
                        this._timerDataRequestDelay = 0;
                        this.SortShiftsByStartDate(response.data);
                        this._shiftsCache = response.data;
                        this._selectedShift = null;
                        this._lastDataDeferred.resolve(response.data);
                    }
                });
            }, this._timerDataRequestDelay);
            return this._lastDataDeferred.promise;
        }

        GetCachedShifts() {
            return this._shiftsCache;
        }

        GetTimeOffRequestsByDateRange(startDate: Moment, endDate: Moment) {
            return this.timeOffService.Get(startDate.toISOString()).then((response) => {
                return response.data;
            });
        }

        GenerateScheduleEmailBody(shifts: Api.Models.ICalendarEntry[], introMessage: string) {
            var calendar = new Calendar();
            shifts.forEach((shift) => {
                if (!shift.IsTimeOffRequest) {
                    calendar.Events.push(new Event(shift.EntityName, shift.RoleName, moment(shift.StartDateTime), moment(shift.EndDateTime)));
                }
            });
            return this.SerialiseCalendarEmailBody(calendar, introMessage);
        }

        SerialiseCalendarEmailBody(calendar: Calendar, introMessage: string): string {
            var serEvents: Array<string> = new Array<string>();
            calendar.Events.forEach((event) => {
                serEvents.push(this.SerialiseEventEmailBody(event));
            });
            return encodeURI([
                introMessage,
                serEvents.join("\n\r\n\r")
            ].join("\n\r"));
        }

        SerialiseEventEmailBody(event: Event): string {
            return [
                event.StartTime.format("dddd, D MMMM"),
                event.StartTime.format("LT") + " - " + event.EndTime.format("LT"),
                event.Name,
                event.Description
            ].join("\n\r");
        }

        GetTimeOffStatus(calEntry: Api.Models.ICalendarEntry, l10N: Api.Models.IL10N) {
            var result = { Status: "", Icon: "" };
            switch (calEntry.TimeOffRequestStatus) {
            case 0:
                if (moment(calEntry.StartDateTime).diff(moment(), "days") > 0) {
                    result.Status = l10N.TimeOffRequestPending;
                    result.Icon = "mx-col-info fa fa-spinner";
                } else {
                    result.Status = l10N.TimeOffRequestExpired;
                    result.Icon = "mx-col-info fa fa-clock-o";
                }
                break;

            case 1:
                result.Status = l10N.TimeOffRequestApproved;
                result.Icon = "mx-col-success fa fa-check";
                break;

            case 2:
                result.Status = l10N.TimeOffRequestDenied;
                result.Icon = "mx-col-warning fa fa-minus";
                break;

            case 3:
                result.Status = l10N.TimeOffRequestCancelled;
                result.Icon = "mx-col-warning fa fa-ban";
                break;
            }
            return result;
        }

        SortShiftsByStartDate(shifts: Array<Api.Models.ICalendarEntry>): void {
            shifts.sort((shift1, shift2) => {
                return moment(shift1.StartDateTime).valueOf() - moment(shift2.StartDateTime).valueOf();
            });
        }

        MergeShiftsAndTimeOffAndFillBlanks(
            startDate: Date,
            periodLength: number,
            shifts: Api.Models.ICalendarEntry,
            scheduledTimeOff: Api.Models.ITimeOffRequest
            ): void {

        }
    }

    myScheduleService = Core.NG.InventoryCountModule.RegisterService("MyScheduleService"
        , MyScheduleService
        , Core.Auth.$authService
        , Api.$myScheduleService
        , Api.$teamScheduleService
        , Api.$myTimeOffService
        , Core.NG.$q
        , Core.NG.$timeout
        , Core.Constants
        );
}
