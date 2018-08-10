module Core {

    class PopupMessageService implements IPopupMessageService {

        private _message: IPopupMessage = <IPopupMessage>{};
        private _title: string = "";
        private _isOffline: boolean = false;
        private _numberOfPendingTasks: number = 0;

        constructor(
            private $timeout: ng.ITimeoutService,
            private $modalStack: ng.ui.bootstrap.IModalStackService,
            signalr: Core.ISignalRService) {

            var connectedHandler = (): void => { this._isOffline = false; };

            signalr.SetDisconnectedListener((): void => { this._isOffline = true; });
            signalr.SetConnectedListener(connectedHandler);
            signalr.SetReconnectedListener(connectedHandler);
        }

        IsOffline(): boolean {
            return this._isOffline;
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
            this.$modalStack.dismissAll();
        }

        CheckModalMode(): boolean {
            return !!(this.$modalStack.getTop());
        }

        GetCurrentMessage(): IPopupMessage {
            return this._message;
        }

        ShowMessage(message: string, messageType: PopupMessageTypeEnum, cssClass: string, fadeOutAfter: number): void {

            if (!cssClass) {
                if (messageType === PopupMessageTypeEnum.Success) {
                    cssClass = "alert alert-success alert-dismissable";
                }
                if (messageType === PopupMessageTypeEnum.Error) {
                    cssClass = "alert alert-danger alert-dismissable";
                }
                if (messageType === PopupMessageTypeEnum.Warning) {
                    cssClass = "alert alert-warning alert-dismissable";
                }
            }

            this._message.Message = message;
            this._message.MessageType = messageType;
            this._message.CssClass = cssClass;
            this._message.FadeOutAfter = fadeOutAfter;

            if (messageType === PopupMessageTypeEnum.Success) {
                this.$timeout((): void => { this.ClearMessage(); }, this._message.FadeOutAfter);
            }
        }

        ShowSuccess(message: string): void {
            this.ShowMessage(message, PopupMessageTypeEnum.Success, "alert alert-success", 5000);
        }

        ShowWarning(message: string): void {
            this.ShowMessage(message, PopupMessageTypeEnum.Warning, "alert alert-warning", 5000);
        }

        ShowError(message: string): void {
            this.ShowMessage(message, PopupMessageTypeEnum.Error, "alert alert-danger", 5000);
        }

        ClearMessage(): void {
            this._message.Message = "";
            this._message.MessageType = null;
            this._message.CssClass = null;
            this._message.FadeOutAfter = null;
        }

        Dismiss(): void {
            this.$timeout((): void => { this.ClearMessage(); }, 0);
        }
    }

   $popupMessageService = NG.CoreModule.RegisterService("PopupMessage", PopupMessageService,
        NG.$timeout,
        Core.NG.$modalStack,
        Core.$signalR);
} 