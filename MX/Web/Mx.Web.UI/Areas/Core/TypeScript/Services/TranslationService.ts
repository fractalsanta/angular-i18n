module Core {
    "use strict";

    interface IMap<T> {
        [key: string]: T;
    }

    export interface ITranslationService {
        GetTranslations(): ng.IPromise<Api.Models.ITranslations>;
    }

    class TranslationService implements ITranslationService {
        private _translations: IMap<Api.Models.ITranslations> = {};
        private _requests: IMap<ng.IPromise<Api.Models.ITranslations>> = {};

        constructor(private apiService: Api.ITranslationsService, private authService: Auth.IAuthService, private $q: ng.IQService, private constants: Core.IConstants) { }

        GetTranslations(): ng.IPromise<Api.Models.ITranslations> {
            var user = this.authService.GetUser().BusinessUser;
            var culture = (user ? user.Culture : this.constants.SystemCulture).toLowerCase();

            // check if there is a cached translation
            var translation = this._translations[culture];
            if (translation != null) {
                var deferred = this.$q.defer<Api.Models.ITranslations>();
                deferred.resolve(translation);
                return deferred.promise;
            }

            // check if there is a pending API request
            var request = this._requests[culture];
            if (request != null) {
                return request;
            }

            // make an API request and store it in the pending map
            var promise = this.apiService.Get(culture).then(result => {
                this._translations[culture] = result.data;
                return result.data;
            });

            this._requests[culture] = promise;
            return promise;
        }
    }

    export var $translation: NG.INamedDependency<ITranslationService> =
        NG.CoreModule.RegisterService("Translation", TranslationService,
            Api.$translationsService,
            Auth.$authService,
            NG.$q,
            Core.Constants);
}