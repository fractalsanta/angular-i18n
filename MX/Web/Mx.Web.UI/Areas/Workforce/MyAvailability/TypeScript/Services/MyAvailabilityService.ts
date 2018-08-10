module Workforce.MyAvailability {
    "use strict";

    class MyAvailabilityService implements IMyAvailabilityService {

        private _availabilities: Api.Models.IAvailability;
        private _myAvailabilityDaySelected: Api.Models.IDayAvailability;

        constructor(
            private authService: Core.Auth.IAuthService,
            private myAvailabilityApiService: Api.IMyAvailabilityService
            ) {

            this.InitializeModel();
        }

        InitializeModel() {
            this._availabilities = null;
        }

        GetAvailability() {
            return this._availabilities;
        }

        GetAvailabilityPromise() {
            var promise = this.myAvailabilityApiService.Get();
            promise.then(result => {
                this._availabilities = result.data;
            });
            return promise;
        }

        SelectMyAvailabilityDay(myAvailablityDay: Api.Models.IDayAvailability): void {
            this._myAvailabilityDaySelected = myAvailablityDay;
        }

        GetSelectedMyAvailabilityDay() {
            return this._myAvailabilityDaySelected;
        }

        ResetMyAvailabilityDaySelection() {
            this._myAvailabilityDaySelected = null;
        }

        UpdateMyAvailabilityDay(myAvailablityDay: Api.Models.IDayAvailability): ng.IHttpPromise<{}> {
            return this.myAvailabilityApiService.PutAvailability( myAvailablityDay);
        }

        DeleteMyAvailabilityDay(param: IMyAvailabilityDelete): ng.IHttpPromise<{}> {
            return this.myAvailabilityApiService.Delete(param.DayOfWeek,param.Start, param.End, param.IsAllDay);
        }

        SortTimes(times: Workforce.MyAvailability.Api.Models.ITimeRange[]): Workforce.MyAvailability.Api.Models.ITimeRange[] {
            return _.sortBy(times, time => {
                var value = moment(time.Start);
                return value.hours() * 60 + value.minutes();
            });

        }

        MapTimeRange(times: Workforce.MyAvailability.Api.Models.ITimeRange[]): Core.ITimeRange[] {
            if (times.length === 1 && times[0].IsAllDay)
                return [];

            return _.map<Workforce.MyAvailability.Api.Models.ITimeRange, Core.ITimeRange>
                (times, (data: Workforce.MyAvailability.Api.Models.ITimeRange): Core.ITimeRange => {
                    var end = moment(data.End);
                    var start = moment(data.Start);
                return <Core.ITimeRange>{
                        End: moment({ hour: end.hours(), minute: end.minutes() }),
                        Start: moment({ hour: start.hours(), minute: start.minutes() })
                    }
            });
        }

        GetTime(time: IMyAvailabilityEntry, constants: Core.IConstants): Workforce.MyAvailability.Api.Models.ITimeRange {

            var newtime = <Workforce.MyAvailability.Api.Models.ITimeRange>{
                IsAllDay: time.IsAllDay,
                Start: moment(time.StartTime).format(constants.InternalDateFormat),
            End: moment(time.StartTime).format(constants.InternalDateFormat)
            };
            if (!newtime.IsAllDay) {
                newtime.Start = moment(time.StartTime).format(constants.InternalDateTimeFormat);
                newtime.End = moment(time.EndTime).format(constants.InternalDateTimeFormat);
            }

            return newtime;
        }


    }

    myAvailabilityService = Core.NG.InventoryCountModule.RegisterService("MyAvailabilityService"
        , MyAvailabilityService
        , Core.Auth.$authService
        , Api.$myAvailabilityService
        );
}
