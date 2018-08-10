declare module Workforce.Deliveries {
    export interface IAddExtraDeliveryControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Submit(): void;
        Cancel(): void;
        Vm: {
            AvailableUsers: Api.Models.IClockedOnUser[];
            SelectedUserId: number;
            OrderNumber: string;
            Comment: string;
            Authorize: Core.Api.Models.ISupervisorAuthorization;
            AuthorizationIsValid: boolean;
            ValidationErrorMessage: string;
            ShowAuthorization: boolean;
            ShowSelectUserPrompt: boolean;
        };
    }
}  