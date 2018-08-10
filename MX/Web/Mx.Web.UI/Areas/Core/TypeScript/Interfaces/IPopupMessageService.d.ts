declare module Core {
        export interface IPopupMessageService {
        GetCurrentMessage(): IPopupMessage;
        ShowMessage(message: string, messageType: PopupMessageTypeEnum, cssClass: string, fadeOutAfter: number): void;
        ShowSuccess(message: string): void;
        ShowWarning(message: string): void;
        ShowError(message: string): void;
        Dismiss(): void;
        CheckModalMode(): boolean;
        ClearMessages(): void;
        ClearModals(): void;
        SetPageTitle(title: string): void;
        GetPageTitle(): string;
        IsOffline(): boolean;
        SetOfflineFlag(offline: boolean): void;
        SetPendingTasks(num: number): void;
        GetPendingTasks(): number;
    }

    export var $popupMessageService: Core.NG.INamedDependency<IPopupMessageService>;
} 