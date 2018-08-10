module Core {
    export enum ConfirmationTypeEnum {
        Positive = 1, Danger = 3
    }
    export interface IConfirmation {
        Title: string;
        Message: string;
        ConfirmText: string;
        CancelText?: string;
        ConfirmationType:  ConfirmationTypeEnum;
    }
}
