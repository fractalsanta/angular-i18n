module Administration.User.Services {
    "use strict";

    export interface IUserSettingsService {
        GetUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum): ng.IPromise<string>;
        SetUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum, value: string): ng.IHttpPromise<{}>;
    }

    export class UserSettingsService implements IUserSettingsService {

        constructor(private $q: ng.IQService, private userService: Api.IUserSettingsService, private $timeout: ng.ITimeoutService) {
        }

        public GetUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum): ng.IPromise<string> {
            return this.userService.GetUserSetting(userSetting)
                .then(d=> { return d.data; });
        }

        public SetUserSetting(userSetting: Administration.User.Api.Models.UserSettingEnum, value: string): ng.IHttpPromise<{}> {
            return this.userService.PutUserSetting(userSetting, value); 
        }        
    }

    export var $userSettingService: Core.NG.INamedService<IUserSettingsService> = Core.NG.AdministrationHierarchyModule.RegisterService("UserSettingsService", UserSettingsService,
        Core.NG.$q,
        Api.$userSettingsService,
        Core.NG.$timeout
        );
} 