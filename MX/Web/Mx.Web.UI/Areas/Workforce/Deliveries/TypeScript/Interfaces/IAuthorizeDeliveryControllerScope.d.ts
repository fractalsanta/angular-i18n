declare module Workforce.Deliveries {
    export interface IAuthorizeDeliveryControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Cancel(): void;
        Submit(): void;
        Vm: {
            Authorize: Core.Api.Models.ISupervisorAuthorization;
            EmployeeName: string;
            AuthorizationIsValid: boolean;
            ValidationErrorMessage: string;
        };
    }
}