module Core.Tests {
    export class PopupMessageServiceMock implements IPopupMessageService {

        private _message: IPopupMessage = <IPopupMessage>{};
        private _title: string = "";
        private _isOffline: boolean = false;
        private _numberOfPendingTasks: number = 0;

        constructor() {
            
        }     
        
        IsOffline(): boolean {
            return true;
        }

        SetOfflineFlag(offline: boolean): void {
            this._isOffline = offline;
        }

        SetPendingTasks(num: number): void {
            this._numberOfPendingTasks = num;
        }

        GetPendingTasks(): number {
            return this._numberOfPendingTasks;
        }

        SetPageTitle(title: string): void {
            this._title = title;
        }

        GetPageTitle(): string {
            return this._title;
        }

        ClearMessages(): void {
            this._message.Message = "";
            this._message.MessageType = null;
            this._message.CssClass = "";
            this._message.FadeOutAfter = null;
        }

        ClearModals(): void {
            
        }

        CheckModalMode(): boolean {
            return false;
        }

        GetCurrentMessage(): IPopupMessage {
            return this._message;
        }

        ShowMessage(message: string, messageType: PopupMessageTypeEnum, cssClass: string, fadeOutAfter: number): void {           
        }

        ShowSuccess(message: string): void {
            
        }

        ShowWarning(message: string): void {
            
        }

        ShowError(message: string): void {
            
        }

        ClearMessage(): void {
            this._message.Message = "";
            this._message.MessageType = null;
            this._message.CssClass = null;
            this._message.FadeOutAfter = null;
        }

        Dismiss(): void {
           
        }         
    }
} 