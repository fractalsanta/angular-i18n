module Core {
    "use strict";

    class SystemSettingsService implements ISystemSettingsService {

        private _loginPageColorScheme: number;

        constructor(private constants: Core.Api.Models.IConstants, private authService: Core.Auth.IAuthService) {
            this._loginPageColorScheme = this.constants.LoginPageColorScheme;
        }

        GetCurrencySymbol() {
            var user = this.authService.GetUser();
            var symbol = this.constants.SystemCurrencySymbol;            
            if (user == null || user.BusinessUser == null || user.BusinessUser.MobileSettings == null) {
                return symbol;
            }            

            var entityId = user.BusinessUser.MobileSettings.EntityId;
            if (this.constants.EntitiesWithDifferentCurrencySymbol != null && this.constants.EntitiesWithDifferentCurrencySymbol.length > 0) {
                if (_.any(this.constants.EntitiesWithDifferentCurrencySymbol, (el) => el.EntityId == entityId)) {
                    var entity = _.where(this.constants.EntitiesWithDifferentCurrencySymbol, (el) => el.EntityId == entityId)[0];
                    symbol = entity.CurrencySymbol;
                }
            }
            return symbol;          
        }

        GetLoginPageColorScheme() {
            return this._loginPageColorScheme;
        }

        UpdateLoginPageColorScheme(index: number) {
            this._loginPageColorScheme = index;
        }
    }

    $systemSettingsService = NG.CoreModule.RegisterService("SystemSettingsService", SystemSettingsService, Core.Constants, Auth.$authService);
}
 