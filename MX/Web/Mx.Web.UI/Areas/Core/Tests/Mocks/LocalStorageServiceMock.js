var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var LocalStorageServiceMock = (function () {
            function LocalStorageServiceMock() {
            }
            LocalStorageServiceMock.prototype.Add = function (key, value) {
                this._data[key] = value;
            };
            LocalStorageServiceMock.prototype.Set = function (key, value) {
                this._data[key] = value;
            };
            LocalStorageServiceMock.prototype.Get = function (key) {
                return this._data[key];
            };
            LocalStorageServiceMock.prototype.Remove = function (key) {
                this._data[key] = null;
            };
            LocalStorageServiceMock.prototype.IsSupported = function () {
                return false;
            };
            LocalStorageServiceMock.prototype.Clear = function () {
                this._data = {};
            };
            return LocalStorageServiceMock;
        }());
        Tests.LocalStorageServiceMock = LocalStorageServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
