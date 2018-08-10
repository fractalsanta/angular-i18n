var Core;
(function (Core) {
    "use strict";
    var SystemSettingsService = (function () {
        function SystemSettingsService(constants, authService) {
            this.constants = constants;
            this.authService = authService;
            this._loginPageColorScheme = this.constants.LoginPageColorScheme;
        }
        SystemSettingsService.prototype.GetCurrencySymbol = function () {
            var user = this.authService.GetUser();
            var symbol = this.constants.SystemCurrencySymbol;
            if (user == null || user.BusinessUser == null || user.BusinessUser.MobileSettings == null) {
                return symbol;
            }
            var entityId = user.BusinessUser.MobileSettings.EntityId;
            if (this.constants.EntitiesWithDifferentCurrencySymbol != null && this.constants.EntitiesWithDifferentCurrencySymbol.length > 0) {
                if (_.any(this.constants.EntitiesWithDifferentCurrencySymbol, function (el) { return el.EntityId == entityId; })) {
                    var entity = _.where(this.constants.EntitiesWithDifferentCurrencySymbol, function (el) { return el.EntityId == entityId; })[0];
                    symbol = entity.CurrencySymbol;
                }
            }
            return symbol;
        };
        SystemSettingsService.prototype.GetLoginPageColorScheme = function () {
            return this._loginPageColorScheme;
        };
        SystemSettingsService.prototype.UpdateLoginPageColorScheme = function (index) {
            this._loginPageColorScheme = index;
        };
        return SystemSettingsService;
    }());
    Core.$systemSettingsService = Core.NG.CoreModule.RegisterService("SystemSettingsService", SystemSettingsService, Core.Constants, Core.Auth.$authService);
})(Core || (Core = {}));
