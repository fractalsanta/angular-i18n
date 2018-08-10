var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        "use strict";
        var LocalStorageKeys = (function () {
            function LocalStorageKeys() {
            }
            LocalStorageKeys.USER_NAME = "UserName";
            LocalStorageKeys.PIN_TOKEN = "PinToken";
            return LocalStorageKeys;
        }());
        Auth.LocalStorageKeys = LocalStorageKeys;
        var AuthService = (function () {
            function AuthService($q, logonService, http, cookieStore, rootScope, ssoLogoutService, entityService, accountService, pinChallengeService, locationService) {
                var _this = this;
                this.$q = $q;
                this.logonService = logonService;
                this.http = http;
                this.cookieStore = cookieStore;
                this.rootScope = rootScope;
                this.ssoLogoutService = ssoLogoutService;
                this.entityService = entityService;
                this.accountService = accountService;
                this.pinChallengeService = pinChallengeService;
                this.locationService = locationService;
                this.user = { IsAuthenticated: false, BusinessUser: null };
                this._persistCookie = true;
                this._ssoCookie = false;
                this._isSharedCookieUsed = false;
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
                }
                else {
                    var cookie = cookieStore.get(AuthService.COOKIE_NAME);
                    var externalParameterEntityId = this.ExtractEntityIdFromUrl();
                    if (cookie != null) {
                        this.http.defaults.headers.common[AuthService.TOKEN_NAME] = cookie;
                    }
                    this.RetrieveUser(externalParameterEntityId).then(function () {
                        if (_this.user.BusinessUser != null && _this.user.IsAuthenticated && !_this._isSharedCookieUsed) {
                            _this._persistCookie = true;
                            _this.cookieStore.put(AuthService.COOKIE_NAME, cookie);
                        }
                        else {
                            _this._persistCookie = false;
                            _this.cookieStore.remove(AuthService.COOKIE_NAME);
                        }
                    });
                }
                rootScope.$on(Core.ApplicationEvent.HttpSuccess, function (event) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    if (args != null && args.length > 0) {
                        var response = args[0];
                        if (response.headers(AuthService.TOKEN_NAME) != null) {
                            var token = response.headers(AuthService.TOKEN_NAME);
                            _this.http.defaults.headers.common[AuthService.TOKEN_NAME] = token;
                            if (_this._persistCookie && !_this._ssoCookie && !_this._isSharedCookieUsed) {
                                _this.cookieStore.put(AuthService.COOKIE_NAME, token);
                            }
                        }
                    }
                });
            }
            AuthService.prototype.IsSharedCookieMode = function () {
                return this._isSharedCookieUsed;
            };
            AuthService.prototype.GetAuthToken = function () {
                return this.http.defaults.headers.common[AuthService.TOKEN_NAME];
            };
            AuthService.prototype.Logon = function (credentials) {
                var _this = this;
                var promise = this.logonService.PostUserLogon(credentials);
                promise.then(function (result) {
                    _this.ProcessLogon(result.data);
                    _this.cookieStore.put(AuthService.COOKIE_NAME, result.data.AuthToken);
                });
                return promise;
            };
            AuthService.prototype.LogonWithPinChallenge = function () {
                var userName = localStorage.getItem(LocalStorageKeys.USER_NAME);
                return this.pinChallengeService.Get(userName);
            };
            AuthService.prototype.LogonWithPin = function (pin) {
                var _this = this;
                var userName = localStorage.getItem(LocalStorageKeys.USER_NAME), pinToken = localStorage.getItem(LocalStorageKeys.PIN_TOKEN), challengePromise = this.pinChallengeService.Get(userName), deferredPromise = this.$q.defer();
                challengePromise.success(function (challengeResult) {
                    var challenge = challengeResult;
                    var hashedPin = CryptoJS.SHA256(pin + challenge.Salt).toString();
                    var challengeResponse = CryptoJS.SHA256(hashedPin + challenge.Nonce).toString();
                    var logonPromise = _this.logonService.PostUserLogonWithPin(userName, challengeResponse, pinToken);
                    logonPromise.success(function (logonResult) {
                        _this.ProcessLogon(logonResult);
                        _this.cookieStore.put(AuthService.COOKIE_NAME, logonResult.AuthToken);
                        deferredPromise.resolve(logonResult);
                    }).error(function (logonResult) {
                        deferredPromise.reject(logonResult);
                    });
                });
                challengePromise.error(function (challengeResult) {
                    _this.ProcessLogon(challengeResult.data);
                    deferredPromise.reject(challengeResult);
                });
                return deferredPromise.promise;
            };
            AuthService.prototype.ProcessLogon = function (logonData) {
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
                    this.rootScope.$broadcast(Core.ApplicationEvent.Login, null);
                    this.entityService.GetStartOfWeek(logonData.User.MobileSettings.EntityId, moment().format('YYYY-MM-DD')).success(function (result) {
                        Core.NG.Configs.DatepickerConfig.startingDay = result;
                    });
                }
            };
            AuthService.prototype.Logout = function () {
                if (this.user != null && this.user.BusinessUser != null) {
                    var entityId = this.user.BusinessUser.MobileSettings.EntityId;
                    this.rootScope.$broadcast(Core.ApplicationEvent.Logout, entityId);
                    if (!this._isSharedCookieUsed) {
                        this.ssoLogoutService.PostSsoLogout().then(function (result) {
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
                this.rootScope.$broadcast(Core.ApplicationEvent.Logout, null);
            };
            AuthService.prototype.RetrieveUser = function (entityId) {
                var _this = this;
                var promise = this.logonService.GetUser(entityId);
                promise.then(function (result) {
                    _this.ProcessLogon(result.data);
                });
                return promise;
            };
            AuthService.prototype.GetUser = function () {
                return this.user;
            };
            AuthService.prototype.GetPinUserName = function () {
                return localStorage.getItem(LocalStorageKeys.PIN_TOKEN) ? localStorage.getItem(LocalStorageKeys.USER_NAME) : null;
            };
            AuthService.prototype.CheckPermissionAllowance = function () {
                var permisions = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    permisions[_i - 0] = arguments[_i];
                }
                return this.CheckPermissionsAllowance(permisions);
            };
            AuthService.prototype.CheckPermissionsAllowance = function (permisions) {
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
            };
            AuthService.prototype.SetPinNumber = function (password, pin) {
                var _this = this;
                return this.accountService.PostPinNumber(password, pin)
                    .success(function (result) {
                    localStorage.setItem(LocalStorageKeys.USER_NAME, _this.user.BusinessUser.UserName);
                    localStorage.setItem(LocalStorageKeys.PIN_TOKEN, result);
                });
            };
            AuthService.prototype.ClearPinNumber = function (deletePin) {
                localStorage.removeItem(LocalStorageKeys.USER_NAME);
                localStorage.removeItem(LocalStorageKeys.PIN_TOKEN);
                if (deletePin) {
                    this.accountService.DeleteUserPin();
                }
            };
            AuthService.prototype.ExtractEntityIdFromUrl = function () {
                var absoluteUrl = this.locationService.absUrl();
                var regex = /\?entityId=([0-9]+)/i;
                var match = regex.exec(absoluteUrl);
                if (match) {
                    return Number(match[1]);
                }
                return null;
            };
            AuthService.COOKIE_NAME = "Auth";
            AuthService.SSO_COOKIE_NAME = "SsoAuth";
            AuthService.SSO_COOKIE_SharedEntityIdCookie = "SharedEntityIdCookie";
            AuthService.TOKEN_NAME = "AuthToken";
            return AuthService;
        }());
        Auth.$authService = Core.NG.CoreModule.RegisterService("Auth", AuthService, Core.NG.$q, Auth.Api.$logonService, Core.NG.$http, Core.NG.$cookieStore, Core.NG.$rootScope, Auth.Api.$ssoLogoutService, Core.Api.$entityService, Administration.MyAccount.Api.$accountService, Auth.Api.$pinChallengeService, Core.NG.$location);
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
