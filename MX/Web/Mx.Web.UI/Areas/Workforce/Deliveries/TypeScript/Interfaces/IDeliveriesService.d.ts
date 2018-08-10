declare module Workforce.Deliveries {

    export interface IDeliveriesService {
        GetDeliveriesData(date: Date): ng.IHttpPromise<Workforce.Deliveries.Api.Models.IDeliveryData>;
        GetAvailableUsers(date: Date): ng.IHttpPromise<Api.Models.IClockedOnUser[]>;
        AddExtraDelivery(request: Api.Models.IExtraDeliveryRequest): ng.IHttpPromise<{}>;
    }

    export var deliveriesService: Core.NG.INamedService<IDeliveriesService>;
}