module Core.Tests {
    export class AuthServiceMock implements IMock<Core.Auth.IAuthService> {
        private _user: Core.Auth.IUser;

        private _grantAllPermissions: boolean = true;

        constructor() {
            this._user = <Core.Auth.IUser>{
                BusinessUser: <Core.Api.Models.IBusinessUser>{
                    Id: 0,
                    UserName: "Best_User_Name_Ever",
                    FirstName: "",
                    LastName: "",
                    EmployeeId: 100,
                    EmployeeNumber: "",
                    Culture: "",
                    Status: Core.Api.Models.BusinessUser.BusinessUserStatusEnum.Active,
                    MobileSettings: <Core.Api.Models.IMobileSettings>{
                        EntityId: 1,
                        EntityName: "EntityName",
                        EntityNumber: "100",
                        FavouriteStores: []
                    },
                    Permission: <Core.Api.Models.IPermissions>{
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

        public SetGetUser(user: Core.Auth.IUser) {
            this._user = user;
            return this;
        }

        public GrantAllPermissions(toggle?: boolean) {
            if (toggle !== undefined) {
                this._grantAllPermissions = toggle;
            }
            return this._grantAllPermissions;
        }

        Object: Core.Auth.IAuthService = {
            GetUser: () => {
                return this._user;
            },

            GetPinUserName: () => {
                return this._user.BusinessUser.UserName;
            },

            Logon: (credentials: Core.Auth.Api.Models.ICredentials): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse> => {
                return null;
            },

            LogonWithPin: (pin: string): ng.IHttpPromise<Core.Auth.Api.Models.ILogonResponse> => {
                return null;
            },

            LogonWithPinChallenge: (): ng.IHttpPromise<any> => {
                return null;
            },

            Logout: (): void => {

            },

            CheckPermissionsAllowance: (permisions: Core.Api.Models.Task[]): boolean => {
                return this.GrantAllPermissions();
            },

            CheckPermissionAllowance: (...permision: Core.Api.Models.Task[]): boolean => {
                return this.GrantAllPermissions();
            },

            SetPinNumber: (password: string, pin: string): ng.IHttpPromise<string> => {
                return null;
            },

            ClearPinNumber: (deletePin: boolean): void => {
            },

            GetAuthToken: () => {
                return "";
            },

            IsSharedCookieMode: () => {
                return false;
            }
        };
    }
}
