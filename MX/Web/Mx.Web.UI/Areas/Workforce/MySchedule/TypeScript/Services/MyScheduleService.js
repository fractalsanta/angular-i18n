var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        "use strict";
        var MyScheduleService = (function () {
            function MyScheduleService(authService, myScheduleApiService, teamScheduleApiService, timeOffService, $q, $timeout, constants) {
                this.authService = authService;
                this.myScheduleApiService = myScheduleApiService;
                this.teamScheduleApiService = teamScheduleApiService;
                this.timeOffService = timeOffService;
                this.$q = $q;
                this.$timeout = $timeout;
                this.constants = constants;
                this._timerDataRequestPromise = null;
                this._timerDataRequestDelay = 0;
                this.InitializeModel();
            }
            MyScheduleService.prototype.InitializeModel = function () {
                this._selectedShift = null;
            };
            MyScheduleService.prototype.SetSelectedShift = function (shift) {
                this._selectedShift = shift;
            };
            MyScheduleService.prototype.GetSelectedShift = function () {
                return this._selectedShift;
            };
            MyScheduleService.prototype.ResetShiftSelection = function () {
                this._selectedShift = null;
            };
            MyScheduleService.prototype.GetShiftsByDateRange = function (startDate, endDate) {
                var _this = this;
                if (this._timerDataRequestPromise) {
                    this.$timeout.cancel(this._timerDataRequestPromise);
                }
                var def = this._lastDataDeferred = this.$q.defer();
                this._timerDataRequestPromise = this.$timeout(function () {
                    _this._timerDataRequestPromise = null;
                    _this._timerDataRequestDelay = 500;
                    _this.myScheduleApiService.Get(startDate.format(_this.constants.InternalDateFormat), endDate.format(_this.constants.InternalDateFormat)).then(function (response) {
                        if (_this._lastDataDeferred === def) {
                            _this._timerDataRequestDelay = 0;
                            _this.SortShiftsByStartDate(response.data);
                            _this._shiftsCache = response.data;
                            _this._selectedShift = null;
                            _this._lastDataDeferred.resolve(response.data);
                        }
                    });
                }, this._timerDataRequestDelay);
                return this._lastDataDeferred.promise;
            };
            MyScheduleService.prototype.GetCachedShifts = function () {
                return this._shiftsCache;
            };
            MyScheduleService.prototype.GetTimeOffRequestsByDateRange = function (startDate, endDate) {
                return this.timeOffService.Get(startDate.toISOString()).then(function (response) {
                    return response.data;
                });
            };
            MyScheduleService.prototype.GenerateScheduleEmailBody = function (shifts, introMessage) {
                var calendar = new MySchedule.Calendar();
                shifts.forEach(function (shift) {
                    if (!shift.IsTimeOffRequest) {
                        calendar.Events.push(new MySchedule.Event(shift.EntityName, shift.RoleName, moment(shift.StartDateTime), moment(shift.EndDateTime)));
                    }
                });
                return this.SerialiseCalendarEmailBody(calendar, introMessage);
            };
            MyScheduleService.prototype.SerialiseCalendarEmailBody = function (calendar, introMessage) {
                var _this = this;
                var serEvents = new Array();
                calendar.Events.forEach(function (event) {
                    serEvents.push(_this.SerialiseEventEmailBody(event));
                });
                return encodeURI([
                    introMessage,
                    serEvents.join("\n\r\n\r")
                ].join("\n\r"));
            };
            MyScheduleService.prototype.SerialiseEventEmailBody = function (event) {
                return [
                    event.StartTime.format("dddd, D MMMM"),
                    event.StartTime.format("LT") + " - " + event.EndTime.format("LT"),
                    event.Name,
                    event.Description
                ].join("\n\r");
            };
            MyScheduleService.prototype.GetTimeOffStatus = function (calEntry, l10N) {
                var result = { Status: "", Icon: "" };
                switch (calEntry.TimeOffRequestStatus) {
                    case 0:
                        if (moment(calEntry.StartDateTime).diff(moment(), "days") > 0) {
                            result.Status = l10N.TimeOffRequestPending;
                            result.Icon = "mx-col-info fa fa-spinner";
                        }
                        else {
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
            };
            MyScheduleService.prototype.SortShiftsByStartDate = function (shifts) {
                shifts.sort(function (shift1, shift2) {
                    return moment(shift1.StartDateTime).valueOf() - moment(shift2.StartDateTime).valueOf();
                });
            };
            MyScheduleService.prototype.MergeShiftsAndTimeOffAndFillBlanks = function (startDate, periodLength, shifts, scheduledTimeOff) {
            };
            return MyScheduleService;
        }());
        MySchedule.myScheduleService = Core.NG.InventoryCountModule.RegisterService("MyScheduleService", MyScheduleService, Core.Auth.$authService, MySchedule.Api.$myScheduleService, MySchedule.Api.$teamScheduleService, MySchedule.Api.$myTimeOffService, Core.NG.$q, Core.NG.$timeout, Core.Constants);
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
