var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var SystemSettingsServiceMock = (function () {
            function SystemSettingsServiceMock() {
                var _this = this;
                this._loginPageColorScheme = -1;
                this.Object = {
                    GetCurrencySymbol: function () {
                        return _this.GetCurrencySymbol();
                    },
                    GetLoginPageColorScheme: function () {
                        return _this._loginPageColorScheme;
                    },
                    UpdateLoginPageColorScheme: function (index) {
                        _this._loginPageColorScheme = index;
                    }
                };
            }
            SystemSettingsServiceMock.prototype.GetCurrencySymbol = function () {
                return "$";
            };
            return SystemSettingsServiceMock;
        }());
        Tests.SystemSettingsServiceMock = SystemSettingsServiceMock;
        Core.$systemSettingsService = { name: "SystemSettingsService" };
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
