module Core {
    export interface IPopupMessage {
        MessageType: PopupMessageTypeEnum;
        Message: string;
        CssClass: string;
        FadeOutAfter: number;
    }
} 

module Core {

    export enum PopupMessageTypeEnum {
        Success = 1, Warning = 2, Error = 3
    }
}