var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var PopupMessageServiceMock = (function () {
            function PopupMessageServiceMock() {
                this._message = {};
                this._title = "";
                this._isOffline = false;
                this._numberOfPendingTasks = 0;
            }
            PopupMessageServiceMock.prototype.IsOffline = function () {
                return true;
            };
            PopupMessageServiceMock.prototype.SetOfflineFlag = function (offline) {
                this._isOffline = offline;
            };
            PopupMessageServiceMock.prototype.SetPendingTasks = function (num) {
                this._numberOfPendingTasks = num;
            };
            PopupMessageServiceMock.prototype.GetPendingTasks = function () {
                return this._numberOfPendingTasks;
            };
            PopupMessageServiceMock.prototype.SetPageTitle = function (title) {
                this._title = title;
            };
            PopupMessageServiceMock.prototype.GetPageTitle = function () {
                return this._title;
            };
            PopupMessageServiceMock.prototype.ClearMessages = function () {
                this._message.Message = "";
                this._message.MessageType = null;
                this._message.CssClass = "";
                this._message.FadeOutAfter = null;
            };
            PopupMessageServiceMock.prototype.ClearModals = function () {
            };
            PopupMessageServiceMock.prototype.CheckModalMode = function () {
                return false;
            };
            PopupMessageServiceMock.prototype.GetCurrentMessage = function () {
                return this._message;
            };
            PopupMessageServiceMock.prototype.ShowMessage = function (message, messageType, cssClass, fadeOutAfter) {
            };
            PopupMessageServiceMock.prototype.ShowSuccess = function (message) {
            };
            PopupMessageServiceMock.prototype.ShowWarning = function (message) {
            };
            PopupMessageServiceMock.prototype.ShowError = function (message) {
            };
            PopupMessageServiceMock.prototype.ClearMessage = function () {
                this._message.Message = "";
                this._message.MessageType = null;
                this._message.CssClass = null;
                this._message.FadeOutAfter = null;
            };
            PopupMessageServiceMock.prototype.Dismiss = function () {
            };
            return PopupMessageServiceMock;
        }());
        Tests.PopupMessageServiceMock = PopupMessageServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
