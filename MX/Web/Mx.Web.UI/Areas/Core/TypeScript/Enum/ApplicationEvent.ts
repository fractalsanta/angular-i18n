module Core {
    "use strict";

    export class ApplicationEvent {
        public static ChangeStore: string = "mx-changeStore";
        public static HttpSuccess: string = "mx-httpSuccess";
        public static HttpError: string = "mx-httpError";
        public static Login: string = "mx-login";
        public static Logout: string = "mx-logout";
        public static UiRouterStateChangeSuccess: string = "$stateChangeSuccess";
    }
} 