var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var SettingServiceMock = (function () {
            function SettingServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    GetMeasures: function (type, entityId) {
                        return null;
                    },
                    POSTReportMeasureConfig: function (measure, action) {
                        return null;
                    },
                    GetConfigurationSettings: function (settings) {
                        return _this._helper.CreateHttpPromise(_this._settings);
                    }
                };
                this._helper = new PromiseHelper($q);
                this._settings = {
                    data: {
                        System_Operations_HotSchedulesSamlSsoUrl: "HotSchedules"
                    }
                };
            }
            return SettingServiceMock;
        }());
        Tests.SettingServiceMock = SettingServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
