declare module Workforce.MyTimeCard {

    export interface IMyTimeCardService {
        GetTimeCards(start: Moment, end: Moment): ng.IPromise<IDayEntry[]>;
    }

    export var myTimeCardService: Core.NG.INamedService<IMyTimeCardService>;
}