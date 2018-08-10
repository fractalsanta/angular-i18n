var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var MyScheduleServiceMock = (function () {
            function MyScheduleServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    SetSelectedShift: function (shift) {
                        _this._shift = shift;
                    },
                    GetSelectedShift: function () {
                        return _this._shift;
                    },
                    ResetShiftSelection: function () {
                        _this._shift = null;
                    },
                    GetShiftsByDateRange: function (startDate, endDate) {
                        return _this._helper.CreatePromise(_this._shifts);
                    },
                    GetTimeOffRequestsByDateRange: function (startDate, endDate) {
                        return _this._helper.CreatePromise(_this._timeOffRequests);
                    },
                    SortShiftsByStartDate: function (shifts) {
                    },
                    GetCachedShifts: function () {
                        return _this._shifts;
                    },
                    GenerateScheduleEmailBody: function (shifts, introMessage) {
                        return "";
                    },
                    GetTimeOffStatus: function (calEntry, L10N) {
                        return { Status: "", Icon: "" };
                    }
                };
                this._helper = new PromiseHelper($q);
                this._shifts = MySchedule.ShiftsMock;
                this._timeOffRequests = MySchedule.TimeOffRequestsMock;
            }
            return MyScheduleServiceMock;
        }());
        MySchedule.MyScheduleServiceMock = MyScheduleServiceMock;
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
