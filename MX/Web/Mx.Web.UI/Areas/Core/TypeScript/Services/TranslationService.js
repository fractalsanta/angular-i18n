var Core;
(function (Core) {
    "use strict";
    var TranslationService = (function () {
        function TranslationService(apiService, authService, $q, constants) {
            this.apiService = apiService;
            this.authService = authService;
            this.$q = $q;
            this.constants = constants;
            this._translations = {};
            this._requests = {};
        }
        TranslationService.prototype.GetTranslations = function () {
            var _this = this;
            var user = this.authService.GetUser().BusinessUser;
            var culture = (user ? user.Culture : this.constants.SystemCulture).toLowerCase();
            var translation = this._translations[culture];
            if (translation != null) {
                var deferred = this.$q.defer();
                deferred.resolve(translation);
                return deferred.promise;
            }
            var request = this._requests[culture];
            if (request != null) {
                return request;
            }
            var promise = this.apiService.Get(culture).then(function (result) {
                _this._translations[culture] = result.data;
                return result.data;
            });
            this._requests[culture] = promise;
            return promise;
        };
        return TranslationService;
    }());
    Core.$translation = Core.NG.CoreModule.RegisterService("Translation", TranslationService, Core.Api.$translationsService, Core.Auth.$authService, Core.NG.$q, Core.Constants);
})(Core || (Core = {}));
