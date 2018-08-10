declare module Workforce.MyAvailability {
    export interface IMyAvailabilityControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        GetSelectedMyAvailabilityDay(): Api.Models.IDayAvailability;
        SetDetailedView(flag: boolean);
        Vm: {
            DetailedView: boolean;
        }
    }
}
 