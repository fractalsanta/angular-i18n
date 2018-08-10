module Core {
    "use strict";

    interface IAppViewModel {
        User: Auth.IUser;
        PIN: string;
        PINtries: number;
    }

    interface IAppScope extends ng.IScope {
        Loc: Auth.Api.Models.IL10N;
        Model: IAppViewModel;
        Credentials: Auth.Api.Models.ICredentials;
        Logon(credentials: ng.IFormController): void;
        LogonError(result: ng.IHttpPromiseCallbackArg<Auth.Api.Models.ILogonResponse>, unSuccessfulLogonMessage: string): void;
        LogonWithPIN(): void;
        Logout(): void;
        ClearIsInvalidLogin(): void;
        Lock(): void;
        PINUserName(): string;
        ShowPINLogin(): boolean;
        GetTitle(): string;
        IsAjaxBusy(): boolean;
        IsMobileReady(): boolean;
        Message: IPopupMessage;
        IsInvalidLogin: boolean;
        UnSuccessfulLogonMessage: string;
        LoginTranslationsLoaded: boolean;
        AppReady: boolean;
        Keypad(event): void;
        Keydown(event): void;
        PopupMessageModalMode(): boolean;
        PopupMessageDismiss(): void;
        PerformSamlCheck(): void;
        DismissInvalidLogin(): void;
        GetPendingRequests(): any[];
        CheckModalMode(): boolean;
        GetLoginScheme(): string;
    }

    class AppController {
        constructor(
            private scope: IAppScope,
            private authService: Auth.IAuthService,
            private $translation: ITranslationService,
            popupMessageService: IPopupMessageService,
            private http: ng.IHttpService,
            $location: ng.ILocationService,
            $modalStack: ng.ui.bootstrap.IModalStackService,
            layoutService: ILayoutService,
            systemSettingsService: ISystemSettingsService,
            private timeoutService: ng.ITimeoutService
            ) {

            scope.Model = {
                User: authService.GetUser(),
                PIN: "",
                PINtries: 0
            };

            $translation.GetTranslations().then((result: Api.Models.ITranslations): void => {
                scope.Loc = result.Authentication;
                scope.LoginTranslationsLoaded = true;
            });

            scope.IsMobileReady = (): boolean => {
                if (!this.scope.AppReady) {
                    return true;
                }
                return layoutService.IsMobileReady();
            };

            scope.PINUserName = (): string => {
                return authService.GetPinUserName();
            };

            scope.ShowPINLogin = (): boolean => {
                return authService.GetPinUserName() ? true : false;
            };

            scope.GetTitle = (): string => popupMessageService.GetPageTitle();

            scope.Message = popupMessageService.GetCurrentMessage();

            scope.PopupMessageModalMode = (): any => {
                return popupMessageService.CheckModalMode();
            };

            scope.Credentials = { Username: "", Password: "" };
            scope.IsInvalidLogin = false;

            scope.Logout = (): void => {
                if (this.authService.IsSharedCookieMode() && scope.LoginTranslationsLoaded) {
                    popupMessageService.ShowWarning(scope.Loc.LogoutFromMMS);
                    //Lock app screen in 3 sec
                    this.timeoutService(() => this.scope.Lock(), 3000);               
                } else {
                    scope.Lock();
                }                
                authService.ClearPinNumber(false);
            };

            scope.Lock = (): void => {
                scope.PopupMessageDismiss();
                authService.Logout();
                scope.AppReady = false;
            };

            scope.CheckModalMode = (): boolean => {
                return ($modalStack.getTop() != null);
            };

            scope.IsAjaxBusy = (): boolean => {
                return !!(http.pendingRequests.length);
            };

            scope.ClearIsInvalidLogin = (): void => {
                scope.IsInvalidLogin = false;
            };

            scope.Logon = (credentials: ng.IFormController): void => {
                scope.IsInvalidLogin = false;
                if (credentials.$valid) {
                    authService.Logon(scope.Credentials).then(
                        (response: ng.IHttpPromiseCallbackArg<Auth.Api.Models.ILogonResponse>): void => {
                            $translation.GetTranslations().then((): void => {
                                scope.IsInvalidLogin = false;
                                scope.Credentials.Username = "";
                                scope.Credentials.Password = "";
                                scope.Model.PIN = "";
                                scope.Model.PINtries = 0;
                                scope.AppReady = true;
                            });
                        },
                        (result: ng.IHttpPromiseCallbackArg<Auth.Api.Models.ILogonResponse>): void => {
                            scope.LogonError(result, scope.Loc.InvalidCredentials);
                        });
                };
            };

            scope.LogonWithPIN = (): void => {
                scope.IsInvalidLogin = false;
                scope.Model.PINtries = scope.Model.PINtries + 1;
                authService.LogonWithPin(scope.Model.PIN).then(
                    (response: ng.IHttpPromiseCallbackArg<Auth.Api.Models.ILogonResponse>): void => {
                        scope.IsInvalidLogin = false;
                        scope.Model.PIN = "";
                        scope.Model.PINtries = 0;
                    },
                    (result: ng.IHttpPromiseCallbackArg<Auth.Api.Models.ILogonResponse>): void => {
                        scope.Model.PIN = "";
                        scope.LogonError(result, scope.Loc.InvalidPin);
                    });
            };

            scope.LogonError = (result: ng.IHttpPromiseCallbackArg<Auth.Api.Models.ILogonResponse>, unSuccessfulLogonMessage: string): void => {
                scope.IsInvalidLogin = true;
                scope.UnSuccessfulLogonMessage = unSuccessfulLogonMessage;

                if (result.status === HttpStatus.NotFound ||
                    result.status === HttpStatus.ServiceUnavailable ||
                    result.status === HttpStatus.InternalServerError ||
                    (result.status >= HttpStatus.ERROR_INTERNET_OUT_OF_HANDLES &&
                    result.status <= HttpStatus.ERROR_HTTP_REDIRECT_FAILED)) {

                    scope.UnSuccessfulLogonMessage = scope.Loc.ServerUnavailable;
                } else if (result.status === HttpStatus.Canceled) {
                    scope.UnSuccessfulLogonMessage = scope.Loc.ServerUnavailable;
                } else if (result.status === HttpStatus.Conflict) {
                    scope.UnSuccessfulLogonMessage = result.statusText;
                }
            }

            scope.PopupMessageDismiss = (): void => {
                popupMessageService.Dismiss();
            };

            scope.$on(ApplicationEvent.HttpError, (event: ng.IAngularEvent, ...args: any[]): void => {
                if (args != null && args.length > 0) {
                    var response = <ng.IHttpPromiseCallbackArg<any>>args[0];
                    if (response.status === HttpStatus.Forbidden) {
                        $location.path("/Core/Forbidden");
                    } else if (response.status === HttpStatus.NotFound) {
                        if (response.config.url.toLowerCase().indexOf("htm") > 0) {
                            $location.path("/Core/404");
                        }
                    } else if (response.status === HttpStatus.Unauthorized) {
                        // When user get logged out due to Unauthorized we should hide all modals
                        $modalStack.dismissAll("User Unauthorized");

                        if (scope.Model.PINtries > 2) {
                            scope.Logout();
                        } else {
                            scope.Lock();
                        }
                    } else if (response.status === HttpStatus.Conflict) {
                        // When user receives conflict error, let each page controller handle it individually
                    } else {
                        if (response.status >= 500) {
                            popupMessageService.ShowError("The requested operation failed.");
                        } else {
                            if (!event.defaultPrevented) {
                                popupMessageService.ShowWarning("The requested operation failed.");
                            }
                        }
                    }
                }
            });

            scope.DismissInvalidLogin = (): void => {
                scope.IsInvalidLogin = false;
            };

            scope.$watch("Model.User.BusinessUser", (newValue: Api.Models.IBusinessUser): void => {
                if (newValue != null && newValue.Id != null && newValue.Id > 0 && newValue.UserName != null) {
                    $translation.GetTranslations().then((): void => {
                        scope.AppReady = true;
                    });
                }
            });

            scope.GetPendingRequests = (): any[] => {
                return this.http.pendingRequests;
            };

            scope.GetLoginScheme = (): string => {
                var schemeIndex = systemSettingsService.GetLoginPageColorScheme();
                return "theme" + schemeIndex;
            };
        }
    }

    NG.CoreModule.RegisterNamedController("AppController", AppController,
        NG.$typedScope<IAppScope>(),
        Auth.$authService,
        Core.$translation,
        Core.$popupMessageService,
        NG.$http,
        NG.$location,
        NG.$modalStack,
        layoutService,
        Core.$systemSettingsService,
        Core.NG.$timeout);
} 