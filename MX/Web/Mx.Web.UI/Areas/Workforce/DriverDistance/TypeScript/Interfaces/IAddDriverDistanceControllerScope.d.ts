declare module Workforce.DriverDistance {
    export interface IAddDriverDistanceControllerScope extends ng.IScope {
        L10N: Workforce.DriverDistance.Api.Models.IL10N;
        
        Vm: {
            AvailableUsers: Administration.User.Api.Models.IUser[];
            SelectedUserId: number;
            StartOdomRead: number;
            EndOdomRead: number;
            Authorize: Core.Api.Models.ISupervisorAuthorization;
            AuthorizationIsValid: boolean;
            ValidationErrorMessage: string;
            ShowAuthorization: boolean;
            ShowOdomError: boolean;
            ShowSelectUserPrompt: boolean;
        };

        Submit(): void;
        Cancel(): void;

        IsOdomValid(): boolean;
    }
}