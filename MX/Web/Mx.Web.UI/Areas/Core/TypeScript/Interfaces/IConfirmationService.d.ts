declare module Core {
    export interface IConfirmationService {
        Confirm(confirmationSettings: IConfirmation): ng.IPromise<boolean>;
        ConfirmCheckbox(confirmationSettings: IConfirmationCheckbox): ng.IPromise<boolean>;
    }

    export var $confirmationService: Core.NG.INamedDependency<IConfirmationService>;
} 