var Core;
(function (Core) {
    "use strict";
    var AppController = (function () {
        function AppController(scope, authService, $translation, popupMessageService, http, $location, $modalStack, layoutService, systemSettingsService, timeoutService) {
            var _this = this;
            this.scope = scope;
            this.authService = authService;
            this.$translation = $translation;
            this.http = http;
            this.timeoutService = timeoutService;
            scope.Model = {
                User: authService.GetUser(),
                PIN: "",
                PINtries: 0
            };
            $translation.GetTranslations().then(function (result) {
                scope.Loc = result.Authentication;
                scope.LoginTranslationsLoaded = true;
            });
            scope.IsMobileReady = function () {
                if (!_this.scope.AppReady) {
                    return true;
                }
                return layoutService.IsMobileReady();
            };
            scope.PINUserName = function () {
                return authService.GetPinUserName();
            };
            scope.ShowPINLogin = function () {
                return authService.GetPinUserName() ? true : false;
            };
            scope.GetTitle = function () { return popupMessageService.GetPageTitle(); };
            scope.Message = popupMessageService.GetCurrentMessage();
            scope.PopupMessageModalMode = function () {
                return popupMessageService.CheckModalMode();
            };
            scope.Credentials = { Username: "", Password: "" };
            scope.IsInvalidLogin = false;
            scope.Logout = function () {
                if (_this.authService.IsSharedCookieMode() && scope.LoginTranslationsLoaded) {
                    popupMessageService.ShowWarning(scope.Loc.LogoutFromMMS);
                    _this.timeoutService(function () { return _this.scope.Lock(); }, 3000);
                }
                else {
                    scope.Lock();
                }
                authService.ClearPinNumber(false);
            };
            scope.Lock = function () {
                scope.PopupMessageDismiss();
                authService.Logout();
                scope.AppReady = false;
            };
            scope.CheckModalMode = function () {
                return ($modalStack.getTop() != null);
            };
            scope.IsAjaxBusy = function () {
                return !!(http.pendingRequests.length);
            };
            scope.ClearIsInvalidLogin = function () {
                scope.IsInvalidLogin = false;
            };
            scope.Logon = function (credentials) {
                scope.IsInvalidLogin = false;
                if (credentials.$valid) {
                    authService.Logon(scope.Credentials).then(function (response) {
                        $translation.GetTranslations().then(function () {
                            scope.IsInvalidLogin = false;
                            scope.Credentials.Username = "";
                            scope.Credentials.Password = "";
                            scope.Model.PIN = "";
                            scope.Model.PINtries = 0;
                            scope.AppReady = true;
                        });
                    }, function (result) {
                        scope.LogonError(result, scope.Loc.InvalidCredentials);
                    });
                }
                ;
            };
            scope.LogonWithPIN = function () {
                scope.IsInvalidLogin = false;
                scope.Model.PINtries = scope.Model.PINtries + 1;
                authService.LogonWithPin(scope.Model.PIN).then(function (response) {
                    scope.IsInvalidLogin = false;
                    scope.Model.PIN = "";
                    scope.Model.PINtries = 0;
                }, function (result) {
                    scope.Model.PIN = "";
                    scope.LogonError(result, scope.Loc.InvalidPin);
                });
            };
            scope.LogonError = function (result, unSuccessfulLogonMessage) {
                scope.IsInvalidLogin = true;
                scope.UnSuccessfulLogonMessage = unSuccessfulLogonMessage;
                if (result.status === Core.HttpStatus.NotFound ||
                    result.status === Core.HttpStatus.ServiceUnavailable ||
                    result.status === Core.HttpStatus.InternalServerError ||
                    (result.status >= Core.HttpStatus.ERROR_INTERNET_OUT_OF_HANDLES &&
                        result.status <= Core.HttpStatus.ERROR_HTTP_REDIRECT_FAILED)) {
                    scope.UnSuccessfulLogonMessage = scope.Loc.ServerUnavailable;
                }
                else if (result.status === Core.HttpStatus.Canceled) {
                    scope.UnSuccessfulLogonMessage = scope.Loc.ServerUnavailable;
                }
                else if (result.status === Core.HttpStatus.Conflict) {
                    scope.UnSuccessfulLogonMessage = result.statusText;
                }
            };
            scope.PopupMessageDismiss = function () {
                popupMessageService.Dismiss();
            };
            scope.$on(Core.ApplicationEvent.HttpError, function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args != null && args.length > 0) {
                    var response = args[0];
                    if (response.status === Core.HttpStatus.Forbidden) {
                        $location.path("/Core/Forbidden");
                    }
                    else if (response.status === Core.HttpStatus.NotFound) {
                        if (response.config.url.toLowerCase().indexOf("htm") > 0) {
                            $location.path("/Core/404");
                        }
                    }
                    else if (response.status === Core.HttpStatus.Unauthorized) {
                        $modalStack.dismissAll("User Unauthorized");
                        if (scope.Model.PINtries > 2) {
                            scope.Logout();
                        }
                        else {
                            scope.Lock();
                        }
                    }
                    else if (response.status === Core.HttpStatus.Conflict) {
                    }
                    else {
                        if (response.status >= 500) {
                            popupMessageService.ShowError("The requested operation failed.");
                        }
                        else {
                            if (!event.defaultPrevented) {
                                popupMessageService.ShowWarning("The requested operation failed.");
                            }
                        }
                    }
                }
            });
            scope.DismissInvalidLogin = function () {
                scope.IsInvalidLogin = false;
            };
            scope.$watch("Model.User.BusinessUser", function (newValue) {
                if (newValue != null && newValue.Id != null && newValue.Id > 0 && newValue.UserName != null) {
                    $translation.GetTranslations().then(function () {
                        scope.AppReady = true;
                    });
                }
            });
            scope.GetPendingRequests = function () {
                return _this.http.pendingRequests;
            };
            scope.GetLoginScheme = function () {
                var schemeIndex = systemSettingsService.GetLoginPageColorScheme();
                return "theme" + schemeIndex;
            };
        }
        return AppController;
    }());
    Core.NG.CoreModule.RegisterNamedController("AppController", AppController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, Core.$popupMessageService, Core.NG.$http, Core.NG.$location, Core.NG.$modalStack, Core.layoutService, Core.$systemSettingsService, Core.NG.$timeout);
})(Core || (Core = {}));
