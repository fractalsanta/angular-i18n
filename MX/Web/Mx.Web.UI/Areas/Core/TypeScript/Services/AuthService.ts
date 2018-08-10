module Core.Auth {
    "use strict";

    export interface IUser {
        IsAuthenticated: boolean;
        BusinessUser: Core.Api.Models.IBusinessUser;
    }

    export class LocalStorageKeys {
        public static USER_NAME = "UserName";
        public static PIN_TOKEN = "PinToken";
    }

    export interface IAuthService {
        GetUser(): IUser;
        Logon(credentials: Api.Models.ICredentials): ng.IHttpPromise<Api.Models.ILogonResponse>;
        Logout(): void;
        CheckPermissionAllowance(...permisions: Core.Api.Models.Task[]): boolean;
        CheckPermissionsAllowance(permisions: Core.Api.Models.Task[]): boolean;
        GetAuthToken(): string;
        GetPinUserName(): string;
        LogonWithPin(pin: string): ng.IPromise<Auth.Api.Models.ILogonResponse>;
        LogonWithPinChallenge(): ng.IHttpPromise<any>;
        SetPinNumber(password: string, pin: string): ng.IHttpPromise<string>;
        ClearPinNumber(deletePin: boolean): void;
        IsSharedCookieMode(): boolean;
    }

    class AuthService implements IAuthService {
        private static COOKIE_NAME = "Auth";
        private static SSO_COOKIE_NAME = "SsoAuth";
        private static SSO_COOKIE_SharedEntityIdCookie = "SharedEntityIdCookie";
        private static TOKEN_NAME = "AuthToken";
        
        private user: IUser = { IsAuthenticated: false, BusinessUser: null };
        private _persistCookie = true;
        private _ssoCookie = false;
        private _isSharedCookieUsed = false;

        constructor(
            private $q: ng.IQService,
            private logonService: Api.ILogonService,
            private http: ng.IHttpService,
            private cookieStore: ng.cookies.ICookieStoreService,
            private rootScope: ng.IRootScopeService,
            private ssoLogoutService: Api.ISsoLogoutService,
            private entityService: Core.Api.IEntityService,
            private accountService: Administration.MyAccount.Api.IAccountService,
            private pinChallengeService: Core.Auth.Api.IPinChallengeService,
            private locationService: ng.ILocationService
            ) {                   

           var ssoCookie = cookieStore.get(AuthService.SSO_COOKIE_NAME);
            if (ssoCookie != null) {
                this._persistCookie = false;
                this._ssoCookie = true;
                this.cookieStore.remove(AuthService.SSO_COOKIE_NAME);
                this.http.defaults.headers.common[AuthService.TOKEN_NAME] = ssoCookie;

                var sharedEntityIdCookie = cookieStore.get(AuthService.SSO_COOKIE_SharedEntityIdCookie);

                if (sharedEntityIdCookie != null) 
                    this.RetrieveUser(sharedEntityIdCookie);
                else 
                    this.RetrieveUser(this.ExtractEntityIdFromUrl());
                
            } else {

                var cookie = cookieStore.get(AuthService.COOKIE_NAME);                    
                var externalParameterEntityId = this.ExtractEntityIdFromUrl();   

                if (cookie != null) {
                    this.http.defaults.headers.common[AuthService.TOKEN_NAME] = cookie;
                }
                this.RetrieveUser(externalParameterEntityId).then(() => {
                    if (this.user.BusinessUser != null && this.user.IsAuthenticated && !this._isSharedCookieUsed) {
                        this._persistCookie = true;
                        this.cookieStore.put(AuthService.COOKIE_NAME, cookie);
                    } else {
                        this._persistCookie = false;
                        this.cookieStore.remove(AuthService.COOKIE_NAME);
                    }
                });
            }

            rootScope.$on(ApplicationEvent.HttpSuccess, (event: ng.IAngularEvent, ...args: any[]): void => {
                if (args != null && args.length > 0) {
                    var response = <ng.IHttpPromiseCallbackArg<any>>args[0];
                    if (response.headers(AuthService.TOKEN_NAME) != null) {
                        var token = response.headers(AuthService.TOKEN_NAME);
                        this.http.defaults.headers.common[AuthService.TOKEN_NAME] = token;
                        if (this._persistCookie && !this._ssoCookie && !this._isSharedCookieUsed) {
                            this.cookieStore.put(AuthService.COOKIE_NAME, token);
                        }
                    }
                }
            });
        }

        public IsSharedCookieMode() {
            return this._isSharedCookieUsed;
        }

        public GetAuthToken(): string {
            return this.http.defaults.headers.common[AuthService.TOKEN_NAME];
        }

        public Logon(credentials: Core.Auth.Api.Models.ICredentials): ng.IHttpPromise<Auth.Api.Models.ILogonResponse> {
            var promise = this.logonService.PostUserLogon(credentials);
            promise.then(result => {
                this.ProcessLogon(result.data);
                this.cookieStore.put(AuthService.COOKIE_NAME, result.data.AuthToken);
            });
            return promise;
        }

        public LogonWithPinChallenge(): ng.IHttpPromise<any> {
            var userName: string = localStorage.getItem(LocalStorageKeys.USER_NAME);
            return this.pinChallengeService.Get(userName);
        }

        public LogonWithPin(pin: string): ng.IPromise<Auth.Api.Models.ILogonResponse> {
            var userName: string = localStorage.getItem(LocalStorageKeys.USER_NAME),
                pinToken: any = localStorage.getItem(LocalStorageKeys.PIN_TOKEN),
                challengePromise = this.pinChallengeService.Get(userName),
                deferredPromise = this.$q.defer<Auth.Api.Models.ILogonResponse>();

            challengePromise.success(challengeResult => {
                var challenge = challengeResult;

                var hashedPin = CryptoJS.SHA256(pin + challenge.Salt).toString();
                var challengeResponse = CryptoJS.SHA256(hashedPin + challenge.Nonce).toString();

                var logonPromise = this.logonService.PostUserLogonWithPin(userName, challengeResponse, pinToken);
                logonPromise.success(logonResult => {
                    this.ProcessLogon(logonResult);
                    this.cookieStore.put(AuthService.COOKIE_NAME, logonResult.AuthToken);
                    deferredPromise.resolve(logonResult);
                }).error(logonResult => {
                    deferredPromise.reject(logonResult);
                });
            });
            challengePromise.error(challengeResult => {
                this.ProcessLogon(challengeResult.data);
                deferredPromise.reject(challengeResult);
            });

            return deferredPromise.promise;
        }

        private ProcessLogon(logonData: Core.Auth.Api.Models.ILogonResponse): void {

            this.user.IsAuthenticated = false;
            this._isSharedCookieUsed = logonData.IsSharedCookieUsed;
            if (logonData.User != null) {
                this.user.IsAuthenticated = true;
                this.user.BusinessUser = logonData.User;                

                this.http.defaults.headers.common[AuthService.TOKEN_NAME] = logonData.AuthToken;

                moment.lang(this.user.BusinessUser.Culture);
                localStorage.removeItem("DateMenu.DateString");
                localStorage.setItem(LocalStorageKeys.USER_NAME, logonData.User.UserName);
                localStorage.setItem(LocalStorageKeys.PIN_TOKEN, logonData.User.PinToken ? logonData.User.PinToken : "");
                this.rootScope.$broadcast(ApplicationEvent.Login, null);
                this.entityService.GetStartOfWeek(logonData.User.MobileSettings.EntityId, moment().format('YYYY-MM-DD')).success((result: number): void => {
                    Core.NG.Configs.DatepickerConfig.startingDay = result;
                });
            }
        }

        public Logout(): void {
            if (this.user != null && this.user.BusinessUser != null) {
                var entityId = this.user.BusinessUser.MobileSettings.EntityId;
                this.rootScope.$broadcast(ApplicationEvent.Logout, entityId);
                if (!this._isSharedCookieUsed) {
                    this.ssoLogoutService.PostSsoLogout().then((result: ng.IHttpPromiseCallbackArg<Auth.Api.SsoLogoutController.ISsoLogoutResponce>): void => {
                        if (result.data.RedirectUrl != null) {
                            window.location.href = result.data.RedirectUrl;
                        }
                    });
                }
            }

            localStorage.removeItem("DateMenu.DateString");
            delete this.http.defaults.headers.common[AuthService.TOKEN_NAME];
            this.cookieStore.remove(AuthService.COOKIE_NAME);
            this.user.IsAuthenticated = false;
            this.user.BusinessUser = null;
            this._ssoCookie = false;
            this._persistCookie = true;

            this.rootScope.$broadcast(ApplicationEvent.Logout, null);
        }

        private RetrieveUser(entityId?: number): ng.IHttpPromise<Api.Models.ILogonResponse> {
            var promise = this.logonService.GetUser(entityId);            
            promise.then(result => {
                this.ProcessLogon(result.data);
            });
            return promise;
        }

        public GetUser(): IUser {
            return this.user;
        }

        public GetPinUserName(): string {
            return localStorage.getItem(LocalStorageKeys.PIN_TOKEN) ? localStorage.getItem(LocalStorageKeys.USER_NAME) : null;
        }

        public CheckPermissionAllowance(...permisions: Core.Api.Models.Task[]): boolean {
            return this.CheckPermissionsAllowance(permisions);
        }

        public CheckPermissionsAllowance(permisions: Core.Api.Models.Task[]): boolean {
            if (this.user != null) {
                if (this.user.BusinessUser != null) {
                    if (this.user.BusinessUser.Permission != null) {
                        if (this.user.BusinessUser.Permission.AllowedTasks != null) {
                            return _.intersection(this.user.BusinessUser.Permission.AllowedTasks, permisions).length > 0;
                        }
                    }
                }
            }
            return false;
        }

        public SetPinNumber(password: string, pin: string): ng.IHttpPromise<string> {
            return this.accountService.PostPinNumber(password, pin)
                .success(result => {
                    localStorage.setItem(LocalStorageKeys.USER_NAME, this.user.BusinessUser.UserName);
                    localStorage.setItem(LocalStorageKeys.PIN_TOKEN, result);
                });
        }

        public ClearPinNumber(deletePin: boolean) {
            localStorage.removeItem(LocalStorageKeys.USER_NAME);
            localStorage.removeItem(LocalStorageKeys.PIN_TOKEN);

            if (deletePin) {
                this.accountService.DeleteUserPin();
            }
        }
             
        private ExtractEntityIdFromUrl(): number {

            var absoluteUrl = this.locationService.absUrl();
            var regex = /\?entityId=([0-9]+)/i;
            var match = regex.exec(absoluteUrl);

            if (match) {
                return Number(match[1]);
            }
            return null;
        }
    }

    export var $authService: NG.INamedDependency<IAuthService> =
        NG.CoreModule.RegisterService("Auth", AuthService,
            Core.NG.$q,
            Api.$logonService,
            NG.$http,
            NG.$cookieStore,
            NG.$rootScope,
            Api.$ssoLogoutService,
            Core.Api.$entityService,
            Administration.MyAccount.Api.$accountService,
            Api.$pinChallengeService,
            NG.$location
            );
}
