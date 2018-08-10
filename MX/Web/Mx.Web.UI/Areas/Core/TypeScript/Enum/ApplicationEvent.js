var Core;
(function (Core) {
    "use strict";
    var ApplicationEvent = (function () {
        function ApplicationEvent() {
        }
        ApplicationEvent.ChangeStore = "mx-changeStore";
        ApplicationEvent.HttpSuccess = "mx-httpSuccess";
        ApplicationEvent.HttpError = "mx-httpError";
        ApplicationEvent.Login = "mx-login";
        ApplicationEvent.Logout = "mx-logout";
        ApplicationEvent.UiRouterStateChangeSuccess = "$stateChangeSuccess";
        return ApplicationEvent;
    }());
    Core.ApplicationEvent = ApplicationEvent;
})(Core || (Core = {}));
