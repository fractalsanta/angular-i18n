var Administration;
(function (Administration) {
    var User;
    (function (User) {
        var Services;
        (function (Services) {
            "use strict";
            var UserSettingsService = (function () {
                function UserSettingsService($q, userService, $timeout) {
                    this.$q = $q;
                    this.userService = userService;
                    this.$timeout = $timeout;
                }
                UserSettingsService.prototype.GetUserSetting = function (userSetting) {
                    return this.userService.GetUserSetting(userSetting)
                        .then(function (d) { return d.data; });
                };
                UserSettingsService.prototype.SetUserSetting = function (userSetting, value) {
                    return this.userService.PutUserSetting(userSetting, value);
                };
                return UserSettingsService;
            }());
            Services.UserSettingsService = UserSettingsService;
            Services.$userSettingService = Core.NG.AdministrationHierarchyModule.RegisterService("UserSettingsService", UserSettingsService, Core.NG.$q, User.Api.$userSettingsService, Core.NG.$timeout);
        })(Services = User.Services || (User.Services = {}));
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
