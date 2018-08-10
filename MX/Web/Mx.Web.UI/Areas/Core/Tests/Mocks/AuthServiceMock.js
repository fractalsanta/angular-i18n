var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var AuthServiceMock = (function () {
            function AuthServiceMock() {
                var _this = this;
                this._grantAllPermissions = true;
                this.Object = {
                    GetUser: function () {
                        return _this._user;
                    },
                    GetPinUserName: function () {
                        return _this._user.BusinessUser.UserName;
                    },
                    Logon: function (credentials) {
                        return null;
                    },
                    LogonWithPin: function (pin) {
                        return null;
                    },
                    LogonWithPinChallenge: function () {
                        return null;
                    },
                    Logout: function () {
                    },
                    CheckPermissionsAllowance: function (permisions) {
                        return _this.GrantAllPermissions();
                    },
                    CheckPermissionAllowance: function () {
                        var permision = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            permision[_i - 0] = arguments[_i];
                        }
                        return _this.GrantAllPermissions();
                    },
                    SetPinNumber: function (password, pin) {
                        return null;
                    },
                    ClearPinNumber: function (deletePin) {
                    },
                    GetAuthToken: function () {
                        return "";
                    },
                    IsSharedCookieMode: function () {
                        return false;
                    }
                };
                this._user = {
                    BusinessUser: {
                        Id: 0,
                        UserName: "Best_User_Name_Ever",
                        FirstName: "",
                        LastName: "",
                        EmployeeId: 100,
                        EmployeeNumber: "",
                        Culture: "",
                        Status: Core.Api.Models.BusinessUser.BusinessUserStatusEnum.Active,
                        MobileSettings: {
                            EntityId: 1,
                            EntityName: "EntityName",
                            EntityNumber: "100",
                            FavouriteStores: []
                        },
                        Permission: {
                            Usage: 0,
                            GroupIds: [],
                            AllowedTasks: []
                        },
                        AssignedLocations: [],
                        EntityIdBase: 1,
                        EntityTypeId: 1
                    },
                    IsAuthenticated: true
                };
            }
            AuthServiceMock.prototype.SetGetUser = function (user) {
                this._user = user;
                return this;
            };
            AuthServiceMock.prototype.GrantAllPermissions = function (toggle) {
                if (toggle !== undefined) {
                    this._grantAllPermissions = toggle;
                }
                return this._grantAllPermissions;
            };
            return AuthServiceMock;
        }());
        Tests.AuthServiceMock = AuthServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
