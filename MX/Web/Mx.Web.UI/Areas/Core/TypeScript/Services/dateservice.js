var Core;
(function (Core) {
    var Date;
    (function (Date) {
        "use strict";
        var DateService = (function () {
            function DateService(constants, entityService, authService) {
                this.constants = constants;
                this.entityService = entityService;
                this.authService = authService;
                this._startingDayOffsetPromise = null;
                this._entityToday = null;
            }
            DateService.prototype.GetStartOfWeekDay = function (date, offset) {
                var daysToStartOfTheWeekDay = (moment(date).weekday() - offset) >= 0 ? -1 * (moment(date).weekday() - offset) : -1 * (7 - (offset - moment(date).weekday()));
                var startOfTheSelectedWeekDay = moment(date).add('days', daysToStartOfTheWeekDay);
                return startOfTheSelectedWeekDay;
            };
            DateService.prototype.StartOfWeek = function (date) {
                var _this = this;
                if (this._startingDayOffsetPromise === null) {
                    this._startingDayOffsetPromise = this.entityService
                        .GetStartOfWeek(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, date.format(this.constants.InternalDateFormat))
                        .then(function (result) { return _this.CalculateDayFromOffset(date, result.data); });
                }
                return this._startingDayOffsetPromise;
            };
            DateService.prototype.GetEntityCurrentBusinessDay = function () {
                if (this._entityToday == null) {
                    var user = this.authService.GetUser();
                    this._entityToday = this.entityService.Get(user.BusinessUser.MobileSettings.EntityId).then(function (result) { return moment(result.data.CurrentBusinessDay); });
                }
                return this._entityToday;
            };
            DateService.prototype.CalculateDayFromOffset = function (day, offset) {
                if (offset > day.day()) {
                    return moment(day.startOf('day')).day(offset - 7);
                }
                else {
                    return moment(day.startOf('day')).day(offset);
                }
            };
            DateService.prototype.IsOverlapping = function (times) {
                if (times.length == 0)
                    return false;
                var sorted = _.sortBy(times, 'Start');
                var stop = sorted.length - 1;
                for (var i = 0; stop > i; i++) {
                    if (sorted[i].End <= sorted[i].Start) {
                        return true;
                    }
                    if (sorted[i].End > sorted[i + 1].Start)
                        return true;
                }
                var last = sorted.length - 1;
                if (sorted[last].End <= sorted[last].Start) {
                    return true;
                }
                return false;
            };
            return DateService;
        }());
        Date.$dateService = Core.NG.CoreModule.RegisterService("DateService", DateService, Core.Constants, Core.Api.$entityService, Core.Auth.$authService);
    })(Date = Core.Date || (Core.Date = {}));
})(Core || (Core = {}));
