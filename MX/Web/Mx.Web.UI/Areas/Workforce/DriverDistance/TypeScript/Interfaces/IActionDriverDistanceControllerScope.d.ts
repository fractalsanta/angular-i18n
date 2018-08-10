declare module Workforce.DriverDistance {
    export interface IActionDriverDistanceControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;

        Vm: {
            ActionTitle: string;
            ActionMessage: string;
            Authorization: Core.Api.Models.ISupervisorAuthorization;
            AuthorizationIsValid: boolean;
            ValidationErrorMessage: string;
            SubmitButtonClass: string;
            SubmitButtonText: string;
        };

        AreRequiredFieldsSet(): boolean;

        Submit(): void;
        Cancel(): void;
    }
}