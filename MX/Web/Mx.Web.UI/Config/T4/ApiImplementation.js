var Administration;
(function (Administration) {
    var DataLoad;
    (function (DataLoad) {
        var Api;
        (function (Api) {
            var DataLoadService = (function () {
                function DataLoadService($http) {
                    this.$http = $http;
                }
                DataLoadService.prototype.PostFormData = function () {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/DataLoad/Api/DataLoad",
                        timeout: 120000
                    });
                };
                return DataLoadService;
            }());
            Api.$dataLoadService = Core.NG.CoreModule.RegisterService("ApiLayer.DataLoadService", DataLoadService, Core.NG.$http);
        })(Api = DataLoad.Api || (DataLoad.Api = {}));
    })(DataLoad = Administration.DataLoad || (Administration.DataLoad = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var DayCharacteristic;
    (function (DayCharacteristic) {
        var Api;
        (function (Api) {
            var DayCharacteristicService = (function () {
                function DayCharacteristicService($http) {
                    this.$http = $http;
                }
                DayCharacteristicService.prototype.Get = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                        timeout: 120000
                    });
                };
                DayCharacteristicService.prototype.Put = function (value) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                        timeout: 120000,
                        data: value
                    });
                };
                DayCharacteristicService.prototype.Delete = function (value) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                        timeout: 120000,
                        data: value
                    });
                };
                DayCharacteristicService.prototype.Get1 = function (entityId, businessDay) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                        timeout: 120000,
                        params: { entityId: entityId, businessDay: businessDay }
                    });
                };
                DayCharacteristicService.prototype.Put1 = function (entityId, businessDay, value) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/DayCharacteristic/Api/DayCharacteristic",
                        timeout: 120000,
                        params: { entityId: entityId, businessDay: businessDay },
                        data: value
                    });
                };
                return DayCharacteristicService;
            }());
            Api.$dayCharacteristicService = Core.NG.CoreModule.RegisterService("ApiLayer.DayCharacteristicService", DayCharacteristicService, Core.NG.$http);
        })(Api = DayCharacteristic.Api || (DayCharacteristic.Api = {}));
    })(DayCharacteristic = Administration.DayCharacteristic || (Administration.DayCharacteristic = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var Hierarchy;
    (function (Hierarchy) {
        var Api;
        (function (Api) {
            var HierarchyService = (function () {
                function HierarchyService($http) {
                    this.$http = $http;
                }
                HierarchyService.prototype.GetHierarchy = function (baseEntityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/Hierarchy/Api/Hierarchy",
                        timeout: 120000,
                        params: { baseEntityId: baseEntityId }
                    });
                };
                HierarchyService.prototype.GetHierarchyLevels = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/Hierarchy/Api/Hierarchy",
                        timeout: 120000
                    });
                };
                HierarchyService.prototype.PostCreateEntity = function (number, name, parentId, type) {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/Hierarchy/Api/Hierarchy",
                        timeout: 120000,
                        params: { number: number, name: name, parentId: parentId, type: type }
                    });
                };
                HierarchyService.prototype.PutUpdateBarebonesEntity = function (id, number, name) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/Hierarchy/Api/Hierarchy/" + encodeURI(id.toString()),
                        timeout: 120000,
                        params: { number: number, name: name }
                    });
                };
                HierarchyService.prototype.PutMoveHierarchy = function (id, parentId) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/Hierarchy/Api/Hierarchy/" + encodeURI(id.toString()),
                        timeout: 120000,
                        params: { parentId: parentId }
                    });
                };
                return HierarchyService;
            }());
            Api.$hierarchyService = Core.NG.CoreModule.RegisterService("ApiLayer.HierarchyService", HierarchyService, Core.NG.$http);
        })(Api = Hierarchy.Api || (Hierarchy.Api = {}));
    })(Hierarchy = Administration.Hierarchy || (Administration.Hierarchy = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var MyAccount;
    (function (MyAccount) {
        var Api;
        (function (Api) {
            var AccountService = (function () {
                function AccountService($http) {
                    this.$http = $http;
                }
                AccountService.prototype.PostPinNumber = function (password, pin) {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/MyAccount/Api/Account",
                        timeout: 120000,
                        params: { password: password, pin: pin }
                    });
                };
                AccountService.prototype.DeleteUserPin = function () {
                    return this.$http({
                        method: "DELETE",
                        url: "/Administration/MyAccount/Api/Account",
                        timeout: 120000
                    });
                };
                return AccountService;
            }());
            Api.$accountService = Core.NG.CoreModule.RegisterService("ApiLayer.AccountService", AccountService, Core.NG.$http);
        })(Api = MyAccount.Api || (MyAccount.Api = {}));
    })(MyAccount = Administration.MyAccount || (Administration.MyAccount = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Api;
        (function (Api) {
            var InventoryCountSettingsService = (function () {
                function InventoryCountSettingsService($http) {
                    this.$http = $http;
                }
                InventoryCountSettingsService.prototype.GetInventoryCountSettings = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/Settings/Api/InventoryCountSettings",
                        timeout: 120000
                    });
                };
                InventoryCountSettingsService.prototype.PostInventoryCountSettings = function (inventoryCountSettings) {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/Settings/Api/InventoryCountSettings",
                        timeout: 120000,
                        data: inventoryCountSettings
                    });
                };
                return InventoryCountSettingsService;
            }());
            Api.$inventoryCountSettingsService = Core.NG.CoreModule.RegisterService("ApiLayer.InventoryCountSettingsService", InventoryCountSettingsService, Core.NG.$http);
        })(Api = Settings.Api || (Settings.Api = {}));
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Api;
        (function (Api) {
            var SettingsService = (function () {
                function SettingsService($http) {
                    this.$http = $http;
                }
                SettingsService.prototype.GetMeasures = function (type, entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/Settings/Api/Settings",
                        timeout: 120000,
                        params: { type: type, entityId: entityId }
                    });
                };
                SettingsService.prototype.POSTReportMeasureConfig = function (measure, action) {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/Settings/Api/Settings",
                        timeout: 120000,
                        params: { action: action },
                        data: measure
                    });
                };
                SettingsService.prototype.GetConfigurationSettings = function (settings) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/Settings/Api/Settings",
                        timeout: 120000,
                        params: { settings: settings }
                    });
                };
                return SettingsService;
            }());
            Api.$settingsService = Core.NG.CoreModule.RegisterService("ApiLayer.SettingsService", SettingsService, Core.NG.$http);
        })(Api = Settings.Api || (Settings.Api = {}));
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Api;
        (function (Api) {
            var SiteSettingsService = (function () {
                function SiteSettingsService($http) {
                    this.$http = $http;
                }
                SiteSettingsService.prototype.GetSiteSettings = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/Settings/Api/SiteSettings",
                        timeout: 120000
                    });
                };
                SiteSettingsService.prototype.PostSiteSettings = function (settings) {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/Settings/Api/SiteSettings",
                        timeout: 120000,
                        data: settings
                    });
                };
                return SiteSettingsService;
            }());
            Api.$siteSettingsService = Core.NG.CoreModule.RegisterService("ApiLayer.SiteSettingsService", SiteSettingsService, Core.NG.$http);
        })(Api = Settings.Api || (Settings.Api = {}));
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var User;
    (function (User) {
        var Api;
        (function (Api) {
            var UserService = (function () {
                function UserService($http) {
                    this.$http = $http;
                }
                UserService.prototype.GetUsers = function (entityId, includeDescendents, includeTerminated) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/User/Api/User",
                        timeout: 120000,
                        params: { entityId: entityId, includeDescendents: includeDescendents, includeTerminated: includeTerminated }
                    });
                };
                UserService.prototype.GetSecurityGroups = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/User/Api/User",
                        timeout: 120000
                    });
                };
                UserService.prototype.PostCreateNewUser = function (entityId, employeeNumber, firstName, lastName, middleName, userName, password, securityGroups) {
                    return this.$http({
                        method: "POST",
                        url: "/Administration/User/Api/User",
                        timeout: 120000,
                        params: { entityId: entityId, employeeNumber: employeeNumber, firstName: firstName, lastName: lastName, middleName: middleName, userName: userName, password: password, securityGroups: securityGroups }
                    });
                };
                UserService.prototype.GetUserNameFromFirstNameAndLastName = function (firstName, lastName) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/User/Api/User",
                        timeout: 120000,
                        params: { firstName: firstName, lastName: lastName }
                    });
                };
                UserService.prototype.PutUpdateBasicUser = function (id, entityId, employeeNumber, firstName, lastName, middleName, userName, password, status) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/User/Api/User/" + encodeURI(id.toString()),
                        timeout: 120000,
                        params: { entityId: entityId, employeeNumber: employeeNumber, firstName: firstName, lastName: lastName, middleName: middleName, userName: userName, password: password, status: status }
                    });
                };
                UserService.prototype.PutUpdateUserSecurityGroups = function (userId, securityGroups) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/User/Api/User",
                        timeout: 120000,
                        params: { userId: userId, securityGroups: securityGroups }
                    });
                };
                return UserService;
            }());
            Api.$userService = Core.NG.CoreModule.RegisterService("ApiLayer.UserService", UserService, Core.NG.$http);
        })(Api = User.Api || (User.Api = {}));
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var User;
    (function (User) {
        var Api;
        (function (Api) {
            var UserSettingsService = (function () {
                function UserSettingsService($http) {
                    this.$http = $http;
                }
                UserSettingsService.prototype.GetUserSetting = function (userSetting) {
                    return this.$http({
                        method: "GET",
                        url: "/Administration/User/Api/UserSettings",
                        timeout: 120000,
                        params: { userSetting: userSetting }
                    });
                };
                UserSettingsService.prototype.PutUserSetting = function (userSetting, value) {
                    return this.$http({
                        method: "PUT",
                        url: "/Administration/User/Api/UserSettings",
                        timeout: 120000,
                        params: { userSetting: userSetting, value: value }
                    });
                };
                return UserSettingsService;
            }());
            Api.$userSettingsService = Core.NG.CoreModule.RegisterService("ApiLayer.UserSettingsService", UserSettingsService, Core.NG.$http);
        })(Api = User.Api || (User.Api = {}));
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var BackplaneService = (function () {
            function BackplaneService($http) {
                this.$http = $http;
            }
            BackplaneService.prototype.IsBackplaneActive = function () {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Backplane",
                    timeout: 120000
                });
            };
            return BackplaneService;
        }());
        Api.$backplaneService = Core.NG.CoreModule.RegisterService("ApiLayer.BackplaneService", BackplaneService, Core.NG.$http);
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var EntityService = (function () {
            function EntityService($http) {
                this.$http = $http;
            }
            EntityService.prototype.Get = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Entity",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            EntityService.prototype.GetOpenEntities = function (userId) {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Entity",
                    timeout: 120000,
                    params: { userId: userId }
                });
            };
            EntityService.prototype.GetStartOfWeek = function (entityId, calendarDay) {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Entity",
                    timeout: 120000,
                    params: { entityId: entityId, calendarDay: calendarDay }
                });
            };
            EntityService.prototype.GetEntitiesByIds = function (entityIds) {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Entity",
                    timeout: 120000,
                    params: { entityIds: entityIds }
                });
            };
            EntityService.prototype.GetEntitiesByEntityType = function (entityTypeId) {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Entity",
                    timeout: 120000,
                    params: { entityTypeId: entityTypeId }
                });
            };
            return EntityService;
        }());
        Api.$entityService = Core.NG.CoreModule.RegisterService("ApiLayer.EntityService", EntityService, Core.NG.$http);
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var MobileSettingsService = (function () {
            function MobileSettingsService($http) {
                this.$http = $http;
            }
            MobileSettingsService.prototype.Post = function (mobileSettings) {
                return this.$http({
                    method: "POST",
                    url: "/Core/Api/MobileSettings",
                    timeout: 120000,
                    data: mobileSettings
                });
            };
            return MobileSettingsService;
        }());
        Api.$mobileSettingsService = Core.NG.CoreModule.RegisterService("ApiLayer.MobileSettingsService", MobileSettingsService, Core.NG.$http);
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var NotificationsService = (function () {
            function NotificationsService($http) {
                this.$http = $http;
            }
            NotificationsService.prototype.Get = function () {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Notifications",
                    timeout: 120000
                });
            };
            return NotificationsService;
        }());
        Api.$notificationsService = Core.NG.CoreModule.RegisterService("ApiLayer.NotificationsService", NotificationsService, Core.NG.$http);
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var TranslationsService = (function () {
            function TranslationsService($http) {
                this.$http = $http;
            }
            TranslationsService.prototype.Get = function (culture) {
                return this.$http({
                    method: "GET",
                    url: "/Core/Api/Translations",
                    timeout: 120000,
                    params: { culture: culture }
                });
            };
            return TranslationsService;
        }());
        Api.$translationsService = Core.NG.CoreModule.RegisterService("ApiLayer.TranslationsService", TranslationsService, Core.NG.$http);
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        var Api;
        (function (Api) {
            var LogonService = (function () {
                function LogonService($http) {
                    this.$http = $http;
                }
                LogonService.prototype.PostUserLogon = function (credentials) {
                    return this.$http({
                        method: "POST",
                        url: "/Core/Auth/Api/Logon",
                        timeout: 120000,
                        data: credentials
                    });
                };
                LogonService.prototype.PostUserLogonWithPin = function (userName, pin, pinToken) {
                    return this.$http({
                        method: "POST",
                        url: "/Core/Auth/Api/Logon",
                        timeout: 120000,
                        params: { userName: userName, pin: pin, pinToken: pinToken }
                    });
                };
                LogonService.prototype.GetUser = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Core/Auth/Api/Logon",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                return LogonService;
            }());
            Api.$logonService = Core.NG.CoreModule.RegisterService("ApiLayer.LogonService", LogonService, Core.NG.$http);
        })(Api = Auth.Api || (Auth.Api = {}));
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        var Api;
        (function (Api) {
            var LogonImageService = (function () {
                function LogonImageService($http) {
                    this.$http = $http;
                }
                LogonImageService.prototype.Get = function (key) {
                    return this.$http({
                        method: "GET",
                        url: "/Core/Auth/Api/LogonImage",
                        timeout: 120000,
                        params: { key: key }
                    });
                };
                return LogonImageService;
            }());
            Api.$logonImageService = Core.NG.CoreModule.RegisterService("ApiLayer.LogonImageService", LogonImageService, Core.NG.$http);
        })(Api = Auth.Api || (Auth.Api = {}));
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        var Api;
        (function (Api) {
            var PartnerLoginService = (function () {
                function PartnerLoginService($http) {
                    this.$http = $http;
                }
                PartnerLoginService.prototype.Post = function () {
                    return this.$http({
                        method: "POST",
                        url: "/Core/Auth/Api/PartnerLogin",
                        timeout: 120000
                    });
                };
                return PartnerLoginService;
            }());
            Api.$partnerLoginService = Core.NG.CoreModule.RegisterService("ApiLayer.PartnerLoginService", PartnerLoginService, Core.NG.$http);
        })(Api = Auth.Api || (Auth.Api = {}));
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        var Api;
        (function (Api) {
            var PinChallengeService = (function () {
                function PinChallengeService($http) {
                    this.$http = $http;
                }
                PinChallengeService.prototype.Get = function (username) {
                    return this.$http({
                        method: "GET",
                        url: "/Core/Auth/Api/PinChallenge",
                        timeout: 120000,
                        params: { username: username }
                    });
                };
                return PinChallengeService;
            }());
            Api.$pinChallengeService = Core.NG.CoreModule.RegisterService("ApiLayer.PinChallengeService", PinChallengeService, Core.NG.$http);
        })(Api = Auth.Api || (Auth.Api = {}));
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        var Api;
        (function (Api) {
            var SsoService = (function () {
                function SsoService($http) {
                    this.$http = $http;
                }
                SsoService.prototype.GetSsoEnabled = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Core/Auth/Api/Sso",
                        timeout: 120000
                    });
                };
                SsoService.prototype.PostSsoLogon = function () {
                    return this.$http({
                        method: "POST",
                        url: "/Core/Auth/Api/Sso",
                        timeout: 120000
                    });
                };
                return SsoService;
            }());
            Api.$ssoService = Core.NG.CoreModule.RegisterService("ApiLayer.SsoService", SsoService, Core.NG.$http);
        })(Api = Auth.Api || (Auth.Api = {}));
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Auth;
    (function (Auth) {
        var Api;
        (function (Api) {
            var SsoLogoutService = (function () {
                function SsoLogoutService($http) {
                    this.$http = $http;
                }
                SsoLogoutService.prototype.PostSsoLogout = function () {
                    return this.$http({
                        method: "POST",
                        url: "/Core/Auth/Api/SsoLogout",
                        timeout: 120000
                    });
                };
                return SsoLogoutService;
            }());
            Api.$ssoLogoutService = Core.NG.CoreModule.RegisterService("ApiLayer.SsoLogoutService", SsoLogoutService, Core.NG.$http);
        })(Api = Auth.Api || (Auth.Api = {}));
    })(Auth = Core.Auth || (Core.Auth = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Diagnostics;
    (function (Diagnostics) {
        var Api;
        (function (Api) {
            var Services;
            (function (Services) {
                var DiagnosticService = (function () {
                    function DiagnosticService($http) {
                        this.$http = $http;
                    }
                    DiagnosticService.prototype.GetDiagnostic = function () {
                        return this.$http({
                            method: "GET",
                            url: "/Core/Diagnostics/Api/Services/Diagnostic",
                            timeout: 120000
                        });
                    };
                    return DiagnosticService;
                }());
                Services.$diagnosticService = Core.NG.CoreModule.RegisterService("ApiLayer.DiagnosticService", DiagnosticService, Core.NG.$http);
            })(Services = Api.Services || (Api.Services = {}));
        })(Api = Diagnostics.Api || (Diagnostics.Api = {}));
    })(Diagnostics = Core.Diagnostics || (Core.Diagnostics = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PartnerRedirect;
    (function (PartnerRedirect) {
        var Api;
        (function (Api) {
            var PartnerRedirectService = (function () {
                function PartnerRedirectService($http) {
                    this.$http = $http;
                }
                PartnerRedirectService.prototype.Get = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Core/PartnerRedirect/Api/PartnerRedirect",
                        timeout: 120000
                    });
                };
                return PartnerRedirectService;
            }());
            Api.$partnerRedirectService = Core.NG.CoreModule.RegisterService("ApiLayer.PartnerRedirectService", PartnerRedirectService, Core.NG.$http);
        })(Api = PartnerRedirect.Api || (PartnerRedirect.Api = {}));
    })(PartnerRedirect = Core.PartnerRedirect || (Core.PartnerRedirect = {}));
})(Core || (Core = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var CalendarService = (function () {
            function CalendarService($http) {
                this.$http = $http;
            }
            CalendarService.prototype.GetDaysOfWorkWeek = function (startOfWeek, entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Calendar",
                    timeout: 120000,
                    params: { startOfWeek: startOfWeek, entityId: entityId }
                });
            };
            return CalendarService;
        }());
        Api.$calendarService = Core.NG.CoreModule.RegisterService("ApiLayer.CalendarService", CalendarService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var CharacteristicCodeService = (function () {
            function CharacteristicCodeService($http) {
                this.$http = $http;
            }
            CharacteristicCodeService.prototype.Get = function () {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/CharacteristicCode",
                    timeout: 120000
                });
            };
            CharacteristicCodeService.prototype.Get1 = function (id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/CharacteristicCode/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            CharacteristicCodeService.prototype.Post = function (value) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/CharacteristicCode",
                    timeout: 120000,
                    data: value
                });
            };
            CharacteristicCodeService.prototype.Put = function (id, value) {
                return this.$http({
                    method: "PUT",
                    url: "/Forecasting/Api/CharacteristicCode/" + encodeURI(id.toString()),
                    timeout: 120000,
                    data: value
                });
            };
            CharacteristicCodeService.prototype.Delete = function (id) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/CharacteristicCode/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            return CharacteristicCodeService;
        }());
        Api.$characteristicCodeService = Core.NG.CoreModule.RegisterService("ApiLayer.CharacteristicCodeService", CharacteristicCodeService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var DaySegmentService = (function () {
            function DaySegmentService($http) {
                this.$http = $http;
            }
            DaySegmentService.prototype.GetDaysegments = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/DaySegment",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            return DaySegmentService;
        }());
        Api.$daySegmentService = Core.NG.CoreModule.RegisterService("ApiLayer.DaySegmentService", DaySegmentService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var EventCalendarService = (function () {
            function EventCalendarService($http) {
                this.$http = $http;
            }
            EventCalendarService.prototype.GetEventWeekDaysInfo = function (entityId, fromDate, toDate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/EventCalendar",
                    timeout: 120000,
                    params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
                });
            };
            EventCalendarService.prototype.GetCalendarInfo = function (entityId, year, month) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/EventCalendar",
                    timeout: 120000,
                    params: { entityId: entityId, year: year, month: month }
                });
            };
            return EventCalendarService;
        }());
        Api.$eventCalendarService = Core.NG.CoreModule.RegisterService("ApiLayer.EventCalendarService", EventCalendarService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var EventService = (function () {
            function EventService($http) {
                this.$http = $http;
            }
            EventService.prototype.GetEventProfiles = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Event",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            EventService.prototype.GetProfileNameExistsForEntity = function (entityId, profileName) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Event",
                    timeout: 120000,
                    params: { entityId: entityId, profileName: profileName }
                });
            };
            EventService.prototype.PostEventProfile = function (eventProfile, entityId) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/Event",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: eventProfile
                });
            };
            EventService.prototype.DeleteEventProfile = function (eventProfileId) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/Event",
                    timeout: 120000,
                    params: { eventProfileId: eventProfileId }
                });
            };
            return EventService;
        }());
        Api.$eventService = Core.NG.CoreModule.RegisterService("ApiLayer.EventService", EventService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var EventTagService = (function () {
            function EventTagService($http) {
                this.$http = $http;
            }
            EventTagService.prototype.GetEventProfileTags = function (eventProfileId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/EventTag",
                    timeout: 120000,
                    params: { eventProfileId: eventProfileId }
                });
            };
            EventTagService.prototype.PostEventProfileTag = function (tag, entityId) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/EventTag",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: tag
                });
            };
            EventTagService.prototype.PutEventProfileTag = function (tag, entityId) {
                return this.$http({
                    method: "PUT",
                    url: "/Forecasting/Api/EventTag",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: tag
                });
            };
            EventTagService.prototype.DeleteEventProfileTag = function (entityId, tagId, connectionId) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/EventTag",
                    timeout: 120000,
                    params: { entityId: entityId, tagId: tagId, connectionId: connectionId }
                });
            };
            return EventTagService;
        }());
        Api.$eventTagService = Core.NG.CoreModule.RegisterService("ApiLayer.EventTagService", EventTagService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var EventTagNoteService = (function () {
            function EventTagNoteService($http) {
                this.$http = $http;
            }
            EventTagNoteService.prototype.PutEventProfileTagNote = function (tagnote, entityId) {
                return this.$http({
                    method: "PUT",
                    url: "/Forecasting/Api/EventTagNote",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: tagnote
                });
            };
            return EventTagNoteService;
        }());
        Api.$eventTagNoteService = Core.NG.CoreModule.RegisterService("ApiLayer.EventTagNoteService", EventTagNoteService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastService = (function () {
            function ForecastService($http) {
                this.$http = $http;
            }
            ForecastService.prototype.GetForecastById = function (entityId, id, filterId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Forecast/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, filterId: filterId }
                });
            };
            ForecastService.prototype.GetForecastForBusinessDay = function (entityId, businessDay) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Forecast",
                    timeout: 120000,
                    params: { entityId: entityId, businessDay: businessDay }
                });
            };
            ForecastService.prototype.GetForecastsForBusinessDateRange = function (entityId, startDate, endDate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Forecast",
                    timeout: 120000,
                    params: { entityId: entityId, startDate: startDate, endDate: endDate }
                });
            };
            ForecastService.prototype.GetForecasts = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Forecast",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            ForecastService.prototype.PatchRevertForecast = function (entityId, forecastId, opcollection) {
                return this.$http({
                    method: "PATCH",
                    url: "/Forecasting/Api/Forecast",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId },
                    data: opcollection
                });
            };
            return ForecastService;
        }());
        Api.$forecastService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastService", ForecastService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastFilterAssignService = (function () {
            function ForecastFilterAssignService($http) {
                this.$http = $http;
            }
            ForecastFilterAssignService.prototype.GetForecastFilterAssigns = function () {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastFilterAssign",
                    timeout: 120000
                });
            };
            ForecastFilterAssignService.prototype.PostForecastFilterAssign = function (forecastFilterAssignRecords) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/ForecastFilterAssign",
                    timeout: 120000,
                    data: forecastFilterAssignRecords
                });
            };
            return ForecastFilterAssignService;
        }());
        Api.$forecastFilterAssignService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastFilterAssignService", ForecastFilterAssignService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastFilterService = (function () {
            function ForecastFilterService($http) {
                this.$http = $http;
            }
            ForecastFilterService.prototype.GetForecastFilters = function () {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastFilter",
                    timeout: 120000
                });
            };
            ForecastFilterService.prototype.DeleteFilterById = function (id) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/ForecastFilter/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            return ForecastFilterService;
        }());
        Api.$forecastFilterService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastFilterService", ForecastFilterService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastFilterDialogService = (function () {
            function ForecastFilterDialogService($http) {
                this.$http = $http;
            }
            ForecastFilterDialogService.prototype.PostInsertOrUpdateForecastFilter = function (forecastFilterRecord) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/ForecastFilterDialog",
                    timeout: 120000,
                    data: forecastFilterRecord
                });
            };
            return ForecastFilterDialogService;
        }());
        Api.$forecastFilterDialogService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastFilterDialogService", ForecastFilterDialogService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastGenerationService = (function () {
            function ForecastGenerationService($http) {
                this.$http = $http;
            }
            ForecastGenerationService.prototype.Get = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastGeneration",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            ForecastGenerationService.prototype.Post = function (entityId, request) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/ForecastGeneration",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: request
                });
            };
            return ForecastGenerationService;
        }());
        Api.$forecastGenerationService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastGenerationService", ForecastGenerationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastPipelineService = (function () {
            function ForecastPipelineService($http) {
                this.$http = $http;
            }
            ForecastPipelineService.prototype.PostPipeline = function (entityId, forecastId, request) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/ForecastPipeline",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId },
                    data: request
                });
            };
            return ForecastPipelineService;
        }());
        Api.$forecastPipelineService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastPipelineService", ForecastPipelineService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastSalesEvaluationService = (function () {
            function ForecastSalesEvaluationService($http) {
                this.$http = $http;
            }
            ForecastSalesEvaluationService.prototype.GetEvaluateSales = function (entityId, date, filterId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastSalesEvaluation",
                    timeout: 120000,
                    params: { entityId: entityId, date: date, filterId: filterId }
                });
            };
            return ForecastSalesEvaluationService;
        }());
        Api.$forecastSalesEvaluationService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastSalesEvaluationService", ForecastSalesEvaluationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastSalesItemEvaluationService = (function () {
            function ForecastSalesItemEvaluationService($http) {
                this.$http = $http;
            }
            ForecastSalesItemEvaluationService.prototype.Get = function (entityId, salesItemId, date, filterId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastSalesItemEvaluation",
                    timeout: 120000,
                    params: { entityId: entityId, salesItemId: salesItemId, date: date, filterId: filterId }
                });
            };
            return ForecastSalesItemEvaluationService;
        }());
        Api.$forecastSalesItemEvaluationService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastSalesItemEvaluationService", ForecastSalesItemEvaluationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastTransactionEvaluationService = (function () {
            function ForecastTransactionEvaluationService($http) {
                this.$http = $http;
            }
            ForecastTransactionEvaluationService.prototype.GetEvaluateTransactions = function (entityId, date, filterId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastTransactionEvaluation",
                    timeout: 120000,
                    params: { entityId: entityId, date: date, filterId: filterId }
                });
            };
            return ForecastTransactionEvaluationService;
        }());
        Api.$forecastTransactionEvaluationService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastTransactionEvaluationService", ForecastTransactionEvaluationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ForecastZoneService = (function () {
            function ForecastZoneService($http) {
                this.$http = $http;
            }
            ForecastZoneService.prototype.GetForecastZones = function () {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/ForecastZone",
                    timeout: 120000
                });
            };
            return ForecastZoneService;
        }());
        Api.$forecastZoneService = Core.NG.CoreModule.RegisterService("ApiLayer.ForecastZoneService", ForecastZoneService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var FutureOrderService = (function () {
            function FutureOrderService($http) {
                this.$http = $http;
            }
            FutureOrderService.prototype.GetAllFutureOrdersForEntity = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/FutureOrder",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            FutureOrderService.prototype.GetFutureOrdersByStatusDateRange = function (entityId, startDate, endDate, statusIds) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/FutureOrder",
                    timeout: 120000,
                    params: { entityId: entityId, startDate: startDate, endDate: endDate, statusIds: statusIds }
                });
            };
            FutureOrderService.prototype.GetFutureOrdersForDateRange = function (entityId, startDate, endDate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/FutureOrder",
                    timeout: 120000,
                    params: { entityId: entityId, startDate: startDate, endDate: endDate }
                });
            };
            FutureOrderService.prototype.GetFutureOrdersForBusinessDay = function (entityId, businessDay) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/FutureOrder",
                    timeout: 120000,
                    params: { entityId: entityId, businessDay: businessDay }
                });
            };
            return FutureOrderService;
        }());
        Api.$futureOrderService = Core.NG.CoreModule.RegisterService("ApiLayer.FutureOrderService", FutureOrderService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var HistoricalService = (function () {
            function HistoricalService($http) {
                this.$http = $http;
            }
            HistoricalService.prototype.GetForecastSalesHistory = function (entityId, forecastId, filterId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Historical",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId }
                });
            };
            return HistoricalService;
        }());
        Api.$historicalService = Core.NG.CoreModule.RegisterService("ApiLayer.HistoricalService", HistoricalService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var InventoryItemMetricService = (function () {
            function InventoryItemMetricService($http) {
                this.$http = $http;
            }
            InventoryItemMetricService.prototype.Get = function (entityId, forecastId, filterId, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/InventoryItemMetric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            InventoryItemMetricService.prototype.Get1 = function (entityId, forecastId, id, filterId, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/InventoryItemMetric/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            InventoryItemMetricService.prototype.Get2 = function (entityId, forecastId, ids, filterId, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/InventoryItemMetric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, ids: ids, filterId: filterId, aggregate: aggregate }
                });
            };
            return InventoryItemMetricService;
        }());
        Api.$inventoryItemMetricService = Core.NG.CoreModule.RegisterService("ApiLayer.InventoryItemMetricService", InventoryItemMetricService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var MetricAllService = (function () {
            function MetricAllService($http) {
                this.$http = $http;
            }
            MetricAllService.prototype.GetForecastMetricAlls = function (entityId, forecastId, filterId, includeActuals) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/MetricAll",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals }
                });
            };
            MetricAllService.prototype.GetForecastMetricAlls1 = function (entityId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/MetricAll",
                    timeout: 120000,
                    params: { entityId: entityId }
                });
            };
            return MetricAllService;
        }());
        Api.$metricAllService = Core.NG.CoreModule.RegisterService("ApiLayer.MetricAllService", MetricAllService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var MetricService = (function () {
            function MetricService($http) {
                this.$http = $http;
            }
            MetricService.prototype.GetForecastMetrics = function (entityId, forecastId, filterId, includeActuals) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Metric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals }
                });
            };
            MetricService.prototype.GetForecastMetricsByServiceType = function (entityId, forecastId, serviceType, includeActuals) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Metric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, serviceType: serviceType, includeActuals: includeActuals }
                });
            };
            MetricService.prototype.GetForecastEvaluationById = function (entityId, forecastEvaluationId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Metric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
                });
            };
            MetricService.prototype.GetForecastMetricId = function (entityId, forecastId, id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Metric/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId }
                });
            };
            MetricService.prototype.GetEvaluationMetricId = function (entityId, forecastEvaluationId, id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Metric/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
                });
            };
            MetricService.prototype.PatchForecastMetricDetails = function (entityId, forecastId, version, metricDetailRequests) {
                return this.$http({
                    method: "PATCH",
                    url: "/Forecasting/Api/Metric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, version: version },
                    data: metricDetailRequests
                });
            };
            return MetricService;
        }());
        Api.$metricService = Core.NG.CoreModule.RegisterService("ApiLayer.MetricService", MetricService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var MirroringRegenerationService = (function () {
            function MirroringRegenerationService($http) {
                this.$http = $http;
            }
            MirroringRegenerationService.prototype.Post = function (entityId, request) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/MirroringRegeneration",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: request
                });
            };
            return MirroringRegenerationService;
        }());
        Api.$mirroringRegenerationService = Core.NG.CoreModule.RegisterService("ApiLayer.MirroringRegenerationService", MirroringRegenerationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var MultiFilterMetricAllService = (function () {
            function MultiFilterMetricAllService($http) {
                this.$http = $http;
            }
            MultiFilterMetricAllService.prototype.GetForecastMetricAlls = function (entityId, forecastId, filterIds, includeActuals) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/MultiFilterMetricAll",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterIds: filterIds, includeActuals: includeActuals }
                });
            };
            return MultiFilterMetricAllService;
        }());
        Api.$multiFilterMetricAllService = Core.NG.CoreModule.RegisterService("ApiLayer.MultiFilterMetricAllService", MultiFilterMetricAllService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var MultiFilterSalesItemMetricAllService = (function () {
            function MultiFilterSalesItemMetricAllService($http) {
                this.$http = $http;
            }
            MultiFilterSalesItemMetricAllService.prototype.GetForecastingSalesItemMetricAlls = function (entityId, forecastId, filterIds, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/MultiFilterSalesItemMetricAll",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterIds: filterIds, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            MultiFilterSalesItemMetricAllService.prototype.GetSalesItemMetrics = function (entityId, forecastId, id, filterIds, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/MultiFilterSalesItemMetricAll/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterIds: filterIds, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            MultiFilterSalesItemMetricAllService.prototype.GetSalesItemMetricDetailsById = function (entityId, forecastId, ids, filterIds, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/MultiFilterSalesItemMetricAll",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, ids: ids, filterIds: filterIds, aggregate: aggregate }
                });
            };
            return MultiFilterSalesItemMetricAllService;
        }());
        Api.$multiFilterSalesItemMetricAllService = Core.NG.CoreModule.RegisterService("ApiLayer.MultiFilterSalesItemMetricAllService", MultiFilterSalesItemMetricAllService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var PromotionService = (function () {
            function PromotionService($http) {
                this.$http = $http;
            }
            PromotionService.prototype.Get = function (startDate, endDate, status) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Promotion",
                    timeout: 120000,
                    params: { startDate: startDate, endDate: endDate, status: status }
                });
            };
            PromotionService.prototype.Get1 = function (id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            PromotionService.prototype.GetWithTimeline = function (id, withTimeline) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { withTimeline: withTimeline }
                });
            };
            PromotionService.prototype.GetFormData = function (id, withFormData) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { withFormData: withFormData }
                });
            };
            PromotionService.prototype.Post = function (promo, checkOverlap) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/Promotion",
                    timeout: 120000,
                    params: { checkOverlap: checkOverlap },
                    data: promo
                });
            };
            PromotionService.prototype.Post1 = function (request) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/Promotion",
                    timeout: 120000,
                    data: request
                });
            };
            PromotionService.prototype.Delete = function (id) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/Promotion/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            return PromotionService;
        }());
        Api.$promotionService = Core.NG.CoreModule.RegisterService("ApiLayer.PromotionService", PromotionService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SalesItemService = (function () {
            function SalesItemService($http) {
                this.$http = $http;
            }
            SalesItemService.prototype.GetSalesItemsForForecast = function (entityId, forecastId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItem",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId }
                });
            };
            SalesItemService.prototype.Get = function (entityId, forecastId, id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItem/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId }
                });
            };
            SalesItemService.prototype.GetAll = function (searchText) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItem",
                    timeout: 120000,
                    params: { searchText: searchText }
                });
            };
            return SalesItemService;
        }());
        Api.$salesItemService = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemService", SalesItemService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SalesItemHistoricalService = (function () {
            function SalesItemHistoricalService($http) {
                this.$http = $http;
            }
            SalesItemHistoricalService.prototype.GetForecastSalesItemHistory = function (entityId, forecastId, salesItemId, filterId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemHistorical",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, salesItemId: salesItemId, filterId: filterId }
                });
            };
            return SalesItemHistoricalService;
        }());
        Api.$salesItemHistoricalService = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemHistoricalService", SalesItemHistoricalService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SalesItemMetricAllService = (function () {
            function SalesItemMetricAllService($http) {
                this.$http = $http;
            }
            SalesItemMetricAllService.prototype.GetForecastingSalesItemMetricAlls = function (entityId, forecastId, filterId, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetricAll",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            SalesItemMetricAllService.prototype.GetSalesItemMetrics = function (entityId, forecastId, id, filterId, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetricAll/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            SalesItemMetricAllService.prototype.GetSalesItemMetricDetailsById = function (entityId, forecastId, ids, filterId, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetricAll",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, ids: ids, filterId: filterId, aggregate: aggregate }
                });
            };
            return SalesItemMetricAllService;
        }());
        Api.$salesItemMetricAllService = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemMetricAllService", SalesItemMetricAllService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SalesItemMetricService = (function () {
            function SalesItemMetricService($http) {
                this.$http = $http;
            }
            SalesItemMetricService.prototype.GetForecastSalesItemMetric = function (entityId, forecastId, filterId, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            SalesItemMetricService.prototype.GetForecastSalesItemMetric1 = function (entityId, forecastId, id, filterId, includeActuals, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetric/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, filterId: filterId, includeActuals: includeActuals, aggregate: aggregate }
                });
            };
            SalesItemMetricService.prototype.GetForecastSalesItemMetric2 = function (entityId, forecastId, ids, filterId, aggregate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, ids: ids, filterId: filterId, aggregate: aggregate }
                });
            };
            SalesItemMetricService.prototype.Get = function (entityId, forecastEvaluationId) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
                });
            };
            SalesItemMetricService.prototype.GetEvaluationSalesItemMetricId = function (entityId, forecastEvaluationId, id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMetric/" + encodeURI(id.toString()),
                    timeout: 120000,
                    params: { entityId: entityId, forecastEvaluationId: forecastEvaluationId }
                });
            };
            SalesItemMetricService.prototype.PatchSalesItemMetricDetails = function (entityId, forecastId, version, salesItemMetricDetailRequests) {
                return this.$http({
                    method: "PATCH",
                    url: "/Forecasting/Api/SalesItemMetric",
                    timeout: 120000,
                    params: { entityId: entityId, forecastId: forecastId, version: version },
                    data: salesItemMetricDetailRequests
                });
            };
            return SalesItemMetricService;
        }());
        Api.$salesItemMetricService = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemMetricService", SalesItemMetricService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SalesItemMirrorIntervalsService = (function () {
            function SalesItemMirrorIntervalsService($http) {
                this.$http = $http;
            }
            SalesItemMirrorIntervalsService.prototype.GetSalesItemMirrorInterval = function (id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMirrorIntervals/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            SalesItemMirrorIntervalsService.prototype.GetSalesItemMirrorIntervals = function (startDate, endDate) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/SalesItemMirrorIntervals",
                    timeout: 120000,
                    params: { startDate: startDate, endDate: endDate }
                });
            };
            SalesItemMirrorIntervalsService.prototype.PostSalesItemMirrorIntervals = function (salesItemMirrorInterval) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/SalesItemMirrorIntervals",
                    timeout: 120000,
                    data: salesItemMirrorInterval
                });
            };
            SalesItemMirrorIntervalsService.prototype.DeleteSalesItemMirrorIntervals = function (intervalId, resetManagerForecast) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/SalesItemMirrorIntervals",
                    timeout: 120000,
                    params: { intervalId: intervalId, resetManagerForecast: resetManagerForecast }
                });
            };
            return SalesItemMirrorIntervalsService;
        }());
        Api.$salesItemMirrorIntervalsService = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemMirrorIntervalsService", SalesItemMirrorIntervalsService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SalesItemSystemAdjustmentService = (function () {
            function SalesItemSystemAdjustmentService($http) {
                this.$http = $http;
            }
            SalesItemSystemAdjustmentService.prototype.PostSalesItemSystemAdjustments = function (entityId, businessDay, salesItemSystemAdjustmentRequest) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/SalesItemSystemAdjustment",
                    timeout: 120000,
                    params: { entityId: entityId, businessDay: businessDay },
                    data: salesItemSystemAdjustmentRequest
                });
            };
            return SalesItemSystemAdjustmentService;
        }());
        Api.$salesItemSystemAdjustmentService = Core.NG.CoreModule.RegisterService("ApiLayer.SalesItemSystemAdjustmentService", SalesItemSystemAdjustmentService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var StoreMirrorIntervalsService = (function () {
            function StoreMirrorIntervalsService($http) {
                this.$http = $http;
            }
            StoreMirrorIntervalsService.prototype.GetStoreMirrorInterval = function (id) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/StoreMirrorIntervals/" + encodeURI(id.toString()),
                    timeout: 120000
                });
            };
            StoreMirrorIntervalsService.prototype.GetStoreMirrorIntervals = function (entityId, group, types) {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/StoreMirrorIntervals",
                    timeout: 120000,
                    params: { entityId: entityId, group: group, types: types }
                });
            };
            StoreMirrorIntervalsService.prototype.PostStoreMirrorIntervals = function (storeMirrorIntervalGroup) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/StoreMirrorIntervals",
                    timeout: 120000,
                    data: storeMirrorIntervalGroup
                });
            };
            StoreMirrorIntervalsService.prototype.DeleteStoreMirrorInterval = function (entityId, userName, groupId, resetManagerForecasts) {
                return this.$http({
                    method: "DELETE",
                    url: "/Forecasting/Api/StoreMirrorIntervals",
                    timeout: 120000,
                    params: { entityId: entityId, userName: userName, groupId: groupId, resetManagerForecasts: resetManagerForecasts }
                });
            };
            return StoreMirrorIntervalsService;
        }());
        Api.$storeMirrorIntervalsService = Core.NG.CoreModule.RegisterService("ApiLayer.StoreMirrorIntervalsService", StoreMirrorIntervalsService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SystemAdjustmentService = (function () {
            function SystemAdjustmentService($http) {
                this.$http = $http;
            }
            SystemAdjustmentService.prototype.PostSystemAdjustments = function (entityId, businessDay, systemAdjustmentRequest) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/SystemAdjustment",
                    timeout: 120000,
                    params: { entityId: entityId, businessDay: businessDay },
                    data: systemAdjustmentRequest
                });
            };
            return SystemAdjustmentService;
        }());
        Api.$systemAdjustmentService = Core.NG.CoreModule.RegisterService("ApiLayer.SystemAdjustmentService", SystemAdjustmentService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var SystemForecastGenerationService = (function () {
            function SystemForecastGenerationService($http) {
                this.$http = $http;
            }
            SystemForecastGenerationService.prototype.Post = function (entityId, request) {
                return this.$http({
                    method: "POST",
                    url: "/Forecasting/Api/SystemForecastGeneration",
                    timeout: 120000,
                    params: { entityId: entityId },
                    data: request
                });
            };
            return SystemForecastGenerationService;
        }());
        Api.$systemForecastGenerationService = Core.NG.CoreModule.RegisterService("ApiLayer.SystemForecastGenerationService", SystemForecastGenerationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var TransitionService = (function () {
            function TransitionService($http) {
                this.$http = $http;
            }
            TransitionService.prototype.GetTransition = function () {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/Transition",
                    timeout: 120000
                });
            };
            return TransitionService;
        }());
        Api.$transitionService = Core.NG.CoreModule.RegisterService("ApiLayer.TransitionService", TransitionService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var TranslatedPosServiceTypeService = (function () {
            function TranslatedPosServiceTypeService($http) {
                this.$http = $http;
            }
            TranslatedPosServiceTypeService.prototype.GetPosServiceTypeEnumTranslations = function () {
                return this.$http({
                    method: "GET",
                    url: "/Forecasting/Api/TranslatedPosServiceType",
                    timeout: 120000
                });
            };
            return TranslatedPosServiceTypeService;
        }());
        Api.$translatedPosServiceTypeService = Core.NG.CoreModule.RegisterService("ApiLayer.TranslatedPosServiceTypeService", TranslatedPosServiceTypeService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var CountService = (function () {
                function CountService($http) {
                    this.$http = $http;
                }
                CountService.prototype.Get = function (countType, entityId, countId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/Count",
                        timeout: 120000,
                        params: { countType: countType, entityId: entityId, countId: countId }
                    });
                };
                CountService.prototype.Delete = function (countType, countId, entityId, connectionId) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Inventory/Count/Api/Count",
                        timeout: 120000,
                        params: { countType: countType, countId: countId, entityId: entityId, connectionId: connectionId }
                    });
                };
                CountService.prototype.PutCount = function (countUpdates, entityId, connectionId) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Count/Api/Count",
                        timeout: 30000,
                        params: { entityId: entityId, connectionId: connectionId },
                        data: countUpdates
                    });
                };
                CountService.prototype.GetCheckIfCountApplied = function (countId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/Count",
                        timeout: 120000,
                        params: { countId: countId }
                    });
                };
                CountService.prototype.GetEntityItemsAndVendorEntityItemsNotInCurrentCount = function (entityId, countId, locationId, stockCountItemType, search) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/Count",
                        timeout: 120000,
                        params: { entityId: entityId, countId: countId, locationId: locationId, stockCountItemType: stockCountItemType, search: search }
                    });
                };
                CountService.prototype.PostUpdateCountWithCountItems = function (entityId, countId, locationId, countItems, countType) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Count/Api/Count",
                        timeout: 120000,
                        params: { entityId: entityId, countId: countId, locationId: locationId, countType: countType },
                        data: countItems
                    });
                };
                return CountService;
            }());
            Api.$countService = Core.NG.CoreModule.RegisterService("ApiLayer.CountService", CountService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var CountTypeService = (function () {
                function CountTypeService($http) {
                    this.$http = $http;
                }
                CountTypeService.prototype.Get = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/CountType",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                return CountTypeService;
            }());
            Api.$countTypeService = Core.NG.CoreModule.RegisterService("ApiLayer.CountTypeService", CountTypeService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var CountVarianceService = (function () {
                function CountVarianceService($http) {
                    this.$http = $http;
                }
                CountVarianceService.prototype.GetCountItemsVariances = function (entityId, countId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/CountVariance",
                        timeout: 120000,
                        params: { entityId: entityId, countId: countId }
                    });
                };
                return CountVarianceService;
            }());
            Api.$countVarianceService = Core.NG.CoreModule.RegisterService("ApiLayer.CountVarianceService", CountVarianceService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var FinishService = (function () {
                function FinishService($http) {
                    this.$http = $http;
                }
                FinishService.prototype.Post = function (model) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Count/Api/Finish",
                        timeout: 120000,
                        data: model
                    });
                };
                FinishService.prototype.GetApplyDateByCountType = function (entityId, countType) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/Finish",
                        timeout: 120000,
                        params: { entityId: entityId, countType: countType }
                    });
                };
                return FinishService;
            }());
            Api.$finishService = Core.NG.CoreModule.RegisterService("ApiLayer.FinishService", FinishService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var ReviewService = (function () {
                function ReviewService($http) {
                    this.$http = $http;
                }
                ReviewService.prototype.GetReview = function (stockCountLocationId, countType, entityIdCurrent) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/Review",
                        timeout: 120000,
                        params: { stockCountLocationId: stockCountLocationId, countType: countType, entityIdCurrent: entityIdCurrent }
                    });
                };
                return ReviewService;
            }());
            Api.$reviewService = Core.NG.CoreModule.RegisterService("ApiLayer.ReviewService", ReviewService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var TravelPathAddItemsService = (function () {
                function TravelPathAddItemsService($http) {
                    this.$http = $http;
                }
                TravelPathAddItemsService.prototype.GetSearchItemsLimited = function (searchCriteria, currentEntityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/TravelPathAddItems",
                        timeout: 120000,
                        params: { searchCriteria: searchCriteria, currentEntityId: currentEntityId }
                    });
                };
                return TravelPathAddItemsService;
            }());
            Api.$travelPathAddItemsService = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathAddItemsService", TravelPathAddItemsService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var TravelPathService = (function () {
                function TravelPathService($http) {
                    this.$http = $http;
                }
                TravelPathService.prototype.GetTravelPathData = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/TravelPath",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                TravelPathService.prototype.GetTravelPathDataForLocation = function (entityId, locationId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Count/Api/TravelPath",
                        timeout: 120000,
                        params: { entityId: entityId, locationId: locationId }
                    });
                };
                TravelPathService.prototype.PostUpdateTravelPath = function (update, connectionId, currentEntityId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Count/Api/TravelPath",
                        timeout: 120000,
                        params: { connectionId: connectionId, currentEntityId: currentEntityId },
                        data: update
                    });
                };
                return TravelPathService;
            }());
            Api.$travelPathService = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathService", TravelPathService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var TravelPathItemService = (function () {
                function TravelPathItemService($http) {
                    this.$http = $http;
                }
                TravelPathItemService.prototype.PostUpdateCount = function (travelPathItemUpdate) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Count/Api/TravelPathItem",
                        timeout: 120000,
                        data: travelPathItemUpdate
                    });
                };
                return TravelPathItemService;
            }());
            Api.$travelPathItemService = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathItemService", TravelPathItemService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var TravelPathLocationService = (function () {
                function TravelPathLocationService($http) {
                    this.$http = $http;
                }
                TravelPathLocationService.prototype.PostAddLocation = function (currentEntityId, locationName, connectionId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Count/Api/TravelPathLocation",
                        timeout: 120000,
                        params: { currentEntityId: currentEntityId, locationName: locationName, connectionId: connectionId }
                    });
                };
                TravelPathLocationService.prototype.PutLocation = function (locationId, currentEntityId, newLocationName, targetLocationId, movingLocationId, activateLocation, deactivateLocation, renameLocation, resortLocation, connectionId) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Count/Api/TravelPathLocation",
                        timeout: 120000,
                        params: { locationId: locationId, currentEntityId: currentEntityId, newLocationName: newLocationName, targetLocationId: targetLocationId, movingLocationId: movingLocationId, activateLocation: activateLocation, deactivateLocation: deactivateLocation, renameLocation: renameLocation, resortLocation: resortLocation, connectionId: connectionId }
                    });
                };
                TravelPathLocationService.prototype.DeleteLocation = function (locationId, currentEntityId, connectionId) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Inventory/Count/Api/TravelPathLocation",
                        timeout: 120000,
                        params: { locationId: locationId, currentEntityId: currentEntityId, connectionId: connectionId }
                    });
                };
                return TravelPathLocationService;
            }());
            Api.$travelPathLocationService = Core.NG.CoreModule.RegisterService("ApiLayer.TravelPathLocationService", TravelPathLocationService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var UpdateCostService = (function () {
                function UpdateCostService($http) {
                    this.$http = $http;
                }
                UpdateCostService.prototype.PostUpdateCost = function (updateCostItems, currentEntityId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Count/Api/UpdateCost",
                        timeout: 120000,
                        params: { currentEntityId: currentEntityId },
                        data: updateCostItems
                    });
                };
                return UpdateCostService;
            }());
            Api.$updateCostService = Core.NG.CoreModule.RegisterService("ApiLayer.UpdateCostService", UpdateCostService, Core.NG.$http);
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var OrderAddItemsService = (function () {
                function OrderAddItemsService($http) {
                    this.$http = $http;
                }
                OrderAddItemsService.prototype.GetVendorItems = function (entityId, vendorId, searchText) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/OrderAddItems",
                        timeout: 120000,
                        params: { entityId: entityId, vendorId: vendorId, searchText: searchText }
                    });
                };
                return OrderAddItemsService;
            }());
            Api.$orderAddItemsService = Core.NG.CoreModule.RegisterService("ApiLayer.OrderAddItemsService", OrderAddItemsService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var OrderService = (function () {
                function OrderService($http) {
                    this.$http = $http;
                }
                OrderService.prototype.GetOrdersByRange = function (entityId, fromDate, toDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
                    });
                };
                OrderService.prototype.GetOrder = function (entityId, orderId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, orderId: orderId }
                    });
                };
                OrderService.prototype.PostAddItems = function (entityId, orderId, itemCodes) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, orderId: orderId },
                        data: itemCodes
                    });
                };
                OrderService.prototype.PostCreateAutoSelectTemplate = function (entityId, vendorId, deliveryDate, daysToCover) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, vendorId: vendorId, deliveryDate: deliveryDate, daysToCover: daysToCover }
                    });
                };
                OrderService.prototype.PutPurchaseUnitQuantity = function (entityId, salesOrderItemId, supplyOrderItemId, quantity) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, salesOrderItemId: salesOrderItemId, supplyOrderItemId: supplyOrderItemId, quantity: quantity }
                    });
                };
                OrderService.prototype.PostCreateSupplyOrder = function (orderId, autoReceive, invoiceNumber, receiveTime) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { orderId: orderId, autoReceive: autoReceive, invoiceNumber: invoiceNumber, receiveTime: receiveTime }
                    });
                };
                OrderService.prototype.DeleteOrder = function (orderId) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { orderId: orderId }
                    });
                };
                OrderService.prototype.GetOrderItemHistory = function (transactionSalesOrderItemId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { transactionSalesOrderItemId: transactionSalesOrderItemId }
                    });
                };
                OrderService.prototype.GetScheduledOrders = function (entityId, fromDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, fromDate: fromDate }
                    });
                };
                OrderService.prototype.PutVoidedScheduledOrder = function (entityId, startDate, actionItemInstanceId, currentUserFullName, actionItemId) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, startDate: startDate, actionItemInstanceId: actionItemInstanceId, currentUserFullName: currentUserFullName, actionItemId: actionItemId }
                    });
                };
                OrderService.prototype.PostGenerateSalesOrderFromScheduledOrder = function (entityId, startDate, actionItemId, actionItemInstanceId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId, startDate: startDate, actionItemId: actionItemId, actionItemInstanceId: actionItemInstanceId }
                    });
                };
                OrderService.prototype.GetStoreLocalDateTimeString = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/Order",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                return OrderService;
            }());
            Api.$orderService = Core.NG.CoreModule.RegisterService("ApiLayer.OrderService", OrderService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var OrderHistoryService = (function () {
                function OrderHistoryService($http) {
                    this.$http = $http;
                }
                OrderHistoryService.prototype.GetOrdersByRange = function (entityId, fromDate, toDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/OrderHistory",
                        timeout: 120000,
                        params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
                    });
                };
                return OrderHistoryService;
            }());
            Api.$orderHistoryService = Core.NG.CoreModule.RegisterService("ApiLayer.OrderHistoryService", OrderHistoryService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var OverdueScheduledOrdersService = (function () {
                function OverdueScheduledOrdersService($http) {
                    this.$http = $http;
                }
                OverdueScheduledOrdersService.prototype.GetOverdueScheduledOrders = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/OverdueScheduledOrders",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                return OverdueScheduledOrdersService;
            }());
            Api.$overdueScheduledOrdersService = Core.NG.CoreModule.RegisterService("ApiLayer.OverdueScheduledOrdersService", OverdueScheduledOrdersService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var ReceiveOrderService = (function () {
                function ReceiveOrderService($http) {
                    this.$http = $http;
                }
                ReceiveOrderService.prototype.GetReceiveOrder = function (orderId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/ReceiveOrder",
                        timeout: 120000,
                        params: { orderId: orderId }
                    });
                };
                ReceiveOrderService.prototype.GetPlacedAndReceivedOrders = function (entityId, fromDate, toDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/ReceiveOrder",
                        timeout: 120000,
                        params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
                    });
                };
                ReceiveOrderService.prototype.PostPushForTomorrow = function (orderId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReceiveOrder",
                        timeout: 120000,
                        params: { orderId: orderId }
                    });
                };
                ReceiveOrderService.prototype.PostAddItems = function (entityId, orderId, itemCodes) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReceiveOrder",
                        timeout: 120000,
                        params: { entityId: entityId, orderId: orderId },
                        data: itemCodes
                    });
                };
                ReceiveOrderService.prototype.GetLocalStoreDateTimeString = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/ReceiveOrder",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                return ReceiveOrderService;
            }());
            Api.$receiveOrderService = Core.NG.CoreModule.RegisterService("ApiLayer.ReceiveOrderService", ReceiveOrderService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var ReceiveOrderDetailService = (function () {
                function ReceiveOrderDetailService($http) {
                    this.$http = $http;
                }
                ReceiveOrderDetailService.prototype.PostReceiveOrder = function (entityId, applyDate, orderId, invoiceNumber, items) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReceiveOrderDetail",
                        timeout: 120000,
                        params: { entityId: entityId, applyDate: applyDate, orderId: orderId, invoiceNumber: invoiceNumber },
                        data: items
                    });
                };
                ReceiveOrderDetailService.prototype.PostAdjustment = function (entityId, orderId, items) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReceiveOrderDetail",
                        timeout: 120000,
                        params: { entityId: entityId, orderId: orderId },
                        data: items
                    });
                };
                ReceiveOrderDetailService.prototype.PostChangeApplyDate = function (orderId, newApplyDate) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReceiveOrderDetail",
                        timeout: 120000,
                        params: { orderId: orderId, newApplyDate: newApplyDate }
                    });
                };
                return ReceiveOrderDetailService;
            }());
            Api.$receiveOrderDetailService = Core.NG.CoreModule.RegisterService("ApiLayer.ReceiveOrderDetailService", ReceiveOrderDetailService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var ReturnEntireOrderService = (function () {
                function ReturnEntireOrderService($http) {
                    this.$http = $http;
                }
                ReturnEntireOrderService.prototype.PostReturnEntireOrder = function (orderId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReturnEntireOrder",
                        timeout: 120000,
                        params: { orderId: orderId }
                    });
                };
                return ReturnEntireOrderService;
            }());
            Api.$returnEntireOrderService = Core.NG.CoreModule.RegisterService("ApiLayer.ReturnEntireOrderService", ReturnEntireOrderService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var ReturnOrderService = (function () {
                function ReturnOrderService($http) {
                    this.$http = $http;
                }
                ReturnOrderService.prototype.GetReceivedOrders = function (entityId, fromDate, toDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/ReturnOrder",
                        timeout: 120000,
                        params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
                    });
                };
                ReturnOrderService.prototype.PostReturnItemsInOrder = function (orderId, items) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Order/Api/ReturnOrder",
                        timeout: 120000,
                        params: { orderId: orderId },
                        data: items
                    });
                };
                return ReturnOrderService;
            }());
            Api.$returnOrderService = Core.NG.CoreModule.RegisterService("ApiLayer.ReturnOrderService", ReturnOrderService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var VendorService = (function () {
                function VendorService($http) {
                    this.$http = $http;
                }
                VendorService.prototype.Get = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Order/Api/Vendor",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                return VendorService;
            }());
            Api.$vendorService = Core.NG.CoreModule.RegisterService("ApiLayer.VendorService", VendorService, Core.NG.$http);
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Production;
    (function (Production) {
        var Api;
        (function (Api) {
            var PrepAdjustService = (function () {
                function PrepAdjustService($http) {
                    this.$http = $http;
                }
                PrepAdjustService.prototype.GetPrepAdjustItemsByEntityId = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Production/Api/PrepAdjust",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                PrepAdjustService.prototype.PostPrepAdjustItems = function (entityId, items, applyDate) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Production/Api/PrepAdjust",
                        timeout: 120000,
                        params: { entityId: entityId, applyDate: applyDate },
                        data: items
                    });
                };
                return PrepAdjustService;
            }());
            Api.$prepAdjustService = Core.NG.CoreModule.RegisterService("ApiLayer.PrepAdjustService", PrepAdjustService, Core.NG.$http);
        })(Api = Production.Api || (Production.Api = {}));
    })(Production = Inventory.Production || (Inventory.Production = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Production;
    (function (Production) {
        var Api;
        (function (Api) {
            var PrepAdjustFavoriteService = (function () {
                function PrepAdjustFavoriteService($http) {
                    this.$http = $http;
                }
                PrepAdjustFavoriteService.prototype.Get = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Production/Api/PrepAdjustFavorite",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                PrepAdjustFavoriteService.prototype.PostAddFavorite = function (entityId, itemId) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Production/Api/PrepAdjustFavorite",
                        timeout: 120000,
                        params: { entityId: entityId, itemId: itemId }
                    });
                };
                PrepAdjustFavoriteService.prototype.DeleteFavorite = function (entityId, itemId) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Inventory/Production/Api/PrepAdjustFavorite",
                        timeout: 120000,
                        params: { entityId: entityId, itemId: itemId }
                    });
                };
                return PrepAdjustFavoriteService;
            }());
            Api.$prepAdjustFavoriteService = Core.NG.CoreModule.RegisterService("ApiLayer.PrepAdjustFavoriteService", PrepAdjustFavoriteService, Core.NG.$http);
        })(Api = Production.Api || (Production.Api = {}));
    })(Production = Inventory.Production || (Inventory.Production = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Production;
    (function (Production) {
        var Api;
        (function (Api) {
            var PrepAdjustItemSearchService = (function () {
                function PrepAdjustItemSearchService($http) {
                    this.$http = $http;
                }
                PrepAdjustItemSearchService.prototype.GetPrepAdjustItemsByEntityId = function (entityId, description, recordLimit) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Production/Api/PrepAdjustItemSearch",
                        timeout: 120000,
                        params: { entityId: entityId, description: description, recordLimit: recordLimit }
                    });
                };
                return PrepAdjustItemSearchService;
            }());
            Api.$prepAdjustItemSearchService = Core.NG.CoreModule.RegisterService("ApiLayer.PrepAdjustItemSearchService", PrepAdjustItemSearchService, Core.NG.$http);
        })(Api = Production.Api || (Production.Api = {}));
    })(Production = Inventory.Production || (Inventory.Production = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Api;
        (function (Api) {
            var TransferService = (function () {
                function TransferService($http) {
                    this.$http = $http;
                }
                TransferService.prototype.GetByTransferIdAndEntityId = function (transferId, entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        params: { transferId: transferId, entityId: entityId }
                    });
                };
                TransferService.prototype.GetPendingTransfersFromStoreByEntityId = function (transferEntityId, showTransferIn, showTransferOut) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        params: { transferEntityId: transferEntityId, showTransferIn: showTransferIn, showTransferOut: showTransferOut }
                    });
                };
                TransferService.prototype.GetTransfersByStoreAndDateRange = function (entityId, startTime, endTime) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        params: { entityId: entityId, startTime: startTime, endTime: endTime }
                    });
                };
                TransferService.prototype.PostCreateInventoryTransfer = function (transferFromEntityId, transferToEntityId, body) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        params: { transferFromEntityId: transferFromEntityId, transferToEntityId: transferToEntityId },
                        data: body
                    });
                };
                TransferService.prototype.PutUpdateTransferQuantities = function (transfer, isApproved, reason) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        params: { isApproved: isApproved, reason: reason },
                        data: transfer
                    });
                };
                TransferService.prototype.PutTransferDetailWithUpdatedCostAndQuantity = function (transferDetail) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        data: transferDetail
                    });
                };
                TransferService.prototype.PutUpdateNoCostItems = function (transferId, entityId, updateCostItems) {
                    return this.$http({
                        method: "PUT",
                        url: "/Inventory/Transfer/Api/Transfer",
                        timeout: 120000,
                        params: { transferId: transferId, entityId: entityId },
                        data: updateCostItems
                    });
                };
                return TransferService;
            }());
            Api.$transferService = Core.NG.CoreModule.RegisterService("ApiLayer.TransferService", TransferService, Core.NG.$http);
        })(Api = Transfer.Api || (Transfer.Api = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Api;
        (function (Api) {
            var TransferHistoryService = (function () {
                function TransferHistoryService($http) {
                    this.$http = $http;
                }
                TransferHistoryService.prototype.GetTransfersWithEntitiesByStoreAndDateRange = function (entityId, startTime, endTime) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/TransferHistory",
                        timeout: 120000,
                        params: { entityId: entityId, startTime: startTime, endTime: endTime }
                    });
                };
                TransferHistoryService.prototype.GetByTransferIdWithReportingUnits = function (transferId, entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/TransferHistory",
                        timeout: 120000,
                        params: { transferId: transferId, entityId: entityId }
                    });
                };
                return TransferHistoryService;
            }());
            Api.$transferHistoryService = Core.NG.CoreModule.RegisterService("ApiLayer.TransferHistoryService", TransferHistoryService, Core.NG.$http);
        })(Api = Transfer.Api || (Transfer.Api = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Api;
        (function (Api) {
            var TransferStoreService = (function () {
                function TransferStoreService($http) {
                    this.$http = $http;
                }
                TransferStoreService.prototype.GetNeighboringStores = function (currentStoreId, direction) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/TransferStore",
                        timeout: 120000,
                        params: { currentStoreId: currentStoreId, direction: direction }
                    });
                };
                TransferStoreService.prototype.GetTransferableItemsBetweenStoresLimited = function (fromEntityId, toEntityId, filter, direction) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Transfer/Api/TransferStore",
                        timeout: 120000,
                        params: { fromEntityId: fromEntityId, toEntityId: toEntityId, filter: filter, direction: direction }
                    });
                };
                return TransferStoreService;
            }());
            Api.$transferStoreService = Core.NG.CoreModule.RegisterService("ApiLayer.TransferStoreService", TransferStoreService, Core.NG.$http);
        })(Api = Transfer.Api || (Transfer.Api = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        var Api;
        (function (Api) {
            var WasteService = (function () {
                function WasteService($http) {
                    this.$http = $http;
                }
                WasteService.prototype.GetWasteItemsLimited = function (entityId, filter) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Waste/Api/Waste",
                        timeout: 120000,
                        params: { entityId: entityId, filter: filter }
                    });
                };
                WasteService.prototype.PostWasteItems = function (entityId, items, applyDate) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Waste/Api/Waste",
                        timeout: 120000,
                        params: { entityId: entityId, applyDate: applyDate },
                        data: items
                    });
                };
                return WasteService;
            }());
            Api.$wasteService = Core.NG.CoreModule.RegisterService("ApiLayer.WasteService", WasteService, Core.NG.$http);
        })(Api = Waste.Api || (Waste.Api = {}));
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        var Api;
        (function (Api) {
            var WasteFavoriteService = (function () {
                function WasteFavoriteService($http) {
                    this.$http = $http;
                }
                WasteFavoriteService.prototype.Get = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Waste/Api/WasteFavorite",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                WasteFavoriteService.prototype.PostAdd = function (entityId, itemId, isInventoryItem) {
                    return this.$http({
                        method: "POST",
                        url: "/Inventory/Waste/Api/WasteFavorite",
                        timeout: 120000,
                        params: { entityId: entityId, itemId: itemId, isInventoryItem: isInventoryItem }
                    });
                };
                WasteFavoriteService.prototype.Delete = function (entityId, itemId, isInventoryItem) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Inventory/Waste/Api/WasteFavorite",
                        timeout: 120000,
                        params: { entityId: entityId, itemId: itemId, isInventoryItem: isInventoryItem }
                    });
                };
                return WasteFavoriteService;
            }());
            Api.$wasteFavoriteService = Core.NG.CoreModule.RegisterService("ApiLayer.WasteFavoriteService", WasteFavoriteService, Core.NG.$http);
        })(Api = Waste.Api || (Waste.Api = {}));
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        var Api;
        (function (Api) {
            var WasteHistoryService = (function () {
                function WasteHistoryService($http) {
                    this.$http = $http;
                }
                WasteHistoryService.prototype.GetWasteHistory = function (entityId, fromDate, toDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Waste/Api/WasteHistory",
                        timeout: 120000,
                        params: { entityId: entityId, fromDate: fromDate, toDate: toDate }
                    });
                };
                return WasteHistoryService;
            }());
            Api.$wasteHistoryService = Core.NG.CoreModule.RegisterService("ApiLayer.WasteHistoryService", WasteHistoryService, Core.NG.$http);
        })(Api = Waste.Api || (Waste.Api = {}));
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        var Api;
        (function (Api) {
            var WasteReasonService = (function () {
                function WasteReasonService($http) {
                    this.$http = $http;
                }
                WasteReasonService.prototype.Get = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Inventory/Waste/Api/WasteReason",
                        timeout: 120000
                    });
                };
                return WasteReasonService;
            }());
            Api.$wasteReasonService = Core.NG.CoreModule.RegisterService("ApiLayer.WasteReasonService", WasteReasonService, Core.NG.$http);
        })(Api = Waste.Api || (Waste.Api = {}));
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var ColumnsService = (function () {
                function ColumnsService($http) {
                    this.$http = $http;
                }
                ColumnsService.prototype.Get = function (reportType) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/Columns",
                        timeout: 120000,
                        params: { reportType: reportType }
                    });
                };
                return ColumnsService;
            }());
            Api.$columnsService = Core.NG.CoreModule.RegisterService("ApiLayer.ColumnsService", ColumnsService, Core.NG.$http);
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var ProductService = (function () {
                function ProductService($http) {
                    this.$http = $http;
                }
                ProductService.prototype.Get = function (entityId, dateFrom, dateTo, reportType, viewId, searchText) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/Product",
                        timeout: 120000,
                        params: { entityId: entityId, dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, viewId: viewId, searchText: searchText }
                    });
                };
                return ProductService;
            }());
            Api.$productService = Core.NG.CoreModule.RegisterService("ApiLayer.ProductService", ProductService, Core.NG.$http);
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var ProductExportService = (function () {
                function ProductExportService($http) {
                    this.$http = $http;
                }
                ProductExportService.prototype.Get = function (entityId, dateFrom, dateTo, reportType, viewId) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/ProductExport",
                        timeout: 120000,
                        params: { entityId: entityId, dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, viewId: viewId }
                    });
                };
                return ProductExportService;
            }());
            Api.$productExportService = Core.NG.CoreModule.RegisterService("ApiLayer.ProductExportService", ProductExportService, Core.NG.$http);
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var ReportService = (function () {
                function ReportService($http) {
                    this.$http = $http;
                }
                ReportService.prototype.Get = function (dateFrom, dateTo, reportType, entityId, viewId) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/Report",
                        timeout: 120000,
                        params: { dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, entityId: entityId, viewId: viewId }
                    });
                };
                return ReportService;
            }());
            Api.$reportService = Core.NG.CoreModule.RegisterService("ApiLayer.ReportService", ReportService, Core.NG.$http);
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var ReportExportService = (function () {
                function ReportExportService($http) {
                    this.$http = $http;
                }
                ReportExportService.prototype.Get = function (dateFrom, dateTo, reportType, entityId, viewId) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/ReportExport",
                        timeout: 120000,
                        params: { dateFrom: dateFrom, dateTo: dateTo, reportType: reportType, entityId: entityId, viewId: viewId }
                    });
                };
                return ReportExportService;
            }());
            Api.$reportExportService = Core.NG.CoreModule.RegisterService("ApiLayer.ReportExportService", ReportExportService, Core.NG.$http);
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var ViewService = (function () {
                function ViewService($http) {
                    this.$http = $http;
                }
                ViewService.prototype.GetView = function (entityId, viewId, reportType) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/View",
                        timeout: 120000,
                        params: { entityId: entityId, viewId: viewId, reportType: reportType }
                    });
                };
                ViewService.prototype.GetReportViews = function (entityId, reportType) {
                    return this.$http({
                        method: "GET",
                        url: "/Operations/Reporting/Api/View",
                        timeout: 120000,
                        params: { entityId: entityId, reportType: reportType }
                    });
                };
                ViewService.prototype.PostCreateView = function (entityId, view) {
                    return this.$http({
                        method: "POST",
                        url: "/Operations/Reporting/Api/View",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: view
                    });
                };
                ViewService.prototype.PutUpdateView = function (entityId, view) {
                    return this.$http({
                        method: "PUT",
                        url: "/Operations/Reporting/Api/View",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: view
                    });
                };
                ViewService.prototype.DeleteView = function (entityId, viewId, reportType) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Operations/Reporting/Api/View",
                        timeout: 120000,
                        params: { entityId: entityId, viewId: viewId, reportType: reportType }
                    });
                };
                return ViewService;
            }());
            Api.$viewService = Core.NG.CoreModule.RegisterService("ApiLayer.ViewService", ViewService, Core.NG.$http);
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Reporting;
(function (Reporting) {
    var Dashboard;
    (function (Dashboard) {
        var Api;
        (function (Api) {
            var MeasuresService = (function () {
                function MeasuresService($http) {
                    this.$http = $http;
                }
                MeasuresService.prototype.GetMeasures = function (entityId, typeId, groupId, selectedDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Reporting/Dashboard/Api/Measures",
                        timeout: 120000,
                        params: { entityId: entityId, typeId: typeId, groupId: groupId, selectedDate: selectedDate }
                    });
                };
                MeasuresService.prototype.GetMeasureDrilldown = function (entityId, date, measureKey) {
                    return this.$http({
                        method: "GET",
                        url: "/Reporting/Dashboard/Api/Measures",
                        timeout: 120000,
                        params: { entityId: entityId, date: date, measureKey: measureKey }
                    });
                };
                return MeasuresService;
            }());
            Api.$measuresService = Core.NG.CoreModule.RegisterService("ApiLayer.MeasuresService", MeasuresService, Core.NG.$http);
        })(Api = Dashboard.Api || (Dashboard.Api = {}));
    })(Dashboard = Reporting.Dashboard || (Reporting.Dashboard = {}));
})(Reporting || (Reporting = {}));
var Reporting;
(function (Reporting) {
    var Dashboard;
    (function (Dashboard) {
        var Api;
        (function (Api) {
            var ReferenceDataService = (function () {
                function ReferenceDataService($http) {
                    this.$http = $http;
                }
                ReferenceDataService.prototype.Get = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Reporting/Dashboard/Api/ReferenceData",
                        timeout: 120000
                    });
                };
                return ReferenceDataService;
            }());
            Api.$referenceDataService = Core.NG.CoreModule.RegisterService("ApiLayer.ReferenceDataService", ReferenceDataService, Core.NG.$http);
        })(Api = Dashboard.Api || (Dashboard.Api = {}));
    })(Dashboard = Reporting.Dashboard || (Reporting.Dashboard = {}));
})(Reporting || (Reporting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var ReportMeasureGenerationService = (function () {
            function ReportMeasureGenerationService($http) {
                this.$http = $http;
            }
            ReportMeasureGenerationService.prototype.Post = function (entityId, businessDay) {
                return this.$http({
                    method: "POST",
                    url: "/Reporting/Dashboard/Api/ReportMeasureGeneration",
                    timeout: 120000,
                    params: { entityId: entityId, businessDay: businessDay }
                });
            };
            return ReportMeasureGenerationService;
        }());
        Api.$reportMeasureGenerationService = Core.NG.CoreModule.RegisterService("ApiLayer.ReportMeasureGenerationService", ReportMeasureGenerationService, Core.NG.$http);
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var Api;
        (function (Api) {
            var AvailableUsersService = (function () {
                function AvailableUsersService($http) {
                    this.$http = $http;
                }
                AvailableUsersService.prototype.Get = function (entityId, date) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/Deliveries/Api/AvailableUsers",
                        timeout: 120000,
                        params: { entityId: entityId, date: date }
                    });
                };
                return AvailableUsersService;
            }());
            Api.$availableUsersService = Core.NG.CoreModule.RegisterService("ApiLayer.AvailableUsersService", AvailableUsersService, Core.NG.$http);
        })(Api = Deliveries.Api || (Deliveries.Api = {}));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var Api;
        (function (Api) {
            var DeliveriesAuthorizeService = (function () {
                function DeliveriesAuthorizeService($http) {
                    this.$http = $http;
                }
                DeliveriesAuthorizeService.prototype.Put = function (entityId, request) {
                    return this.$http({
                        method: "PUT",
                        url: "/Workforce/Deliveries/Api/DeliveriesAuthorize",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: request
                    });
                };
                return DeliveriesAuthorizeService;
            }());
            Api.$deliveriesAuthorizeService = Core.NG.CoreModule.RegisterService("ApiLayer.DeliveriesAuthorizeService", DeliveriesAuthorizeService, Core.NG.$http);
        })(Api = Deliveries.Api || (Deliveries.Api = {}));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var Api;
        (function (Api) {
            var DeliveriesService = (function () {
                function DeliveriesService($http) {
                    this.$http = $http;
                }
                DeliveriesService.prototype.Get = function (entityId, date) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/Deliveries/Api/Deliveries",
                        timeout: 120000,
                        params: { entityId: entityId, date: date }
                    });
                };
                DeliveriesService.prototype.Post = function (entityId, request) {
                    return this.$http({
                        method: "POST",
                        url: "/Workforce/Deliveries/Api/Deliveries",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: request
                    });
                };
                return DeliveriesService;
            }());
            Api.$deliveriesService = Core.NG.CoreModule.RegisterService("ApiLayer.DeliveriesService", DeliveriesService, Core.NG.$http);
        })(Api = Deliveries.Api || (Deliveries.Api = {}));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Api;
        (function (Api) {
            var DriverDistanceEmployeeService = (function () {
                function DriverDistanceEmployeeService($http) {
                    this.$http = $http;
                }
                DriverDistanceEmployeeService.prototype.GetRecordsForEmployeeByEntityAndDate = function (employeeId, entityId, date) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/DriverDistance/Api/DriverDistanceEmployee",
                        timeout: 120000,
                        params: { employeeId: employeeId, entityId: entityId, date: date }
                    });
                };
                DriverDistanceEmployeeService.prototype.Post = function (entityId, request) {
                    return this.$http({
                        method: "POST",
                        url: "/Workforce/DriverDistance/Api/DriverDistanceEmployee",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: request
                    });
                };
                return DriverDistanceEmployeeService;
            }());
            Api.$driverDistanceEmployeeService = Core.NG.CoreModule.RegisterService("ApiLayer.DriverDistanceEmployeeService", DriverDistanceEmployeeService, Core.NG.$http);
        })(Api = DriverDistance.Api || (DriverDistance.Api = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Api;
        (function (Api) {
            var DriverDistanceManagerService = (function () {
                function DriverDistanceManagerService($http) {
                    this.$http = $http;
                }
                DriverDistanceManagerService.prototype.GetRecordsForEntityByDate = function (entityId, date) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                        timeout: 120000,
                        params: { entityId: entityId, date: date }
                    });
                };
                DriverDistanceManagerService.prototype.PutActionDriverDistanceRecord = function (entityId, request) {
                    return this.$http({
                        method: "PUT",
                        url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: request
                    });
                };
                DriverDistanceManagerService.prototype.GetActiveUsersByAssignedEntity = function (entityId) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                        timeout: 120000,
                        params: { entityId: entityId }
                    });
                };
                DriverDistanceManagerService.prototype.Post = function (entityId, request) {
                    return this.$http({
                        method: "POST",
                        url: "/Workforce/DriverDistance/Api/DriverDistanceManager",
                        timeout: 120000,
                        params: { entityId: entityId },
                        data: request
                    });
                };
                return DriverDistanceManagerService;
            }());
            Api.$driverDistanceManagerService = Core.NG.CoreModule.RegisterService("ApiLayer.DriverDistanceManagerService", DriverDistanceManagerService, Core.NG.$http);
        })(Api = DriverDistance.Api || (DriverDistance.Api = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        var Api;
        (function (Api) {
            var MyAvailabilityService = (function () {
                function MyAvailabilityService($http) {
                    this.$http = $http;
                }
                MyAvailabilityService.prototype.Get = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MyAvailability/Api/MyAvailability",
                        timeout: 120000
                    });
                };
                MyAvailabilityService.prototype.PutAvailability = function (availability) {
                    return this.$http({
                        method: "PUT",
                        url: "/Workforce/MyAvailability/Api/MyAvailability",
                        timeout: 120000,
                        data: availability
                    });
                };
                MyAvailabilityService.prototype.Delete = function (dayOfWeek, start, end, isAllDay) {
                    return this.$http({
                        method: "DELETE",
                        url: "/Workforce/MyAvailability/Api/MyAvailability",
                        timeout: 120000,
                        params: { dayOfWeek: dayOfWeek, start: start, end: end, isAllDay: isAllDay }
                    });
                };
                return MyAvailabilityService;
            }());
            Api.$myAvailabilityService = Core.NG.CoreModule.RegisterService("ApiLayer.MyAvailabilityService", MyAvailabilityService, Core.NG.$http);
        })(Api = MyAvailability.Api || (MyAvailability.Api = {}));
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MyDetails;
    (function (MyDetails) {
        var Api;
        (function (Api) {
            var MyDetailsService = (function () {
                function MyDetailsService($http) {
                    this.$http = $http;
                }
                MyDetailsService.prototype.GetUserById = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MyDetails/Api/MyDetails",
                        timeout: 120000
                    });
                };
                MyDetailsService.prototype.PutUserContact = function (userContact) {
                    return this.$http({
                        method: "PUT",
                        url: "/Workforce/MyDetails/Api/MyDetails",
                        timeout: 120000,
                        data: userContact
                    });
                };
                return MyDetailsService;
            }());
            Api.$myDetailsService = Core.NG.CoreModule.RegisterService("ApiLayer.MyDetailsService", MyDetailsService, Core.NG.$http);
        })(Api = MyDetails.Api || (MyDetails.Api = {}));
    })(MyDetails = Workforce.MyDetails || (Workforce.MyDetails = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var Api;
        (function (Api) {
            var MyScheduleService = (function () {
                function MyScheduleService($http) {
                    this.$http = $http;
                }
                MyScheduleService.prototype.Get = function (startDate, endDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MySchedule/Api/MySchedule",
                        timeout: 120000,
                        params: { startDate: startDate, endDate: endDate }
                    });
                };
                return MyScheduleService;
            }());
            Api.$myScheduleService = Core.NG.CoreModule.RegisterService("ApiLayer.MyScheduleService", MyScheduleService, Core.NG.$http);
        })(Api = MySchedule.Api || (MySchedule.Api = {}));
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var Api;
        (function (Api) {
            var MyScheduleDownloadService = (function () {
                function MyScheduleDownloadService($http) {
                    this.$http = $http;
                }
                MyScheduleDownloadService.prototype.Get = function (beginDate, endDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MySchedule/Api/MyScheduleDownload",
                        timeout: 120000,
                        params: { beginDate: beginDate, endDate: endDate }
                    });
                };
                return MyScheduleDownloadService;
            }());
            Api.$myScheduleDownloadService = Core.NG.CoreModule.RegisterService("ApiLayer.MyScheduleDownloadService", MyScheduleDownloadService, Core.NG.$http);
        })(Api = MySchedule.Api || (MySchedule.Api = {}));
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var Api;
        (function (Api) {
            var MyTimeOffService = (function () {
                function MyTimeOffService($http) {
                    this.$http = $http;
                }
                MyTimeOffService.prototype.Get = function (selectedDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MySchedule/Api/MyTimeOff",
                        timeout: 120000,
                        params: { selectedDate: selectedDate }
                    });
                };
                MyTimeOffService.prototype.GetFutureTimeOffRequests = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MySchedule/Api/MyTimeOff",
                        timeout: 120000
                    });
                };
                MyTimeOffService.prototype.PostCancelRequest = function (requestId) {
                    return this.$http({
                        method: "POST",
                        url: "/Workforce/MySchedule/Api/MyTimeOff",
                        timeout: 120000,
                        params: { requestId: requestId }
                    });
                };
                MyTimeOffService.prototype.PostNewRequest = function (request) {
                    return this.$http({
                        method: "POST",
                        url: "/Workforce/MySchedule/Api/MyTimeOff",
                        timeout: 120000,
                        data: request
                    });
                };
                return MyTimeOffService;
            }());
            Api.$myTimeOffService = Core.NG.CoreModule.RegisterService("ApiLayer.MyTimeOffService", MyTimeOffService, Core.NG.$http);
        })(Api = MySchedule.Api || (MySchedule.Api = {}));
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var Api;
        (function (Api) {
            var TeamScheduleService = (function () {
                function TeamScheduleService($http) {
                    this.$http = $http;
                }
                TeamScheduleService.prototype.Get = function (entityId, startDate, stopDate) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MySchedule/Api/TeamSchedule",
                        timeout: 120000,
                        params: { entityId: entityId, startDate: startDate, stopDate: stopDate }
                    });
                };
                return TeamScheduleService;
            }());
            Api.$teamScheduleService = Core.NG.CoreModule.RegisterService("ApiLayer.TeamScheduleService", TeamScheduleService, Core.NG.$http);
        })(Api = MySchedule.Api || (MySchedule.Api = {}));
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MyTimeCard;
    (function (MyTimeCard) {
        var Api;
        (function (Api) {
            var MyTimeCardService = (function () {
                function MyTimeCardService($http) {
                    this.$http = $http;
                }
                MyTimeCardService.prototype.GetTimeCards = function (start, end) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MyTimeCard/Api/MyTimeCard",
                        timeout: 120000,
                        params: { start: start, end: end }
                    });
                };
                return MyTimeCardService;
            }());
            Api.$myTimeCardService = Core.NG.CoreModule.RegisterService("ApiLayer.MyTimeCardService", MyTimeCardService, Core.NG.$http);
        })(Api = MyTimeCard.Api || (MyTimeCard.Api = {}));
    })(MyTimeCard = Workforce.MyTimeCard || (Workforce.MyTimeCard = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MyTimeOff;
    (function (MyTimeOff) {
        var Api;
        (function (Api) {
            var TimeOffReasonService = (function () {
                function TimeOffReasonService($http) {
                    this.$http = $http;
                }
                TimeOffReasonService.prototype.GetReasons = function () {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/MyTimeOff/Api/TimeOffReason",
                        timeout: 120000
                    });
                };
                return TimeOffReasonService;
            }());
            Api.$timeOffReasonService = Core.NG.CoreModule.RegisterService("ApiLayer.TimeOffReasonService", TimeOffReasonService, Core.NG.$http);
        })(Api = MyTimeOff.Api || (MyTimeOff.Api = {}));
    })(MyTimeOff = Workforce.MyTimeOff || (Workforce.MyTimeOff = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var PeriodClose;
    (function (PeriodClose) {
        var Api;
        (function (Api) {
            var PeriodCloseService = (function () {
                function PeriodCloseService($http) {
                    this.$http = $http;
                }
                PeriodCloseService.prototype.GetPeriodLockStatus = function (entityId, calendarDay) {
                    return this.$http({
                        method: "GET",
                        url: "/Workforce/PeriodClose/Api/PeriodClose",
                        timeout: 120000,
                        params: { entityId: entityId, calendarDay: calendarDay }
                    });
                };
                return PeriodCloseService;
            }());
            Api.$periodCloseService = Core.NG.CoreModule.RegisterService("ApiLayer.PeriodCloseService", PeriodCloseService, Core.NG.$http);
        })(Api = PeriodClose.Api || (PeriodClose.Api = {}));
    })(PeriodClose = Workforce.PeriodClose || (Workforce.PeriodClose = {}));
})(Workforce || (Workforce = {}));
