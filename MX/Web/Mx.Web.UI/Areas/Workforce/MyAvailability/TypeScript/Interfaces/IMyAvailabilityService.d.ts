declare module Workforce.MyAvailability {

    export interface IMyAvailabilityService {
        GetAvailability(): Api.Models.IAvailability;
        GetAvailabilityPromise(): ng.IHttpPromise<Api.Models.IAvailability>;
        GetSelectedMyAvailabilityDay(): Api.Models.IDayAvailability;
        SelectMyAvailabilityDay(myAvailableDay: Api.Models.IDayAvailability): void;
        UpdateMyAvailabilityDay(myAvailableDay: Api.Models.IDayAvailability): ng.IHttpPromise<{}>;
        DeleteMyAvailabilityDay(myAvailablityDay: Workforce.MyAvailability.IMyAvailabilityDelete): ng.IHttpPromise<{}>;
        ResetMyAvailabilityDaySelection() : void;

        SortTimes(times: Workforce.MyAvailability.Api.Models.ITimeRange[]): Workforce.MyAvailability.Api.Models.ITimeRange[];
        MapTimeRange(times: Workforce.MyAvailability.Api.Models.ITimeRange[]): Core.ITimeRange[];
        GetTime(time: IMyAvailabilityEntry, constants: Core.IConstants): Workforce.MyAvailability.Api.Models.ITimeRange;
    }

    export var myAvailabilityService: Core.NG.INamedService<IMyAvailabilityService>;
} 