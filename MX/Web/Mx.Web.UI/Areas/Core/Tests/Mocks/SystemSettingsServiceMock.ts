/// <reference path="../../typescript/interfaces/isystemsettingsservice.d.ts" />

module Core.Tests {
    export class SystemSettingsServiceMock implements IMock<Core.ISystemSettingsService> {

        private _loginPageColorScheme: number = -1;

        GetCurrencySymbol() {
            return "$";
        }

        Object: Core.ISystemSettingsService = {
            GetCurrencySymbol: () => {
                return this.GetCurrencySymbol();
            },
            GetLoginPageColorScheme: () => {
                return this._loginPageColorScheme;
            },
            UpdateLoginPageColorScheme: (index: number) => {
                this._loginPageColorScheme = index;
            }
        }
    }

    Core.$systemSettingsService = { name: "SystemSettingsService" };
}
