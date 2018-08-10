var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Tests;
        (function (Tests) {
            var SiteSettingsServiceMock = (function () {
                function SiteSettingsServiceMock($q) {
                    var _this = this;
                    this.$q = $q;
                    this.GetSiteSettings = function () {
                        return _this._helper.CreateHttpPromise(_this._data);
                    };
                    this.PostSiteSettings = function (settings) {
                        _this._data = settings;
                        return _this._helper.CreateHttpPromise(null);
                    };
                    this.SetSiteSettingsTest = function (settings) {
                        _this._data = settings;
                    };
                    this.GetSiteSettingsTest = function () {
                        return _this._data;
                    };
                    this._helper = new PromiseHelper($q);
                }
                return SiteSettingsServiceMock;
            }());
            Tests.SiteSettingsServiceMock = SiteSettingsServiceMock;
        })(Tests = Settings.Tests || (Settings.Tests = {}));
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
