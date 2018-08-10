module Workforce.Deliveries {

    class DeliveriesService implements IDeliveriesService {
        
        constructor(
            private authService: Core.Auth.IAuthService,
            private deliveriesApiService: Api.IDeliveriesService,
            private availableUsersApiService: Api.IAvailableUsersService,
            private constants: Core.IConstants
            ) {
            
        }
        
        GetDeliveriesData = (date: Date): ng.IHttpPromise<Workforce.Deliveries.Api.Models.IDeliveryData> => {
            var selectedDate = date ? moment(date).format(this.constants.InternalDateFormat) : "";
            return this.deliveriesApiService.Get(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, selectedDate);
        };

        GetAvailableUsers = (date: Date): ng.IHttpPromise<Api.Models.IClockedOnUser[]> => {
            var selectedDate = date ? moment(date).format(this.constants.InternalDateFormat) : "";
            return this.availableUsersApiService.Get(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, selectedDate);
        };

        AddExtraDelivery = (request: Api.Models.IExtraDeliveryRequest): ng.IHttpPromise<{}> => {
            return this.deliveriesApiService.Post( this.authService.GetUser().BusinessUser.MobileSettings.EntityId, request );
        };
    }

    deliveriesService = Core.NG.WorkforceDeliveriesModule.RegisterService("DeliveriesService"
        , DeliveriesService
        , Core.Auth.$authService
        , Api.$deliveriesService
        , Api.$availableUsersService
        , Core.Constants
        );
}