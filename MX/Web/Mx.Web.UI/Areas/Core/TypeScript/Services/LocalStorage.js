var Core;
(function (Core) {
    var LocalStorage;
    (function (LocalStorage) {
        "use strict";
        var LocalStorageService = (function () {
            function LocalStorageService($mxlocalStorage) {
                this.$mxlocalStorage = $mxlocalStorage;
            }
            LocalStorageService.prototype.Add = function (key, value) {
                return this.$mxlocalStorage.add(key, value);
            };
            LocalStorageService.prototype.Set = function (key, value) {
                return this.$mxlocalStorage.set(key, value);
            };
            LocalStorageService.prototype.Get = function (key) {
                return this.$mxlocalStorage.get(key);
            };
            LocalStorageService.prototype.Remove = function (key) {
                return this.$mxlocalStorage.remove(key);
            };
            LocalStorageService.prototype.IsSupported = function () {
                return this.$mxlocalStorage.isSupported;
            };
            return LocalStorageService;
        }());
        LocalStorage.$localStorageSvc = Core.NG.CoreModule.RegisterService("MxLocalStorageService", LocalStorageService, Core.NG.$mxlocalStorage);
    })(LocalStorage = Core.LocalStorage || (Core.LocalStorage = {}));
})(Core || (Core = {}));
