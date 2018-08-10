module Core.Date {
    "use strict";

    export interface IDateService {
        StartOfWeek(date: Moment): ng.IPromise<Moment>;
        GetStartOfWeekDay(date: Moment, offset: number): Moment;
        CalculateDayFromOffset(day: Moment, offset: number): Moment;
        IsOverlapping(times: ITimeRange[]): boolean;
        GetEntityCurrentBusinessDay(): ng.IPromise<Moment>;
    }

    class DateService implements IDateService {
        constructor(
            private constants : Core.IConstants,
            private entityService: Core.Api.IEntityService,
            private authService: Core.Auth.IAuthService
            ) {

        }

        private _startingDayOffsetPromise: ng.IPromise<Moment> = null;
        private _entityToday: ng.IPromise<Moment> = null;

        GetStartOfWeekDay(date: Moment, offset: number) {
            var daysToStartOfTheWeekDay = (moment(date).weekday() - offset) >= 0 ? -1 * (moment(date).weekday() - offset) : -1 * (7 - (offset - moment(date).weekday()));
            var startOfTheSelectedWeekDay = moment(date).add('days', daysToStartOfTheWeekDay);
            return startOfTheSelectedWeekDay;
        }

        // Given a day of a week (start) and a date, return the start of the week.
        // Day of week defaults to Entity starting day.
        StartOfWeek(date: Moment): ng.IPromise<Moment> {
            if (this._startingDayOffsetPromise === null) {
                this._startingDayOffsetPromise = this.entityService
                    .GetStartOfWeek(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, date.format(this.constants.InternalDateFormat))
                    .then(result => this.CalculateDayFromOffset(date, result.data));
            }
            return this._startingDayOffsetPromise;
        }

        GetEntityCurrentBusinessDay() {
            if (this._entityToday == null) {
                var user = this.authService.GetUser();
                this._entityToday = this.entityService.Get(user.BusinessUser.MobileSettings.EntityId).then((result) => moment(result.data.CurrentBusinessDay));
            }
            return this._entityToday;
        }

        CalculateDayFromOffset(day: Moment, offset: number): Moment {
            // If we pivot on Tuesday and we are Monday we have to use -7 to get last Tuesday.
            if (offset > day.day()) {
                return moment(day.startOf('day')).day(offset - 7);
            } else {
                return moment(day.startOf('day')).day(offset);
            }
        }

        // Check if the start and end times overlap
        IsOverlapping(times: ITimeRange[]): boolean {
            if (times.length == 0)
                return false;
            var sorted = _.sortBy<ITimeRange>(times, 'Start');
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
        }
    }

    export var $dateService: NG.INamedDependency<IDateService> =
        NG.CoreModule.RegisterService("DateService", DateService,
            Core.Constants,
            Core.Api.$entityService,
            Core.Auth.$authService);
}