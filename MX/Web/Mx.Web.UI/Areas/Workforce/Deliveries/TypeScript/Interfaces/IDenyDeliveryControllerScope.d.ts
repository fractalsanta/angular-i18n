declare module Workforce.Deliveries {
    export interface IDenyDeliveryControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Cancel(): void;
        Submit(): void;
        Vm: {
            DenyReason: string;
            Authorize: Core.Api.Models.ISupervisorAuthorization;
            AuthorizationIsValid: boolean;
            ValidationErrorMessage: string;
            EmployeeName: string;
        };
    }
}  