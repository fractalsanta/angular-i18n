var Core;
(function (Core) {
    var PopupMessageService = (function () {
        function PopupMessageService($timeout, $modalStack, signalr) {
            var _this = this;
            this.$timeout = $timeout;
            this.$modalStack = $modalStack;
            this._message = {};
            this._title = "";
            this._isOffline = false;
            this._numberOfPendingTasks = 0;
            var connectedHandler = function () { _this._isOffline = false; };
            signalr.SetDisconnectedListener(function () { _this._isOffline = true; });
            signalr.SetConnectedListener(connectedHandler);
            signalr.SetReconnectedListener(connectedHandler);
        }
        PopupMessageService.prototype.IsOffline = function () {
            return this._isOffline;
        };
        PopupMessageService.prototype.SetOfflineFlag = function (offline) {
            this._isOffline = offline;
        };
        PopupMessageService.prototype.SetPendingTasks = function (num) {
            this._numberOfPendingTasks = num;
        };
        PopupMessageService.prototype.GetPendingTasks = function () {
            return this._numberOfPendingTasks;
        };
        PopupMessageService.prototype.SetPageTitle = function (title) {
            this._title = title;
        };
        PopupMessageService.prototype.GetPageTitle = function () {
            return this._title;
        };
        PopupMessageService.prototype.ClearMessages = function () {
            this._message.Message = "";
            this._message.MessageType = null;
            this._message.CssClass = "";
            this._message.FadeOutAfter = null;
        };
        PopupMessageService.prototype.ClearModals = function () {
            this.$modalStack.dismissAll();
        };
        PopupMessageService.prototype.CheckModalMode = function () {
            return !!(this.$modalStack.getTop());
        };
        PopupMessageService.prototype.GetCurrentMessage = function () {
            return this._message;
        };
        PopupMessageService.prototype.ShowMessage = function (message, messageType, cssClass, fadeOutAfter) {
            var _this = this;
            if (!cssClass) {
                if (messageType === Core.PopupMessageTypeEnum.Success) {
                    cssClass = "alert alert-success alert-dismissable";
                }
                if (messageType === Core.PopupMessageTypeEnum.Error) {
                    cssClass = "alert alert-danger alert-dismissable";
                }
                if (messageType === Core.PopupMessageTypeEnum.Warning) {
                    cssClass = "alert alert-warning alert-dismissable";
                }
            }
            this._message.Message = message;
            this._message.MessageType = messageType;
            this._message.CssClass = cssClass;
            this._message.FadeOutAfter = fadeOutAfter;
            if (messageType === Core.PopupMessageTypeEnum.Success) {
                this.$timeout(function () { _this.ClearMessage(); }, this._message.FadeOutAfter);
            }
        };
        PopupMessageService.prototype.ShowSuccess = function (message) {
            this.ShowMessage(message, Core.PopupMessageTypeEnum.Success, "alert alert-success", 5000);
        };
        PopupMessageService.prototype.ShowWarning = function (message) {
            this.ShowMessage(message, Core.PopupMessageTypeEnum.Warning, "alert alert-warning", 5000);
        };
        PopupMessageService.prototype.ShowError = function (message) {
            this.ShowMessage(message, Core.PopupMessageTypeEnum.Error, "alert alert-danger", 5000);
        };
        PopupMessageService.prototype.ClearMessage = function () {
            this._message.Message = "";
            this._message.MessageType = null;
            this._message.CssClass = null;
            this._message.FadeOutAfter = null;
        };
        PopupMessageService.prototype.Dismiss = function () {
            var _this = this;
            this.$timeout(function () { _this.ClearMessage(); }, 0);
        };
        return PopupMessageService;
    }());
    Core.$popupMessageService = Core.NG.CoreModule.RegisterService("PopupMessage", PopupMessageService, Core.NG.$timeout, Core.NG.$modalStack, Core.$signalR);
})(Core || (Core = {}));
