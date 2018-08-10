var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        "use strict";
        var MyAvailabilityService = (function () {
            function MyAvailabilityService(authService, myAvailabilityApiService) {
                this.authService = authService;
                this.myAvailabilityApiService = myAvailabilityApiService;
                this.InitializeModel();
            }
            MyAvailabilityService.prototype.InitializeModel = function () {
                this._availabilities = null;
            };
            MyAvailabilityService.prototype.GetAvailability = function () {
                return this._availabilities;
            };
            MyAvailabilityService.prototype.GetAvailabilityPromise = function () {
                var _this = this;
                var promise = this.myAvailabilityApiService.Get();
                promise.then(function (result) {
                    _this._availabilities = result.data;
                });
                return promise;
            };
            MyAvailabilityService.prototype.SelectMyAvailabilityDay = function (myAvailablityDay) {
                this._myAvailabilityDaySelected = myAvailablityDay;
            };
            MyAvailabilityService.prototype.GetSelectedMyAvailabilityDay = function () {
                return this._myAvailabilityDaySelected;
            };
            MyAvailabilityService.prototype.ResetMyAvailabilityDaySelection = function () {
                this._myAvailabilityDaySelected = null;
            };
            MyAvailabilityService.prototype.UpdateMyAvailabilityDay = function (myAvailablityDay) {
                return this.myAvailabilityApiService.PutAvailability(myAvailablityDay);
            };
            MyAvailabilityService.prototype.DeleteMyAvailabilityDay = function (param) {
                return this.myAvailabilityApiService.Delete(param.DayOfWeek, param.Start, param.End, param.IsAllDay);
            };
            MyAvailabilityService.prototype.SortTimes = function (times) {
                return _.sortBy(times, function (time) {
                    var value = moment(time.Start);
                    return value.hours() * 60 + value.minutes();
                });
            };
            MyAvailabilityService.prototype.MapTimeRange = function (times) {
                if (times.length === 1 && times[0].IsAllDay)
                    return [];
                return _.map(times, function (data) {
                    var end = moment(data.End);
                    var start = moment(data.Start);
                    return {
                        End: moment({ hour: end.hours(), minute: end.minutes() }),
                        Start: moment({ hour: start.hours(), minute: start.minutes() })
                    };
                });
            };
            MyAvailabilityService.prototype.GetTime = function (time, constants) {
                var newtime = {
                    IsAllDay: time.IsAllDay,
                    Start: moment(time.StartTime).format(constants.InternalDateFormat),
                    End: moment(time.StartTime).format(constants.InternalDateFormat)
                };
                if (!newtime.IsAllDay) {
                    newtime.Start = moment(time.StartTime).format(constants.InternalDateTimeFormat);
                    newtime.End = moment(time.EndTime).format(constants.InternalDateTimeFormat);
                }
                return newtime;
            };
            return MyAvailabilityService;
        }());
        MyAvailability.myAvailabilityService = Core.NG.InventoryCountModule.RegisterService("MyAvailabilityService", MyAvailabilityService, Core.Auth.$authService, MyAvailability.Api.$myAvailabilityService);
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
